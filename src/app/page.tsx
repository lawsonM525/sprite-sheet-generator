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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Image 
            src="/pink-sprinkles.gif" 
            alt="Pink sprinkles" 
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
            unoptimized
          />
          <span className="text-xl font-bold text-white">Sprite Generator</span>
        </div>
        <UserMenu />
      </div>

      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <div className="mb-4">
          <span className="text-sm font-medium text-pink-500 uppercase tracking-wide">FREE TOOLS</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Sprite Generator
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          The Sprite Generator is not just a simple tool that produces a
          sprite at random. It is a very complex element that considers such factors as
          character progression, animation advancement, and the creation of a universe.
        </p>
      </div>

      {/* Main Generator Form */}
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <Card className="bg-gray-900 border-gray-700 shadow-2xl">
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
                  placeholder="Generate a sprite about..."
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  rows={4}
                  className="w-full text-lg bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-300">Frame Count</Label>
                  <Select value={frameCount} onValueChange={setFrameCount}>
                    <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="4" className="text-white hover:bg-gray-700">4 frames</SelectItem>
                      <SelectItem value="9" className="text-white hover:bg-gray-700">9 frames</SelectItem>
                      <SelectItem value="16" className="text-white hover:bg-gray-700">16 frames</SelectItem>
                      <SelectItem value="25" className="text-white hover:bg-gray-700">25 frames</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300">Style</Label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {STYLES.map((style) => (
                        <SelectItem key={style.value} value={style.value} className="text-white hover:bg-gray-700">
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-300">Canvas Size</Label>
                <Select value={canvasSize} onValueChange={setCanvasSize}>
                  <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="64" className="text-white hover:bg-gray-700">64×64</SelectItem>
                    <SelectItem value="128" className="text-white hover:bg-gray-700">128×128</SelectItem>
                    <SelectItem value="256" className="text-white hover:bg-gray-700">256×256</SelectItem>
                    <SelectItem value="512" className="text-white hover:bg-gray-700">512×512</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || (!concept && !selectedTemplate)}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 text-lg font-medium"
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
                <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="text-center text-sm text-gray-400">
                <span>0/20 Uses Today</span>
                <br />
                <span>By continuing you agree to our </span>
                <a href="#" className="text-pink-500 underline">Terms and conditions</a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress/Results Section */}
      {(isGenerating || generatedSprite) && (
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <Card className="bg-gray-900 border-gray-700 shadow-2xl">
            <CardContent className="p-8">
              {isGenerating ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-center h-32 bg-gray-800 border border-gray-600 rounded-lg">
                    <div className="text-center text-gray-300">
                      <Loader2 className="w-8 h-8 mx-auto mb-2 text-pink-500 animate-spin" />
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
        </div>
      )}

      {/* Templates Section */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Popular Templates</h2>
          <p className="text-gray-300">Get started quickly with these pre-made animation concepts</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((template) => (
            <Card
              key={template.value}
              className="bg-gray-900 border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => {
                setSelectedTemplate(template.value)
                setConcept(template.description)
              }}
            >
              <CardHeader>
                <CardTitle className="text-xl text-white">{template.label}</CardTitle>
                <CardDescription className="text-gray-400">{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white">
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