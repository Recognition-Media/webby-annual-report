'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'

function buildSectionIds(trendCount: number) {
  const ids = ['welcome-letter', 'entry-stats', 'how-judged']
  for (let i = 0; i < trendCount; i++) {
    ids.push(`trend-${i}`)
  }
  ids.push('thank-you')
  return ids
}

export function ReportScroll({
  active,
  trendCount,
  children,
}: {
  active: boolean
  trendCount: number
  children: React.ReactNode
}) {
  const sectionIds = useMemo(() => buildSectionIds(trendCount), [trendCount])
  const [activeIndex, setActiveIndex] = useState(0)
  const [dotsVisible, setDotsVisible] = useState(false)
  const [inTrend, setInTrend] = useState(false)

  // Enable scroll-snap on html when active
  useEffect(() => {
    if (!active) return
    document.documentElement.classList.add('snap-active')
    window.scrollTo(0, 0)

    // Track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionIds.indexOf(entry.target.id)
            if (idx !== -1) setActiveIndex(idx)
          }
        })
      },
      { threshold: 0.5 }
    )

    setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
      setDotsVisible(true)
    }, 400)

    // Track trend active state
    function checkTrend() {
      setInTrend(!!document.querySelector('[data-trend-active]'))
    }
    const mutObserver = new MutationObserver(checkTrend)
    mutObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['data-trend-active'] })

    return () => {
      document.documentElement.classList.remove('snap-active')
      observer.disconnect()
      mutObserver.disconnect()
    }
  }, [active, sectionIds])

  const scrollTo = useCallback((index: number) => {
    const el = document.getElementById(sectionIds[index])
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [sectionIds])

  // Keyboard navigation
  useEffect(() => {
    if (!active) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        const next = Math.min(activeIndex + 1, sectionIds.length - 1)
        scrollTo(next)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        const prev = Math.max(activeIndex - 1, 0)
        scrollTo(prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active, activeIndex, scrollTo, sectionIds])

  return (
    <>
      {children}
      {active && dotsVisible && !inTrend && (
        <NavDots
          sections={sectionIds}
          activeIndex={activeIndex}
          onNavigate={scrollTo}
        />
      )}
    </>
  )
}

function NavDots({
  sections,
  activeIndex,
  onNavigate,
}: {
  sections: string[]
  activeIndex: number
  onNavigate: (index: number) => void
}) {
  return (
    <nav
      aria-label="Section navigation"
      style={{
        position: 'fixed',
        right: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        animation: 'fadeIn 0.6s ease',
      }}
    >
      {sections.map((id, i) => (
        <button
          key={id}
          onClick={() => onNavigate(i)}
          aria-label={`Go to ${id.replace(/-/g, ' ')}`}
          style={{
            width: i === activeIndex ? 10 : 8,
            height: i === activeIndex ? 10 : 8,
            borderRadius: '50%',
            border: 'none',
            background: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            padding: 0,
          }}
        />
      ))}
    </nav>
  )
}
