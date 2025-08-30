import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: NextRequest) {
  try {
    const { concept, style, frameCount, canvasSize, background } = await request.json()

    // Use API keys from environment variables
    const openaiKey = process.env.OPENAI_API_KEY
    const geminiKey = process.env.GEMINI_API_KEY
    
    if (!openaiKey || !geminiKey) {
      return NextResponse.json(
        { error: 'API keys not configured (need both OPENAI_API_KEY and GEMINI_API_KEY)' },
        { status: 500 }
      )
    }

    // Initialize clients
    const openai = new OpenAI({ apiKey: openaiKey })
    const genai = new GoogleGenAI({ apiKey: geminiKey })

    // Generate frame plan
    const systemPrompt = `You are an animation planning engine. You maintain consistent style and do not change background or camera angle. Create a frame-by-frame plan for sprite sheet animations.`

    const userPrompt = `Create a ${frameCount}-frame animation plan for: "${concept}"
Style: ${style}
Output a JSON array with frame descriptions showing progression.
Keep the subject identity constant, background constant, and camera static.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    console.log('Raw LLM response:', completion.choices[0].message.content)
    
    let framePlan: any[] = []
    try {
      const response = JSON.parse(completion.choices[0].message.content || '{}')
      console.log('Parsed response:', response)
      framePlan = response.animation || response.frames || []
      console.log('Frame plan:', framePlan)
    } catch (error) {
      console.error('Error parsing JSON response:', error)
      console.log('Creating fallback frame plan')
      // Create fallback frame plan
      framePlan = Array.from({ length: frameCount }, (_, i) => ({
        index: i,
        description: `Frame ${i + 1} of ${concept} animation`
      }))
    }
    
    // Ensure we have the right number of frames
    if (framePlan.length === 0 || framePlan.length !== frameCount) {
      console.log(`Frame plan has ${framePlan.length} frames, but need ${frameCount}. Creating fallback.`)
      framePlan = Array.from({ length: frameCount }, (_, i) => ({
        index: i,
        description: `Frame ${i + 1} of ${concept} animation`
      }))
    }
    
    console.log('Final frame plan length:', framePlan.length)

    // Generate detailed image prompts for each frame
    const imagePrompts = await generateImagePrompts(openai, framePlan, style, background, canvasSize, concept)

    // Generate actual images using Gemini (sequential with consistency)
    console.log('Generating images for prompts:', imagePrompts.slice(0, 2))
    const frameImages = await generateFrameImagesWithGemini(genai, framePlan, style, background, concept)
    console.log('Generated frame images:', frameImages.length, 'frames')

    // Assemble sprite sheet
    console.log('Assembling sprite sheet...')
    const { spriteSheet, atlas } = await assembleSpriteSheetServer(frameImages, frameCount, canvasSize)
    console.log('Sprite sheet generated:', !!spriteSheet, spriteSheet?.substring(0, 50))

    const result = {
      framePlan,
      frames: frameImages,
      spriteSheet,
      atlas,
      css: generateCSS(frameCount, canvasSize),
      prompts: imagePrompts,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate sprite sheet' },
      { status: 500 }
    )
  }
}

async function generateImagePrompts(
  openai: OpenAI,
  framePlan: any[],
  style: string,
  background: string,
  size: number,
  concept: string
): Promise<string[]> {
  const styleDescriptor = getStyleDescriptor(style)
  // Always generate with solid background - we'll remove it later if needed
  const bgDescriptor = 'solid white background for easy processing'
  
  return framePlan.map((frame: any, index: number) => {
    const basePrompt = frame.description || frame.textual_change || `Frame ${index + 1} of ${concept}`
    const consistencyPrompt = 'same art style, same color palette, same lighting, centered subject, clean composition'
    
    return `${basePrompt}, ${styleDescriptor}, ${bgDescriptor}, ${consistencyPrompt}, high quality digital art`
  })
}

async function generateFrameImages(
  openai: OpenAI,
  prompts: string[],
  size: number
): Promise<string[]> {
  const images: string[] = []
  
  for (const prompt of prompts) {
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      })
      
      const imageUrl = response.data?.[0]?.url
      if (imageUrl) {
        // Convert to base64 data URL for client
        const imageResponse = await fetch(imageUrl)
        const imageBuffer = await imageResponse.arrayBuffer()
        const base64 = Buffer.from(imageBuffer).toString('base64')
        images.push(`data:image/png;base64,${base64}`)
      }
    } catch (error) {
      console.error('Error generating image:', error)
      // Add placeholder if generation fails
      images.push('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
    }
  }
  
  return images
}

async function generateFrameImagesWithGemini(
  genai: GoogleGenAI,
  framePlan: any[],
  style: string,
  background: string,
  concept: string
): Promise<string[]> {
  const images: string[] = []
  let previousImageData: string | null = null
  
  const styleDescriptor = getStyleDescriptor(style)
  // Always generate with solid background - we'll remove it later if needed
  const bgDescriptor = 'solid white background for easy processing'
  
  for (let i = 0; i < framePlan.length; i++) {
    const frame = framePlan[i]
    const frameDescription = frame.description || `Frame ${i + 1} of ${concept} animation`
    
    try {
      let prompt: any[]
      
      if (i === 0) {
        // First frame - text-to-image
        prompt = [
          {
            text: `Create the first frame of a ${concept} animation sequence. ${frameDescription}. Style: ${styleDescriptor}, ${bgDescriptor}. Make sure this is a high-quality, detailed image that will serve as the foundation for subsequent animation frames. Keep the subject centered and ensure consistency for animation purposes.`
          }
        ]
      } else {
        // Subsequent frames - use previous image as reference
        prompt = [
          {
            text: `This is frame ${i + 1} of a ${framePlan.length}-frame ${concept} animation sequence. Based on the previous frame provided, create the next frame showing: ${frameDescription}. 
            
            IMPORTANT: Maintain the exact same art style, lighting, background, and camera angle as the previous frame. Only change what's described for this specific frame. Keep all other elements (background, colors, composition) exactly the same as the reference image. Style: ${styleDescriptor}, ${bgDescriptor}.`
          },
          {
            inlineData: {
              mimeType: "image/png",
              data: previousImageData,
            },
          }
        ]
      }

      const response = await genai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: prompt,
      })

      // Extract image data from response
      let imageData: string | null = null
      if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            imageData = part.inlineData.data
            break
          }
        }
      }

      if (imageData) {
        let processedImageData = imageData
        
        // Remove background if transparent background is requested
        if (background === 'transparent') {
          try {
            processedImageData = await removeBackground(imageData)
            console.log(`✓ Removed background for frame ${i + 1}`)
          } catch (error) {
            console.error(`Failed to remove background for frame ${i + 1}:`, error)
            // Fall back to original image if background removal fails
          }
        }
        
        const base64Image = `data:image/png;base64,${processedImageData}`
        images.push(base64Image)
        // Store the processed image data (with transparent background) for next frame
        previousImageData = processedImageData
        console.log(`✓ Generated frame ${i + 1}/${framePlan.length}`)
      } else {
        console.error(`Failed to generate frame ${i + 1} - no image data in response`)
        // Add placeholder if generation fails
        images.push('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
      }
      
      // Add a small delay between requests to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.error(`Error generating frame ${i + 1}:`, error)
      // Add placeholder if generation fails
      images.push('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
    }
  }
  
  return images
}

