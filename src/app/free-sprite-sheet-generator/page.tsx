import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Free Sprite Sheet Generator – Create Sprite Sheets Online with No Watermark',
  description: 'Generate sprite sheets for games and animations free online. No watermark, no installs, completely free.',
  keywords: ['free sprite sheet generator', 'online sprite sheet maker', 'no watermark sprite sheets'],
  openGraph: {
    title: 'Free Sprite Sheet Generator – Online & No Watermark',
    description: 'Create sprite sheets online for free with zero watermarks. Ideal for game developers and animators.',
    type: 'website',
    images: [
      {
        url: '/sample-sprites/smiling-emoji.png',
        width: 120,
        height: 120,
        alt: 'Sample sprite sheet without watermark'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Sprite Sheet Generator – Online & No Watermark',
    description: 'Generate sprite sheets online for free with no watermark or downloads.',
    images: ['/sample-sprites/smiling-emoji.png']
  }
}

export default function FreeSpriteSheetGeneratorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Free Sprite Sheet Generator',
    description: 'Online sprite sheet maker. Create and download sprite sheets for free with no watermark.',
    image: 'https://sprite-sheet-generator.com/sample-sprites/smiling-emoji.png',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://sprite-sheet-generator.com/'
    }
  }

  return (
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-rich-black text-citron-600">
        <div className="text-center py-12 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-mimi-pink-500 mb-4">
            Free Sprite Sheet Generator
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto">
            Craft high-quality sprite sheets online—absolutely free and with no watermark. Perfect for games, web animations, and creative experiments.
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link href="/">Start Generating</Link>
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 space-y-16 pb-16">
          <section>
            <h2 className="text-2xl sm:text-3xl text-purple-pizzazz text-center mb-6">Product Overview</h2>
            <p className="max-w-3xl mx-auto leading-relaxed mb-4">
              Our free sprite sheet generator runs entirely in your browser, giving you instant results without any downloads or subscriptions. Customize frame counts, canvas sizes, and art styles, then export crisp PNG sprite sheets ready for your project.
            </p>
            <ul className="list-disc space-y-2 max-w-3xl mx-auto text-left pl-6">
              <li>Completely online—no software installation required</li>
              <li>Zero cost and no hidden watermarks</li>
              <li>Customizable templates and art styles</li>
              <li>Instant PNG exports for games and websites</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl text-purple-pizzazz text-center mb-6">How to Use</h2>
            <ol className="list-decimal space-y-2 max-w-3xl mx-auto text-left pl-6">
              <li>Describe your animation concept or upload a reference image.</li>
              <li>Select a style, frame count, and canvas size that fit your project.</li>
              <li>Click <span className="font-semibold">Generate</span> to create and download your sprite sheet instantly.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl text-purple-pizzazz text-center mb-6">Screenshots &amp; Demos</h2>
            <div className="grid sm:grid-cols-3 gap-6 justify-items-center">
              <Image
                src="/dancing-frog.gif"
                alt="Animated frog demo"
                width={160}
                height={160}
                className="border border-rich-black-400 rounded"
              />
              <Image
                src="/sample-sprites/happy-bird.png"
                alt="Happy bird sprite sheet example"
                width={160}
                height={160}
                className="border border-rich-black-400 rounded"
              />
              <Image
                src="/sample-sprites/neon-star.png"
                alt="Neon star sprite sheet example"
                width={160}
                height={160}
                className="border border-rich-black-400 rounded"
              />
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-2xl sm:text-3xl text-purple-pizzazz mb-4">Ready to Create?</h2>
            <p className="mb-6">
              Dive into the full-featured generator and build your own animations in seconds.
            </p>
            <Button asChild>
              <Link href="/">Generate Your Sprite Sheet</Link>
            </Button>
          </section>
        </div>
      </div>
    </>
  )
}

