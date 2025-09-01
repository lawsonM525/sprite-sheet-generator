'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SpriteAnimation from '@/components/SpriteAnimation'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI Sprite Generator',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  description:
    'Web app that turns text prompts into sprite sheets using the Nano Banana model. Support for additional models is coming soon.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  url: 'https://sprite-sheet-generator.com/ai-sprite-generator'
}

export default function AISpriteGeneratorPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-rich-black">
        {/* Navigation */}
        <nav className="relative flex justify-between items-center px-4 sm:px-6 py-4 border-b border-rich-black-300">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/pink-sprinkles.gif" 
              alt="Pink sprinkles" 
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
              unoptimized
            />
            <span className="text-lg sm:text-xl font-bold text-mimi-pink-500">Sprite Sheet Generator</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/" className="text-purple-pizzazz hover:text-citron-500 transition-colors">
              Home
            </Link>
            <Link href="/how-to-use-sprite-sheets" className="text-purple-pizzazz hover:text-citron-500 transition-colors">
              How to Use
            </Link>
            <Link href="/free-sprite-sheet-generator" className="text-purple-pizzazz hover:text-citron-500 transition-colors">
              Free Generator
            </Link>
            <Link href="/game-engine-sprite-sheets" className="text-purple-pizzazz hover:text-citron-500 transition-colors">
              Game Engines
            </Link>
            <a href="/pricing" className="text-purple-pizzazz hover:text-citron-500 transition-colors">
              Pricing
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden flex flex-col gap-1 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`w-5 h-0.5 bg-purple-pizzazz transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-purple-pizzazz transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-purple-pizzazz transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-rich-black-200 border-b border-rich-black-300 sm:hidden z-50">
              <div className="flex flex-col px-4 py-4 space-y-4">
                <Link
                  href="/"
                  className="text-purple-pizzazz hover:text-citron-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/how-to-use-sprite-sheets"
                  className="text-purple-pizzazz hover:text-citron-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How to Use
                </Link>
                <Link
                  href="/free-sprite-sheet-generator"
                  className="text-purple-pizzazz hover:text-citron-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Free Generator
                </Link>
                <Link
                  href="/game-engine-sprite-sheets"
                  className="text-purple-pizzazz hover:text-citron-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Game Engines
                </Link>
                <a
                  href="/pricing"
                  className="text-purple-pizzazz hover:text-citron-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <div className="text-center py-12 sm:py-16 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-mimi-pink-500 mb-6">
            AI Sprite Generator
          </h1>
          <p className="text-lg sm:text-xl text-citron-600 max-w-3xl mx-auto leading-relaxed px-4 mb-8">
            Transform text prompts into animated sprite sheets using advanced AI models. Create consistent characters and animations for games and web projects.
          </p>
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-purple-pizzazz-500 to-mimi-pink-400 hover:from-purple-pizzazz-600 hover:to-mimi-pink-500 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200">
              🎨 Generate AI Sprite Sheets
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="space-y-8 sm:space-y-12">
            
            {/* AI Models Section */}
            <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-mimi-pink-500">Supported AI Models</CardTitle>
              </CardHeader>
              <CardContent className="text-citron-600 space-y-4">
                <div className="bg-rich-black-300 p-6 rounded-lg">
                  <h3 className="text-lg text-purple-pizzazz mb-3">Nano Banana (Current Model)</h3>
                  <p className="text-citron-600 text-base sm:text-lg leading-relaxed mb-4">
                    Our flagship AI model specializes in creating consistent sprite animations. Trained specifically 
                    for game assets and character animations with excellent frame-to-frame coherence.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-citron-400 mt-1">✓</span>
                      <span>Excellent character consistency across frames</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-citron-400 mt-1">✓</span>
                      <span>Supports 2x2, 3x3, and 4x4 grid layouts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-citron-400 mt-1">✓</span>
                      <span>Optimized for pixel art and cartoon styles</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-rich-black-300 p-6 rounded-lg">
                  <h3 className="text-lg text-purple-pizzazz mb-3">Coming Soon</h3>
                  <p className="text-citron-600 leading-relaxed">
                    We&apos;re working on integrating additional models including DALL·E and Stable Diffusion 
                    to give you more style options and capabilities.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Demo Examples */}
            <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-mimi-pink-500">AI-Generated Examples</CardTitle>
              </CardHeader>
              <CardContent className="text-citron-600 space-y-8">
                <p className="text-lg leading-relaxed">
                  See what our AI can create! These sprite sheets were generated from simple text prompts and show the quality and consistency you can expect.
                </p>
                
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Blue Blinking Eye Example */}
                  <div className="bg-rich-black-300 p-6 rounded-lg">
                    <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Blinking Blue Eye</h4>
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <Image 
                          src="/sample-sprites/blinking-blue-eye-2x2.png" 
                          alt="Blinking blue eye sprite sheet - AI generated"
                          width={150}
                          height={150}
                          className="border border-rich-black-400 rounded mb-2"
                        />
                        <p className="text-citron-500 text-xs">Sprite Sheet (2x2)</p>
                      </div>
                      <div className="text-center">
                        <SpriteAnimation 
                          src="/sample-sprites/blinking-blue-eye-2x2.png"
                          alt="Blinking blue eye animation"
                          size={150}
                          speed={200}
                          gridSize={2}
                        />
                        <p className="text-citron-500 text-xs mt-2">Animated Result</p>
                      </div>
                    </div>
                    <div className="bg-rich-black text-citron-400 p-2 rounded text-xs text-center mt-3">
                      <code>Prompt: &quot;blue eye blinking animation, realistic style, 2x2 grid&quot;</code>
                    </div>
                  </div>

                  {/* Bouncing Ball Example */}
                  <div className="bg-rich-black-300 p-6 rounded-lg">
                    <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Bouncing Ball</h4>
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <Image 
                          src="/sample-sprites/bouncing-ball.png" 
                          alt="Bouncing ball sprite sheet - AI generated"
                          width={150}
                          height={150}
                          className="border border-rich-black-400 rounded mb-2"
                        />
                        <p className="text-citron-500 text-xs">Sprite Sheet</p>
                      </div>
                      <div className="text-center">
                        <SpriteAnimation 
                          src="/sample-sprites/bouncing-ball.png"
                          alt="Bouncing ball animation"
                          size={150}
                          speed={130}
                        />
                        <p className="text-citron-500 text-xs mt-2">Animated Result</p>
                      </div>
                    </div>
                    <div className="bg-rich-black text-citron-400 p-2 rounded text-xs text-center mt-3">
                      <code>Prompt: &quot;bouncing ball physics animation, 3x3 grid&quot;</code>
                    </div>
                  </div>

                  {/* Happy Bird Example */}
                  <div className="bg-rich-black-300 p-6 rounded-lg">
                    <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Happy Bird</h4>
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <Image 
                          src="/sample-sprites/happy-bird.png" 
                          alt="Happy bird sprite sheet - AI generated"
                          width={150}
                          height={150}
                          className="border border-rich-black-400 rounded mb-2"
                        />
                        <p className="text-citron-500 text-xs">Sprite Sheet</p>
                      </div>
                      <div className="text-center">
                        <SpriteAnimation 
                          src="/sample-sprites/happy-bird.png"
                          alt="Happy bird animation"
                          size={150}
                          speed={110}
                        />
                        <p className="text-citron-500 text-xs mt-2">Animated Result</p>
                      </div>
                    </div>
                    <div className="bg-rich-black text-citron-400 p-2 rounded text-xs text-center mt-3">
                      <code>Prompt: &quot;happy bird flapping wings, colorful, 3x3 animation cycle&quot;</code>
                    </div>
                  </div>

                  {/* Neon Star Example */}
                  <div className="bg-rich-black-300 p-6 rounded-lg">
                    <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Neon Star</h4>
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <Image 
                          src="/sample-sprites/neon-star.png" 
                          alt="Neon star sprite sheet - AI generated"
                          width={150}
                          height={150}
                          className="border border-rich-black-400 rounded mb-2"
                        />
                        <p className="text-citron-500 text-xs">Sprite Sheet</p>
                      </div>
                      <div className="text-center">
                        <SpriteAnimation 
                          src="/sample-sprites/neon-star.png"
                          alt="Neon star animation"
                          size={150}
                          speed={160}
                        />
                        <p className="text-citron-500 text-xs mt-2">Animated Result</p>
                      </div>
                    </div>
                    <div className="bg-rich-black text-citron-400 p-2 rounded text-xs text-center mt-3">
                      <code>Prompt: &quot;neon star spinning with glow effect, 3x3 grid&quot;</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Consistency Technology */}
            <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-mimi-pink-500">How AI Creates Consistent Sprite Animations</CardTitle>
              </CardHeader>
              <CardContent className="text-citron-600 space-y-6">
                <p className="text-lg leading-relaxed">
                  Our AI technology uses advanced techniques to ensure frame-to-frame consistency, 
                  creating smooth animations that maintain character integrity throughout the sequence.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-rich-black-300 p-6 rounded-lg">
                    <h4 className="text-lg text-purple-pizzazz mb-3">🎯 Temporal Coherence</h4>
                    <p className="text-citron-600 leading-relaxed mb-3">
                      Our AI maintains consistent character features, colors, and proportions across all frames, 
                      preventing the &quot;flickering&quot; effect common in traditional AI-generated sequences.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-0.5">•</span>
                        <span>Character identity preservation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-0.5">•</span>
                        <span>Color palette consistency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-0.5">•</span>
                        <span>Smooth motion transitions</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-rich-black-300 p-6 rounded-lg">
                    <h4 className="text-lg text-purple-pizzazz mb-3">⚡ Motion Intelligence</h4>
                    <p className="text-citron-600 leading-relaxed mb-3">
                      Advanced motion understanding ensures natural movement patterns that follow 
                      real-world physics and animation principles.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-0.5">•</span>
                        <span>Physics-aware animations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-0.5">•</span>
                        <span>Natural easing curves</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-0.5">•</span>
                        <span>Contextual motion patterns</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-rich-black-300 p-6 rounded-lg">
                    <h4 className="text-lg text-purple-pizzazz mb-3">🎨 Style Consistency</h4>
                    <p className="text-citron-600 leading-relaxed mb-3">
                      Maintains artistic style and visual coherence throughout the entire animation sequence, 
                      ensuring professional-quality results.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-0.5">•</span>
                        <span>Unified art style</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-0.5">•</span>
                        <span>Consistent lighting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-0.5">•</span>
                        <span>Texture preservation</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-rich-black-300 p-6 rounded-lg">
                    <h4 className="text-lg text-purple-pizzazz mb-3">🔧 Optimization Features</h4>
                    <p className="text-citron-600 leading-relaxed mb-3">
                      Built-in optimization ensures sprites are game-ready with proper sizing, 
                      compression, and format compatibility.
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-0.5">•</span>
                        <span>Automatic frame sizing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-0.5">•</span>
                        <span>Transparent backgrounds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-0.5">•</span>
                        <span>Multiple export formats</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-pizzazz-600 to-mimi-pink-500 p-6 rounded-lg">
                  <h4 className="text-lg text-white mb-3">💡 Pro Tip: Writing Better Prompts</h4>
                  <p className="text-white/90 leading-relaxed mb-4">
                    Get the best results by being specific about animation type, style, and grid size. 
                    Our AI responds well to detailed descriptions that include movement patterns and visual style preferences.
                  </p>
                  <div className="bg-black/20 p-4 rounded text-white/80 text-sm">
                    <p className="mb-2"><strong>Good prompt:</strong> &quot;Medieval knight walking cycle, pixel art style, 4x4 grid, side view&quot;</p>
                    <p><strong>Better prompt:</strong> &quot;Medieval knight in full armor walking cycle, 16-bit pixel art style, 4x4 animation grid, side profile view, smooth walking motion&quot;</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-purple-pizzazz-500 to-mimi-pink-400 border-0 shadow-2xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-3xl font-bold text-white mb-4">Ready to Generate AI Sprites?</h3>
                <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                  Transform your ideas into animated sprite sheets with our AI-powered generator. 
                  Perfect for rapid prototyping and creative experimentation.
                </p>
                <Link href="/">
                  <Button size="lg" className="bg-white text-purple-pizzazz hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
                    Start Generating Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
