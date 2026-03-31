'use client'

import { motion } from 'framer-motion'

const SECTION_COLORS: Record<string, string> = {
  'Welcome Letter': '#8B70D1',
  'By the Numbers': '#80D064',
  'How We Judge': '#8B70D1',
  'Quick Summary': '#82D8EB',
  'Thank You': '#8B70D1',
}

const TREND_COLORS = [
  '#8B70D1', '#82D8EB', '#FF7F63', '#80D064', '#FFB763',
]

function getColor(title: string, index: number): string {
  return SECTION_COLORS[title] || TREND_COLORS[index % TREND_COLORS.length]
}

interface TrendSubnavProps {
  titles: string[]
  activeTrend: number
  onNavigate: (index: number) => void
}

export function TrendSubnav({ titles, activeTrend, onNavigate }: TrendSubnavProps) {
  const activeTitle = titles[activeTrend] || ''
  const activeColor = getColor(activeTitle, activeTrend)

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
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
