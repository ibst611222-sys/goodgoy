'use client'

import { useEffect, useRef } from 'react'

interface ParticleFieldProps {
  volatility?: number // 0-1, affects particle speed and chaos
  density?: number
  color?: string
}

export function ParticleField({ volatility = 0.3, density = 100, color = '#c8a45c' }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: {
      x: number; y: number; vx: number; vy: number
      size: number; alpha: number; life: number; maxLife: number
    }[] = []

    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        life: 0,
        maxLife: Math.random() * 300 + 200,
      })
    }

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const speed = 0.3 + volatility * 1.2

      particles.forEach((p) => {
        p.x += p.vx * speed
        p.y += p.vy * speed
        p.life++

        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height || p.life > p.maxLife) {
          p.x = Math.random() * canvas.width
          p.y = Math.random() * canvas.height
          p.vx = (Math.random() - 0.5) * 0.3
          p.vy = (Math.random() - 0.5) * 0.3
          p.life = 0
          p.maxLife = Math.random() * 300 + 200
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = p.alpha * (1 - p.life / p.maxLife)
        ctx.fill()
      })

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = color
            ctx.globalAlpha = (1 - dist / 120) * 0.08 * (1 + volatility)
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [volatility, density, color])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
