import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const imagePath = join(process.cwd(), 'public', 'open-graph-img.png')
    const imageBuffer = await readFile(imagePath)
    
    return new NextResponse(new Uint8Array(imageBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving open graph image:', error)
    return new NextResponse('Image not found', { status: 404 })
  }
}
