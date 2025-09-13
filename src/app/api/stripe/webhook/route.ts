import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import connectToDatabase from '@/lib/mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    const mongoose = await connectToDatabase()
    const db = mongoose.connection.db!

    // Helper function to determine plan from price ID
    const getPlanFromPriceId = (priceId: string): string => {
      console.log(`Checking price ID: ${priceId}`)
      console.log(`PRO_PRICE_ID: ${process.env.STRIPE_PRO_PRICE_ID}`)
      console.log(`PREMIUM_PRICE_ID: ${process.env.STRIPE_PREMIUM_PRICE_ID}`)
      
      if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
      if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) return 'premium'
      
      console.log(`No matching price ID found, defaulting to 'free'`)
      return 'free'
    }

    // Helper function to update user subscription
    const updateUserSubscription = async (email: string, updates: any) => {
      console.log(`Updating user subscription for ${email}:`, updates)
      console.log(`Database name: ${db.databaseName}`)
      console.log(`Collection: users`)

      // Prepare updates for both top-level and nested subscription fields
      const finalUpdates: any = { updatedAt: new Date() }

      if (updates.plan) {
        finalUpdates.plan = updates.plan
        finalUpdates.planStatus = updates.planStatus || 'active'
        finalUpdates['subscription.planId'] = updates.plan
        finalUpdates['subscription.status'] = updates.planStatus || 'active'
      }
      if (updates.planStatus) {
        finalUpdates.planStatus = updates.planStatus
        finalUpdates['subscription.status'] = updates.planStatus
      }
      if (updates.stripeCustomerId) {
        finalUpdates.stripeCustomerId = updates.stripeCustomerId
        finalUpdates['subscription.stripeCustomerId'] = updates.stripeCustomerId
      }
      if (updates.subscriptionId) {
        finalUpdates.subscriptionId = updates.subscriptionId
        finalUpdates['subscription.stripeSubscriptionId'] = updates.subscriptionId
      }

      console.log(`Final database updates:`, finalUpdates)

      const result = await db.collection('users').updateOne(
        { email },
        { $set: finalUpdates },
        { upsert: true }
      )
      console.log(`Database update result:`, result)

      // Verify the update
      const user = await db.collection('users').findOne({ email })
      console.log(`User after update:`, user)
    }

    // Handle the event - Listen to ALL events and process subscription-related ones
    console.log(`Processing event: ${event.type}`)
    
    switch (event.type) {
      // Checkout Session Events
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.customer_email) {
          await updateUserSubscription(session.customer_email, {
            planStatus: 'payment_failed'
          })
          console.log(`Async payment failed for ${session.customer_email}`)
        }
        break
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)
          const customer = session.customer
            ? await stripe.customers.retrieve(session.customer as string) as Stripe.Customer
            : undefined
          const email = (customer && customer.email) || (session as any).customer_email || (session as any).customer_details?.email
          if (email) {
            await updateUserSubscription(email, {
              stripeCustomerId: session.customer,
              subscriptionId: session.subscription,
              plan,
              planStatus: 'active'
            })
            console.log(`Async payment succeeded for ${email}: ${plan}`)
          }
        }
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)
          const customer = session.customer
            ? await stripe.customers.retrieve(session.customer as string) as Stripe.Customer
            : undefined
          const email = (customer && customer.email) || (session as any).customer_email || (session as any).customer_details?.email
          if (email) {
            await updateUserSubscription(email, {
              stripeCustomerId: session.customer,
              subscriptionId: session.subscription,
              plan,
              planStatus: 'active'
            })
            console.log(`Checkout completed for ${email}: ${plan}`)
          }
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log(`Checkout session expired: ${session.id}`)
        break
      }

      // Customer Events
      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer
        if (customer.email) {
          await updateUserSubscription(customer.email, {
            stripeCustomerId: customer.id
          })
          console.log(`Customer created: ${customer.email}`)
        }
        break
      }

      case 'customer.deleted': {
        const customer = event.data.object as Stripe.Customer
        if (customer.email) {
          await updateUserSubscription(customer.email, {
            plan: 'free',
            planStatus: 'deleted',
            stripeCustomerId: null,
            subscriptionId: null
          })
          console.log(`Customer deleted: ${customer.email}`)
        }
        break
      }

      case 'customer.updated': {
        const customer = event.data.object as Stripe.Customer
        console.log(`Customer updated: ${customer.id}`)
        break
      }

      // Subscription Events
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
        if (customer.email) {
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)
          await updateUserSubscription(customer.email, {
            subscriptionId: subscription.id,
            plan,
            planStatus: subscription.status
          })
          console.log(`Subscription created for ${customer.email}: ${plan}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
        if (customer.email) {
          await updateUserSubscription(customer.email, {
            plan: 'free',
            planStatus: 'cancelled',
            subscriptionId: null
          })
          console.log(`Subscription deleted for ${customer.email}`)
        }
        break
      }

      case 'customer.subscription.paused': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
        if (customer.email) {
          await updateUserSubscription(customer.email, {
            planStatus: 'paused'
          })
          console.log(`Subscription paused for ${customer.email}`)
        }
        break
      }

      case 'customer.subscription.resumed': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
        if (customer.email) {
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)
          await updateUserSubscription(customer.email, {
            plan,
            planStatus: 'active'
          })
          console.log(`Subscription resumed for ${customer.email}: ${plan}`)
        }
        break
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
        if (customer.email) {
          console.log(`Trial ending soon for ${customer.email}`)
          // Optionally send notification email here
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
        if (customer.email) {
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)
          await updateUserSubscription(customer.email, {
            plan,
            planStatus: subscription.status
          })
          console.log(`Subscription updated for ${customer.email}: ${plan} (${subscription.status})`)
        }
        break
      }

      case 'customer.subscription.pending_update_applied': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
        if (customer.email) {
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)
          await updateUserSubscription(customer.email, {
            plan,
            planStatus: subscription.status
          })
          console.log(`Pending update applied for ${customer.email}: ${plan}`)
        }
        break
      }

      case 'customer.subscription.pending_update_expired': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
        if (customer.email) {
          console.log(`Pending update expired for ${customer.email}`)
        }
        break
      }

      // Invoice Events
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer
        if (customer.email) {
          await updateUserSubscription(customer.email, {
            planStatus: 'past_due'
          })
          console.log(`Payment failed for ${customer.email}`)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer
        if (customer.email && (invoice as any).subscription) {
          const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string)
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)
          await updateUserSubscription(customer.email, {
            plan,
            planStatus: 'active'
          })
          console.log(`Payment succeeded for ${customer.email}: ${plan}`)
        }
        break
      }

      case 'invoice.payment_action_required': {
        const invoice = event.data.object as Stripe.Invoice
        const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer
        if (customer.email) {
          await updateUserSubscription(customer.email, {
            planStatus: 'incomplete'
          })
          console.log(`Payment action required for ${customer.email}`)
        }
        break
      }

      // Payment Intent Events
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`Payment intent succeeded: ${paymentIntent.id}`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`Payment intent failed: ${paymentIntent.id}`)
        break
      }

      // Charge Events
      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge
        console.log(`Charge succeeded: ${charge.id}`)
        break
      }

      case 'charge.failed': {
        const charge = event.data.object as Stripe.Charge
        console.log(`Charge failed: ${charge.id}`)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        console.log(`Charge refunded: ${charge.id}`)
        break
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute
        console.log(`Dispute created: ${dispute.id}`)
        break
      }

      // All other events - just log them
      default:
        console.log(`Event received: ${event.type} - ${event.id}`)
        console.log(`Event data:`, JSON.stringify(event.data.object, null, 2))
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
