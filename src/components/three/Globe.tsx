'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function Globe() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Globe
    const geometry = new THREE.SphereGeometry(2.5, 64, 64)
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color('#1e1b18'),
      emissive: new THREE.Color('#3a2816'),
      emissiveIntensity: 0.2,
      wireframe: false,
      transparent: true,
      opacity: 0.9,
    })
    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)

    // Glow
    const glowGeometry = new THREE.SphereGeometry(2.6, 64, 64)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#c8a45c'),
      transparent: true,
      opacity: 0.08,
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(glow)

    // Grid lines
    const gridMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color('#c8a45c'),
      transparent: true,
      opacity: 0.1,
    })
    for (let i = 0; i <= 12; i++) {
      const lat = (i / 12) * Math.PI
      const points: THREE.Vector3[] = []
      for (let j = 0; j <= 64; j++) {
        const lng = (j / 64) * Math.PI * 2
        const x = 2.51 * Math.sin(lat) * Math.cos(lng)
        const y = 2.51 * Math.cos(lat)
        const z = 2.51 * Math.sin(lat) * Math.sin(lng)
        points.push(new THREE.Vector3(x, y, z))
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(lineGeo, gridMaterial)
      globe.add(line)
    }

    // Market markers (dots on globe)
    const markerPositions = [
      { lat: 0.71, lng: -1.28 }, // NYSE
      { lat: 0.52, lng: -0.12 }, // LSE
      { lat: 0.61, lng: 2.04 },  // HKEX
      { lat: 0.64, lng: 1.40 },  // TSE
      { lat: 0.48, lng: 1.25 },  // Frankfurt
      { lat: 0.75, lng: 0.77 },  // Moscow
      { lat: 0.35, lng: 1.95 },  // Shanghai
      { lat: 0.62, lng: 1.03 },  // Singapore
      { lat: 0.45, lng: -0.65 }, // Madrid
      { lat: 0.55, lng: 0.18 },  // Paris
    ]

    markerPositions.forEach((pos) => {
      const dotGeo = new THREE.SphereGeometry(0.04, 8, 8)
      const dotMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#c8a45c'),
      })
      const dot = new THREE.Mesh(dotGeo, dotMat)
      const x = 2.55 * Math.sin(pos.lat) * Math.cos(pos.lng)
      const y = 2.55 * Math.cos(pos.lat)
      const z = 2.55 * Math.sin(pos.lat) * Math.sin(pos.lng)
      dot.position.set(x, y, z)
      globe.add(dot)
    })

    // Lights
    const ambientLight = new THREE.AmbientLight(0x403830)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffdd99, 0.8)
    dirLight.position.set(5, 3, 5)
    scene.add(dirLight)
    const dirLight2 = new THREE.DirectionalLight(0xc8a45c, 0.2)
    dirLight2.position.set(-3, -1, -5)
    scene.add(dirLight2)

    // Particles (stars)
    const particleCount = 2000
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 8 + Math.random() * 15
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      sizes[i] = 0.02 + Math.random() * 0.05
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    const particleMat = new THREE.PointsMaterial({
      color: 0xc8a45c,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Connection lines
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color('#c8a45c'),
      transparent: true,
      opacity: 0.06,
    })
    for (let i = 0; i < 20; i++) {
      const idx1 = Math.floor(Math.random() * markerPositions.length)
      const idx2 = Math.floor(Math.random() * markerPositions.length)
      if (idx1 === idx2) continue
      const p1 = markerPositions[idx1]
      const p2 = markerPositions[idx2]
      const pts: THREE.Vector3[] = []
      const steps = 30
      for (let j = 0; j <= steps; j++) {
        const t = j / steps
        const lat = p1.lat + (p2.lat - p1.lat) * t
        const lng = p1.lng + (p2.lng - p1.lng) * t
        const r = 2.55 + 0.3 * Math.sin(t * Math.PI)
        const x = r * Math.sin(lat) * Math.cos(lng)
        const y = r * Math.sin(lat) * Math.sin(lng)
        const z = r * Math.cos(lat)
        pts.push(new THREE.Vector3(x, y, z))
      }
      const lineGeo2 = new THREE.BufferGeometry().setFromPoints(pts)
      const line2 = new THREE.Line(lineGeo2, connectionMaterial)
      globe.add(line2)
    }

    camera.position.z = 6

    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      requestAnimationFrame(animate)
      globe.rotation.y += 0.0015
      globe.rotation.x += 0.0003
      particles.rotation.y += 0.0001

      // Subtle mouse parallax
      globe.rotation.y += (mouseX * 0.1 - globe.rotation.y) * 0.01
      globe.rotation.x += (mouseY * 0.05 - globe.rotation.x) * 0.01

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
    />
  )
}
