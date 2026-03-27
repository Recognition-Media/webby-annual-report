'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendSubnav } from './TrendSubnav'

export function TrendContainer({
  trendCount,
  trendTitles,
  children,
}: {
  trendCount: number
  trendTitles: string[]
  children: React.ReactNode
}) {
  const [activeTrend, setActiveTrend] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  // Track when container is in view
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Listen for trend-next/trend-prev events
  useEffect(() => {
    if (!isActive) return

    function handleNextTrend() {
      setActiveTrend((t) => Math.min(t + 1, trendCount - 1))
    }
    function handlePrevTrend() {
      setActiveTrend((t) => Math.max(t - 1, 0))
    }
    function handleNextOrExit() {
      setActiveTrend((t) => {
        if (t >= trendCount - 1) {
          // Last trend — exit to thank-you
          document.body.style.overflow = ''
          document.documentElement.classList.add('snap-active')
          const thankYou = document.getElementById('thank-you')
          if (thankYou) {
            thankYou.scrollIntoView({ behavior: 'smooth' })
          }
          return t
        }
        return t + 1
      })
    }

    window.addEventListener('trend-next', handleNextTrend)
    window.addEventListener('trend-prev', handlePrevTrend)
    window.addEventListener('trend-next-or-exit', handleNextOrExit)
    return () => {
      window.removeEventListener('trend-next', handleNextTrend)
      window.removeEventListener('trend-prev', handlePrevTrend)
      window.removeEventListener('trend-next-or-exit', handleNextOrExit)
    }
  }, [isActive, trendCount])

  function navigateToTrend(index: number) {
    window.dispatchEvent(new CustomEvent('trend-reset-phase', { detail: { index } }))
    setActiveTrend(index)
  }

  return (
    <section
      id="trends"
      data-active-trend={activeTrend}
      data-trend-count={trendCount}
      data-snap
      ref={containerRef}
      style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#191919',
      }}
    >
      <motion.div
        animate={{ x: `-${activeTrend * 100}vw` }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        style={{
          display: 'flex',
          height: '100%',
          width: `${trendCount * 100}vw`,
        }}
      >
        {children}
      </motion.div>

      {/* Subnav — only when trends are in view */}
      {isActive && (
        <TrendSubnav
          titles={trendTitles}
          activeTrend={activeTrend}
          onNavigate={navigateToTrend}
        />
      )}
    </section>
  )
}
