'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.5,
  className = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const startTime = useRef(Date.now())
  const frameRef = useRef<number>()

  useEffect(() => {
    startTime.current = Date.now()
    const from = 0
    const range = value - from

    function animate() {
      const elapsed = Date.now() - startTime.current
      const progress = Math.min(elapsed / (duration * 1000), 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(from + range * eased)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [value, duration])

  const formatted = displayValue.toFixed(decimals)

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{formatted}{suffix}
    </motion.span>
  )
}
