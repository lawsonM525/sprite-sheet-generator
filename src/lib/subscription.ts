export interface SubscriptionLimits {
  monthlyGenerations: number
  maxFrames: number
  maxCanvasSize: number
  priorityProcessing: boolean
  downloadFormats: string[]
  support: 'basic' | 'priority' | 'premium'
}

export const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    monthlyGenerations: 5,
    maxFrames: 9,
    maxCanvasSize: 256,
    priorityProcessing: false,
    downloadFormats: ['png'],
    support: 'basic'
  },
  premium: {
    monthlyGenerations: 50,
    maxFrames: 25,
    maxCanvasSize: 512,
    priorityProcessing: true,
    downloadFormats: ['png', 'gif', 'webp'],
    support: 'priority'
  },
  pro: {
    monthlyGenerations: 1000,
    maxFrames: 100,
    maxCanvasSize: 1024,
    priorityProcessing: true,
    downloadFormats: ['png', 'gif', 'webp', 'svg'],
    support: 'premium'
  }
}

export const SUBSCRIPTION_PLANS = {
  premium: {
    name: 'Premium',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    features: [
      '50 generations per month',
      'Up to 25 frames per animation',
      'Canvas sizes up to 512px',
      'Priority processing',
      'Multiple download formats',
      'Priority support'
    ]
  },
  pro: {
    name: 'Professional',
    price: 29.99,
    currency: 'USD',
    interval: 'month',
    features: [
      '1000 generations per month',
      'Up to 100 frames per animation',
      'Canvas sizes up to 1024px',
      'Fastest processing',
      'All download formats',
      'Premium support',
      'API access'
    ]
  }
}

export function getSubscriptionLimits(subscriptionStatus: string): SubscriptionLimits {
  return SUBSCRIPTION_LIMITS[subscriptionStatus] || SUBSCRIPTION_LIMITS.free
}

export function canGenerateSprite(user: any, frameCount: number, canvasSize: number): { 
  canGenerate: boolean
  reason?: string 
} {
  if (!user) {
    return { canGenerate: false, reason: 'Please sign in to generate sprites' }
  }

  const limits = getSubscriptionLimits(user.subscription.planId || user.subscription.status)
  
  // Check monthly limit
  if (user.usage.monthlyGenerations >= limits.monthlyGenerations) {
    return { 
      canGenerate: false, 
      reason: `Monthly limit reached (${limits.monthlyGenerations}). Upgrade your plan for more generations.` 
    }
  }
  
  // Check frame count
  if (frameCount > limits.maxFrames) {
    return { 
      canGenerate: false, 
      reason: `Frame count (${frameCount}) exceeds limit (${limits.maxFrames}). Upgrade your plan for more frames.` 
    }
  }
  
  // Check canvas size
  if (canvasSize > limits.maxCanvasSize) {
    return { 
      canGenerate: false, 
      reason: `Canvas size (${canvasSize}px) exceeds limit (${limits.maxCanvasSize}px). Upgrade your plan for larger sizes.` 
    }
  }
  
  return { canGenerate: true }
}