async function removeBackground(base64ImageData: string): Promise<string> {
  const sharp = require('sharp')
  
  try {
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64ImageData, 'base64')
    const image = sharp(imageBuffer)
    
    // Get image metadata
    const { width, height, channels } = await image.metadata()
    
    if (!width || !height) {
      throw new Error('Unable to get image dimensions')
    }
    
    // Advanced background removal approach:
    // 1. Detect edges to identify the main subject
    // 2. Create a mask based on edge detection and color similarity
    // 3. Apply the mask to create transparency
    
    // Step 1: Create an edge-detected version to identify the subject
    const edges = await sharp(imageBuffer)
      .greyscale()
      .convolve({
        width: 3,
        height: 3,
        kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] // Edge detection kernel
      })
      .threshold(30) // Adjust threshold for edge sensitivity
      .png()
      .toBuffer()
    
    // Step 2: Create a mask by combining edge detection with color analysis
    // Assume corners are background and find similar colors
    const cornerSize = Math.min(20, Math.floor(width * 0.1), Math.floor(height * 0.1))
    
    // Sample corner colors to determine background
    const topLeft = await sharp(imageBuffer)
      .extract({ left: 0, top: 0, width: cornerSize, height: cornerSize })
      .stats()
    
    const topRight = await sharp(imageBuffer)
      .extract({ left: width - cornerSize, top: 0, width: cornerSize, height: cornerSize })
      .stats()
    
    const bottomLeft = await sharp(imageBuffer)
      .extract({ left: 0, top: height - cornerSize, width: cornerSize, height: cornerSize })
      .stats()
    
    const bottomRight = await sharp(imageBuffer)
      .extract({ left: width - cornerSize, top: height - cornerSize, width: cornerSize, height: cornerSize })
      .stats()
    
    // Get average background color from corners
    const avgBgColor = {
      r: Math.round((topLeft.channels[0].mean + topRight.channels[0].mean + bottomLeft.channels[0].mean + bottomRight.channels[0].mean) / 4),
      g: Math.round((topLeft.channels[1].mean + topRight.channels[1].mean + bottomLeft.channels[1].mean + bottomRight.channels[1].mean) / 4),
      b: Math.round((topLeft.channels[2].mean + topRight.channels[2].mean + bottomLeft.channels[2].mean + bottomRight.channels[2].mean) / 4)
    }
    
    // Step 3: Create a more sophisticated mask
    // Remove background colors within tolerance while preserving subject
    const tolerance = 40 // Color tolerance for background removal
    
    const finalImage = await sharp(imageBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }: { data: Buffer, info: any }) => {
        const newData = Buffer.alloc(info.width * info.height * 4) // RGBA
        
        for (let i = 0; i < data.length; i += info.channels) {
          const r = data[i]
          const g = data[i + 1] 
          const b = data[i + 2]
          const alpha = info.channels === 4 ? data[i + 3] : 255
          
          // Calculate color distance from background
          const colorDistance = Math.sqrt(
            Math.pow(r - avgBgColor.r, 2) +
            Math.pow(g - avgBgColor.g, 2) +
            Math.pow(b - avgBgColor.b, 2)
          )
          
          const outputIndex = (i / info.channels) * 4
          newData[outputIndex] = r
          newData[outputIndex + 1] = g
          newData[outputIndex + 2] = b
          
          // Make transparent if color is close to background
          if (colorDistance < tolerance) {
            newData[outputIndex + 3] = 0 // Fully transparent
          } else {
            // Gradual transparency based on distance
            const alphaMultiplier = Math.min(1, colorDistance / tolerance)
            newData[outputIndex + 3] = Math.round(alpha * alphaMultiplier)
          }
        }
        
        return sharp(newData, {
          raw: {
            width: info.width,
            height: info.height,
            channels: 4
          }
        }).png().toBuffer()
      })
    
    return (await finalImage).toString('base64')
    
  } catch (error) {
    console.error('Background removal failed:', error)
    // Return original image if processing fails
    return base64ImageData
  }
}

