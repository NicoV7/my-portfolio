'use client'

import { useEffect, useRef } from 'react'

type AnimatedBackgroundProps = {
  variant?: 'particles' | 'geometric' | 'waves' | 'code'
  intensity?: 'subtle' | 'medium' | 'vibrant'
  className?: string
}

export default function AnimatedBackground({ 
  variant = 'particles', 
  intensity = 'subtle',
  className = ''
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<any[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Get current theme
    const getTheme = () => {
      if (document.documentElement.classList.contains('night')) return 'night'
      if (document.documentElement.classList.contains('dark')) return 'dark'
      return 'light'
    }

    // Theme-based colors
    const getColors = (theme: string) => {
      switch (theme) {
        case 'night':
          return {
            primary: 'rgba(249, 115, 22, 0.7)', // Orange - much more visible
            secondary: 'rgba(255, 255, 255, 0.3)', // White - much more visible
            accent: 'rgba(249, 115, 22, 0.9)', // Orange accent - very visible
            glow: 'rgba(249, 115, 22, 0.4)' // Orange glow
          }
        case 'dark':
          return {
            primary: 'rgba(59, 130, 246, 0.7)', // Blue - much more visible
            secondary: 'rgba(148, 163, 184, 0.3)', // Gray - much more visible
            accent: 'rgba(59, 130, 246, 0.9)', // Blue accent - very visible
            glow: 'rgba(59, 130, 246, 0.4)' // Blue glow
          }
        default: // light
          return {
            primary: 'rgba(59, 130, 246, 0.5)', // Blue - much more visible
            secondary: 'rgba(107, 114, 128, 0.3)', // Gray - much more visible
            accent: 'rgba(59, 130, 246, 0.7)', // Blue accent - very visible
            glow: 'rgba(59, 130, 246, 0.2)' // Blue glow
          }
      }
    }

    // Initialize particles based on variant
    const initializeAnimation = () => {
      const particleCount = intensity === 'vibrant' ? 120 : intensity === 'medium' ? 80 : 50
      particlesRef.current = []

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseSize: Math.random() * (intensity === 'vibrant' ? 8 : intensity === 'medium' ? 6 : 4) + 3,
          size: 0, // Will be calculated with pulsing
          speedX: (Math.random() - 0.5) * (intensity === 'vibrant' ? 3 : intensity === 'medium' ? 2 : 1),
          speedY: (Math.random() - 0.5) * (intensity === 'vibrant' ? 3 : intensity === 'medium' ? 2 : 1),
          opacity: Math.random() * 0.8 + 0.2,
          angle: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.04,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2,
          trail: [] // For trail effect
        })
      }
    }

    // Animation functions by variant
    const animateParticles = () => {
      const theme = getTheme()
      const colors = getColors(theme)
      const time = Date.now() * 0.001
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Update position with floating movement
        particle.x += particle.speedX + Math.sin(time + particle.pulseOffset) * 0.5
        particle.y += particle.speedY + Math.cos(time + particle.pulseOffset) * 0.5
        particle.angle += particle.rotationSpeed

        // Update pulsing size
        const pulse = Math.sin(time * particle.pulseSpeed + particle.pulseOffset) * 0.5 + 0.5
        particle.size = particle.baseSize * (0.7 + pulse * 0.6)

        // Wrap around edges with smooth transition
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size

        // Draw glow effect
        ctx.save()
        ctx.globalAlpha = particle.opacity * 0.3
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        )
        gradient.addColorStop(0, colors.glow)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Draw main particle
        ctx.save()
        ctx.globalAlpha = particle.opacity
        
        if (variant === 'geometric') {
          // Draw rotating squares with gradient
          ctx.translate(particle.x, particle.y)
          ctx.rotate(particle.angle)
          const gradient = ctx.createLinearGradient(-particle.size/2, -particle.size/2, particle.size/2, particle.size/2)
          gradient.addColorStop(0, colors.primary)
          gradient.addColorStop(1, colors.accent)
          ctx.fillStyle = gradient
          ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size)
          
          // Add stroke
          ctx.strokeStyle = colors.accent
          ctx.lineWidth = 1
          ctx.strokeRect(-particle.size/2, -particle.size/2, particle.size, particle.size)
        } else {
          // Draw circles with gradient
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
          )
          gradient.addColorStop(0, colors.accent)
          gradient.addColorStop(0.7, colors.primary)
          gradient.addColorStop(1, 'transparent')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()

          // Add stroke
          ctx.strokeStyle = colors.accent
          ctx.lineWidth = 1
          ctx.stroke()
        }
        ctx.restore()

        // Enhanced connections for particles variant
        if (variant === 'particles') {
          particlesRef.current.slice(index + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 150) {
              ctx.save()
              const connectionOpacity = (1 - distance / 150) * 0.6
              ctx.globalAlpha = connectionOpacity
              
              // Animated gradient line
              const gradient = ctx.createLinearGradient(particle.x, particle.y, otherParticle.x, otherParticle.y)
              gradient.addColorStop(0, colors.secondary)
              gradient.addColorStop(0.5, colors.accent)
              gradient.addColorStop(1, colors.secondary)
              
              ctx.strokeStyle = gradient
              ctx.lineWidth = 2
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.stroke()
              ctx.restore()
            }
          })
        }
      })
    }

    const animateWaves = () => {
      const theme = getTheme()
      const colors = getColors(theme)
      const time = Date.now() * 0.001

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw multiple wave layers
      for (let layer = 0; layer < 3; layer++) {
        ctx.save()
        ctx.globalAlpha = 0.1 - layer * 0.02
        ctx.fillStyle = colors.primary

        const waveHeight = 60 + layer * 20
        const frequency = 0.002 + layer * 0.001
        const speed = 0.5 + layer * 0.2

        ctx.beginPath()
        ctx.moveTo(0, canvas.height)

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height - waveHeight * Math.sin(x * frequency + time * speed) - waveHeight
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
    }

    const animateCode = () => {
      const theme = getTheme()
      const colors = getColors(theme)
      const time = Date.now() * 0.0005

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Binary rain effect
      const fontSize = 14
      const columns = Math.floor(canvas.width / fontSize)
      
      ctx.font = `${fontSize}px monospace`
      ctx.fillStyle = colors.primary

      for (let i = 0; i < columns; i++) {
        const char = Math.random() > 0.5 ? '1' : '0'
        const x = i * fontSize
        const y = (Math.sin(time + i * 0.1) * 100 + 100) % canvas.height
        
        ctx.save()
        ctx.globalAlpha = 0.1
        ctx.fillText(char, x, y)
        ctx.restore()
      }
    }

    // Main animation loop
    const animate = () => {
      switch (variant) {
        case 'waves':
          animateWaves()
          break
        case 'code':
          animateCode()
          break
        case 'geometric':
        case 'particles':
        default:
          animateParticles()
          break
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    // Initialize and start animation
    if (variant === 'particles' || variant === 'geometric') {
      initializeAnimation()
    }
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [variant, intensity])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ 
        background: 'transparent',
        zIndex: 1
      }}
    />
  )
}