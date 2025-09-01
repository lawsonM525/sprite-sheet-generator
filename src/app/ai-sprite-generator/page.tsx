import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'AI Sprite Generator - Models & Examples | Sprite Sheet Generator',
 
  description:
    'Explore AI-powered sprite sheet generation with the Nano Banana model, prompt examples, and API access. More models coming soon.',
 main
  keywords: [
    'AI sprite generator',
    'sprite sheet AI',
    'prompt examples',
    'API access',
    'AI models for sprites',
    'sprite licensing',
    'generation limits',
    'Nano Banana AI'
main
  ],
  openGraph: {
    title: 'AI Sprite Generator',
    description:

      'Capabilities, Nano Banana model details, examples and API usage for AI-generated sprite sheets. More models coming soon.',
main
    images: [
      {
        url: '/ai-sprite-generator/opengraph-image?sprite=/dancing-frog.gif',
        width: 1200,
        height: 630,
        alt: 'Generated sprite sheet preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Sprite Generator',
    description:

      'Capabilities, Nano Banana model details, examples and API usage for AI-generated sprite sheets. More models coming soon.',
 main
    images: ['/ai-sprite-generator/opengraph-image?sprite=/dancing-frog.gif']
  },
  alternates: {
    canonical: 'https://sprite-sheet-generator.com/ai-sprite-generator'
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI Sprite Generator',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  description:

    'Web app that turns text prompts into sprite sheets using the Nano Banana model. Support for additional models is coming soon.',
main
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  url: 'https://sprite-sheet-generator.com/ai-sprite-generator'
}

export default function AISpriteGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-8 text-citron-600">
        <h1 className="text-3xl font-bold text-mimi-pink-500">AI Sprite Generator</h1>
        <p>
          Our generator turns text prompts into animated sprite sheets. Use it to prototype
          characters, game assets, and more.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-mimi-pink-500 mb-2">Supported Models</h2>
          <ul className="list-disc pl-6 space-y-1">

            <li>Nano Banana (current model)</li>
            <li>Additional models like DALL·E and Stable Diffusion coming soon</li>
main
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-mimi-pink-500 mb-2">Prompt Examples</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <code>pixel knight walking cycle, 3x3 grid</code>
            </li>
            <li>
              <code>neon blue star spinning, 4 frames</code>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-mimi-pink-500 mb-2">API Access</h2>
          <p className="mb-2">Generate sprites programmatically:</p>
          <pre className="bg-rich-black text-citron-400 p-4 rounded text-sm overflow-x-auto">{`fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'pixel knight walking',

    model: 'nano-banana',
 main
  }),
})`}</pre>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-mimi-pink-500 mb-2">FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-citron-500">How accurate are the sprites?</h3>
              <p>
                Models strive for consistency but complex motions may require prompt iteration.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-citron-500">Can I use the sprites commercially?</h3>
              <p>
                Yes, generated sprites are yours to use, subject to each model&apos;s licensing terms.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-citron-500">Are there generation limits?</h3>
              <p>Free accounts can create 3 sprites per week; paid plans raise this limit.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-mimi-pink-500 mb-2">Example Output</h2>
          <Image
            src="/dancing-frog.gif"
            alt="Dancing frog sprite example"
            width={200}
            height={200}
            unoptimized
          />
        </section>
      </div>
    </>
  )
}
