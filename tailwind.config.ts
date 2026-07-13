import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cosmic: {
          50: '#f0f0ff',
          100: '#d5d0ff',
          200: '#b3a8ff',
          300: '#8a78ff',
          400: '#6d4aff',
          500: '#5b21f6',
          600: '#4c1d95',
          700: '#3b0f6e',
          800: '#2a0a4f',
          900: '#1a0633',
          950: '#0f0220',
        },
        neon: {
          cyan: '#00f0ff',
          green: '#00ff88',
          pink: '#ff2d95',
          purple: '#a855f7',
          amber: '#f59e0b',
        },
        surface: {
          dark: '#050510',
          card: '#0a0a1a',
          elevated: '#12122a',
          border: '#1a1a3e',
          'border-light': '#2a2a5e',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'data-flow': 'data-flow 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'data-flow': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(90, 33, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(90, 33, 246, 0.03) 1px, transparent 1px)',
        'radial-gradient': 'radial-gradient(circle at 50% 50%, rgba(90, 33, 246, 0.1), transparent 70%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}

export default config
