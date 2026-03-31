'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TREND_COLORS } from './TrendSection'

interface TrendSubnavProps {
  titles: string[]
  activeTrend: number
  onNavigate: (index: number) => void
}

export function TrendSubnav({ titles, activeTrend, onNavigate }: TrendSubnavProps) {
  const activeColor = TREND_COLORS[activeTrend % TREND_COLORS.length]
  const [expanded, setExpanded] = useState(false)
  const [hintVisible, setHintVisible] = useState(true)

  // Hide hint when user leaves the first trend page
  useEffect(() => {
    if (activeTrend !== 0) {
      setHintVisible(false)
    }
  }, [activeTrend])

  return (
    <>
      {/* Dark scrim behind subnav when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 54,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="no-custom-cursor"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 55,
        pointerEvents: 'auto',
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={() => { if ('ontouchstart' in window) setExpanded(!expanded) }}
    >
      {/* Hint text + chevron — fades away after a few seconds */}
      <AnimatePresence>
        {hintVisible && !expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              top: -41,
              left: 'calc(50% - 35px)',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 10,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 500,
              }}
            >
              Explore trends
            </span>
            <motion.svg
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <polyline
                points="2,4 7,9 12,4"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.5"
                fill="none"
              />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress line */}
      <div style={{ position: 'relative', height: 2, background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          style={{ height: 2, borderRadius: 0, background: activeColor }}
          animate={{ width: `${((activeTrend + 1) / titles.length) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>

      {/* Collapsed state — current trend */}
      <div
        style={{
          background: 'rgba(25, 25, 25, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '14px 0',
          cursor: 'pointer',
        }}
      >
        <AnimatePresence mode="wait">
          {!expanded && (
            <div className="max-w-[1000px] mx-auto px-4 md:px-0">
            <motion.div
              key={`collapsed-${activeTrend}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
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
                Trend {String(activeTrend + 1).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: '#fff',
                  fontWeight: 500,
                  letterSpacing: '-0.2px',
                }}
              >
                {titles[activeTrend]}
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
            </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Expanded state — all trends */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 1000, margin: '0 auto' }}>
                {titles.map((title, i) => {
                  const isActive = i === activeTrend
                  const itemColor = TREND_COLORS[i % TREND_COLORS.length]
                  const number = String(i + 1).padStart(2, '0')

                  return (
                    <motion.button
                      key={i}
                      onClick={() => {
                        onNavigate(i)
                        setExpanded(false)
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ background: `linear-gradient(to right, ${itemColor}45, transparent)` }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '12px 60px',
                        background: 'none',
                        border: 'none',
                        borderBottom: i < titles.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        borderRadius: 0,
                      }}
                    >
                      {/* Active indicator — fixed width container */}
                      <div style={{ width: 24, flexShrink: 0 }}>
                        <motion.div
                          animate={{
                            width: isActive ? 24 : 0,
                            opacity: isActive ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          style={{ height: 2, borderRadius: 0, background: itemColor }}
                        />
                      </div>

                      <span
                        style={{
                          fontSize: 10,
                          letterSpacing: 3,
                          textTransform: 'uppercase',
                          color: isActive ? itemColor : 'rgba(255,255,255,0.5)',
                          fontWeight: 500,
                          transition: 'color 0.3s ease',
                          flexShrink: 0,
                        }}
                      >
                        {number}
                      </span>

                      <span
                        style={{
                          fontSize: 14,
                          color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                          fontWeight: isActive ? 500 : 400,
                          letterSpacing: '-0.2px',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {title}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
    </>
  )
}
