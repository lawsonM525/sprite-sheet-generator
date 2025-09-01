import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import mongoose from 'mongoose'
import connectToDatabase from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
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

    // Check if we need to reset monthly usage (new month)
    const now = new Date()
    const lastReset = new Date(user.usage.lastResetDate)
    const shouldReset = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()

    let updateData: any = {
      $inc: {
        'usage.totalGenerations': 1
      }
    }

    if (shouldReset) {
      // Reset monthly counter and update reset date
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
