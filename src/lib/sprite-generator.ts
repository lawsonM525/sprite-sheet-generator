interface GenerateOptions {
  concept: string
  style: string
  frameCount: number
  canvasSize: number
  background: 'transparent' | 'solid'
  referenceImage?: File
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

interface ProgressCallback {
  (progress: {
    type: 'status' | 'progress' | 'complete' | 'error'
    message?: string
    progress?: number
    currentFrame?: number
    totalFrames?: number
    data?: any
  }): void
}

interface SpriteConfig {
  concept: string
  style: string
  frameCount: number
  canvasSize: number
  background: 'transparent' | 'solid'
  referenceImage?: File
}

interface ProgressData {
  type: 'status' | 'progress' | 'complete' | 'error'
  message?: string
  progress?: number
  currentFrame?: number
  totalFrames?: number
  data?: any
}

export async function generateSpriteSheet(
  config: SpriteConfig,
  onProgress?: (progress: ProgressData) => void
): Promise<SpriteResult> {
  const { concept, style, frameCount, canvasSize, background, referenceImage } = config

  try {
    // Create FormData to handle both text and file data
    const formData = new FormData()
    formData.append('concept', concept)
    formData.append('style', style)
    formData.append('frameCount', frameCount.toString())
    formData.append('canvasSize', canvasSize.toString())
    formData.append('background', background)
    
    if (referenceImage) {
      formData.append('referenceImage', referenceImage)
    }

    // Call the streaming API route
    const response = await fetch('/api/generate-stream', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to generate sprite sheet')
    }

    return new Promise((resolve, reject) => {
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        reject(new Error('No response body'))
        return
      }

      let buffer = ''
      
      function readStream() {
        reader!.read().then(({ done, value }) => {
          if (done) {
            // Process any remaining buffer content before ending
            if (buffer.trim()) {
              processBuffer(buffer)
            }
            // Don't reject immediately - the complete message might have been processed
            setTimeout(() => {
              reject(new Error('Stream ended without completion message'))
            }, 100)
            return
          }

          // Accumulate the chunk data
          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk
          
          // Process complete lines
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep incomplete line in buffer
          
          for (const line of lines) {
            processLine(line)
          }

          readStream()
        }).catch(reject)
      }
      
      function processLine(line: string) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            
            if (data.type === 'complete') {
              console.log('Generation result:', {
                hasFrames: !!data.data.frames,
                framesLength: data.data.frames?.length,
                hasSpriteSheet: !!data.data.spriteSheet,
                spriteSheetStart: data.data.spriteSheet?.substring(0, 50)
              })
              
              // Update usage after successful generation
              fetch('/api/user/usage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
              }).catch(usageError => {
                console.error('Failed to update usage:', usageError)
                // Don't fail the generation if usage update fails
              })
              
              // Track goal with DataFast (client analytics)
              try {
                (window as any)?.datafast?.('sprite_generated', {
                  concept: concept?.toString().slice(0, 255),
                  style: style?.toString().slice(0, 255),
                  frame_count: frameCount.toString(),
                  canvas_size: canvasSize.toString(),
                  background: background?.toString().slice(0, 255),
                  reference_image: referenceImage ? 'true' : 'false',
                })
              } catch (_) {
                // ignore client analytics failures
              }
              
              resolve(data.data)
              return
            } else if (data.type === 'error') {
              reject(new Error(data.message))
              return
            } else if (onProgress) {
              onProgress(data)
            }
          } catch (e) {
            console.error('Error parsing progress data:', e, 'Line:', line)
          }
        }
      }
      
      function processBuffer(remainingBuffer: string) {
        const lines = remainingBuffer.split('\n')
        for (const line of lines) {
          processLine(line)
        }
      }
      
      readStream()
    })
  } catch (error) {
    console.error('Generation error:', error)
    throw error
  }
}
