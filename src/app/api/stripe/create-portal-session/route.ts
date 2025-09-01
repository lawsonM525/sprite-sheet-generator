import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { customerId } = await request.json()

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
    }

    // Create Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `https://www.sprite-sheet-generator.com/account/subscription`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Failed to create portal session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
