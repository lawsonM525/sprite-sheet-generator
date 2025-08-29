'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Download, Sparkles, Grid3x3 } from 'lucide-react'
import { SpritePreview } from '@/components/SpritePreview'
import { ProgressBar } from '@/components/ProgressBar'
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <Image 
              src="/dancing-frog.gif" 
              alt="Dancing frog" 
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
              unoptimized
            />
            <h1 className="text-5xl font-bold text-foreground font-mono-heading">
              <span className="bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
                Create your sprite sheet!!
              </span>
            </h1>
            <Image 
              src="/dancing-frog.gif" 
              alt="Dancing frog" 
              width={96}
              height={96}
              className="w-24 h-24 object-contain transform scale-x-[-1]"
              unoptimized
            />
          </div>
          <p className="text-lg text-muted-foreground">
            AI-powered animation sprite creator for games and web
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="create">Create New</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-3xl">Configuration</CardTitle>
                    <CardDescription>Set up your sprite sheet parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="concept">Concept Prompt</Label>
                      <Textarea
                        id="concept"
                        placeholder="e.g., 'A glowing star that grows from small to large'"
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="style">Style</Label>
                      <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                        <SelectTrigger id="style">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STYLES.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="frames">Frame Count</Label>
                        <Select value={frameCount} onValueChange={setFrameCount}>
                          <SelectTrigger id="frames">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4">4 frames</SelectItem>
                            <SelectItem value="9">9 frames</SelectItem>
                            <SelectItem value="16">16 frames</SelectItem>
                            <SelectItem value="25">25 frames</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="size">Canvas Size</Label>
                        <Select value={canvasSize} onValueChange={setCanvasSize}>
                          <SelectTrigger id="size">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="64">64×64</SelectItem>
                            <SelectItem value="128">128×128</SelectItem>
                            <SelectItem value="256">256×256</SelectItem>
                            <SelectItem value="512">512×512</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || (!concept && !selectedTemplate)}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Sprite Sheet
                        </>
                      )}
                    </Button>

                    {error && (
                      <div className="bg-destructive/10 border border-destructive text-destructive-foreground px-4 py-3 rounded">
                        {error}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-3xl">Preview</CardTitle>
                    <CardDescription>Your generated sprite sheet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isGenerating ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center h-32 bg-muted/20 border border-border rounded-lg">
                          <div className="text-center text-muted-foreground">
                            <Loader2 className="w-8 h-8 mx-auto mb-2 text-primary animate-spin" />
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
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-muted/20 border border-border rounded-lg">
                        <div className="text-center text-muted-foreground">
                          <Grid3x3 className="w-12 h-12 mx-auto mb-2 text-primary" />
                          <p>Your sprite sheet will appear here</p>
                        </div>
                      </div>
                    )}

                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="templates">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEMPLATES.map((template) => (
                  <Card
                    key={template.value}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedTemplate(template.value)
                      setConcept('')
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-3xl">{template.label}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Use This Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}