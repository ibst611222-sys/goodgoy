'use client'

import { useEffect, useRef } from 'react'

export function EnhancedParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let mouse = { x: 0, y: 0 }
    const handleMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
      mouseRef.current = mouse
    }
    window.addEventListener('mousemove', handleMouse)

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles with different sizes and colors
    const COLORS = ['#c8a45c', '#e8b84b', '#7c9f6e', '#8a7a66']
    const particles: {
      x: number; y: number; vx: number; vy: number
      size: number; alpha: number; color: string
      life: number; maxLife: number
      orbitX: number; orbitY: number; orbitSpeed: number
    }[] = []

    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.cos(angle) * (0.1 + Math.random() * 0.2),
        vy: Math.sin(angle) * (0.1 + Math.random() * 0.2),
        size: Math.random() * 3 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: Math.random() * 200,
        maxLife: Math.random() * 400 + 200,
        orbitX: (Math.random() - 0.5) * canvas.width * 0.3,
        orbitY: (Math.random() - 0.5) * canvas.height * 0.3,
        orbitSpeed: 0.001 + Math.random() * 0.003,
      })
    }

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Mouse influence
      const mx = (mouse.x * 0.5 + 0.5) * canvas.width
      const my = (-mouse.y * 0.5 + 0.5) * canvas.height

      // Update and draw particles
      particles.forEach((p) => {
        p.life++

        // Orbit around mouse
        const angle = p.life * p.orbitSpeed
        const targetX = mx + p.orbitX * Math.cos(angle)
        const targetY = my + p.orbitY * Math.sin(angle)

        p.x += (targetX - p.x) * 0.01 + p.vx
        p.y += (targetY - p.y) * 0.01 + p.vy
        p.vx *= 0.99
        p.vy *= 0.99

        // Fade in/out
        const fadeIn = Math.min(p.life / 50, 1)
        const fadeOut = Math.max(1 - (p.life - p.maxLife + 100) / 100, 0)
        const alpha = p.alpha * fadeIn * fadeOut

        if (p.life > p.maxLife) {
          p.life = 0
          p.maxLife = Math.random() * 400 + 200
          p.orbitX = (Math.random() - 0.5) * canvas.width * 0.3
          p.orbitY = (Math.random() - 0.5) * canvas.height * 0.3
        }

        // Glow
        if (p.size > 1.5) {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
          gradient.addColorStop(0, p.color + '44')
          gradient.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        }

        // Particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha
        ctx.fill()
      })

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            const alpha = (1 - dist / 150) * 0.06
            ctx.strokeStyle = `rgba(200, 164, 92, ${alpha})`
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
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
