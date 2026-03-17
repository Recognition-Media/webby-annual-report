'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

export function TrendContainer({
  trendCount,
  children,
}: {
  trendCount: number
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

  // Listen for trend completion — move to next trend horizontally
  useEffect(() => {
    if (!isActive) return

    function handleNextTrend() {
      setActiveTrend((t) => Math.min(t + 1, trendCount - 1))
    }
    function handlePrevTrend() {
      setActiveTrend((t) => Math.max(t - 1, 0))
    }

    window.addEventListener('trend-next', handleNextTrend)
    window.addEventListener('trend-prev', handlePrevTrend)
    return () => {
      window.removeEventListener('trend-next', handleNextTrend)
      window.removeEventListener('trend-prev', handlePrevTrend)
    }
  }, [isActive, trendCount])

  return (
    <section
      id="trends"
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
    </section>
  )
}
