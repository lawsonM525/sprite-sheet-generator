'use client'

import { useEffect, useState } from 'react'

export interface SpriteAnimationProps {
  src: string
  alt: string
  size?: number
  speed?: number
  gridSize?: number
}

export function SpriteAnimation({ src, alt, size = 64, speed = 150, gridSize = 3 }: SpriteAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const totalFrames = gridSize * gridSize

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames)
    }, speed)

    return () => clearInterval(interval)
  }, [speed, totalFrames])

  const row = Math.floor(currentFrame / gridSize)
  const col = currentFrame % gridSize

  return (
    <div
      className="border border-rich-black-400 rounded"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${src})`,
        backgroundSize: `${size * gridSize}px ${size * gridSize}px`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `-${col * size}px -${row * size}px`,
        imageRendering: 'pixelated'
      }}
      title={alt}
    />
  )
}

export default SpriteAnimation
