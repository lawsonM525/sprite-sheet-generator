'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SpriteAnimation } from '@/components/SpriteAnimation'
import { Footer } from '@/components/Footer'

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I import a sprite sheet into Unity?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Drag the sheet into the Assets panel, set Sprite Mode to Multiple, then open the Sprite Editor and slice the frames before adding them to an Animator.",
      },
    },
    {
      "@type": "Question",
      name: "How can I use a sprite sheet in Unreal Engine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enable the Paper2D plugin, import the PNG as a Paper2D Texture, create a Flipbook, and play it through a Flipbook component in a Blueprint or C++ actor.",
      },
    },
    {
      "@type": "Question",
      name: "Can Godot handle sprite sheets?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Import the image as a Texture, add an AnimatedSprite2D node, create a SpriteFrames resource, and define the frame size to generate animations.",
      },
    },
    {
      "@type": "Question",
      name: "Does Phaser support sprite sheets?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use this.load.spritesheet during preload with frame dimensions, then call this.anims.create to build an animation from the frames.",
      },
    },
  ],
}

export default function GameEngineSpriteSheets() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  return (
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
          <Link href="/free-sprite-sheet-generator" className="text-purple-pizzazz hover:text-citron-500 transition-colors">
            Free Generator
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
                href="/free-sprite-sheet-generator"
                className="text-purple-pizzazz hover:text-citron-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Free Generator
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
          Sprite Sheets for Game Engines
        </h1>
        <p className="text-lg sm:text-xl text-citron-600 max-w-3xl mx-auto leading-relaxed px-4">
          Learn how to import and export sprite sheets in Unity, Unreal Engine, Godot, and Phaser with step-by-step guides and downloadable examples.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="space-y-8 sm:space-y-12">

          {/* Table of Contents */}
          <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-mimi-pink-500">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent className="text-citron-600">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <a href="#unity" className="text-purple-pizzazz hover:underline">
                    Unity
                  </a>
                </li>
                <li>
                  <a href="#unreal" className="text-purple-pizzazz hover:underline">
                    Unreal Engine
                  </a>
                </li>
                <li>
                  <a href="#godot" className="text-purple-pizzazz hover:underline">
                    Godot
                  </a>
                </li>
                <li>
                  <a href="#phaser" className="text-purple-pizzazz hover:underline">
                    Phaser
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Demo Examples */}
          <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-mimi-pink-500">See Sprite Sheets in Action</CardTitle>
            </CardHeader>
            <CardContent className="text-citron-600 space-y-8">
              <p className="text-lg leading-relaxed">
                Before diving into the technical guides, see how these sprite sheets animate in real-time. These examples work perfectly in all the game engines covered below.
              </p>
              
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bouncing Ball Example */}
                <div className="bg-rich-black-300 p-6 rounded-lg">
                  <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Bouncing Ball</h4>
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <Image 
                        src="/sample-sprites/bouncing-ball.png" 
                        alt="Bouncing ball sprite sheet for Unity"
                        width={120}
                        height={120}
                        className="border border-rich-black-400 rounded mb-2"
                      />
                      <p className="text-citron-500 text-xs">Sprite Sheet</p>
                    </div>
                    <div className="text-center">
                      <SpriteAnimation 
                        src="/sample-sprites/bouncing-ball.png"
                        alt="Bouncing ball animation"
                        size={120}
                        speed={130}
                      />
                      <p className="text-citron-500 text-xs mt-2">Animated</p>
                    </div>
                  </div>
                  <div className="bg-rich-black text-citron-400 p-2 rounded text-xs text-center mt-3">
                    <code>Perfect for Unity physics demos</code>
                  </div>
                </div>

                {/* Happy Bird Example */}
                <div className="bg-rich-black-300 p-6 rounded-lg">
                  <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Happy Bird</h4>
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <Image 
                        src="/sample-sprites/happy-bird.png" 
                        alt="Happy bird sprite sheet for Unreal Engine"
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
                    <code>Great for Unreal Engine 2D games</code>
                  </div>
                </div>

                {/* Neon Star Example */}
                <div className="bg-rich-black-300 p-6 rounded-lg">
                  <h4 className="text-lg text-purple-pizzazz mb-4 text-center">Neon Star</h4>
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <Image 
                        src="/sample-sprites/neon-star.png" 
                        alt="Neon star sprite sheet for Godot"
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
                    <code>Ideal for Godot and Phaser projects</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unity */}
          <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8" id="unity">
            <CardHeader>
              <CardTitle className="text-2xl text-mimi-pink-500">Unity</CardTitle>
            </CardHeader>
            <CardContent className="text-citron-600 space-y-6">
              <div>
                <h3 className="text-xl text-purple-pizzazz mb-3">Importing Sprite Sheets</h3>
                <ol className="list-decimal pl-6 space-y-2 mb-4">
                  <li>Drag your sprite sheet into the <em>Assets</em> panel.</li>
                  <li>Select the image and set <strong>Sprite Mode</strong> to <em>Multiple</em>.</li>
                  <li>Open <em>Sprite Editor</em> → <em>Slice</em> → <em>Apply</em>.</li>
                  <li>Add the sliced sprites to an <em>Animator</em> or <em>Animation</em> clip.</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-xl text-purple-pizzazz mb-3">C# Animation Script</h3>
                <pre className="bg-rich-black text-citron-400 p-4 rounded text-sm overflow-x-auto">
{`using UnityEngine;
public class SpriteAnimator : MonoBehaviour {
  public Sprite[] frames;
  public float frameRate = 12f;
  SpriteRenderer sr;
  int index; float timer;
  
  void Awake() => sr = GetComponent<SpriteRenderer>();
  
  void Update() {
    timer += Time.deltaTime;
    if (timer >= 1f / frameRate) {
      index = (index + 1) % frames.Length;
      sr.sprite = frames[index];
      timer = 0f;
    }
  }
}`}
                </pre>
              </div>
              
              <div className="text-center">
                <Link
                  href="/sample-sprites/bouncing-ball.png"
                  className="text-purple-pizzazz underline"
                  download
                >
                  Download bouncing-ball.png for Unity
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Unreal Engine */}
          <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8" id="unreal">
            <CardHeader>
              <CardTitle className="text-2xl text-mimi-pink-500">Unreal Engine</CardTitle>
            </CardHeader>
            <CardContent className="text-citron-600 space-y-6">
              <div>
                <h3 className="text-xl text-purple-pizzazz mb-3">Setting Up Paper2D</h3>
                <ol className="list-decimal pl-6 space-y-2 mb-4">
                  <li>Enable the <em>Paper2D</em> plugin in your project settings.</li>
                  <li>Import the sprite sheet PNG into the <em>Content Browser</em>.</li>
                  <li>Right‑click the texture → <em>Sprite Actions</em> → <em>Apply Paper2D Texture Settings</em>.</li>
                  <li>Create a <em>Flipbook</em> from the sprites and add it to a <em>Flipbook Component</em>.</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-xl text-purple-pizzazz mb-3">C++ Flipbook Control</h3>
                <pre className="bg-rich-black text-citron-400 p-4 rounded text-sm overflow-x-auto">
{`// C++ Flipbook playback
UPaperFlipbookComponent* FlipbookComponent;

void AMyActor::BeginPlay() {
  Super::BeginPlay();
  FlipbookComponent->PlayFromStart();
  FlipbookComponent->SetPlayRate(2.0f); // 2x speed
}`}
                </pre>
              </div>
              
              <div className="text-center">
                <Link
                  href="/sample-sprites/happy-bird.png"
                  className="text-purple-pizzazz underline"
                  download
                >
                  Download happy-bird.png for Unreal Engine
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Godot */}
          <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8" id="godot">
            <CardHeader>
              <CardTitle className="text-2xl text-mimi-pink-500">Godot</CardTitle>
            </CardHeader>
            <CardContent className="text-citron-600 space-y-6">
              <div>
                <h3 className="text-xl text-purple-pizzazz mb-3">AnimatedSprite2D Setup</h3>
                <ol className="list-decimal pl-6 space-y-2 mb-4">
                  <li>Drag the PNG into the <em>FileSystem</em> dock.</li>
                  <li>Add an <em>AnimatedSprite2D</em> node to your scene.</li>
                  <li>Create a new <em>SpriteFrames</em> resource and set the frame size.</li>
                  <li>Assign the sprite sheet and play the animation.</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-xl text-purple-pizzazz mb-3">GDScript Animation</h3>
                <pre className="bg-rich-black text-citron-400 p-4 rounded text-sm overflow-x-auto">
{`# GDScript animation control
extends Node2D

@onready var animated_sprite = $AnimatedSprite2D

func _ready():
  animated_sprite.play("walk")
  animated_sprite.speed_scale = 1.5  # 1.5x speed`}
                </pre>
              </div>
              
              <div className="text-center">
                <Link
                  href="/sample-sprites/neon-star.png"
                  className="text-purple-pizzazz underline"
                  download
                >
                  Download neon-star.png for Godot
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Phaser */}
          <Card className="bg-rich-black-200 border-rich-black-400 shadow-2xl mb-8" id="phaser">
            <CardHeader>
              <CardTitle className="text-2xl text-mimi-pink-500">Phaser</CardTitle>
            </CardHeader>
            <CardContent className="text-citron-600 space-y-6">
              <div>
                <h3 className="text-xl text-purple-pizzazz mb-3">Loading and Playing Sprites</h3>
                <ol className="list-decimal pl-6 space-y-2 mb-4">
                  <li>Preload the sheet with <code>this.load.spritesheet</code> specifying frame width and height.</li>
                  <li>In <em>create</em>, define an animation with <code>this.anims.create</code>.</li>
                  <li>Play the animation on a sprite using <code>play</code>.</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-xl text-purple-pizzazz mb-3">Phaser 3 Implementation</h3>
                <pre className="bg-rich-black text-citron-400 p-4 rounded text-sm overflow-x-auto">
{`// Phaser 3 sprite sheet animation
function preload() {
  this.load.spritesheet('ball', 'bouncing-ball.png', { 
    frameWidth: 32, 
    frameHeight: 32 
  })
}

function create() {
  this.anims.create({ 
    key: 'bounce', 
    frames: this.anims.generateFrameNumbers('ball'), 
    frameRate: 12, 
    repeat: -1 
  })
  
  const sprite = this.add.sprite(100, 100, 'ball')
  sprite.play('bounce')
}`}
                </pre>
              </div>
              
              <div className="text-center">
                <Link
                  href="/sample-sprites/smiling-emoji.png"
                  className="text-purple-pizzazz underline"
                  download
                >
                  Download smiling-emoji.png for Phaser
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-purple-pizzazz-500 to-mimi-pink-400 border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Create Game Engine Sprites?</h3>
              <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                Generate sprite sheets optimized for your favorite game engine. Our AI creates consistent animations perfect for Unity, Unreal, Godot, and Phaser.
              </p>
              <Link href="/">
                <Button size="lg" className="bg-white text-purple-pizzazz hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
                  Generate Sprite Sheets Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      
      <Footer />
    </div>
  )
}
