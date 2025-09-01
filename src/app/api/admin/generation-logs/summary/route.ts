import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import mongoose from 'mongoose'
import connectToDatabase from '@/lib/mongodb'

const ADMIN_EMAILS = new Set([
  'mlawsy525@gmail.com',
  'michelle@michellelawson.me',
])

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const email = (session?.user as any)?.email
    if (!email || !ADMIN_EMAILS.has(email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const timeframe = (searchParams.get('timeframe') || '30d').toLowerCase()

    const now = new Date()
    let from: Date | null = null
    if (timeframe !== 'all') {
      const match = timeframe.match(/^(\d+)(d|w|m)$/)
      if (match) {
        const n = parseInt(match[1], 10)
        const unit = match[2]
        from = new Date(now)
        if (unit === 'd') from.setDate(now.getDate() - n)
        if (unit === 'w') from.setDate(now.getDate() - n * 7)
        if (unit === 'm') from.setMonth(now.getMonth() - n)
      } else {
        // default 30d
        from = new Date(now)
        from.setDate(now.getDate() - 30)
      }
    }

    await connectToDatabase()
    const db = mongoose.connection.db
    if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 500 })

    const matchStage: any = { type: 'generation' }
    if (from) matchStage.startedAt = { $gte: from }

    const successMatchStage = { ...matchStage, success: true }

    const [counts, topConcepts, topStyles, plans] = await Promise.all([
      db.collection('generation_logs').aggregate([
        { $match: matchStage },
        { $group: { _id: '$success', count: { $sum: 1 } } },
      ]).toArray(),
      db.collection('generation_logs').aggregate([
        { $match: successMatchStage },
        { $group: { _id: '$concept', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 25 },
      ]).toArray(),
      db.collection('generation_logs').aggregate([
        { $match: successMatchStage },
        { $group: { _id: '$style', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 25 },
      ]).toArray(),
      db.collection('generation_logs').aggregate([
        { $match: successMatchStage },
        { $group: { _id: '$plan', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
    ])

    const successCount = counts.find((c: any) => c._id === true)?.count || 0
    const failureCount = counts.find((c: any) => c._id === false)?.count || 0

    return NextResponse.json({
      timeframe: timeframe,
      from: from ? from.toISOString() : null,
      to: now.toISOString(),
      totals: { success: successCount, failed: failureCount, all: successCount + failureCount },
      topConcepts: topConcepts.map((c: any) => ({ concept: c._id, count: c.count })),
      topStyles: topStyles.map((s: any) => ({ style: s._id, count: s.count })),
      byPlan: plans.map((p: any) => ({ plan: p._id, count: p.count })),
    })
  } catch (error: any) {
    console.error('[admin.summary] error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
