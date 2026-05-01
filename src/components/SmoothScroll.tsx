'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'

function buildSectionIds(trendCount: number) {
  const ids = ['welcome-letter', 'entry-stats', 'how-judged']
  if (trendCount > 0) ids.push('trends')
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

  // Enable scroll-snap on html when active (desktop only)
  useEffect(() => {
    if (!active) return
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    // Snap scrolling disabled for Anthem vertical scroll redesign
    // if (!isMobile) {
    //   document.documentElement.classList.add('snap-active')
    // }
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

    // Prevent scrolling past the trends section until goodbye is shown (desktop only)
    let goodbyeUnlocked = isMobile // always unlocked on mobile
    function clampScroll() {
      if (goodbyeUnlocked) return
      const trends = document.getElementById('trends')
      if (trends) {
        const maxScroll = trends.offsetTop
        if (window.scrollY > maxScroll + 10) {
          window.scrollTo(0, maxScroll)
        }
      }
    }
    function unlockGoodbye() {
      goodbyeUnlocked = true
    }
    if (!isMobile) {
      window.addEventListener('scroll', clampScroll)
    }
    window.addEventListener('trend-next-or-exit', unlockGoodbye)

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
      if (!isMobile) {
        window.removeEventListener('scroll', clampScroll)
      }
      window.removeEventListener('trend-next-or-exit', unlockGoodbye)
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

  return <>{children}</>
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
