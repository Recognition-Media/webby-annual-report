'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'

function buildSectionIds(trendCount: number) {
  const ids = ['welcome-letter', 'entry-stats', 'how-judged']
  if (trendCount > 0) ids.push('trends')
  ids.push('thank-you')
  return ids
}

export function CursorArrow({ active, trendCount }: { active: boolean; trendCount: number }) {
  const sectionIds = useMemo(() => buildSectionIds(trendCount), [trendCount])
  const cursorRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
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
      if (!hasMoved) setHasMoved(true)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
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
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], .no-custom-cursor, .prose, [data-content], img, video, svg')
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

    // If in a trend section with active phases, advance/retreat phases
    const activeTrend = document.querySelector('[data-trend-active]')
    if (activeTrend) {
      const trendPhase = activeTrend.getAttribute('data-trend-phase')
      const isFirstTrend = activeTrend.getAttribute('data-trend-index') === '0'

      if (mouseOnLeft && trendPhase === '0' && isFirstTrend) {
        // Go back to judging page
        document.body.style.overflow = ''
        document.documentElement.classList.add('snap-active')
        const judging = document.getElementById('how-judged')
        if (judging) judging.scrollIntoView({ behavior: 'smooth' })
        return
      }

      if (mouseOnLeft) {
        window.dispatchEvent(new Event('trend-retreat'))
      } else {
        window.dispatchEvent(new Event('trend-advance'))
      }
      return
    }

    // If in the trends container (completed trend), move between trends or exit
    const trendsContainer = document.getElementById('trends')
    if (trendsContainer) {
      const rect = trendsContainer.getBoundingClientRect()
      if (rect.top <= 50 && rect.bottom >= window.innerHeight - 50) {
        if (mouseOnLeft) {
          window.dispatchEvent(new Event('trend-prev'))
        } else {
          // Try to go to next trend — if already on the last, exit to thank-you
          const result = new CustomEvent('trend-next-or-exit')
          window.dispatchEvent(result)
        }
        return
      }
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
      const trendEl = document.querySelector('[data-trend-active]')
      const trendPhase = trendEl?.getAttribute('data-trend-phase')
      const trendIndex = trendEl?.getAttribute('data-trend-index')
      if (mouseOnLeft && trendPhase === '0' && trendIndex === '0') {
        rotation = -90 // up arrow — back to judging
      } else if (mouseOnLeft) {
        rotation = 180 // left arrow — go back
      } else {
        rotation = 0 // right arrow — advance
      }
    } else {
      // Check if we're in the trends container (completed trend)
      const trendsContainer = document.getElementById('trends')
      const rect = trendsContainer?.getBoundingClientRect()
      if (rect && rect.top <= 50 && rect.bottom >= window.innerHeight - 50) {
        const activeTrendIdx = trendsContainer?.getAttribute('data-active-trend')
        const trendCountStr = trendsContainer?.getAttribute('data-trend-count')
        const isLastTrend = activeTrendIdx && trendCountStr && parseInt(activeTrendIdx) >= parseInt(trendCountStr) - 1
        if (isLastTrend && !mouseOnLeft) {
          rotation = 90 // down — exit to goodbye
        } else {
          rotation = mouseOnLeft ? 180 : 0
        }
      } else {
        rotation = 90
      }
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
        opacity: visible && hasMoved ? 1 : 0,
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
