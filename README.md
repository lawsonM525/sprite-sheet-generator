# Sprite Sheet Generator

An AI-powered web application for generating sprite sheets for CSS animations. Create pixel art, neon outlines, and more with our easy-to-use tool.

## Features

- **AI-Powered Generation**: Uses OpenAI, Replicate, or Stability AI to generate consistent sprite frames
- **Multiple Styles**: Choose from pixel art, neon outline, cel-shaded, or vaporwave aesthetics
- **Frame Count Options**: Generate 4, 9, 16, or 25 frame animations
- **Real-time Preview**: Watch your animation play back with adjustable speed
- **Export Options**: Download sprite sheet PNG, individual frames, and JSON atlas
- **CSS Generation**: Get ready-to-use CSS animation code

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An API key from one of the supported AI providers:
  - OpenAI (DALL-E)
  - Replicate
  - Stability AI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sprite-sheet-generator.git
cd sprite-sheet-generator
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables example:
```bash
cp .env.local.example .env.local
```

4. Add your API key to `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter your AI API key
2. Choose a template or enter a custom concept
3. Select a style (pixel art, neon, etc.)
4. Choose frame count and canvas size
5. Click "Generate Sprite Sheet"
6. Preview the animation and adjust playback speed
7. Download the sprite sheet or copy the CSS code

## Templates

Pre-built animation templates include:
- Growing Star
- Blinking Eye
- Walking Cycle
- Flame
- Loading Spinner

## Development

### Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **AI Integration**: OpenAI SDK, custom provider abstraction
- **Image Processing**: Canvas API, Sharp

### Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/          # UI components (shadcn)
│   └── SpritePreview.tsx
├── lib/             # Utility functions
│   ├── utils.ts
│   └── sprite-generator.ts
└── types/           # TypeScript types
```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.