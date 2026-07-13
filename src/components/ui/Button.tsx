'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function Button({ children, variant = 'primary', size = 'md', onClick, className, disabled }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cosmic-500/50 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-cosmic-600 hover:bg-cosmic-500 text-white shadow-lg shadow-cosmic-500/20 hover:shadow-cosmic-500/30',
    secondary: 'glass hover:bg-surface-elevated text-white/80 hover:text-white',
    ghost: 'text-white/50 hover:text-white hover:bg-white/5',
    danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </motion.button>
  )
}
