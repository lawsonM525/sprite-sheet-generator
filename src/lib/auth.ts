import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { ObjectId } from 'mongodb'
import connectToDatabase from '@/lib/mongodb'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 5 * 60, // 5 minutes - short session for fresh subscription data
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug in production temporarily
  callbacks: {
    async jwt({ token, account, profile }: any) {
      try {
        const mongoose = await connectToDatabase()
        const db = mongoose.connection.db!

        if (account && profile) {
          // Initial sign-in: upsert user and enrich token
          const result = await db.collection('users').findOneAndUpdate(
            { email: profile.email },
            {
              $setOnInsert: {
                email: profile.email,
                auth_provider: 'google',
                role: 'user',
                subscription: {
                  status: 'free',
                  planId: 'free',
                  stripeCustomerId: null,
                  stripeSubscriptionId: null,
                  currentPeriodEnd: null,
                  cancelAtPeriodEnd: false,
                },
                usage: {
                  totalGenerations: 0,
                  monthlyGenerations: 0,
                  lastResetDate: new Date().toISOString(),
                },
                createdAt: new Date().toISOString(),
              },
              $set: {
                name: profile.name,
                image: profile.picture,
                lastLoginAt: new Date().toISOString(),
              },
            },
            { upsert: true, returnDocument: 'after' }
          )
          const userDoc = (result as any).value
          if (userDoc) {
            token.userId = userDoc._id.toString()
            token.subscription = userDoc.subscription
            token.usage = userDoc.usage
            token.email = userDoc.email
            token.name = userDoc.name
            token.image = userDoc.image
            console.log('[auth.jwt] upserted and enriched token for', userDoc.email)
          }
        } else {
          // Subsequent requests: ensure token has userId and latest plan by email
          if (!token.userId && token.email) {
            const user = await db.collection('users').findOne({ email: token.email })
            if (user) {
              token.userId = user._id.toString()
              token.subscription = user.subscription
              token.usage = user.usage
              console.log('[auth.jwt] hydrated token from email', token.email)
            }
          }
        }
      } catch (error) {
        console.error('[auth.jwt] error:', error)
        // best-effort fallback retains whatever token has
        if (account && profile) {
          token.userId = token.userId || profile.sub
          token.email = token.email || profile.email
          token.name = token.name || profile.name
          token.image = token.image || profile.picture
        }
      }
      return token
    },
    async session({ session, token }: any) {
      try {
        const mongoose = await connectToDatabase()
        const db = mongoose.connection.db!

        let userDoc: any = null
        if (token.userId) {
          userDoc = await db.collection('users').findOne({ _id: new ObjectId(token.userId) })
        } else if (session?.user?.email) {
          userDoc = await db.collection('users').findOne({ email: session.user.email })
        } else if (token.email) {
          userDoc = await db.collection('users').findOne({ email: token.email })
        }

        if (userDoc) {
          session.user.id = userDoc._id.toString()
          session.user.subscription = userDoc.subscription || { status: 'free', planId: 'free' }
          session.user.usage = userDoc.usage || { totalGenerations: 0, monthlyGenerations: 0, lastResetDate: new Date().toISOString() }
          session.user.role = userDoc.role || 'user'
          // ensure token also carries id for future calls
          token.userId = token.userId || userDoc._id.toString()
          console.log('[auth.session] enriched session for', userDoc.email, 'plan:', userDoc.subscription?.planId)
        } else {
          // Token-level fallback
          if (token.userId) session.user.id = token.userId
          if (!('subscription' in session.user)) session.user.subscription = token.subscription || { status: 'free', planId: 'free' }
          if (!('usage' in session.user)) session.user.usage = token.usage || { totalGenerations: 0, monthlyGenerations: 0, lastResetDate: new Date().toISOString() }
          session.user.role = session.user.role || 'user'
          console.log('[auth.session] fallback session without DB user match')
        }
      } catch (error) {
        console.error('[auth.session] error:', error)
        // Keep base session and minimally set defaults
        if (!session.user.subscription) session.user.subscription = { status: 'free', planId: 'free' }
        if (!session.user.usage) session.user.usage = { totalGenerations: 0, monthlyGenerations: 0, lastResetDate: new Date().toISOString() }
        if (!session.user.role) session.user.role = 'user'
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, profile }: any) {
      console.log('=== NEXTAUTH SIGN-IN EVENT ===')
      console.log('User object:', JSON.stringify(user, null, 2))
      console.log('Account object:', JSON.stringify(account, null, 2))
      console.log('Profile object:', JSON.stringify(profile, null, 2))
      console.log('Environment check:')
      console.log('- NODE_ENV:', process.env.NODE_ENV)
      console.log('- NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
      console.log('- GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID)
      console.log('- GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET)
      console.log('- NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET)
      
      // Update last login time and log OAuth usage
      if (account?.provider === 'google') {
        console.log(`Google OAuth sign-in successful for: ${user.email}`)
        console.log(`OAuth Client ID used: ${process.env.GOOGLE_CLIENT_ID?.substring(0, 20)}...`)
        
        try {
          const mongoose = await connectToDatabase()
          const db = mongoose.connection.db!
          await db.collection('users').updateOne(
            { email: user.email },
            { $set: { lastLoginAt: new Date().toISOString() } }
          )
          console.log('Database update successful')
        } catch (error) {
          console.error('Database update failed:', error)
        }
      }
      console.log('=== END SIGN-IN EVENT ===')
    }
  }
}
