'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SpriteAnimation } from '@/components/SpriteAnimation'
import { Footer } from '@/components/Footer'

export default function FreeSpriteSheetGeneratorPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
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
            <Link href="/ai-sprite-generator" className="text-purple-pizzazz hover:text-citron-500 transition-colors">
              AI Generator
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
                  href="/ai-sprite-generator"
                  className="text-purple-pizzazz hover:text-citron-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Generator
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
            Free Sprite Sheet Generator
          </h1>
          <p className="text-lg sm:text-xl text-citron-600 max-w-3xl mx-auto leading-relaxed px-4 mb-8">
            Craft high-quality sprite sheets online—absolutely free and with no watermark. Perfect for games, web animations, and creative experiments.
          </p>
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-purple-pizzazz-500 to-mimi-pink-400 hover:from-purple-pizzazz-600 hover:to-mimi-pink-500 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200">
              🆓 Generate Free Sprite Sheets
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="space-y-8 sm:space-y-12">

            {/* Features Overview */}
            <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-mimi-pink-500">Why Choose Our Free Generator?</CardTitle>
              </CardHeader>
              <CardContent className="text-citron-600 space-y-6">
                <p className="text-lg leading-relaxed">
                  Our free sprite sheet generator runs entirely in your browser, giving you instant results without any downloads or subscriptions. Create professional animations with zero cost and zero watermarks.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg text-purple-pizzazz mb-3">Free Features</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-1">✓</span>
                        <span>Completely online—no software installation required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-1">✓</span>
                        <span>Zero cost and no hidden watermarks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-1">✓</span>
                        <span>Customizable templates and art styles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-1">✓</span>
                        <span>Instant PNG exports for games and websites</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg text-purple-pizzazz mb-3">Perfect For</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-1">🎮</span>
                        <span>Indie game developers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-1">🎨</span>
                        <span>Web designers and animators</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-1">📚</span>
                        <span>Students and educators</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-citron-400 mt-1">⚡</span>
                        <span>Rapid prototyping</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Examples */}
            <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-mimi-pink-500">Live Examples & Demos</CardTitle>
              </CardHeader>
              <CardContent className="text-citron-600 space-y-8">
                <p className="text-lg leading-relaxed">
                  See the quality of sprite sheets you can create for free! These examples show both the static sprite sheets and their animated results.
                </p>
                
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Blue Blinking Eye Example */}
                  <div className="bg-rich-black-300 p-6 rounded-lg">
                    <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Blinking Blue Eye</h4>
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <Image 
                          src="/sample-sprites/blinking-blue-eye-2x2.png" 
                          alt="Blinking blue eye sprite sheet - free example"
                          width={120}
                          height={120}
                          className="border border-rich-black-400 rounded mb-2"
                        />
                        <p className="text-citron-500 text-xs">Sprite Sheet (2x2)</p>
                      </div>
                      <div className="text-center">
                        <SpriteAnimation 
                          src="/sample-sprites/blinking-blue-eye-2x2.png"
                          alt="Blinking blue eye animation"
                          size={120}
                          speed={200}
                          gridSize={2}
                        />
                        <p className="text-citron-500 text-xs mt-2">Animated</p>
                      </div>
                    </div>
                    <div className="bg-rich-black text-citron-400 p-2 rounded text-xs text-center mt-3">
                      <code>No watermark • Free download</code>
                    </div>
                  </div>

                  {/* Happy Bird Example */}
                  <div className="bg-rich-black-300 p-6 rounded-lg">
                    <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Happy Bird</h4>
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <Image 
                          src="/sample-sprites/happy-bird.png" 
                          alt="Happy bird sprite sheet - free example"
                          width={120}
                          height={120}
                          className="border border-rich-black-400 rounded mb-2"
                        />
                        <p className="text-citron-500 text-xs">Sprite Sheet</p>
                      </div>
                      <div className="text-center">
                        <SpriteAnimation 
                          src="/sample-sprites/happy-bird.png"
                          alt="Happy bird animation"
                          size={120}
                          speed={110}
                        />
                        <p className="text-citron-500 text-xs mt-2">Animated</p>
                      </div>
                    </div>
                    <div className="bg-rich-black text-citron-400 p-2 rounded text-xs text-center mt-3">
                      <code>3x3 grid • 9 frames</code>
                    </div>
                  </div>

                  {/* Neon Star Example */}
                  <div className="bg-rich-black-300 p-6 rounded-lg">
                    <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Neon Star</h4>
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <Image 
                          src="/sample-sprites/neon-star.png" 
                          alt="Neon star sprite sheet - free example"
                          width={120}
                          height={120}
                          className="border border-rich-black-400 rounded mb-2"
                        />
                        <p className="text-citron-500 text-xs">Sprite Sheet</p>
                      </div>
                      <div className="text-center">
                        <SpriteAnimation 
                          src="/sample-sprites/neon-star.png"
                          alt="Neon star animation"
                          size={120}
                          speed={160}
                        />
                        <p className="text-citron-500 text-xs mt-2">Animated</p>
                      </div>
                    </div>
                    <div className="bg-rich-black text-citron-400 p-2 rounded text-xs text-center mt-3">
                      <code>High quality • Commercial use OK</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-purple-pizzazz-500 to-mimi-pink-400 border-0 shadow-2xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-3xl font-bold text-white mb-4">Ready to Create Free Sprite Sheets?</h3>
                <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                  Start generating professional sprite sheets instantly with our free online tool. No watermarks, no downloads required.
                </p>
                <Link href="/">
                  <Button size="lg" className="bg-white text-purple-pizzazz hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
                    Generate Your Sprite Sheet Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}

