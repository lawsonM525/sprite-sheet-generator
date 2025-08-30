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
  { value: 'sketchy-doodle', label: 'Sketchy Doodle' },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentFrame, setCurrentFrame] = useState<number>()
  const [totalFrames, setTotalFrames] = useState<number>()
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setReferenceImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setReferenceImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeReferenceImage = () => {
    setReferenceImage(null)
    setReferenceImagePreview(null)
  }

  const handleGenerate = async () => {
    setError('')
    setIsGenerating(true)
    setProgress(0)
    setProgressMessage('Starting generation...')
    setCurrentFrame(undefined)
    setTotalFrames(parseInt(frameCount))

    try {
      const result = await generateSpriteSheet({
        concept,
        frameCount: parseInt(frameCount),
        canvasSize: parseInt(canvasSize),
        background: background as 'solid' | 'transparent',
        style: selectedStyle,
        referenceImage: referenceImage || undefined,
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
      <nav className="relative flex justify-between items-center px-4 sm:px-6 py-4 border-b border-rich-black-300">
        <div className="flex items-center gap-2">
          <Image 
            src="/pink-sprinkles.gif" 
            alt="Pink sprinkles" 
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
            unoptimized
          />
          <span className="text-lg sm:text-xl font-bold text-mimi-pink-500">Sprite Sheet Generator</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          <a href="/how-to-use-sprite-sheets" className="text-purple-pizzazz hover:text-citron-500 transition-colors">
            How to use sprite sheets
          </a>
          <a href="#" className="text-purple-pizzazz hover:text-citron-500 transition-colors">
            Pricing
          </a>
          <UserMenu />
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
              <a 
                href="/how-to-use-sprite-sheets" 
                className="text-purple-pizzazz hover:text-citron-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How to use sprite sheets
              </a>
              <a 
                href="#" 
                className="text-purple-pizzazz hover:text-citron-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <div onClick={() => setIsMobileMenuOpen(false)}>
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="text-center py-16 px-4">
     
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-mimi-pink-500 mb-6">
          Sprite Sheet Generator
        </h1>
        <p className="text-lg sm:text-xl text-citron-600 max-w-3xl mx-auto leading-relaxed px-4">
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
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <Image 
                    src="/pink-sprinkles.gif" 
                    alt="Pink sprinkles" 
                    width={48}
                    height={48}
                    className="w-12 h-12 mx-auto mb-4 object-contain"
                    unoptimized
                  />
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <Textarea
                      placeholder="Generate a sprite sheet about..."
                      value={concept}
                      onChange={(e) => setConcept(e.target.value)}
                      rows={4}
                      className="w-full text-base sm:text-lg bg-rich-black-300 border-rich-black-400 text-mimi-pink-500 placeholder-citron-400 focus:border-purple-pizzazz focus:ring-purple-pizzazz"
                    />
                  </div>

                  {/* Reference Image Upload */}
                  <div>
                    <Label className="text-sm font-medium text-citron-600 mb-2 block">
                      Reference Image (Optional)
                    </Label>
                    <div className="space-y-3">
                      {referenceImagePreview ? (
                        <div className="relative">
                          <div className="flex items-center gap-3 p-3 bg-rich-black-300 border border-rich-black-400 rounded-lg">
                            <Image
                              src={referenceImagePreview}
                              alt="Reference image preview"
                              width={48}
                              height={48}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm text-mimi-pink-500 font-medium">Reference image uploaded</p>
                              <p className="text-xs text-citron-500">This will guide the AI in creating your sprite sheet</p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={removeReferenceImage}
                              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-rich-black-400 rounded-lg p-6 text-center hover:border-purple-pizzazz transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="reference-image-upload"
                          />
                          <label
                            htmlFor="reference-image-upload"
                            className="cursor-pointer block"
                          >
                            <div className="text-citron-500 mb-2">
                              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-sm text-citron-600 mb-1">Click to upload a reference image</p>
                            <p className="text-xs text-citron-500">PNG, JPG up to 10MB</p>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <Image 
                      src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2hyaWV3a25tamExajY2d3l0MjdjdDE1ZjNnOWkzMTl3amNha2FiYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/dCjgjlXrflbRFqNiRL/giphy.gif"
                      alt="Animated sprite sheet"
                      width={96}
                      height={96}
                      className="w-24 h-24 mx-auto mb-4 object-contain"
                      unoptimized
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
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-mimi-pink-500 mb-4">Popular Templates</h2>
          <p className="text-citron-600 px-4">Get started quickly with these pre-made animation concepts</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {TEMPLATES.map((template) => (
            <Card
              key={template.value}
              className="bg-rich-black-200 border-rich-black-400 cursor-pointer hover:bg-rich-black-300 transition-colors"
              onClick={() => {
                setSelectedTemplate(template.value)
                setConcept(template.description)
              }}
            >
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl text-mimi-pink-500">{template.label}</CardTitle>
                <CardDescription className="text-citron-500 text-sm sm:text-base">{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <Button variant="outline" className="w-full border-purple-pizzazz text-purple-pizzazz hover:bg-purple-pizzazz hover:text-white text-sm sm:text-base">
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