async function assembleSpriteSheetServer(
  frames: string[],
  frameCount: number,
  frameSize: number
): Promise<{ spriteSheet: string; atlas: any }> {
  const sharp = require('sharp')
  
  const cols = Math.ceil(Math.sqrt(frameCount))
  const rows = Math.ceil(frameCount / cols)
  
  const atlas: any = {
    frames: {},
    meta: {
      size: { w: cols * frameSize, h: rows * frameSize },
      format: 'grid',
      fps: 10,
    },
  }
  
  // Convert base64 frames to buffers and create composite array
  const compositeImages: any[] = []
  
  for (let i = 0; i < frames.length; i++) {
    try {
      // Extract base64 data
      const base64Data = frames[i].replace(/^data:image\/\w+;base64,/, '')
      const imageBuffer = Buffer.from(base64Data, 'base64')
      
      const x = (i % cols) * frameSize
      const y = Math.floor(i / cols) * frameSize
      
      // Resize image to exact frame size
      const resizedBuffer = await sharp(imageBuffer)
        .resize(frameSize, frameSize, { 
          fit: 'cover',
          position: 'center' 
        })
        .png()
        .toBuffer()
      
      compositeImages.push({
        input: resizedBuffer,
        left: x,
        top: y,
      })
      
      atlas.frames[`frame_${i}`] = {
        x,
        y,
        w: frameSize,
        h: frameSize,
      }
    } catch (error) {
      console.error('Error processing frame image:', error)
    }
  }
  
  // Create blank canvas and composite all frames
  const spriteSheetBuffer = await sharp({
    create: {
      width: cols * frameSize,
      height: rows * frameSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite(compositeImages)
    .png()
    .toBuffer()
  
  // Convert to base64 data URL
  const base64SpriteSheet = spriteSheetBuffer.toString('base64')
  
  return {
    spriteSheet: `data:image/png;base64,${base64SpriteSheet}`,
    atlas,
  }
}

function getStyleDescriptor(style: string): string {
  const styleMap: Record<string, string> = {
    'pixel-art': 'pixel art style, 8-bit graphics, limited color palette, sharp edges, retro gaming aesthetic',
    'neon-outline': 'neon outline style, glowing edges, vibrant neon colors, dark background, cyberpunk aesthetic',
    'cel-shaded': 'cel shaded style, flat colors, bold black outlines, anime/cartoon aesthetic, clean shading',
    'vaporwave': 'vaporwave aesthetic, pastel pink and blue colors, retro 80s style, gradient effects, synthwave',
    'sketchy-doodle': 'sketchy doodle art style, hand-drawn line art, loose sketchy lines, doodling aesthetic, rough pencil or pen strokes, casual artistic style',
  }
  
  return styleMap[style] || 'digital art style'
}

function generateCSS(frameCount: number, frameSize: number): string {
  const cols = Math.ceil(Math.sqrt(frameCount))
  const totalWidth = cols * frameSize
  
  return `.sprite-animation {
  width: ${frameSize}px;
  height: ${frameSize}px;
  background-image: url('spritesheet.png');
  background-size: ${totalWidth}px auto;
  animation: sprite-frames 1s steps(${frameCount}) infinite;
}

@keyframes sprite-frames {
  to {
    background-position: -${totalWidth}px 0;
  }
}`
}