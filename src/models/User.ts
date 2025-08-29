import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  password?: string
  name?: string
  image?: string
  provider?: string
  providerId?: string
  
  // Subscription details
  subscription: {
    status: 'free' | 'premium' | 'pro'
    planId?: string
    startDate?: Date
    endDate?: Date
    cancelAtPeriodEnd?: boolean
    stripeCustomerId?: string
    stripeSubscriptionId?: string
  }
  
  // Usage tracking
  usage: {
    totalGenerations: number
    monthlyGenerations: number
    lastResetDate: Date
  }
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    select: false // Don't include password in queries by default
  },
  name: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  provider: {
    type: String,
    enum: ['credentials', 'google', 'github'],
    default: 'credentials'
  },
  providerId: {
    type: String
  },
  
  subscription: {
    status: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
    },
    planId: String,
    startDate: Date,
    endDate: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  
  usage: {
    totalGenerations: {
      type: Number,
      default: 0
    },
    monthlyGenerations: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    }
  },
  
  lastLoginAt: Date
}, {
  timestamps: true
})

// Indexes for performance (email index is already defined in schema)
UserSchema.index({ 'subscription.stripeCustomerId': 1 })
UserSchema.index({ 'subscription.stripeSubscriptionId': 1 })
UserSchema.index({ createdAt: -1 })

// Instance methods
UserSchema.methods.isSubscribed = function(): boolean {
  return this.subscription.status !== 'free' && 
         this.subscription.endDate && 
         this.subscription.endDate > new Date()
}

UserSchema.methods.canGenerate = function(): boolean {
  const limits: Record<string, number> = {
    free: 5,
    premium: 50,
    pro: 1000
  }
  
  const limit = limits[this.subscription.status] || limits.free
  return this.usage.monthlyGenerations < limit
}

UserSchema.methods.incrementUsage = function(): void {
  this.usage.totalGenerations += 1
  this.usage.monthlyGenerations += 1
}

UserSchema.methods.resetMonthlyUsage = function(): void {
  const now = new Date()
  const lastReset = this.usage.lastResetDate
  
  // Reset if it's been more than a month
  if (!lastReset || (now.getTime() - lastReset.getTime()) > (30 * 24 * 60 * 60 * 1000)) {
    this.usage.monthlyGenerations = 0
    this.usage.lastResetDate = now
  }
}

// Static methods
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() })
}

// Pre-save middleware
UserSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('lastLoginAt')) {
    const now = new Date()
    const lastReset = this.usage.lastResetDate
    
    // Reset if it's been more than a month
    if (!lastReset || (now.getTime() - lastReset.getTime()) > (30 * 24 * 60 * 60 * 1000)) {
      this.usage.monthlyGenerations = 0
      this.usage.lastResetDate = now
    }
  }
  next()
})

// Create model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User