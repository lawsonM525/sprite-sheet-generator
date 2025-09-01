import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sprite Sheet Guides for Popular Game Engines',
  description:
    'Step-by-step import and export tutorials for using sprite sheets in Unity, Unreal Engine, Godot, and Phaser with downloadable examples.',
  alternates: {
    canonical: 'https://sprite-sheet-generator.com/game-engine-sprite-sheets',
  },
}

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
  return (
    <div className="min-h-screen bg-rich-black text-citron-600">
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-bold text-mimi-pink-500 mb-8">
          Sprite Sheets for Game Engines
        </h1>
        <p className="mb-8">
          Learn how to import and export sprite sheets in the most popular game engines. Follow the guides, copy the code, and download ready-made examples.
        </p>

        <div className="mb-12">
          <h2 className="text-2xl text-mimi-pink-500 mb-4">Table of Contents</h2>
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
        </div>

        {/* Unity */}
        <section id="unity" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-mimi-pink-500 mb-4">Unity</h2>
          <h3 className="text-xl text-purple-pizzazz mb-2">Importing</h3>
          <ol className="list-decimal pl-6 space-y-1 mb-4">
            <li>Drag your sprite sheet into the <em>Assets</em> panel.</li>
            <li>Select the image and set <strong>Sprite Mode</strong> to <em>Multiple</em>.</li>
            <li>Open <em>Sprite Editor</em> → <em>Slice</em> → <em>Apply</em>.</li>
            <li>Add the sliced sprites to an <em>Animator</em> or <em>Animation</em> clip.</li>
          </ol>
          <h3 className="text-xl text-purple-pizzazz mb-2">Exporting</h3>
          <ol className="list-decimal pl-6 space-y-1 mb-4">
            <li>Select individual frames in the <em>Project</em> panel.</li>
            <li>Go to <em>Assets</em> → <em>Export Package</em> and include the sprites.</li>
            <li>Choose a destination and create the package for reuse.</li>
          </ol>
          <pre className="bg-rich-black-300 p-4 rounded text-sm overflow-x-auto mb-4">
{`using UnityEngine;
public class Player : MonoBehaviour {
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
          <p>
            <Link
              href="/sample-sprites/bouncing-ball.png"
              className="text-purple-pizzazz underline"
              download
            >
              Download bouncing-ball.png
            </Link>
          </p>
        </section>

        {/* Unreal Engine */}
        <section id="unreal" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-mimi-pink-500 mb-4">Unreal Engine</h2>
          <h3 className="text-xl text-purple-pizzazz mb-2">Importing</h3>
          <ol className="list-decimal pl-6 space-y-1 mb-4">
            <li>Enable the <em>Paper2D</em> plugin in your project settings.</li>
            <li>Import the sprite sheet PNG into the <em>Content Browser</em>.</li>
            <li>Right‑click the texture → <em>Sprite Actions</em> → <em>Apply Paper2D Texture Settings</em>.</li>
            <li>Create a <em>Flipbook</em> from the sprites and add it to a <em>Flipbook Component</em>.</li>
          </ol>
          <h3 className="text-xl text-purple-pizzazz mb-2">Exporting</h3>
          <ol className="list-decimal pl-6 space-y-1 mb-4">
            <li>Select the Flipbook asset in the <em>Content Browser</em>.</li>
            <li>Choose <em>Asset Actions</em> → <em>Migrate</em> to copy it to another project.</li>
            <li>Alternatively, right‑click the sprites and use <em>Asset Actions</em> → <em>Export</em> to save PNGs.</li>
          </ol>
          <pre className="bg-rich-black-300 p-4 rounded text-sm overflow-x-auto mb-4">
{`// C++ Flipbook playback
UPaperFlipbookComponent* Flipbook;
void APlayer::BeginPlay() {
  Flipbook->PlayFromStart();
}`}
          </pre>
          <p>
            <Link
              href="/sample-sprites/happy-bird.png"
              className="text-purple-pizzazz underline"
              download
            >
              Download happy-bird.png
            </Link>
          </p>
        </section>

        {/* Godot */}
        <section id="godot" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-mimi-pink-500 mb-4">Godot</h2>
          <h3 className="text-xl text-purple-pizzazz mb-2">Importing</h3>
          <ol className="list-decimal pl-6 space-y-1 mb-4">
            <li>Drag the PNG into the <em>FileSystem</em> dock.</li>
            <li>Add an <em>AnimatedSprite2D</em> node to your scene.</li>
            <li>Create a new <em>SpriteFrames</em> resource and set the frame size.</li>
            <li>Assign the sprite sheet and play the animation.</li>
          </ol>
          <h3 className="text-xl text-purple-pizzazz mb-2">Exporting</h3>
          <ol className="list-decimal pl-6 space-y-1 mb-4">
            <li>Open the <em>SpriteFrames</em> resource in the editor.</li>
            <li>Use the <em>Horizontal</em> or <em>Grid</em> slicing options to generate frames.</li>
            <li>Right‑click the animation and choose <em>Save Sprite Frames</em> for reuse.</li>
          </ol>
          <pre className="bg-rich-black-300 p-4 rounded text-sm overflow-x-auto mb-4">
{`# GDScript animation
func _ready():
  $AnimatedSprite2D.play("walk")`}
          </pre>
          <p>
            <Link
              href="/sample-sprites/neon-star.png"
              className="text-purple-pizzazz underline"
              download
            >
              Download neon-star.png
            </Link>
          </p>
        </section>

        {/* Phaser */}
        <section id="phaser" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-mimi-pink-500 mb-4">Phaser</h2>
          <h3 className="text-xl text-purple-pizzazz mb-2">Importing</h3>
          <ol className="list-decimal pl-6 space-y-1 mb-4">
            <li>Preload the sheet with <code>this.load.spritesheet</code> specifying frame width and height.</li>
            <li>In <em>create</em>, define an animation with <code>this.anims.create</code>.</li>
            <li>Play the animation on a sprite using <code>play</code>.</li>
          </ol>
          <h3 className="text-xl text-purple-pizzazz mb-2">Exporting</h3>
          <ol className="list-decimal pl-6 space-y-1 mb-4">
            <li>Use tools like <em>TexturePacker</em> or the Sprite Sheet Generator to build PNG sheets.</li>
            <li>Include the generated PNG and JSON in your game&apos;s assets folder.</li>
          </ol>
          <pre className="bg-rich-black-300 p-4 rounded text-sm overflow-x-auto mb-4">
{`// Phaser 3 example
function preload() {
  this.load.spritesheet('ball', 'bouncing-ball.png', { frameWidth: 32, frameHeight: 32 })
}
function create() {
  this.anims.create({ key: 'bounce', frames: this.anims.generateFrameNumbers('ball'), frameRate: 12, repeat: -1 })
  this.add.sprite(100, 100, 'ball').play('bounce')
}`}
          </pre>
          <p>
            <Link
              href="/sample-sprites/smiling-emoji.png"
              className="text-purple-pizzazz underline"
              download
            >
              Download smiling-emoji.png
            </Link>
          </p>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </div>
  )
}
