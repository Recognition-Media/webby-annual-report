'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface PairedBarData {
  label: string
  shortLabel: string
  value2025: number | null
  value2026: number
  change?: string
}

interface PairedBarChartProps {
  title?: string
  question?: string
  data: PairedBarData[]
  accentColor?: string
}

export function PairedBarChart({
  title = '',
  question,
  data,
  accentColor = '#D17DD0',
}: PairedBarChartProps) {
  const maxVal = Math.max(...data.map(d => Math.max(d.value2025 || 0, d.value2026)))
  const barHeight = (val: number) => (val / maxVal) * 360
  const chartRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(chartRef, { once: true, amount: 0.3 })

  return (
    <div ref={chartRef}>
      {title && (
        <h4
          className="leading-[1.3] mb-2"
          style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 400 }}
        >
          {title}
        </h4>
      )}
      {question && (
        <p className="leading-[1.4] mb-8 w-full" style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 400 }}>
          {question}
        </p>
      )}

      {/* Bars */}
      <div className="flex items-end justify-center gap-3 md:gap-4" style={{ height: 420, paddingBottom: 28, position: 'relative' }}>
        {/* Baseline */}
        <div style={{ position: 'absolute', bottom: 26, left: 0, right: 0, height: 1, background: 'rgba(33,38,26,0.1)' }} />

        {data.map((item, i) => (
          <div key={i} className="flex gap-[3px] items-end">
            {/* 2025 bar — appears immediately on view */}
            {item.value2025 !== null ? (
              <motion.div
                className="rounded-t-[3px]"
                style={{ width: 36, background: `${accentColor}40` }}
                initial={{ height: 0 }}
                animate={isInView ? { height: barHeight(item.value2025) } : { height: 0 }}
                transition={{ duration: 0.4, delay: 0.05 + i * 0.03, ease: 'easeOut' }}
              />
            ) : (
              <div style={{ width: 36 }} />
            )}
            {/* 2026 bar — grows after 1s pause */}
            <motion.div
              className="rounded-t-[3px]"
              style={{ width: 36, background: accentColor }}
              initial={{ height: 0 }}
              animate={isInView ? { height: barHeight(item.value2026) } : { height: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.03, ease: 'easeOut' }}
            />
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-center gap-3 md:gap-4">
        {data.map((item, i) => (
          <div key={i} className="text-center" style={{ width: 75 }}>
            <p className="text-[8px] md:text-[9px] leading-tight" style={{ color: '#21261A', opacity: 0.6 }}>
              {item.shortLabel}
            </p>
            {item.value2025 === null && (
              <motion.p
                className="text-[7px] font-bold uppercase tracking-[1px] mt-1"
                style={{ color: accentColor }}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 1.3 }}
              >
                New
              </motion.p>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 justify-center">
        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: '#21261A', opacity: 0.5 }}>
          <span className="inline-block w-3 h-2 rounded-sm" style={{ background: `${accentColor}40` }} /> 2025
        </span>
        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: '#21261A', opacity: 0.5 }}>
          <span className="inline-block w-3 h-2 rounded-sm" style={{ background: accentColor }} /> 2026
        </span>
      </div>
    </div>
  )
}
