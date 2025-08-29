'use client'

import { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Sparkles, Image as ImageIcon } from 'lucide-react'

interface ProgressBarProps {
  progress: number
  message: string
  currentFrame?: number
  totalFrames?: number
  className?: string
}

export function ProgressBar({ 
  progress, 
  message, 
  currentFrame, 
  totalFrames, 
  className 
}: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0)

  // Smooth progress animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress)
    }, 100)
    return () => clearTimeout(timer)
  }, [progress])

  const getIcon = () => {
    if (progress < 15) {
      return <Sparkles className="w-4 h-4 text-primary animate-pulse" />
    } else if (progress < 85) {
      return <ImageIcon className="w-4 h-4 text-blue-500 animate-bounce" />
    } else {
      return <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
    }
  }

  const getProgressColor = () => {
    if (progress < 30) return 'bg-yellow-500'
    if (progress < 70) return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with icon and message */}
          <div className="flex items-center gap-3">
            {getIcon()}
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {message}
              </p>
              {currentFrame && totalFrames && (
                <p className="text-xs text-muted-foreground">
                  Frame {currentFrame} of {totalFrames}
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-foreground">
                {Math.round(displayProgress)}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative">
            <Progress 
              value={displayProgress} 
              className="h-3 transition-all duration-300 ease-out"
            />
            {/* Animated gradient overlay */}
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full"
              style={{ width: `${displayProgress}%` }}
            />
          </div>

          {/* Frame counter visualization */}
          {currentFrame && totalFrames && (
            <div className="flex gap-1 justify-center">
              {Array.from({ length: totalFrames }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    i < currentFrame
                      ? 'bg-primary'
                      : i === currentFrame - 1
                      ? 'bg-primary/50 animate-pulse'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Stage indicator */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={progress >= 0 ? 'text-primary font-medium' : ''}>
              Planning
            </span>
            <span className={progress >= 15 ? 'text-primary font-medium' : ''}>
              Generating
            </span>
            <span className={progress >= 85 ? 'text-primary font-medium' : ''}>
              Assembling
            </span>
            <span className={progress >= 95 ? 'text-primary font-medium' : ''}>
              Finishing
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}