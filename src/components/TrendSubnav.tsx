'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Colors by slide index:
// 0=Welcome Letter, 1=By the Numbers, 2=How We Judge, 3=Quick Summary,
// 4=Trend1, 5=Trend2, 6=Trend3, 7=Trend4, 8=Trend5, 9=Trend6, 10=Trend7, 11=Thank You
const SLIDE_COLORS: Record<number, string> = {
  0: '#8B70D1',  // Welcome Letter — purple
  1: '#80D064',  // By the Numbers — green
  2: '#8B70D1',  // How We Judge — purple
  3: '#82D8EB',  // Quick Summary — blue
  4: '#8B70D1',  // Trend 1 — purple
  5: '#82D8EB',  // Trend 2 — blue
  6: '#FF7F63',  // Trend 3 — red/coral
  7: '#80D064',  // Trend 4 — green
  8: '#FFB763',  // Trend 5 — orange
  9: '#FF69B4',  // Trend 6 — pink
  10: '#FFD700', // Trend 7 — yellow
  11: '#8B70D1', // Thank You — purple
}

function getColor(index: number): string {
  return SLIDE_COLORS[index] || '#8B70D1'
}

interface TrendSubnavProps {
  titles: string[]
  activeTrend: number
  onNavigate: (index: number) => void
}

export function TrendSubnav({ titles, activeTrend, onNavigate }: TrendSubnavProps) {
  const activeTitle = titles[activeTrend] || ''
  const activeColor = getColor(activeTrend)
  const [hidden, setHidden] = useState(false)
  const lastScrollRef = useRef(0)

  // Hide on scroll down within slides, show on scroll up
  useEffect(() => {
    function handleScroll(e: Event) {
      const target = e.target as HTMLElement
      if (!target || (target as unknown) === document) return
      const scrollTop = target.scrollTop
      if (scrollTop > lastScrollRef.current + 5) {
        setHidden(true)
      } else if (scrollTop < lastScrollRef.current - 5) {
        setHidden(false)
      }
      lastScrollRef.current = scrollTop
    }
    // Listen on capture phase to catch scroll inside slide containers
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true })
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [])

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: hidden ? 60 : 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 55,
      }}
    >
      {/* Progress line */}
      <div style={{ position: 'relative', height: 2, background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          style={{ height: 2, background: activeColor }}
          animate={{ width: `${((activeTrend + 1) / titles.length) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>

      {/* Current section title */}
      <div
        style={{
          background: 'rgba(25, 25, 25, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '14px 0',
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 16px' }}>
          <motion.div
            key={`section-${activeTrend}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 16 }}
          >
            <span
              style={{
                fontSize: 10,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: activeColor,
                fontWeight: 500,
              }}
            >
              {activeTitle}
            </span>
            <span
              style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.3)',
                marginLeft: 'auto',
              }}
            >
              {activeTrend + 1} / {titles.length}
            </span>
            {activeTrend > 0 && (
              <button
                onClick={() => onNavigate(0)}
                className="no-custom-cursor"
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 4,
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: 9,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  marginLeft: 8,
                }}
              >
                Home
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
