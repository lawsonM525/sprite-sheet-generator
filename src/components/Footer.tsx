import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-rich-black-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Footer Links */}
        <div className="flex flex-wrap justify-center gap-6 text-purple-pizzazz mb-6">
          <Link
            href="/ai-sprite-generator"
            className="hover:text-citron-500 transition-colors"
          >
            AI Sprite Sheet Generation
          </Link>
          <Link
            href="/game-engine-sprite-sheets"
            className="hover:text-citron-500 transition-colors"
          >
            Sprite Sheets for Game Devs
          </Link>
          <Link
            href="/free-sprite-sheet-generator"
            className="hover:text-citron-500 transition-colors"
          >
            Free Sprite Sheet Generator
          </Link>
          <Link
            href="/how-to-use-sprite-sheets"
            className="hover:text-citron-500 transition-colors"
          >
            How to use sprite sheets
          </Link>
          <Link
            href="/pricing"
            className="hover:text-citron-500 transition-colors"
          >
            Pricing
          </Link>
        </div>

        {/* Feedback and Bug Report Links */}
        <div className="flex flex-wrap justify-center gap-6 text-citron-600 text-sm">
          <a
            href="https://lwsnlabs.featurebase.app/?b=68b4745211edb0628245f839"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-pizzazz transition-colors"
          >
            Feedback
          </a>
          <a
            href="https://lwsnlabs.featurebase.app/?b=68b4745211edb0628245f839"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-pizzazz transition-colors"
          >
            Report a Bug
          </a>
        </div>
      </div>
    </footer>
  )
}
