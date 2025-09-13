import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import Stripe from 'stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY
    if (!hasStripeKey) {
      console.error('[portal] Missing STRIPE_SECRET_KEY environment variable')
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 })
    }
    if (!hasNextAuthSecret) {
      console.error('[portal] Missing NEXTAUTH_SECRET environment variable')
      return NextResponse.json({ error: 'Auth is not configured' }, { status: 500 })
    }

    const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    const { customerId } = await request.json()

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
    }

    if (typeof customerId !== 'string' || !customerId.startsWith('cus_')) {
      console.error('[portal] Invalid customerId format:', customerId)
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 })
    }

    // Verify the customer exists under the current API key (helps detect live/test mismatch)
    try {
      const customer = await stripe.customers.retrieve(customerId)
      // If Stripe returns a DeletedCustomer, it will have a 'deleted' flag
      if ((customer as any).deleted) {
        console.error('[portal] Customer exists but is deleted:', customerId)
        return NextResponse.json({ error: 'Customer deleted' }, { status: 400 })
      }
    } catch (err: any) {
      const code = err?.raw?.code || err?.code
      const type = err?.type
      const message = err?.message
      console.error('[portal] Failed to retrieve customer', { customerId, code, type, message })
      if (code === 'resource_missing') {
        // Common when using a test customer with a live key (or vice versa)
        return NextResponse.json({ error: 'Customer not found for current Stripe key (check live vs test mode)' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Unable to verify customer' }, { status: 400 })
    }

    // Create Stripe Customer Portal session
    const returnUrl = new URL('/account/subscription', request.nextUrl.origin).toString()
    try {
      const configuration = process.env.STRIPE_PORTAL_CONFIGURATION_ID
      const params: Stripe.BillingPortal.SessionCreateParams = {
        customer: customerId,
        return_url: returnUrl,
      }
      if (configuration) {
        ;(params as any).configuration = configuration
      }
      const portalSession = await stripe.billingPortal.sessions.create(params)
      return NextResponse.json({ url: portalSession.url })
    } catch (err: any) {
      const details = {
        type: err?.type,
        code: err?.raw?.code || err?.code,
        message: err?.message,
        param: err?.raw?.param,
        statusCode: err?.statusCode,
      }
      console.error('[portal] billingPortal.sessions.create failed:', details)
      const status = details.statusCode && details.statusCode >= 400 && details.statusCode < 600 ? details.statusCode : 400
      return NextResponse.json({
        error: details.message || 'Unable to create billing portal session',
        code: details.code,
        type: details.type,
      }, { status })
    }
  } catch (error) {
    const err: any = error
    const details = {
      type: err?.type,
      code: err?.raw?.code || err?.code,
      message: err?.message,
      statusCode: err?.statusCode,
    }
    console.error('[portal] Failed to create portal session:', details)
    // In non-production, bubble up message for easier debugging
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ error: details.message || 'Internal server error' }, { status: details.statusCode || 500 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
