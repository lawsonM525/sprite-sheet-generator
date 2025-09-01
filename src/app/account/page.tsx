'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserMenu } from '@/components/auth/UserMenu'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Crown, User, Calendar, Zap, History, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your account</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getSubscriptionBadge = () => {
    const status = user.subscription.status
    if (status === 'free') return { label: 'Free', className: 'bg-gray-100 text-gray-800' }
    
    const variants = {
      premium: { label: 'Premium', className: 'bg-blue-100 text-blue-800' },
      pro: { label: 'Pro', className: 'bg-purple-100 text-purple-800' }
    }
    
    return variants[status as keyof typeof variants] || { label: 'Free', className: 'bg-gray-100 text-gray-800' }
  }

  const getUsageLimit = () => {
    switch (user.subscription.status) {
      case 'free': return 5
      case 'premium': return 50
      case 'pro': return 1000
      default: return 5
    }
  }

  const usagePercentage = (user.usage.monthlyGenerations / getUsageLimit()) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Account</h1>
          <p className="text-muted-foreground">Manage your profile and subscription</p>
        </div>
        <Link href="/">
          <Button variant="outline">Back to Generator</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                {user.image && (
                  <AvatarImage src={user.image} alt={user.name || user.email} />
                )}
                <AvatarFallback className="text-lg">
                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{user.name || 'User'}</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Subscription</span>
                <Badge className={getSubscriptionBadge().className}>
                  {user.subscription.status !== 'free' && <Crown className="w-3 h-3 mr-1" />}
                  {getSubscriptionBadge().label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Member since {new Date(user.usage.lastResetDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Usage This Month
            </CardTitle>
            <CardDescription>
              Track your sprite sheet generation usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Generations Used</span>
                <span className="text-sm font-mono">
                  {user.usage.monthlyGenerations} / {getUsageLimit()}
                </span>
              </div>
              <Progress value={Math.min(usagePercentage, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Resets monthly on the {new Date(user.usage.lastResetDate).getDate()}th
              </p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Generations</span>
                <span className="text-lg font-bold">{user.usage.totalGenerations}</span>
              </div>
            </div>

            {user.subscription.status === 'free' && usagePercentage > 80 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-800">
                  You&apos;re approaching your monthly limit. 
                  <Link href="/account/subscription" className="font-medium underline ml-1">
                    Upgrade your plan
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Generation History
            </CardTitle>
            <CardDescription>
              View and manage your past creations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/account/history">
              <Button variant="outline" className="w-full">
                View All Projects
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Subscription Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Subscription Management
            </CardTitle>
            <CardDescription>
              Upgrade or manage your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.subscription.status === 'free' ? (
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Upgrade to unlock more frames, higher resolutions, and priority generation.
                </p>
                <Link href="/account/subscription">
                  <Button className="w-full">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  You&apos;re currently on the <strong>{getSubscriptionBadge().label}</strong> plan.
                </p>
                <div className="flex gap-2">
                  <Link href="/account/subscription">
                    <Button variant="outline" className="flex-1">
                      Manage Plan
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  )
}