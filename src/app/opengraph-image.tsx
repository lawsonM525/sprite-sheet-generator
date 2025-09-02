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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://sprite-sheet-generator.com/open-graph-img.png"
          width={1200}
          height={630}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          alt="Sprite Sheet Generator"
        />
      </div>
    ),
    size
  )
}
