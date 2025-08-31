import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 60 * 60 * 24 // cache for one day

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#08070B',
          color: '#FF77E0',
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        Sprite Sheet Generator
      </div>
    ),
    size
  )
}
