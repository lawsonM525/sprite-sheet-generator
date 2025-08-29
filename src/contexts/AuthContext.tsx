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
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
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