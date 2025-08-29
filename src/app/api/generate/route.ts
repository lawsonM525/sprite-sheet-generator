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
  const bgDescriptor = background === 'transparent' ? 'transparent background' : 'solid color background'
  
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
  const bgDescriptor = background === 'transparent' ? 'transparent background' : 'solid color background'
  
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
        const base64Image = `data:image/png;base64,${imageData}`
        images.push(base64Image)
        // Store the raw base64 data (without data URI prefix) for next frame
        previousImageData = imageData
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