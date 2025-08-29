import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import connectToDatabase from '@/lib/mongodb'
import User, { IUser } from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env')
}

interface JWTPayload {
  userId: string
  email: string
  subscription: string
  iat: number
  exp: number
}

export async function verifyAuth(request: NextRequest): Promise<{
  user: IUser | null
  error: string | null
}> {
  try {
    // Get token from cookie or Authorization header
    let token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      return { user: null, error: 'No authentication token provided' }
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET!) as JWTPayload
    
    // Connect to database
    await connectToDatabase()
    
    // Get user from database
    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return { user: null, error: 'User not found' }
    }

    return { user, error: null }

  } catch (error) {
    console.error('Auth verification error:', error)
    return { user: null, error: 'Invalid authentication token' }
  }
}

export function createAuthResponse(error: string, status: number = 401) {
  return Response.json({ error }, { status })
}