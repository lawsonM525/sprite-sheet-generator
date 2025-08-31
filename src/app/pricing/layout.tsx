import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - Sprite Sheet Generator | AI-Powered Animation Creator',
  description: 'Choose the perfect plan for your sprite sheet needs. Free plan with 3 generations per week, Pro plan with 30 per month, or Premium with unlimited generations and custom grids.',
  keywords: 'sprite sheet pricing, animation pricing, AI art pricing, game development tools, sprite generator plans',
  openGraph: {
    title: 'Pricing - Sprite Sheet Generator',
    description: 'Simple, transparent pricing for AI-powered sprite sheet generation. Start free and upgrade as you grow.',
    type: 'website',
    url: 'https://sprite-sheet-generator.com/pricing',
    siteName: 'Sprite Sheet Generator',
    images: [
      {
        url: 'https://sprite-sheet-generator.com/og/pricing.png',
        width: 1200,
        height: 630,
        alt: 'Pricing preview image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing - Sprite Sheet Generator',
    description: 'Simple, transparent pricing for AI-powered sprite sheet generation. Start free and upgrade as you grow.',
    site: '@SpriteSheetGen',
    creator: '@SpriteSheetGen',
    images: ['https://sprite-sheet-generator.com/og/pricing.png'],
  },
  alternates: {
    canonical: 'https://sprite-sheet-generator.com/pricing',
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
