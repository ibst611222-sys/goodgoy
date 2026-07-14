'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(1, 1)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Create multiple abstract shapes
    const shapes: THREE.Mesh[] = []
    const geometries = [
      new THREE.IcosahedronGeometry(0.3, 0),
      new THREE.OctahedronGeometry(0.25, 0),
      new THREE.TorusGeometry(0.2, 0.08, 8, 12),
      new THREE.TetrahedronGeometry(0.2, 0),
    ]

    const COLORS = ['#c8a45c', '#e8b84b', '#7c9f6e', '#8a7a66']
    const POSITIONS = [
      { x: -0.6, y: 0.3, z: -0.5 },
      { x: 0.5, y: -0.2, z: -0.8 },
      { x: 0.7, y: 0.4, z: -0.3 },
      { x: -0.3, y: -0.4, z: -0.6 },
      { x: 0.0, y: 0.5, z: -0.9 },
    ]

    POSITIONS.forEach((pos, i) => {
      const geo = geometries[i % geometries.length]
      const mat = new THREE.MeshPhongMaterial({
        color: COLORS[i % COLORS.length],
        transparent: true,
        opacity: 0.08 + Math.random() * 0.07,
        wireframe: true,
        emissive: COLORS[i % COLORS.length],
        emissiveIntensity: 0.1,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(pos.x, pos.y, pos.z)
      mesh.scale.setScalar(1 + Math.random() * 0.5)
      scene.add(mesh)
      shapes.push(mesh)
    })

    // Ambient light
    const ambient = new THREE.AmbientLight(0xffeedd, 0.5)
    scene.add(ambient)

    // Slow rotation
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.003
      shapes.forEach((shape, i) => {
        shape.rotation.x += 0.002 * (i % 2 === 0 ? 1 : -1)
        shape.rotation.y += 0.003 * (i % 3 === 0 ? 1 : -1)
        shape.position.y += Math.sin(time + i) * 0.0005
      })
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const updateSize = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const w = rect.width || 1
      const h = rect.height || 1
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    updateSize()

    const resizeObserver = new ResizeObserver(updateSize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    camera.position.z = 1.2

    return () => {
      resizeObserver.disconnect()
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
      shapes.forEach(s => {
        s.geometry.dispose()
        ;(s.material as THREE.Material).dispose()
      })
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] opacity-60"
    />
  )
}
