import type { Config } from 'tailwindcss'

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'rich-black': {
          DEFAULT: '#001514',
          100: '#000404',
          200: '#000808',
          300: '#000c0c',
          400: '#001010',
          500: '#001514',
          600: '#007670',
          700: '#00d8cd',
          800: '#3bfff5',
          900: '#9dfffa'
        },
        'citron': {
          DEFAULT: '#c2d076',
          100: '#2c3111',
          200: '#586121',
          300: '#849232',
          400: '#adc046',
          500: '#c2d076',
          600: '#cfda92',
          700: '#dbe3ad',
          800: '#e7ecc8',
          900: '#f3f6e4'
        },
        'mimi-pink': {
          DEFAULT: '#ffe1ea',
          100: '#60001d',
          200: '#c0003a',
          300: '#ff2163',
          400: '#ff81a6',
          500: '#ffe1ea',
          600: '#ffe7ee',
          700: '#ffedf2',
          800: '#fff3f6',
          900: '#fff9fb'
        },
        'violet': {
          DEFAULT: '#ffa0fd',
          100: '#530051',
          200: '#a500a2',
          300: '#f800f4',
          400: '#ff4bfc',
          500: '#ffa0fd',
          600: '#ffb1fe',
          700: '#ffc5fe',
          800: '#ffd8fe',
          900: '#ffecff'
        },
        'purple-pizzazz': {
          DEFAULT: '#e952de',
          100: '#380735',
          200: '#700f69',
          300: '#a8169e',
          400: '#e01dd3',
          500: '#e952de',
          600: '#ed76e5',
          700: '#f298ec',
          800: '#f6baf2',
          900: '#fbddf9'
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config