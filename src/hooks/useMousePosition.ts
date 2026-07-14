'use client'

import { useState, useEffect, useRef } from 'react'

interface MousePosition {
  x: number
  y: number
  normalizedX: number // -1 to 1
  normalizedY: number // -1 to 1
}

export function useMousePosition() {
  const [pos, setPos] = useState<MousePosition>({
    x: 0, y: 0, normalizedX: 0, normalizedY: 0,
  })
  const frameRef = useRef<number>()

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(() => {
        setPos({
          x: e.clientX,
          y: e.clientY,
          normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
          normalizedY: -(e.clientY / window.innerHeight) * 2 + 1,
        })
      })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => {
      window.removeEventListener('mousemove', handleMouse)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return pos
}
