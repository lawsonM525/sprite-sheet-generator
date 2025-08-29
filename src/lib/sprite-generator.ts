interface GenerateOptions {
  concept: string
  style: string
  frameCount: number
  canvasSize: number
  background: 'transparent' | 'solid'
}

interface FramePlan {
  index: number
  description: string
  parameters: {
    scale?: string
    rotation?: string
    opacity?: string
  }
}

interface SpriteResult {
  spriteSheet: string
  frames: string[]
  atlas: any
  css: string
  prompts: string[]
}

export async function generateSpriteSheet(options: GenerateOptions): Promise<SpriteResult> {
  const { concept, style, frameCount, canvasSize, background } = options

  try {
    // Call the API route
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        concept,
        style,
        frameCount,
        canvasSize,
        background,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate sprite sheet')
    }

    const result = await response.json()
    console.log('Generation result:', {
      hasFrames: !!result.frames,
      framesLength: result.frames?.length,
      hasSpriteSheet: !!result.spriteSheet,
      spriteSheetStart: result.spriteSheet?.substring(0, 50)
    })

    return result
  } catch (error) {
    console.error('Generation error:', error)
    throw new Error('Failed to generate sprite sheet. Please check your concept and try again.')
  }
}

