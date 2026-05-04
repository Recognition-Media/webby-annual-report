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
  const singleYear = data.every((d) => d.value2025 === null || d.value2025 === undefined)
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
      <div className={`flex items-end justify-center ${singleYear ? 'gap-[4px]' : 'gap-[8px]'} md:gap-4`} style={{ height: 420, paddingBottom: 28, position: 'relative' }}>
        {/* Baseline */}
        <div style={{ position: 'absolute', bottom: 26, left: 0, right: 0, height: 1, background: 'rgba(33,38,26,0.1)' }} />

        {data.map((item, i) => {
          const delay2025 = 0.05 + i * 0.03
          const delay2026 = (singleYear ? 0.1 : 0.7) + i * 0.03
          return (
            <div key={i} className="flex gap-[3px] items-end">
              {/* 2025 bar — only rendered when comparing years */}
              {!singleYear && (
                item.value2025 !== null ? (
                  <div className="flex flex-col items-center w-[19px] md:w-[36px]">
                    <motion.span
                      className="text-[10px] md:text-[12px] tabular-nums leading-none"
                      style={{ color: '#21261A', opacity: 0.55, fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 0.55 } : { opacity: 0 }}
                      transition={{ duration: 0.3, delay: delay2025 + 0.4 }}
                    >
                      {Math.round(item.value2025)}%
                    </motion.span>
                    <motion.div
                      className="rounded-t-[3px] w-full"
                      style={{ background: `${accentColor}40` }}
                      initial={{ height: 0 }}
                      animate={isInView ? { height: barHeight(item.value2025) } : { height: 0 }}
                      transition={{ duration: 0.4, delay: delay2025, ease: 'easeOut' }}
                    />
                  </div>
                ) : (
                  <div className="w-[19px] md:w-[36px]" />
                )
              )}
              {/* 2026 bar — grows after 1s pause when paired, immediately in single-year mode */}
              <div className={`flex flex-col items-center ${singleYear ? 'w-[38px] md:w-[36px]' : 'w-[19px] md:w-[36px]'}`}>
                <motion.span
                  className="text-[10px] md:text-[12px] tabular-nums leading-none"
                  style={{ color: '#21261A', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.3, delay: delay2026 + 0.5 }}
                >
                  {Math.round(item.value2026)}%
                </motion.span>
                <motion.div
                  className={`rounded-t-[3px] ${singleYear ? 'w-[19px] md:w-full' : 'w-full'}`}
                  style={{ background: accentColor }}
                  initial={{ height: 0 }}
                  animate={isInView ? { height: barHeight(item.value2026) } : { height: 0 }}
                  transition={{ duration: 0.5, delay: delay2026, ease: 'easeOut' }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Labels */}
      <div className={`flex justify-center ${singleYear ? 'gap-[4px]' : 'gap-[8px]'} md:gap-4`}>
        {data.map((item, i) => (
          <div
            key={i}
            className={`text-center ${singleYear ? 'w-[38px] md:w-[36px]' : 'w-[41px] md:w-[75px]'}`}
          >
            <p className="text-[9px] leading-tight" style={{ color: '#21261A', opacity: 0.6, whiteSpace: 'pre-line' }}>
              {item.shortLabel}
            </p>
            {!singleYear && item.value2025 === null && (
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

      {/* Legend — only shown when comparing two years */}
      {!singleYear && (
        <div className="flex gap-4 mt-4 justify-center">
          <span className="flex items-center gap-1.5 text-[11px]" style={{ color: '#21261A', opacity: 0.5 }}>
            <span className="inline-block w-3 h-2 rounded-sm" style={{ background: `${accentColor}40` }} /> 2025
          </span>
          <span className="flex items-center gap-1.5 text-[11px]" style={{ color: '#21261A', opacity: 0.5 }}>
            <span className="inline-block w-3 h-2 rounded-sm" style={{ background: accentColor }} /> 2026
          </span>
        </div>
      )}
    </div>
  )
}
