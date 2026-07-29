'use client'

import { useEffect, useRef, useState } from 'react'

// Nordic flag ribbon — five stripes staggered horizontally to form
// an abstract, flag-inspired band. Each stripe grows from its origin
// edge on scroll-in via a native CSS transition. An
// IntersectionObserver on the wrapper flips a class that swaps the
// initial scaleX(0) for scaleX(1). Widths are tuned to mirror across
// the ribbon: yellow ↔ white, Swedish blue ↔ red.
//
// Ribbon spans edge-to-edge via negative horizontal margins that
// counter the parent section's horizontal padding. When embedding in
// a section with different padding, pass matching negative-margin
// tailwind classes via the `edgeClassName` prop.
export function NordicsFlagStripes({
  position,
  edgeClassName = '-mx-5 md:-mx-[60px]',
}: {
  position: 'top' | 'bottom'
  edgeClassName?: string
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = wrapperRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const stripes = [
    { color: '#C71539', startPct: 0,  endPct: 55,  origin: 'left'  as const },
    { color: '#FFFFFF', startPct: 12, endPct: 65,  origin: 'left'  as const },
    { color: '#00205B', startPct: 22, endPct: 72,  origin: 'left'  as const },
    { color: '#FCD335', startPct: 42, endPct: 95,  origin: 'right' as const },
    { color: '#006AA7', startPct: 45, endPct: 100, origin: 'right' as const },
  ]
  const STRIPE_HEIGHT = 14
  const STRIPE_GAP = 0
  const totalHeight = stripes.length * STRIPE_HEIGHT + (stripes.length - 1) * STRIPE_GAP
  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className={edgeClassName}
      style={{
        position: 'relative',
        height: totalHeight,
        marginTop: position === 'bottom' ? 32 : 0,
        marginBottom: position === 'top' ? 48 : 0,
      }}
    >
      {stripes.map((s, i) => {
        const rightOffset = 100 - s.endPct
        const anchorStyle =
          s.origin === 'left'
            ? { left: `${s.startPct}%` }
            : { right: rightOffset === 0 ? 0 : `${rightOffset}%` }
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: i * (STRIPE_HEIGHT + STRIPE_GAP),
              ...anchorStyle,
              width: `${s.endPct - s.startPct}%`,
              height: STRIPE_HEIGHT,
              background: s.color,
              transformOrigin: s.origin === 'left' ? '0% 50%' : '100% 50%',
              transform: inView ? 'scaleX(1)' : 'scaleX(0)',
              transition: `transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) ${0.15 * i}s`,
            }}
          />
        )
      })}
    </div>
  )
}
