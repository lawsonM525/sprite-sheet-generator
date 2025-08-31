import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Use Sprite Sheets for Web Animation | Complete Guide',
  description: 'Learn how to create smooth web animations using sprite sheets. Better than GIFs - faster loading, smaller files, and full CSS control. Step-by-step tutorial with examples.',
  keywords: 'sprite sheets, web animation, CSS animation, sprite sheet tutorial, web development, animation guide, GIF alternative',
  openGraph: {
    title: 'How to Use Sprite Sheets for Web Animation | Complete Guide',
    description: 'Learn how to create smooth web animations using sprite sheets. Better than GIFs - faster loading, smaller files, and full CSS control.',
    type: 'article',
    url: 'https://sprite-sheet-generator.com/how-to-use-sprite-sheets',
    siteName: 'Sprite Sheet Generator',
    images: [
      {
        url: 'https://sprite-sheet-generator.com/og/how-to.png',
        width: 1200,
        height: 630,
        alt: 'How to use sprite sheets preview image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Use Sprite Sheets for Web Animation | Complete Guide',
    description: 'Learn how to create smooth web animations using sprite sheets. Better than GIFs - faster loading, smaller files, and full CSS control.',
    site: '@SpriteSheetGen',
    creator: '@SpriteSheetGen',
    images: ['https://sprite-sheet-generator.com/og/how-to.png'],
  },
  alternates: {
    canonical: 'https://sprite-sheet-generator.com/how-to-use-sprite-sheets',
  },
}

export default function HowToUseSpriteSheetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
