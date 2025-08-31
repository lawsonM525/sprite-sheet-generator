'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface NavigationProps {
  active?: 'home' | 'pricing' | 'how-to-use-sprite-sheets'
}

export function Navigation({ active }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/how-to-use-sprite-sheets', label: 'How to use sprite sheets', key: 'how-to-use-sprite-sheets' },
    { href: '/pricing', label: 'Pricing', key: 'pricing' }
  ]

  const renderLink = (link: {href: string; label: string; key: string}) => {
    if (link.key === active) {
      return (
        <span key={link.key} className="text-citron-500">
          {link.label}
        </span>
      )
    }
    return (
      <Link
        key={link.key}
        href={link.href}
        className="text-purple-pizzazz hover:text-citron-500 transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <nav className="relative flex justify-between items-center px-4 sm:px-6 py-4 border-b border-rich-black-300">
      <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
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
        {links.map(renderLink)}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="sm:hidden flex flex-col gap-1 p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <div
          className={`w-5 h-0.5 bg-purple-pizzazz transition-transform ${
            isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
          }`}
        />
        <div
          className={`w-5 h-0.5 bg-purple-pizzazz transition-opacity ${
            isMobileMenuOpen ? 'opacity-0' : ''
          }`}
        />
        <div
          className={`w-5 h-0.5 bg-purple-pizzazz transition-transform ${
            isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
          }`}
        />
      </button>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-rich-black-200 border-b border-rich-black-300 sm:hidden z-50">
          <div className="flex flex-col px-4 py-4 space-y-4">
            {links.map(renderLink)}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation
