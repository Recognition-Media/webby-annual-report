'use client'

import { useLayoutEffect, useRef, useState } from 'react'

// Keep this much clear of the viewport edge when nudging the popover
// back on screen, so it never sits flush against the window.
const VIEWPORT_MARGIN = 16

// Small "i" icon next to a list heading that reveals a longer note on
// hover (desktop) or tap (touch, where there's no hover) — a second,
// optional layer of context below the always-visible intro paragraph.
// Shared across every list layout (Poster Row, Ranked Thumbnail Row, …)
// so the icon and popover read identically wherever it's used.
export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const [shiftX, setShiftX] = useState(0)
  const popRef = useRef<HTMLDivElement>(null)

  // The popover hangs left-aligned off the icon at a fixed width, so an
  // icon far enough right pushes it past the window and its text gets
  // clipped. Measure once it's up and slide it back by exactly the
  // overflow — done in a layout effect so it never paints mid-flight.
  useLayoutEffect(() => {
    if (!open) {
      setShiftX(0)
      return
    }
    const el = popRef.current
    if (!el) return
    // Measure un-shifted, so repeated opens don't compound the offset.
    el.style.transform = 'none'
    const rect = el.getBoundingClientRect()
    const overflowRight = rect.right - (window.innerWidth - VIEWPORT_MARGIN)
    if (overflowRight <= 0) {
      setShiftX(0)
      return
    }
    // Never drag it so far that the left edge leaves the window instead.
    setShiftX(Math.min(overflowRight, Math.max(0, rect.left - VIEWPORT_MARGIN)))
  }, [open, text])

  return (
    <span
      className="relative inline-flex flex-shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="More info"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-150"
        style={{
          background: 'rgba(255,255,255,0.22)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: '#ffffff',
          fontSize: 13,
          fontWeight: 700,
          fontStyle: 'italic',
          fontFamily: 'Georgia, serif',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.32)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)' }}
      >
        i
      </button>
      {open && (
        <div
          ref={popRef}
          className="absolute z-20 top-full left-0 mt-2 p-5 rounded-xl text-[15px] md:text-[16px] leading-[1.6]"
          style={{
            width: 'min(90vw, 480px)',
            transform: shiftX ? `translateX(-${shiftX}px)` : undefined,
            background: '#1A1630',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(216,245,255,0.85)',
            fontFamily: "'Basetica', -apple-system, sans-serif",
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          }}
        >
          {text}
        </div>
      )}
    </span>
  )
}
