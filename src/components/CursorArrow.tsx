'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'

function buildSectionIds(trendCount: number) {
  const ids = ['welcome-letter', 'entry-stats', 'how-judged']
  for (let i = 0; i < trendCount; i++) {
    ids.push(`trend-${i}`)
  }
  ids.push('thank-you')
  return ids
}

export function CursorArrow({ active, trendCount }: { active: boolean; trendCount: number }) {
  const sectionIds = useMemo(() => buildSectionIds(trendCount), [trendCount])
  const cursorRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [rotated, setRotated] = useState(false)
  const [inTrend, setInTrend] = useState(false)
  const [mouseOnLeft, setMouseOnLeft] = useState(false)
  const mouseXRef = useRef(0)

  // Trigger the initial rotation shortly after becoming active
  useEffect(() => {
    if (!active) {
      setRotated(false)
      return
    }
    const t = setTimeout(() => setRotated(true), 100)
    return () => clearTimeout(t)
  }, [active])

  // Direct follow — no lag
  useEffect(() => {
    if (!active) return

    function handleMove(e: MouseEvent) {
      mouseXRef.current = e.clientX
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
      // Track which side of screen the mouse is on
      setMouseOnLeft(e.clientX < window.innerWidth / 2)
    }

    document.addEventListener('mousemove', handleMove)
    return () => document.removeEventListener('mousemove', handleMove)
  }, [active])

  // Track if we're in a trend section
  useEffect(() => {
    if (!active) return

    function checkTrend() {
      const activeTrend = document.querySelector('[data-trend-active]')
      setInTrend(!!activeTrend)
    }

    // Check on scroll and on phase changes (mutation observer)
    window.addEventListener('scroll', checkTrend)
    const observer = new MutationObserver(checkTrend)
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['data-trend-active'] })

    return () => {
      window.removeEventListener('scroll', checkTrend)
      observer.disconnect()
    }
  }, [active])

  // Hide over interactive elements + reset rotation
  useEffect(() => {
    if (!active) return

    function handleMouseMove(e: MouseEvent) {
      const target = e.target as HTMLElement
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], .no-custom-cursor, .prose, [data-content]')
      const nowVisible = !isInteractive
      setVisible((prev) => {
        if (!prev && nowVisible) {
          setRotated(false)
          setTimeout(() => setRotated(true), 50)
        }
        return nowVisible
      })
    }

    function handleMouseLeave() {
      setVisible(false)
    }

    function handleMouseEnter() {
      setVisible(true)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [active])

  // Smooth scroll with custom duration
  const smoothScrollTo = useCallback((target: number, duration: number) => {
    const start = window.scrollY
    const distance = target - start
    const startTime = performance.now()

    function step(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      window.scrollTo(0, start + distance * ease)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [])

  // Click handler
  const handleClick = useCallback(() => {
    if (!visible) return

    const scrollY = window.scrollY

    // If in a trend section, advance or retreat based on mouse position
    const activeTrend = document.querySelector('[data-trend-active]')
    if (activeTrend) {
      if (mouseOnLeft) {
        window.dispatchEvent(new Event('trend-retreat'))
      } else {
        window.dispatchEvent(new Event('trend-advance'))
      }
      return
    }

    // Unlock scroll if it was locked by a trend section
    document.body.style.overflow = ''

    // Find the next section below current scroll position
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) {
        const top = el.getBoundingClientRect().top + scrollY
        if (top > scrollY + 50) {
          smoothScrollTo(top, 1440)
          return
        }
      }
    }
  }, [visible, smoothScrollTo, sectionIds, mouseOnLeft])

  useEffect(() => {
    if (!active) return
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [active, handleClick])

  if (!active) return null

  // Rotation logic:
  // - Not rotated yet: 0° (pointing right, initial state)
  // - Normal (not in trend): 90° (pointing down)
  // - In trend, mouse on right: 0° (pointing right = advance)
  // - In trend, mouse on left: 180° (pointing left = go back)
  let rotation = 0
  if (rotated) {
    if (inTrend) {
      const trendPhase = document.querySelector('[data-trend-phase]')?.getAttribute('data-trend-phase')
      rotation = (mouseOnLeft && trendPhase !== '0') ? 180 : 0
    } else {
      rotation = 90
    }
  }

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
    >
      <div
        style={{
          marginLeft: -60,
          marginTop: -60,
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
        >
          {/* Shaft — 130px */}
          <line
            x1="-30" y1="60" x2="100" y2="60"
            stroke="white"
            strokeWidth="1.5"
          />
          {/* Chevron — 65px arms */}
          <line
            x1="100" y1="60" x2="54" y2="14"
            stroke="white"
            strokeWidth="1.5"
          />
          <line
            x1="100" y1="60" x2="54" y2="106"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  )
}
