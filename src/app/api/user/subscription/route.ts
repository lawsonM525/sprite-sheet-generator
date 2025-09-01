import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectToDatabase from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mongoose = await connectToDatabase()
    const db = mongoose.connection.db!

    // Get user subscription data
    const user = await db.collection('users').findOne({ email: session.user.email })

    if (!user) {
      // Return default free plan for new users
      const nowIso = new Date().toISOString()
      return NextResponse.json({
        plan: 'free',
        planStatus: 'active',
        generationsUsed: 0,
        generationsLimit: 3,
        resetDate: getResetDate('free', nowIso)
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
  const base = lastResetDate ? new Date(lastResetDate) : new Date()
  if (plan === 'free') {
    // Weekly reset for free plan based on lastResetDate
    const next = new Date(base.getTime() + 7 * 24 * 60 * 60 * 1000)
    return next.toISOString()
  } else {
    // Monthly reset for paid plans: first day of next month after lastResetDate
    const nextMonth = new Date(base.getFullYear(), base.getMonth() + 1, 1)
    return nextMonth.toISOString()
  }
}
