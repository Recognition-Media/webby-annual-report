'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendSubnav } from './TrendSubnav'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') return window.matchMedia('(max-width: 768px)').matches
    return false
  })
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    if (mq.matches) {
      document.body.style.overflow = ''
      document.documentElement.classList.remove('snap-active')
    }
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

export function TrendContainer({
  trendCount,
  trendTitles,
  children,
}: {
  trendCount: number
  trendTitles: string[]
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const [activeTrend, setActiveTrend] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  // On desktop, container is always the full viewport — activate immediately
  // On mobile, not used (vertical layout)
  useEffect(() => {
    if (!isMobile) setIsActive(true)
  }, [isMobile])

  // Remove snap scroll on desktop — everything is horizontal
  useEffect(() => {
    if (isMobile) return
    if (!isActive) return
    document.documentElement.classList.remove('snap-active')
  }, [isMobile, isActive])

  // Listen for trend-next/trend-prev events (desktop only)
  useEffect(() => {
    if (!isActive || isMobile) return

    function handleNextTrend() {
      setActiveTrend((t) => Math.min(t + 1, trendCount - 1))
    }
    function handlePrevTrend() {
      setActiveTrend((t) => Math.max(t - 1, 0))
    }
    function handleNextOrExit() {
      setActiveTrend((t) => Math.min(t + 1, trendCount - 1))
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
    // Reset ALL trends, not just the target
    window.dispatchEvent(new CustomEvent('trend-reset-phase', { detail: { all: true } }))
    setActiveTrend(index)
  }

  if (isMobile) {
    return (
      <section
        id="trends-mobile"
        ref={containerRef}
        style={{ background: '#191919' }}
      >
        {children}
      </section>
    )
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
        paddingBottom: 50,
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
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

      {/* Subnav — all pages */}
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
