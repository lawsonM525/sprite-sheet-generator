'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Zap, Crown } from 'lucide-react'
import Link from 'next/link'

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams()
  const [plan, setPlan] = useState<string>('pro')
  
  useEffect(() => {
    // Get plan from URL params or session storage
    const sessionId = searchParams.get('session_id')
    const planParam = searchParams.get('plan')
    
    if (planParam) {
      setPlan(planParam)
    }
    
    // Redirect to account after 10 seconds
    const timer = setTimeout(() => {
      window.location.href = '/account/subscription'
    }, 10000)
    
    return () => clearTimeout(timer)
  }, [searchParams])

  const getPlanDetails = (planType: string) => {
    switch (planType) {
      case 'premium':
        return {
          name: 'Premium',
          icon: <Crown className="w-8 h-8 text-mimi-pink-500" />,
          color: 'text-mimi-pink-500',
          features: ['Unlimited generations', 'Custom grid sizes', 'Priority support']
        }
      default:
        return {
          name: 'Pro',
          icon: <Zap className="w-8 h-8 text-purple-pizzazz" />,
          color: 'text-purple-pizzazz',
          features: ['30 generations per month', 'All grid sizes', 'Priority support']
        }
    }
  }

  const planDetails = getPlanDetails(plan)

  return (
    <div className="min-h-screen bg-rich-black flex items-center justify-center p-6">
      <Card className="bg-rich-black-200 border-rich-black-400 max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-mimi-pink-500 mb-2">
            Welcome to {planDetails.name}!
          </CardTitle>
          <p className="text-citron-600">
            Your subscription has been activated successfully
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              {planDetails.icon}
            </div>
            <h3 className={`text-lg font-semibold ${planDetails.color}`}>
              {planDetails.name} Plan Active
            </h3>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-purple-pizzazz">What's included:</h4>
            <ul className="space-y-2">
              {planDetails.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-citron-600">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/account/subscription">
              <Button className="w-full bg-purple-pizzazz hover:bg-purple-pizzazz/90 text-white">
                Manage Subscription
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full border-citron-500 text-citron-500 hover:bg-citron-500 hover:text-rich-black">
                Start Creating Sprite Sheets
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-xs text-citron-500">
              Redirecting to your account in 10 seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
