'use client'

import { useEffect, useRef } from 'react'

// Slow, thin horizontal lines that undulate like an analog signal's
// horizontal hold drifting. Drawn on a canvas sized to its container;
// honors prefers-reduced-motion by rendering one still frame.
export function SignalWaves({
  opacity = 0.2,
  color = '#000000',
  spacing = 14,
  amplitude = 6,
}: {
  opacity?: number
  color?: string
  spacing?: number
  amplitude?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h)
      ctx!.strokeStyle = color
      ctx!.lineWidth = 1
      const step = 6
      for (let y = spacing / 2, row = 0; y < h + amplitude; y += spacing, row++) {
        const phase = row * 0.7
        const k = 0.012 + (row % 3) * 0.002
        ctx!.beginPath()
        for (let x = 0; x <= w + step; x += step) {
          const yy = y + Math.sin(x * k + t * 0.0006 + phase) * amplitude + Math.sin(x * 0.03 - t * 0.0003 + phase) * (amplitude * 0.25)
          if (x === 0) ctx!.moveTo(x, yy)
          else ctx!.lineTo(x, yy)
        }
        ctx!.stroke()
      }
    }

    resize()
    draw(0)

    const ro = new ResizeObserver(() => {
      resize()
      draw(performance.now())
    })
    ro.observe(canvas)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return () => ro.disconnect()

    let raf = 0
    const loop = (t: number) => {
      draw(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [color, spacing, amplitude])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity }}
    />
  )
}
