import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import mongoose from 'mongoose'
import connectToDatabase from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const db = mongoose.connection.db
    
    if (!db) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
    
    // Get current user data
    const user = await db.collection('users').findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Determine reset policy based on plan (weekly for free, monthly for paid)
    const now = new Date()
    const lastReset = new Date(user.usage.lastResetDate)
    const plan = user?.subscription?.planId || 'free'
    let shouldReset = false
    if (plan === 'free') {
      const diffMs = now.getTime() - lastReset.getTime()
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
      shouldReset = diffMs >= sevenDaysMs
    } else {
      shouldReset = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()
    }

    let updateData: any = {
      $inc: {
        'usage.totalGenerations': 1
      }
    }

    if (shouldReset) {
      // Reset period counter and update reset date
      updateData = {
        $inc: {
          'usage.totalGenerations': 1
        },
        $set: {
          'usage.monthlyGenerations': 1,
          'usage.lastResetDate': now.toISOString()
        }
      }
    } else {
      // Just increment monthly counter
      updateData.$inc['usage.monthlyGenerations'] = 1
    }

    // Update user usage
    const result = await db.collection('users').findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { returnDocument: 'after' }
    )

    if (result?.value) {
      return NextResponse.json({ 
        success: true, 
        usage: result.value.usage 
      })
    } else {
      return NextResponse.json({ error: 'Failed to update usage' }, { status: 500 })
    }

  } catch (error) {
    console.error('Usage update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
