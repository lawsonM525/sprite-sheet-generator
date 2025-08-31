import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import connectToDatabase from '@/lib/mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

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
      if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
      if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) return 'premium'
      return 'free'
    }

    // Helper function to update user subscription
    const updateUserSubscription = async (email: string, updates: any) => {
      console.log(`Updating user subscription for ${email}:`, updates)
      console.log(`Database name: ${db.databaseName}`)
      console.log(`Collection: users`)
      
      const result = await db.collection('users').updateOne(
        { email },
        { $set: { ...updates, updatedAt: new Date() } },
        { upsert: true }
      )
      console.log(`Database update result:`, result)
      
      // Verify the update
      const user = await db.collection('users').findOne({ email })
      console.log(`User after update:`, user)
    }

    // Handle the event
    switch (event.type) {
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
        if (session.mode === 'subscription' && session.customer_email) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)

          await updateUserSubscription(session.customer_email, {
            stripeCustomerId: session.customer,
            subscriptionId: session.subscription,
            plan,
            planStatus: 'active'
          })
          console.log(`Async payment succeeded for ${session.customer_email}: ${plan}`)
        }
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription' && session.customer_email) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)

          await updateUserSubscription(session.customer_email, {
            stripeCustomerId: session.customer,
            subscriptionId: session.subscription,
            plan,
            planStatus: 'active'
          })
          console.log(`Checkout completed for ${session.customer_email}: ${plan}`)
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.customer_email) {
          console.log(`Checkout session expired for ${session.customer_email}`)
        }
        break
      }

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
        if (customer.email) {
          console.log(`Customer updated: ${customer.email}`)
        }
        break
      }

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

      default:
        console.log(`Unhandled event type: ${event.type}`)
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
