'use client'

import { useEffect, useState } from 'react'

export interface SpriteAnimationProps {
  src: string
  alt?: string
  size?: number
  speed?: number
  gridSize?: number | { rows: number; cols: number }
  frameCount?: number
}

export function SpriteAnimation({ 
  src, 
  alt = 'Sprite animation', 
  size = 64, 
  speed = 150, 
  gridSize = 3,
  frameCount
}: SpriteAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  
  // Handle both number and object gridSize formats
  const gridRows = typeof gridSize === 'object' ? gridSize.rows : gridSize
  const gridCols = typeof gridSize === 'object' ? gridSize.cols : gridSize
  const totalFrames = frameCount || (gridRows * gridCols)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames)
    }, speed)

    return () => clearInterval(interval)
  }, [speed, totalFrames])

  const row = Math.floor(currentFrame / gridCols)
  const col = currentFrame % gridCols

  return (
    <div
      className="border border-rich-black-400 rounded"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${src})`,
        backgroundSize: `${size * gridCols}px ${size * gridRows}px`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `-${col * size}px -${row * size}px`,
        imageRendering: 'pixelated'
      }}
      title={alt}
    />
  )
}

export default SpriteAnimation
