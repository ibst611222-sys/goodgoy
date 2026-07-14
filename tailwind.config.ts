import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm, sophisticated palette — no purple, no cyan
        clay: {
          50: '#f7f2ea',
          100: '#e8dcc8',
          200: '#d4c0a0',
          300: '#c0a478',
          400: '#b08c54',
          500: '#a0743a',
          600: '#7a5a2e',
          700: '#5a4022',
          800: '#3a2816',
          900: '#1e140a',
          950: '#0f0a05',
        },
        // Accent colors — warm, earthy
        gesso: {
          gold: '#c8a45c',
          sage: '#7c9f6e',
          rose: '#d4586e',
          taupe: '#8a7a66',
          amber: '#e8b84b',
        },
        surface: {
          dark: '#0d0c0a',
          card: '#161412',
          elevated: '#1e1b18',
          border: '#2a2622',
          'border-light': '#3a3530',
        },
        // Legacy aliases — keep old class names working, now warm
        cosmic: {
          50: '#f7f2ea',
          100: '#e8dcc8',
          200: '#d4c0a0',
          300: '#c0a478',
          400: '#b08c54',
          500: '#a0743a',
          600: '#7a5a2e',
          700: '#5a4022',
          800: '#3a2816',
          900: '#1e140a',
          950: '#0f0a05',
        },
        neon: {
          cyan: '#c8a45c',
          green: '#7c9f6e',
          pink: '#d4586e',
          purple: '#8a7a66',
          amber: '#e8b84b',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'SF Mono', 'monospace'],
        display: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'data-flow': 'data-flow 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'data-flow': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(200, 164, 92, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 164, 92, 0.03) 1px, transparent 1px)',
        'warm-glow': 'radial-gradient(ellipse at 50% 0%, rgba(200, 164, 92, 0.08), transparent 60%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}

export default config
