import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'Sprite Sheet Generator - AI-Powered Animation Creator',
  description: 'Generate sprite sheets for CSS animations using AI. Create pixel art, neon outlines, and more with our easy-to-use tool.',
  keywords: 'sprite sheet, animation, CSS, AI, generator, pixel art, game development',
  openGraph: {
    title: 'Sprite Sheet Generator',
    description: 'AI-powered sprite sheet creation for animations',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.gif', type: 'image/gif' }
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.gif',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Analytics Scripts */}
        <script
          defer
          data-website-id="68b37286d0865aeb4b5644dd"
          data-domain="sprite-sheet-generator.com"
          src="https://datafa.st/js/script.js">
        </script>
      </head>
      <body className={`${inter.className} ${jetbrainsMono.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HPDL14R2NZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HPDL14R2NZ');
          `}
        </Script>
        
        <script src="/favicon-animate.js" defer />
      </body>
    </html>
  )
}