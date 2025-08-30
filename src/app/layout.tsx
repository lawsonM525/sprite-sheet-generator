import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HPDL14R2NZ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HPDL14R2NZ');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} ${jetbrainsMono.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <script src="/favicon-animate.js" defer />
      </body>
    </html>
  )
}