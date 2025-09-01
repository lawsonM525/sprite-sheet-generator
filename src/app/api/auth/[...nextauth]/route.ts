import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)
// Use the same database name as other modules ("main") to avoid mismatch
const db = client.db('main')

const authOptions = {
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
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug in production temporarily
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        // Store user in our custom users collection
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
                cancelAtPeriodEnd: false
              },
              usage: {
                totalGenerations: 0,
                monthlyGenerations: 0,
                lastResetDate: new Date().toISOString()
              },
              createdAt: new Date().toISOString()
            },
            $set: {
              name: profile.name,
              image: profile.picture,
              lastLoginAt: new Date().toISOString()
            }
          },
          { upsert: true, returnDocument: 'after' }
        )

        // In the MongoDB Node driver, the updated document is returned under `value`
        const userDoc = (result as any).value
        if (userDoc) {
          token.userId = userDoc._id.toString()
          token.subscription = userDoc.subscription
          token.usage = userDoc.usage
        }
      }
      return token
    },
    async session({ session, token }: any) {
      if (token.userId) {
        // Fetch latest user data from database
        const user = await db.collection('users').findOne({ _id: new ObjectId(token.userId) })
        
        if (user) {
          session.user.id = user._id.toString()
          session.user.subscription = user.subscription
          session.user.usage = user.usage
          session.user.role = user.role
        }
      }
      return session
    }
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
  },
  session: {
    strategy: "jwt" as const, // Use JWT instead of database sessions
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
