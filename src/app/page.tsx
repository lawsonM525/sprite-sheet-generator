'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Download, Sparkles, Grid3x3, Zap } from 'lucide-react'
import { SpritePreview } from '@/components/SpritePreview'
import { ProgressBar } from '@/components/ProgressBar'
import { UserMenu } from '@/components/auth/UserMenu'
import { generateSpriteSheet } from '@/lib/sprite-generator'

const TEMPLATES = [
  { value: 'growing-star', label: 'Growing Star', description: 'A star that expands from small to large' },
  { value: 'blinking-eye', label: 'Blinking Eye', description: 'An eye that blinks smoothly' },
  { value: 'walking-cycle', label: 'Walking Cycle', description: 'Simple character walk animation' },
  { value: 'flame', label: 'Flame', description: 'Animated fire effect' },
  { value: 'loading-spinner', label: 'Loading Spinner', description: 'Rotating loading indicator' },
]

const STYLES = [
  { value: 'pixel-art', label: 'Pixel Art' },
  { value: 'neon-outline', label: 'Neon Outline' },
  { value: 'cel-shaded', label: 'Cel Shaded' },
  { value: 'vaporwave', label: 'Vaporwave' },
]

export default function Home() {
  const [concept, setConcept] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('pixel-art')
  const [frameCount, setFrameCount] = useState('9')
  const [canvasSize, setCanvasSize] = useState('128')
  const [background, setBackground] = useState('solid')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSprite, setGeneratedSprite] = useState<any>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [currentFrame, setCurrentFrame] = useState<number>()
  const [totalFrames, setTotalFrames] = useState<number>()

  const handleGenerate = async () => {
    setError('')
    setIsGenerating(true)
    setProgress(0)
    setProgressMessage('Starting generation...')
    setCurrentFrame(undefined)
    setTotalFrames(parseInt(frameCount))

    try {
      const result = await generateSpriteSheet({
        concept: selectedTemplate || concept,
        style: selectedStyle,
        frameCount: parseInt(frameCount),
        canvasSize: parseInt(canvasSize),
        background: background as 'transparent' | 'solid',
      }, (progressData) => {
        // Update progress based on the progress data
        if (progressData.progress !== undefined) {
          setProgress(progressData.progress)
        }
        if (progressData.message) {
          setProgressMessage(progressData.message)
        }
        if (progressData.currentFrame !== undefined) {
          setCurrentFrame(progressData.currentFrame)
        }
        if (progressData.totalFrames !== undefined) {
          setTotalFrames(progressData.totalFrames)
        }
      })
      
      setGeneratedSprite(result)
      setProgress(100)
      setProgressMessage('Generation complete!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate sprite sheet')
      setProgress(0)
      setProgressMessage('')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-rich-black">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-rich-black-300">
        <div className="flex items-center gap-2">
          <Image 
            src="/pink-sprinkles.gif" 
            alt="Pink sprinkles" 
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
            unoptimized
          />
          <span className="text-xl font-bold text-mimi-pink-500">Sprite Sheet Generator</span>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-citron-600 hover:text-citron-500 transition-colors">
            How to use sprite sheets
          </a>
          <a href="#" className="text-citron-600 hover:text-citron-500 transition-colors">
            Pricing
          </a>
          <UserMenu />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <div className="mb-4">
          <span className="text-sm font-medium text-purple-pizzazz uppercase tracking-wide">FREE TOOLS</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-mimi-pink-500 mb-6">
          Sprite Sheet Generator
        </h1>
        <p className="text-xl text-citron-600 max-w-3xl mx-auto leading-relaxed">
          Create perfect sprite sheets with guaranteed character consistency. Our AI ensures 
          your character maintains the same dimensions and appearance across all frames, 
          making it easy to use for CSS animations and game development.
        </p>
      </div>

      {/* Main Generator Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Image 
                    src="/pink-sprinkles.gif" 
                    alt="Pink sprinkles" 
                    width={48}
                    height={48}
                    className="w-12 h-12 mx-auto mb-4 object-contain"
                    unoptimized
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Textarea
                      placeholder="Generate a sprite sheet about..."
                      value={concept}
                      onChange={(e) => setConcept(e.target.value)}
                      rows={4}
                      className="w-full text-lg bg-rich-black-300 border-rich-black-400 text-mimi-pink-500 placeholder-citron-400 focus:border-purple-pizzazz focus:ring-purple-pizzazz"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-citron-600">Frame Count</Label>
                      <Select value={frameCount} onValueChange={setFrameCount}>
                        <SelectTrigger className="mt-1 bg-rich-black-300 border-rich-black-400 text-mimi-pink-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-rich-black-200 border-rich-black-400">
                          <SelectItem value="4" className="text-mimi-pink-500 hover:bg-rich-black-300">4 frames</SelectItem>
                          <SelectItem value="9" className="text-mimi-pink-500 hover:bg-rich-black-300">9 frames</SelectItem>
                          <SelectItem value="16" className="text-mimi-pink-500 hover:bg-rich-black-300">16 frames</SelectItem>
                          <SelectItem value="25" className="text-mimi-pink-500 hover:bg-rich-black-300">25 frames</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-citron-600">Style</Label>
                      <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                        <SelectTrigger className="mt-1 bg-rich-black-300 border-rich-black-400 text-mimi-pink-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-rich-black-200 border-rich-black-400">
                          {STYLES.map((style) => (
                            <SelectItem key={style.value} value={style.value} className="text-mimi-pink-500 hover:bg-rich-black-300">
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-citron-600">Canvas Size</Label>
                    <Select value={canvasSize} onValueChange={setCanvasSize}>
                      <SelectTrigger className="mt-1 bg-rich-black-300 border-rich-black-400 text-mimi-pink-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-rich-black-200 border-rich-black-400">
                        <SelectItem value="64" className="text-mimi-pink-500 hover:bg-rich-black-300">64×64</SelectItem>
                        <SelectItem value="128" className="text-mimi-pink-500 hover:bg-rich-black-300">128×128</SelectItem>
                        <SelectItem value="256" className="text-mimi-pink-500 hover:bg-rich-black-300">256×256</SelectItem>
                        <SelectItem value="512" className="text-mimi-pink-500 hover:bg-rich-black-300">512×512</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || (!concept && !selectedTemplate)}
                    className="w-full bg-purple-pizzazz hover:bg-purple-pizzazz-400 text-white py-3 text-lg font-medium"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        GENERATING
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        GENERATE
                      </>
                    )}
                  </Button>

                  {error && (
                    <div className="bg-purple-pizzazz-100/20 border border-purple-pizzazz-300 text-mimi-pink-400 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="text-center text-sm text-citron-500">
                    <span>0/3 Uses Today</span>
                    <br />
                    <span>By continuing you agree to our </span>
                    <a href="#" className="text-violet underline">Terms and conditions</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            {(isGenerating || generatedSprite) ? (
              <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl h-full">
                <CardContent className="p-8">
                  {isGenerating ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-center h-32 bg-rich-black-300 border border-rich-black-400 rounded-lg">
                        <div className="text-center text-citron-600">
                          <Loader2 className="w-8 h-8 mx-auto mb-2 text-purple-pizzazz animate-spin" />
                          <p>Generating your sprite sheet...</p>
                        </div>
                      </div>
                      <ProgressBar
                        progress={progress}
                        message={progressMessage}
                        currentFrame={currentFrame}
                        totalFrames={totalFrames}
                      />
                    </div>
                  ) : generatedSprite ? (
                    <SpritePreview
                      spriteSheet={generatedSprite.spriteSheet}
                      frameCount={parseInt(frameCount)}
                      frameSize={parseInt(canvasSize)}
                      atlas={generatedSprite.atlas}
                      frames={generatedSprite.frames}
                    />
                  ) : null}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl h-full">
                <CardContent className="p-8 flex items-center justify-center h-full">
                  <div className="text-center text-citron-600">
                    <img 
                      src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2hyaWV3a25tamExajY2d3l0MjdjdDE1ZjNnOWkzMTl3amNha2FiYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/dCjgjlXrflbRFqNiRL/giphy.gif"
                      alt="Animated sprite sheet"
                      className="w-24 h-24 mx-auto mb-4 object-contain"
                    />
                    <h3 className="text-xl font-semibold text-mimi-pink-500 mb-2">Your sprite sheet will appear here</h3>
                    <p className="text-citron-500">Enter a concept and click generate to create your sprite sheet with perfect character consistency</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-mimi-pink-500 mb-4">Popular Templates</h2>
          <p className="text-citron-600">Get started quickly with these pre-made animation concepts</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((template) => (
            <Card
              key={template.value}
              className="bg-rich-black-200 border-rich-black-400 cursor-pointer hover:bg-rich-black-300 transition-colors"
              onClick={() => {
                setSelectedTemplate(template.value)
                setConcept(template.description)
              }}
            >
              <CardHeader>
                <CardTitle className="text-xl text-mimi-pink-500">{template.label}</CardTitle>
                <CardDescription className="text-citron-500">{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-purple-pizzazz text-purple-pizzazz hover:bg-purple-pizzazz hover:text-white">
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}