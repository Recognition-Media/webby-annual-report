'use client'

import { useEffect, useState } from 'react'

export type Tone = 'light' | 'dark'

/**
 * Compute the average perceived luminance of an image and return whether
 * text on top of it should be `light` (white) or `dark` (#1A1A1A).
 *
 * Strategy: load the image into a hidden canvas at a small thumbnail size
 * (50×50) — that's enough resolution for an "average brightness" read and
 * is ~100x faster than reading every pixel of a full-resolution photo.
 *
 * Returns 'dark' (light text on top) as the safe default while loading or
 * if the calc fails (CORS, decode error, etc.).
 *
 * Threshold per Steve's spec: brightness < 128 → text-light, otherwise dark.
 */
export function useImageBrightness(src: string | undefined | null): Tone {
  const [tone, setTone] = useState<Tone>('dark')

  useEffect(() => {
    if (!src || typeof window === 'undefined') return
    let cancelled = false

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      if (cancelled) return
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 50
        canvas.height = 50
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0, 50, 50)
        const { data } = ctx.getImageData(0, 0, 50, 50)
        let total = 0
        let count = 0
        for (let i = 0; i < data.length; i += 4) {
          // ITU-R BT.709 perceived luminance weights
          total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
          count++
        }
        const avg = total / count
        if (!cancelled) setTone(avg < 128 ? 'light' : 'dark')
      } catch {
        // CORS or decode error — fall back to light text (safer over
        // unknown photo content) and let the next image try again.
        if (!cancelled) setTone('light')
      }
    }

    img.onerror = () => {
      if (!cancelled) setTone('light')
    }

    img.src = src

    return () => {
      cancelled = true
    }
  }, [src])

  return tone
}
