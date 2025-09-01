'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession, signIn, signOut, SessionProvider } from 'next-auth/react'

interface User {
  id: string
  email: string
  name?: string
  image?: string
  role: string
  subscription: {
    status: 'free' | 'premium' | 'pro'
    planId: string
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    currentPeriodEnd: string | null
    cancelAtPeriodEnd: boolean
  }
  usage: {
    totalGenerations: number
    monthlyGenerations: number
    lastResetDate: string
  }
}

interface AuthContextType {
  user: User | null
  signInWithGoogle: () => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [refreshedOnMount, setRefreshedOnMount] = useState(false)
  const loading = status === 'loading'

  useEffect(() => {
    if (session?.user) {
      const sessionUser = session.user as any
      setUser({
        id: sessionUser.id || '',
        email: sessionUser.email || '',
        name: sessionUser.name || undefined,
        image: sessionUser.image || undefined,
        role: sessionUser.role || 'user',
        subscription: sessionUser.subscription || {
          status: 'free',
          planId: 'free',
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false
        },
        usage: sessionUser.usage || {
          totalGenerations: 0,
          monthlyGenerations: 0,
          lastResetDate: new Date().toISOString()
        }
      })
    } else {
      setUser(null)
    }
  }, [session])

  // Auto-refresh session every 2 minutes to get fresh subscription data
  useEffect(() => {
    if (session?.user) {
      const interval = setInterval(() => {
        update()
      }, 2 * 60 * 1000) // 2 minutes

      return () => clearInterval(interval)
    }
  }, [session, update])

  // One-time session refresh on mount once authenticated to ensure enriched fields
  useEffect(() => {
    if (status === 'authenticated' && !refreshedOnMount) {
      update()
      setRefreshedOnMount(true)
    }
  }, [status, refreshedOnMount, update])

  // Fallback: if subscription/usage missing in session, hydrate from API
  useEffect(() => {
    const hydrateFromApi = async () => {
      if (!session?.user) return
      const su = session.user as any
      const missing = !su.subscription || !su.usage || !su.subscription.planId
      if (!missing) return
      try {
        const res = await fetch('/api/user/subscription')
        if (res.ok) {
          const data = await res.json()
          setUser(prev => {
            const base = prev || {
              id: su.id || '',
              email: su.email || '',
              name: su.name,
              image: su.image,
              role: 'user',
              subscription: su.subscription,
              usage: su.usage,
            }
            return {
              ...base,
              subscription: {
                status: data.planStatus || 'free',
                planId: data.plan || 'free',
                stripeCustomerId: data.stripeCustomerId ?? null,
                stripeSubscriptionId: data.subscriptionId ?? null,
                currentPeriodEnd: null,
                cancelAtPeriodEnd: false,
              },
              usage: {
                ...base.usage,
                monthlyGenerations: data.generationsUsed ?? 0,
                lastResetDate: data.resetDate || new Date().toISOString(),
              },
            }
          })
        }
      } catch (e) {
        console.error('Failed to hydrate subscription from API:', e)
      }
    }
    hydrateFromApi()
  }, [session])

  // Refresh session on window focus and when tab becomes visible
  useEffect(() => {
    if (!session?.user) return

    const handleFocus = () => update()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') update()
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [session, update])

  const signInWithGoogle = async () => {
    await signIn('google', { callbackUrl: '/' })
  }

  const logout = async () => {
    await signOut({ callbackUrl: '/' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}