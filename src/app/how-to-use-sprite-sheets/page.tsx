'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import SpriteAnimation from '@/components/SpriteAnimation'

export default function HowToUseSpriteSheets() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  return (
    <div className="min-h-screen bg-rich-black">
      {/* Navigation */}
codex/create-free-sprite-sheet-generator-page
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
          <Link href="/free-sprite-sheet-generator" className="text-purple-pizzazz hover:text-citron-500 transition-colors">
            Free Sprite Sheet Generator
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
                href="/free-sprite-sheet-generator"
                className="text-purple-pizzazz hover:text-citron-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Free Sprite Sheet Generator
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
main

      {/* Hero Section */}
      <div className="text-center py-12 sm:py-16 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-mimi-pink-500 mb-6">
          How to Use Sprite Sheets
        </h1>
        <p className="text-lg sm:text-xl text-citron-600 max-w-3xl mx-auto leading-relaxed px-4">
          Learn how to create and animate sprite sheets for your games and web projects
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="space-y-8 sm:space-y-12">
          {/* What is a Sprite Sheet */}
          <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-mimi-pink-500">What is a Sprite Sheet?</CardTitle>
            </CardHeader>
            <CardContent className="text-citron-600 space-y-4">
              <p className="text-citron-600 text-base sm:text-lg leading-relaxed">
                A sprite sheet is like a comic strip or flip book - it contains multiple frames of an animation 
                arranged in a grid. Instead of having separate image files for each frame, you put them all 
                together in one image. This makes it easier to load and animate characters in games and websites.
              </p>
            </CardContent>
          </Card>

        {/* How Sprite Sheet Grids Work */}
        <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl text-mimi-pink-500">Understanding Sprite Sheet Grids</CardTitle>
          </CardHeader>
          <CardContent className="text-citron-600 space-y-6 p-4 sm:p-6">
            <div>
              <h3 className="text-lg sm:text-xl text-purple-pizzazz mb-3">2x2 Grid (4 frames)</h3>
              <p className="text-base sm:text-lg leading-relaxed mb-4">
                Perfect for simple animations like a blinking eye or a bouncing ball. 
                Four pictures arranged in a square give you a short, smooth loop.
              </p>
              <div className="bg-rich-black-300 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-center">
                    <div className="grid grid-cols-2 gap-2 w-24 mx-auto mb-2">
                      <div className="w-10 h-10 bg-purple-pizzazz-200 rounded flex items-center justify-center text-rich-black font-bold text-sm">1</div>
                      <div className="w-10 h-10 bg-purple-pizzazz-200 rounded flex items-center justify-center text-rich-black font-bold text-sm">2</div>
                      <div className="w-10 h-10 bg-purple-pizzazz-200 rounded flex items-center justify-center text-rich-black font-bold text-sm">3</div>
                      <div className="w-10 h-10 bg-purple-pizzazz-200 rounded flex items-center justify-center text-rich-black font-bold text-sm">4</div>
                    </div>
                    <p className="text-citron-500 text-sm">Grid Layout</p>
                  </div>
                  <div className="text-center">
                    <Image 
                      src="/sample-sprites/blinking-blue-eye-2x2.png" 
                      alt="Blinking blue eye sprite sheet - 2x2 grid with 4 frames"
                      width={120}
                      height={120}
                      className="border border-rich-black-400 rounded mb-2"
                    />
                    <p className="text-citron-500 text-sm">Real Example</p>
                  </div>
                  <div className="text-center">
                    <SpriteAnimation 
                      src="/sample-sprites/blinking-blue-eye-2x2.png"
                      alt="Blinking blue eye animation"
                      size={120}
                      speed={200}
                      gridSize={2}
                    />
                    <p className="text-citron-500 text-sm">Animated Version</p>
                  </div>
                </div>
                <p className="text-center text-citron-500">2x2 Grid = 4 animation frames</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl text-purple-pizzazz mb-3">3x3 Grid (9 frames)</h3>
              <p className="text-base sm:text-lg leading-relaxed mb-4">
                Great for walking animations or more detailed movements. Nine pictures give you 
                smoother motion and more personality in your character.
              </p>
              <div className="bg-rich-black-300 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-center">
                    <div className="grid grid-cols-3 gap-2 w-36 mx-auto mb-2">
                      {[1,2,3,4,5,6,7,8,9].map(num => (
                        <div key={num} className="w-10 h-10 bg-citron-400 rounded flex items-center justify-center text-rich-black font-bold text-sm">{num}</div>
                      ))}
                    </div>
                    <p className="text-citron-500 text-sm">Grid Layout</p>
                  </div>
                  <div className="text-center">
                    <Image 
                      src="/sample-sprites/smiling-emoji.png" 
                      alt="Smiling emoji sprite sheet example"
                      width={120}
                      height={120}
                      className="border border-rich-black-400 rounded mb-2"
                    />
                    <p className="text-citron-500 text-sm">Real Example</p>
                  </div>
                  <div className="text-center">
                    <SpriteAnimation 
                      src="/sample-sprites/smiling-emoji.png"
                      alt="Smiling emoji animation"
                      size={120}
                      speed={220}
                    />
                    <p className="text-citron-500 text-sm">Animated Version</p>
                  </div>
                </div>
                <p className="text-center text-citron-500">3x3 Grid = 9 animation frames</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl text-purple-pizzazz mb-3">4x4 Grid (16 frames)</h3>
              <p className="text-lg leading-relaxed mb-4">
                Perfect for complex animations like dancing, fighting moves, or detailed facial expressions. 
                Sixteen frames create very smooth, professional-looking animations.
              </p>
              <div className="bg-rich-black-300 p-3 sm:p-4 rounded-lg">
                <div className="grid grid-cols-4 gap-1 sm:gap-2 w-40 sm:w-52 mx-auto">
                  {Array.from({length: 16}, (_, i) => i + 1).map(num => (
                    <div key={num} className="w-10 h-10 bg-mimi-pink-400 rounded flex items-center justify-center text-rich-black font-bold text-sm">{num}</div>
                  ))}
                </div>
                <p className="text-center mt-2 text-citron-500">4x4 Grid = 16 animation frames</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How Animation Works */}
        <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-mimi-pink-500">How to Make Sprite Sheets Move</CardTitle>
          </CardHeader>
          <CardContent className="text-citron-600 space-y-6">
            <p className="text-lg leading-relaxed">
              There are two main ways to animate sprite sheets: CSS and JavaScript. Both work by showing one frame at a time, but JavaScript gives you more control.
            </p>
            
            <div className="bg-rich-black-300 p-6 rounded-lg">
              <h4 className="text-lg text-purple-pizzazz mb-3">Method 1: CSS Steps Animation</h4>
              <pre className="bg-rich-black text-citron-400 p-4 rounded text-sm overflow-x-auto">
{`.sprite-animation {
  width: 64px;
  height: 64px;
  background-image: url('your-sprite-sheet.png');
  animation: play 1s steps(9) infinite;
}

@keyframes play {
  0% { background-position: 0 0; }
  100% { background-position: -576px 0; }
}`}
              </pre>
              <p className="text-citron-500 mt-3">
                CSS steps() function jumps between frames instead of smoothly sliding. Good for simple animations.
              </p>
            </div>

            <div className="bg-rich-black-300 p-6 rounded-lg">
              <h4 className="text-lg text-purple-pizzazz mb-3">Method 2: JavaScript Frame Control (Recommended)</h4>
              <pre className="bg-rich-black text-citron-400 p-4 rounded text-sm overflow-x-auto">
{`function SpriteAnimation({ src, size = 64, speed = 150, gridSize = 3 }) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const totalFrames = gridSize * gridSize

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames)
    }, speed)
    return () => clearInterval(interval)
  }, [speed, totalFrames])

  const row = Math.floor(currentFrame / gridSize)
  const col = currentFrame % gridSize
  
  return (
    <div style={{
      width: size,
      height: size,
      backgroundImage: \`url(\${src})\`,
      backgroundSize: \`\${size * gridSize}px \${size * gridSize}px\`,
      backgroundPosition: \`-\${col * size}px -\${row * size}px\`
    }} />
  )
}`}
              </pre>
              <p className="text-citron-500 mt-3">
                JavaScript gives you exact frame control, variable speeds, and works with any grid size (2x2, 3x3, 4x4). Perfect for pause, reverse, or trigger animations based on user actions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Sprite Sheets Are Better */}
        <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-mimi-pink-500">Why Sprite Sheets Beat GIFs</CardTitle>
          </CardHeader>
          <CardContent className="text-citron-600">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg text-purple-pizzazz mb-3">Sprite Sheets Win Because:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-citron-400 mt-1">✓</span>
                    <span>Smaller file sizes = faster loading websites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-citron-400 mt-1">✓</span>
                    <span>You control the speed with CSS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-citron-400 mt-1">✓</span>
                    <span>Can pause, play, or reverse animations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-citron-400 mt-1">✓</span>
                    <span>Works perfectly on all devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-citron-400 mt-1">✓</span>
                    <span>Better quality images</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg text-purple-pizzazz mb-3">GIF Problems:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Large file sizes slow down your site</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Limited to 256 colors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Can&apos;t control playback easily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Sometimes look pixelated</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real Examples Section */}
        <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-mimi-pink-500">See Real Sprite Sheets in Action</CardTitle>
          </CardHeader>
          <CardContent className="text-citron-600 space-y-8">
            <p className="text-lg leading-relaxed">
              Here are actual sprite sheets created with our AI generator. Different grid sizes create different animation styles - from simple 2x2 blinking to complex 3x3 movements!
            </p>
            
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Blinking Blue Eye Example */}
              <div className="bg-rich-black-300 p-6 rounded-lg">
                <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Blinking Blue Eye</h4>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <Image 
                      src="/sample-sprites/blinking-blue-eye-2x2.png" 
                      alt="Blinking blue eye sprite sheet - 2x2 grid with 4 frames"
                      width={150}
                      height={150}
                      className="border border-rich-black-400 rounded mb-2"
                    />
                    <p className="text-citron-500 text-xs">Full Sprite Sheet</p>
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
                  <code>JavaScript: setCurrentFrame((prev) =&gt; (prev + 1) % 4)</code>
                </div>
              </div>

              {/* Bouncing Ball Example */}
              <div className="bg-rich-black-300 p-6 rounded-lg">
                <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Bouncing Ball</h4>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <Image 
                      src="/sample-sprites/bouncing-ball.png" 
                      alt="Bouncing ball sprite sheet - 3x3 grid with 9 frames"
                      width={150}
                      height={150}
                      className="border border-rich-black-400 rounded mb-2"
                    />
                    <p className="text-citron-500 text-xs">Full Sprite Sheet</p>
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
                  <code>JavaScript: setCurrentFrame((prev) =&gt; (prev + 1) % 9)</code>
                </div>
              </div>

              {/* Happy Bird Example */}
              <div className="bg-rich-black-300 p-6 rounded-lg">
                <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Happy Bird</h4>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <Image 
                      src="/sample-sprites/happy-bird.png" 
                      alt="Happy bird sprite sheet - 3x3 grid with 9 frames"
                      width={150}
                      height={150}
                      className="border border-rich-black-400 rounded mb-2"
                    />
                    <p className="text-citron-500 text-xs">Full Sprite Sheet</p>
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
                  <code>JavaScript: setCurrentFrame((prev) =&gt; (prev + 1) % 9)</code>
                </div>
              </div>

              {/* Neon Star Example */}
              <div className="bg-rich-black-300 p-6 rounded-lg">
                <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Neon Star</h4>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <Image 
                      src="/sample-sprites/neon-star.png" 
                      alt="Neon star sprite sheet - 3x3 grid with 9 frames"
                      width={150}
                      height={150}
                      className="border border-rich-black-400 rounded mb-2"
                    />
                    <p className="text-citron-500 text-xs">Full Sprite Sheet</p>
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
                  <code>JavaScript: setCurrentFrame((prev) =&gt; (prev + 1) % 9)</code>
                </div>
              </div>

              {/* Smiling Emoji Example */}
              <div className="bg-rich-black-300 p-6 rounded-lg">
                <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Smiling Emoji</h4>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <Image 
                      src="/sample-sprites/smiling-emoji.png" 
                      alt="Smiling emoji sprite sheet - 3x3 grid with 9 frames"
                      width={150}
                      height={150}
                      className="border border-rich-black-400 rounded mb-2"
                    />
                    <p className="text-citron-500 text-xs">Full Sprite Sheet</p>
                  </div>
                  <div className="text-center">
                    <SpriteAnimation 
                      src="/sample-sprites/smiling-emoji.png"
                      alt="Smiling emoji animation"
                      size={150}
                      speed={220}
                    />
                    <p className="text-citron-500 text-xs mt-2">Animated Result</p>
                  </div>
                </div>
                <div className="bg-rich-black text-citron-400 p-2 rounded text-xs text-center mt-3">
                  <code>JavaScript: setCurrentFrame((prev) =&gt; (prev + 1) % 9)</code>
                </div>
              </div>
            </div>

            <div className="bg-rich-black-300 p-6 rounded-lg">
              <h4 className="text-lg text-purple-pizzazz mb-3">JavaScript Code for Frame-by-Frame Animation:</h4>
              <pre className="bg-rich-black text-citron-400 p-4 rounded text-sm overflow-x-auto">
{`function SpriteAnimation({ src, size = 64, speed = 150 }) {
  const [currentFrame, setCurrentFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % 9) // 9 frames
    }, speed)

    return () => clearInterval(interval)
  }, [speed])

  // Calculate frame position (3x3 grid)
  const row = Math.floor(currentFrame / 3)
  const col = currentFrame % 3
  
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundImage: \`url(\${src})\`,
        backgroundSize: \`\${size * 3}px \${size * 3}px\`,
        backgroundPosition: \`-\${col * size}px -\${row * size}px\`,
      }}
    />
  )
}`}
              </pre>
              <p className="text-citron-500 mt-3">
                This JavaScript approach gives you proper frame-by-frame animation with exact control over timing and frame progression!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step by Step Guide */}
        <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-mimi-pink-500">Step-by-Step: Using Your Sprite Sheet</CardTitle>
          </CardHeader>
          <CardContent className="text-citron-600 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-pizzazz rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="text-lg text-purple-pizzazz mb-2">Create Your Sprite Sheet</h4>
                  <p>Use our AI generator to make a sprite sheet with consistent characters. Choose your grid size based on how smooth you want the animation.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-pizzazz rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="text-lg text-purple-pizzazz mb-2">Add to Your Website</h4>
                  <p>Upload the sprite sheet image to your website and add it to your HTML with a simple image tag or CSS background.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-pizzazz rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="text-lg text-purple-pizzazz mb-2">Write the CSS Animation</h4>
                  <p>Copy our CSS code examples and adjust the timing and frame count to match your sprite sheet.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-pizzazz rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="text-lg text-purple-pizzazz mb-2">Test and Enjoy</h4>
                  <p>Refresh your website and watch your character come to life! Adjust the speed if needed.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-pizzazz-500 to-mimi-pink-400 border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Create Your Own Sprite Sheets?</h3>
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
              Our AI-powered generator creates consistent characters across all frames, making it easy 
              to build professional animations for your website.
            </p>
            <Link href="/">
              <Button size="lg" className="bg-white text-purple-pizzazz hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
                Create Your Sprite Sheet Now
              </Button>
            </Link>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
