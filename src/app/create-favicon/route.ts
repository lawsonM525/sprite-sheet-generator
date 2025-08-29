import { NextResponse } from 'next/server'

export async function GET() {
  // Create a star favicon as SVG
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#050505"/>
  <path d="M16 2 L20 12 L30 12 L22 18 L25 28 L16 22 L7 28 L10 18 L2 12 L12 12 Z" fill="#ff3366"/>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}