import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { customerId } = await request.json()

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
    }

    // Create Stripe Customer Portal session
    const returnUrl = new URL('/account/subscription', request.nextUrl.origin).toString()
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Failed to create portal session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

