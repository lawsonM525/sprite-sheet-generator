'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Check, Crown, Zap, Settings, CreditCard, Calendar, Users } from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'

interface UserSubscription {
  plan: 'free' | 'pro' | 'premium'
  planStatus: string
  stripeCustomerId?: string
  subscriptionId?: string
  generationsUsed?: number
  generationsLimit?: number
  resetDate?: string
}

export default function SubscriptionPage() {
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    if (session?.user?.email) {
      fetchSubscription()
    }
  }, [session])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const createPortalSession = async () => {
    if (!subscription?.stripeCustomerId) return
    
    setPortalLoading(true)
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: subscription.stripeCustomerId })
      })
      
      if (response.ok) {
        const { url } = await response.json()
        window.open(url, '_blank')
      } else {
        console.error('Portal session creation failed:', response.status, await response.text())
      }
    } catch (error) {
      console.error('Failed to create portal session:', error)
    } finally {
      setPortalLoading(false)
    }
  }

  const getPlanDetails = (plan: string) => {
    switch (plan) {
      case 'pro':
        return {
          name: 'Pro',
          price: '$5.99/month',
          icon: <Zap className="w-5 h-5" />,
          color: 'bg-purple-pizzazz',
          features: ['30 generations per month', 'All grid sizes (2x2, 3x3, 4x4, 5x5)', 'Priority support']
        }
      case 'premium':
        return {
          name: 'Premium',
          price: '$14.99/month',
          icon: <Crown className="w-5 h-5" />,
          color: 'bg-purple-pizzazz',
          features: ['Unlimited generations', 'Custom grid sizes', 'Priority support & Discord access']
        }
      default:
        return {
          name: 'Free',
          price: 'Free',
          icon: <Users className="w-5 h-5" />,
          color: 'bg-citron-500',
          features: ['3 generations per week', 'Basic grid sizes (2x2, 3x3)', 'Community support']
        }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>
      case 'past_due':
        return <Badge className="bg-yellow-500 text-white">Past Due</Badge>
      case 'cancelled':
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>
      case 'paused':
        return <Badge className="bg-gray-500 text-white">Paused</Badge>
      default:
        return <Badge className="bg-gray-500 text-white">Free</Badge>
    }
  }

  const getUsageProgress = () => {
    if (!subscription) return 0
    const used = subscription.generationsUsed || 0
    const limit = subscription.generationsLimit || (subscription.plan === 'free' ? 3 : subscription.plan === 'pro' ? 30 : 999)
    return subscription.plan === 'premium' ? 0 : Math.min((used / limit) * 100, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-rich-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-rich-black-300 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-rich-black-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const planDetails = getPlanDetails(subscription?.plan || 'free')
  const usageProgress = getUsageProgress()
  const periodLabel = subscription?.plan === 'free' ? 'This Week' : 'This Month'

  return (
    <div className="min-h-screen bg-rich-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-mimi-pink-500 mb-2">Subscription Management</h1>
          <p className="text-citron-600">Manage your subscription and billing preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Current Plan */}
          <Card className="bg-rich-black-200 border-rich-black-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-mimi-pink-500">
                {planDetails.icon}
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-citron-400">{planDetails.name}</h3>
                  <p className="text-citron-600">{planDetails.price}</p>
                </div>
                {getStatusBadge(subscription?.planStatus || 'free')}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-purple-pizzazz">Features:</h4>
                <ul className="space-y-1">
                  {planDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-citron-600">
                      <Check className="w-4 h-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Usage */}
          <Card className="bg-rich-black-200 border-rich-black-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-mimi-pink-500">
                <Calendar className="w-5 h-5" />
                {`Usage ${periodLabel}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription?.plan === 'premium' ? (
                <div className="text-center py-8">
                  <Crown className="w-12 h-12 text-purple-pizzazz mx-auto mb-2" />
                  <p className="text-citron-400 font-medium">Unlimited Generations</p>
                  <p className="text-citron-600 text-sm">No limits on your creativity!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-citron-600">{`Generations Used ${periodLabel}`}</span>
                      <span className="text-citron-400">
                        {subscription?.generationsUsed || 0} / {subscription?.plan === 'free' ? 3 : 30}
                      </span>
                    </div>
                    <Progress value={usageProgress} className="h-2" />
                  </div>
                  
                  {subscription?.resetDate && (
                    <p className="text-xs text-citron-500">
                      Resets on {new Date(subscription.resetDate).toLocaleDateString()}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <Card className="bg-rich-black-200 border-rich-black-400">
            <CardHeader>
              <CardTitle className="text-mimi-pink-500">Manage Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Upgrade Options */}
                {subscription?.plan === 'free' && (
                  <>
                    <div className="space-y-2">
                      <h4 className="font-medium text-purple-pizzazz">Upgrade to Pro</h4>
                      <p className="text-sm text-citron-600">30 generations per month + all grid sizes</p>
                      <a href="https://buy.stripe.com/aFaaEY2had2E5P66ybawo02" target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-mimi-pink-500 hover:bg-purple-pizzazz text-white">
                          Upgrade to Pro - $5.99/month
                        </Button>
                      </a>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-purple-pizzazz">Upgrade to Premium</h4>
                      <p className="text-sm text-citron-600">Unlimited generations + custom grids</p>
                      <a href="https://buy.stripe.com/cNi5kE3lefaM0uM09Nawo03" target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-purple-pizzazz hover:bg-purple-pizzazz/90 text-white">
                          Upgrade to Premium - $14.99/month
                        </Button>
                      </a>
                    </div>
                  </>
                )}

                {subscription?.plan === 'pro' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-purple-pizzazz">Upgrade to Premium</h4>
                    <p className="text-sm text-citron-600">Unlimited generations + custom grids</p>
                    <a href="https://buy.stripe.com/cNi5kE3lefaM0uM09Nawo03" target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-purple-pizzazz hover:bg-purple-pizzazz/90 text-white">
                        Upgrade to Premium - $14.99/month
                      </Button>
                    </a>
                  </div>
                )}

                {/* Billing Management */}
                {subscription?.stripeCustomerId && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-purple-pizzazz">Billing Management</h4>
                    <p className="text-sm text-citron-600">Update payment method, view invoices, cancel subscription</p>
                    <Button 
                      onClick={createPortalSession}
                      disabled={portalLoading}
                      variant="outline"
                      className="w-full border-purple-pizzazz text-purple-pizzazz hover:bg-purple-pizzazz hover:text-white"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      {portalLoading ? 'Loading...' : 'Manage Billing'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to Account */}
        <div className="mt-8">
          <Link href="/account">
            <Button variant="outline" className="border-citron-500 text-citron-500 hover:bg-citron-500 hover:text-rich-black">
              ← Back to Account
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
