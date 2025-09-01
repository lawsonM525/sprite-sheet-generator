import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSS Sprite Generator Tutorial & Tool',
  description:
    'Generate CSS classes for sprites to reduce HTTP requests and boost load performance. Includes links to the main generator and optimization guides.'
}

export default function CssSpriteGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
