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
  metadataBase: new URL('https://sprite-sheet-generator.com'),
  alternates: {
    canonical: '/',
  },
  title: 'Sprite Sheet Generator - AI-Powered Animation Creator',
  description: 'Generate sprite sheets for CSS animations using AI. Create pixel art, neon outlines, and more with our easy-to-use tool.',
  keywords: 'sprite sheet, animation, CSS, AI, generator, pixel art, game development',
  openGraph: {
    title: 'Sprite Sheet Generator',
    description: 'AI-powered sprite sheet creation for animations',
    type: 'website',
    images: [
      {
        url: '/open-graph-img.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sprite Sheet Generator - AI-Powered Animation Creator',
    description: 'Generate sprite sheets for CSS animations using AI. Create pixel art, neon outlines, and more with our easy-to-use tool.',
    images: ['/open-graph-img.png'],
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
        {/* DataFast queue to ensure early events are captured */}
        <Script id="datafast-queue" strategy="beforeInteractive">
          {`
            window.datafast = window.datafast || function() {
              window.datafast.q = window.datafast.q || [];
              window.datafast.q.push(arguments);
            };
          `}
        </Script>
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