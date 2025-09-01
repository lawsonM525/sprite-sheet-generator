'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export const metadata: Metadata = {
  title: 'CSS Sprite Generator Tutorial & Tool',
  description:
    'Generate CSS classes for sprites to reduce HTTP requests and boost load performance. Includes links to the main generator and optimization guides.'
}

export default function CssSpriteGeneratorPage() {
  const [name, setName] = useState('icon')
  const [x, setX] = useState('0')
  const [y, setY] = useState('0')
  const [width, setWidth] = useState('32')
  const [height, setHeight] = useState('32')

  const css = `.sprite-${name} {\n  width: ${width}px;\n  height: ${height}px;\n  background-image: url('/path/to/spritesheet.png');\n  background-position: -${x}px -${y}px;\n  background-repeat: no-repeat;\n}`

  const jsSample = `const sprite = document.querySelector('.sprite-icon')\nlet frame = 0\nconst frames = 4\nconst frameWidth = 32\n\nsetInterval(() => {\n  sprite.style.backgroundPosition = '-' + frame * frameWidth + 'px 0'\n  frame = (frame + 1) % frames\n}, 100)`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Article', 'HowTo'],
    headline: 'CSS Sprite Generator Tutorial',
    description:
      'Guide and tool for generating CSS sprite classes to improve performance.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Enter sprite details',
        text: 'Provide sprite name, size and coordinates.'
      },
      {
        '@type': 'HowToStep',
        name: 'Copy CSS',
        text: 'Copy the generated class into your stylesheet.'
      },
      {
        '@type': 'HowToStep',
        name: 'Apply class',
        text: 'Use the class on elements that need the sprite.'
      },
      {
        '@type': 'HowToStep',
        name: 'Animate with JavaScript',
        text: 'Cycle background positions to create motion.'
      }
    ]
  }

  return (
    <div className="min-h-screen bg-rich-black text-citron-600 px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-mimi-pink-500 mb-4">
        CSS Sprite Generator
      </h1>
      <p className="mb-6 max-w-2xl">
        CSS sprites pack multiple images into one file, cutting network requests and
        delivering faster experiences. Paste your sprite sheet into your project
        and let this mini tool output the classes for each frame.
      </p>

      <Card className="bg-rich-black-200 border-rich-black-400 mb-8">
        <CardHeader>
          <CardTitle className="text-mimi-pink-500">Generate CSS Class</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="x">X Position</Label>
              <Input id="x" type="number" value={x} onChange={(e) => setX(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="y">Y Position</Label>
              <Input id="y" type="number" value={y} onChange={(e) => setY(e.target.value)} />
            </div>
          </div>
          <Textarea readOnly value={css} className="h-40" />
          <Button onClick={() => navigator.clipboard.writeText(css)}>Copy CSS</Button>
        </CardContent>
      </Card>

      <section className="space-y-4 mb-8">
        <h2 className="text-2xl text-mimi-pink-500">Best Practices</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Group small icons into a single sprite sheet to minimize requests.</li>
          <li>Use <code>background-size</code> to support high-DPI displays.</li>
          <li>Compress your sprite sheet to keep files lightweight.</li>
        </ul>
        <p>
          Learn more about sprites in our{' '}
          <Link href="/how-to-use-sprite-sheets" className="text-purple-pizzazz">
            sprite sheet guide
          </Link>
          .
        </p>
        <p>
          Need a full-featured generator? Try our{' '}
          <Link href="/" className="text-purple-pizzazz">
            free sprite sheet generator
          </Link>
          .
        </p>
        <p>
          Download a{' '}
          <a href="/downloads/sample-sprite.css" className="text-purple-pizzazz" download>
            sample CSS
          </a>{' '}
          or{' '}
          <a href="/downloads/sample-sprite.html" className="text-purple-pizzazz" download>
            sample HTML
          </a>{' '}
          to start quickly.
        </p>
      </section>

      <pre className="bg-rich-black-200 text-citron-400 p-4 rounded overflow-x-auto">
        <code>{`.sprite-icon {\n  background-position: -10px -20px;\n}`}</code>
      </pre>

      <h2 className="text-2xl text-mimi-pink-500 mt-8">Sample JavaScript</h2>
      <pre className="bg-rich-black-200 text-citron-400 p-4 rounded overflow-x-auto">
        <code>{jsSample}</code>
      </pre>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
