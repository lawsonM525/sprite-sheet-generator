'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { useState } from 'react'

export default function PricingPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out sprite sheet generation',
      features: [
        '3 generations per week',
        'All art styles',
        'Basic grid sizes (2x2, 3x3)',
        'Basic download formats',
        'Community support'
      ],
      limitations: [
        'No 4x4 or 5x5 grids',
        'No custom grid sizes',
        'Limited generations',
        'No priority support'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: 'Pro',
      price: '$4.99',
      period: 'per month',
      description: 'Great for regular creators and small projects',
      features: [
        '30 generations per month',
        'All art styles',
        'All grid sizes (2x2, 3x3, 4x4, 5x5)',
        'High-quality downloads',
        'Priority email support',
        'Background removal',
        'CSS animation export'
      ],
      limitations: [
        'No custom grid sizes'
      ],
      buttonText: 'Start Pro Trial',
      buttonVariant: 'default' as const,
      popular: true
    },
    {
      name: 'Premium',
      price: '$14.99',
      period: 'per month',
      description: 'Unlimited power for professional game developers',
      features: [
        'Unlimited generations',
        'All art styles',
        'All grid sizes (2x2, 3x3, 4x4, 5x5)',
        'Custom grid sizes (any layout)',
        'Bulk generation',
        'Premium download formats',
        'Priority support & Discord access',
        'Background removal',
        'Advanced CSS/JS export',
        'API access (coming soon)'
      ],
      limitations: [],
      buttonText: 'Go Premium',
      buttonVariant: 'default' as const,
      popular: false
    }
    ]

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: plans.map((plan, index) => ({
      '@type': 'Product',
      name: `${plan.name} Plan`,
      description: plan.description,
      offers: {
        '@type': 'Offer',
        price: plan.price.replace('$', ''),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      position: index + 1
    }))
  }

  return (
    <div className="min-h-screen bg-rich-black">
      <Script
        id="pricing-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
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
            How to use sprite sheets
          </Link>
          <span className="text-citron-500">Pricing</span>
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
                How to use sprite sheets
              </Link>
              <span className="text-citron-500">Pricing</span>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="text-center py-12 sm:py-16 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-mimi-pink-500 mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg sm:text-xl text-citron-600 max-w-3xl mx-auto leading-relaxed px-4">
          Choose the perfect plan for your sprite sheet needs. Start free and upgrade as you grow.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative bg-rich-black-200 border-rich-black-400 shadow-2xl ${
                plan.popular ? 'border-purple-pizzazz border-2 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-pizzazz text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center p-6 sm:p-8">
                <CardTitle className="text-2xl text-mimi-pink-500 mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-citron-400">{plan.price}</span>
                  <span className="text-citron-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-citron-500 text-sm">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="p-6 sm:p-8 pt-0">
                <div className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-semibold text-purple-pizzazz mb-3">What&apos;s included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-citron-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-400 mb-3">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-citron-600 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {plan.name === 'Pro' ? (
                    <a href="https://buy.stripe.com/test_00wcN69JC7Ik7Xe8Gjawo00" target="_blank" rel="noopener noreferrer">
                      <Button 
                        variant={plan.buttonVariant}
                        className={`w-full ${
                          plan.buttonVariant === 'default' 
                            ? 'bg-purple-pizzazz hover:bg-purple-pizzazz/90 text-white' 
                            : 'border-purple-pizzazz text-purple-pizzazz hover:bg-purple-pizzazz hover:text-white'
                        }`}
                        size="lg"
                      >
                        {plan.buttonText}
                      </Button>
                    </a>
                  ) : plan.name === 'Premium' ? (
                    <a href="https://buy.stripe.com/test_6oUaEYg80aUwfpG6ybawo01" target="_blank" rel="noopener noreferrer">
                      <Button 
                        variant={plan.buttonVariant}
                        className={`w-full ${
                          plan.buttonVariant === 'default' 
                            ? 'bg-purple-pizzazz hover:bg-purple-pizzazz/90 text-white' 
                            : 'border-purple-pizzazz text-purple-pizzazz hover:bg-purple-pizzazz hover:text-white'
                        }`}
                        size="lg"
                      >
                        {plan.buttonText}
                      </Button>
                    </a>
                  ) : (
                    <Button 
                      variant={plan.buttonVariant}
                      className={`w-full ${
                        plan.buttonVariant === 'default' 
                          ? 'bg-purple-pizzazz hover:bg-purple-pizzazz/90 text-white' 
                          : 'border-purple-pizzazz text-purple-pizzazz hover:bg-purple-pizzazz hover:text-white'
                      }`}
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-mimi-pink-500 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid gap-6">
            <Card className="bg-rich-black-200 border-rich-black-400">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-purple-pizzazz mb-2">
                  What counts as a generation?
                </h3>
                <p className="text-citron-600">
                  Each time you click &quot;Generate Sprite Sheet&quot; and create a new sprite sheet, that counts as one generation. 
                  You can download the same sprite sheet multiple times without using additional generations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-rich-black-200 border-rich-black-400">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-purple-pizzazz mb-2">
                  What are custom grid sizes?
                </h3>
                <p className="text-citron-600">
                  Premium users can create sprite sheets with any grid layout (like 6x2, 8x3, or 10x1) instead of being 
                  limited to square grids. This is perfect for specific animation sequences or game engine requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-rich-black-200 border-rich-black-400">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-purple-pizzazz mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-citron-600">
                  Yes! You can cancel your subscription at any time. You&apos;ll continue to have access to your plan 
                  features until the end of your current billing period.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-rich-black-200 border-rich-black-400">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-purple-pizzazz mb-2">
                  Do unused generations roll over?
                </h3>
                <p className="text-citron-600">
                  Free plan generations reset weekly, and Pro plan generations reset monthly. 
                  Unused generations don&apos;t carry over to the next period.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-rich-black-200 border-rich-black-400 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-mimi-pink-500 mb-4">
                Ready to Create Amazing Sprite Sheets?
              </h3>
              <p className="text-citron-600 mb-6">
                Start with our free plan and see how easy it is to generate professional sprite sheets with AI.
              </p>
              <Link href="/">
                <Button size="lg" className="bg-purple-pizzazz hover:bg-purple-pizzazz/90 text-white font-semibold px-8 py-3 text-lg">
                  Start Creating Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
