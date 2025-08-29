import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoClient, ObjectId } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db() // Use default database from connection string

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
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

        if (result) {
          token.userId = result._id.toString()
          token.subscription = result.subscription
          token.usage = result.usage
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
      // Update last login time
      if (account?.provider === 'google') {
        await db.collection('users').updateOne(
          { email: user.email },
          { $set: { lastLoginAt: new Date().toISOString() } }
        )
      }
    }
  },
  session: {
    strategy: "jwt" as const, // Use JWT instead of database sessions
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }