'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCw, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface SpritePreviewProps {
  spriteSheet: string
  frameCount: number
  frameSize: number
  atlas?: any
  frames?: string[]
}

export function SpritePreview({
  spriteSheet,
  frameCount,
  frameSize,
  atlas,
  frames,
}: SpritePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLooping, setIsLooping] = useState(true)
  const [fps, setFps] = useState(10)
  const [currentFrame, setCurrentFrame] = useState(0)
  const animationRef = useRef<number>()
  const lastFrameTime = useRef<number>(0)

  useEffect(() => {
    const getCols = (count: number) => {
      if (count === 4) return 4
      return Math.ceil(Math.sqrt(count))
    }

    const getRows = (count: number) => {
      const cols = getCols(count)
      return Math.ceil(count / cols)
    }
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = spriteSheet

    img.onload = () => {
      const cols = getCols(frameCount)
      const rows = getRows(frameCount)
      
      const animate = (timestamp: number) => {
        if (!lastFrameTime.current) lastFrameTime.current = timestamp
        
        const elapsed = timestamp - lastFrameTime.current
        const frameDuration = 1000 / fps
        
        if (elapsed > frameDuration) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          
          const frameX = (currentFrame % cols) * frameSize
          const frameY = Math.floor(currentFrame / cols) * frameSize
          
          ctx.drawImage(
            img,
            frameX,
            frameY,
            frameSize,
            frameSize,
            0,
            0,
            canvas.width,
            canvas.height
          )
          
          if (isPlaying) {
            setCurrentFrame((prev) => {
              const nextFrame = prev + 1
              if (nextFrame >= frameCount) {
                if (isLooping) {
                  return 0
                } else {
                  setIsPlaying(false)
                  return prev
                }
              }
              return nextFrame
            })
          }
          
          lastFrameTime.current = timestamp
        }
        
        animationRef.current = requestAnimationFrame(animate)
      }
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [spriteSheet, frameCount, frameSize, currentFrame, fps, isPlaying, isLooping])

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={256}
          height={256}
          className="border border-border rounded-lg shadow-inner bg-checkered"
          style={{
            imageRendering: 'pixelated',
            width: '256px',
            height: '256px',
          }}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLooping(!isLooping)}
              className={isLooping ? 'bg-primary text-primary-foreground' : ''}
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Loop
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentFrame(0)
                setIsPlaying(false)
              }}
            >
              <Square className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <span className="text-sm text-muted-foreground">
            Frame {currentFrame + 1} of {frameCount}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Animation Speed</span>
            <span>{fps} FPS</span>
          </div>
          <Slider
            value={[fps]}
            onValueChange={(value) => setFps(value[0])}
            min={1}
            max={30}
            step={1}
            className="w-full"
          />
        </div>

        {frames && frames.length > 0 && (
          <div className="mt-6 p-4 bg-muted/10 border border-border rounded-lg">
            <h4 className="font-semibold text-sm mb-4 text-primary">Individual Frames</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {frames.map((frame, index) => (
                <div
                  key={index}
                  className={`relative border rounded overflow-hidden bg-checkered cursor-pointer transition-all hover:scale-105 ${
                    index === currentFrame ? 'border-primary border-2 shadow-lg' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setCurrentFrame(index)
                    setIsPlaying(false)
                  }}
                >
                  <img
                    src={frame}
                    alt={`Frame ${index + 1}`}
                    className="w-full h-auto aspect-square object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-1 py-0.5 text-center">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {atlas && (
          <div className="mt-4 p-4 bg-muted/20 border border-border rounded-lg">
            <h4 className="font-semibold text-sm mb-2 text-primary">CSS Animation</h4>
            <pre className="text-xs overflow-x-auto text-muted-foreground font-mono">
              <code>{generateCSSAnimation(frameCount, frameSize, fps)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

function generateCSSAnimation(frameCount: number, frameSize: number, fps: number) {
  const cols = Math.ceil(Math.sqrt(frameCount))
  const totalWidth = cols * frameSize
  
  return `.sprite-animation {
  width: ${frameSize}px;
  height: ${frameSize}px;
  background-image: url('spritesheet.png');
  background-size: ${totalWidth}px auto;
  animation: sprite-frames ${frameCount / fps}s steps(${frameCount}) infinite;
}

@keyframes sprite-frames {
  to {
    background-position: -${totalWidth * frameCount}px 0;
  }
}`
}