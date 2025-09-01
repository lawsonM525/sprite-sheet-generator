import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectToDatabase from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mongoose = await connectToDatabase()
    const db = mongoose.connection.db!

    // Get user subscription data
    const user = await db.collection('users').findOne({ email: session.user.email })

    if (!user) {
      // Return default free plan for new users
      return NextResponse.json({
        plan: 'free',
        planStatus: 'active',
        generationsUsed: 0,
        generationsLimit: 3,
        resetDate: getNextWeekReset()
      })
    }

    // Calculate usage limits and reset dates from nested schema
    const plan = user?.subscription?.planId || 'free'
    const planStatus = user?.subscription?.status || 'free'
    const subscription = {
      plan,
      planStatus,
      stripeCustomerId: user?.subscription?.stripeCustomerId ?? null,
      subscriptionId: user?.subscription?.stripeSubscriptionId ?? null,
      generationsUsed: user?.usage?.monthlyGenerations || 0,
      generationsLimit: getGenerationsLimit(plan),
      resetDate: getResetDate(plan, user?.usage?.lastResetDate)
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Failed to fetch subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getGenerationsLimit(plan: string): number {
  switch (plan) {
    case 'pro': return 30
    case 'premium': return 999999 // Unlimited
    default: return 3 // Free
  }
}

function getResetDate(plan: string, lastResetDate?: Date | string): string {
  const now = new Date()
  
  if (plan === 'free') {
    // Weekly reset for free plan
    return getNextWeekReset()
  } else {
    // Monthly reset for paid plans
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return nextMonth.toISOString()
  }
}

function getNextWeekReset(): string {
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  return nextWeek.toISOString()
}
