import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json()

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      )
    }

    // Remove the data URI prefix if present
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
    
    // Process the image to remove background
    const processedImageData = await removeBackground(base64Data)

    return NextResponse.json({
      imageData: `data:image/png;base64,${processedImageData}`
    })

  } catch (error) {
    console.error('Background removal error:', error)
    return NextResponse.json(
      { error: 'Failed to remove background' },
      { status: 500 }
    )
  }
}

async function removeBackground(base64ImageData: string): Promise<string> {
  const sharp = require('sharp')
  
  try {
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64ImageData, 'base64')
    const image = sharp(imageBuffer)
    
    // Get image metadata
    const { width, height } = await image.metadata()
    
    if (!width || !height) {
      throw new Error('Unable to get image dimensions')
    }
    
    // Sample corner colors to determine background
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
    
    // Create a more sophisticated mask
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