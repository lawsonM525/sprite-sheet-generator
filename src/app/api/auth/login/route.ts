import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env')
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectToDatabase()

    // Find user and include password for verification
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    
    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update last login
    user.lastLoginAt = new Date()
    await user.save()

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        subscription: user.subscription.status
      },
      JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Return user data and token
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      subscription: user.subscription,
      usage: user.usage,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    }

    const response = NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      token
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}