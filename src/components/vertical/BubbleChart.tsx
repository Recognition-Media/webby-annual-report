'use client'

import { motion } from 'framer-motion'

interface BubbleData {
  cause: string
  challenge: string
  percentage: number
  respondents: number
  totalRespondents: number
  color: string
}

interface BubbleChartProps {
  eyebrow?: string
  title?: string
  data: BubbleData[]
}

export function BubbleChart({
  eyebrow = 'Top Challenge By Cause Area',
  title,
  data,
}: BubbleChartProps) {
  // Sort by percentage descending for visual hierarchy
  const sorted = [...data].sort((a, b) => b.percentage - a.percentage)

  // Scale bubble size: percentage maps to diameter
  // 100% = 180px, 50% = 90px
  function getSize(pct: number) {
    return Math.max(80, (pct / 100) * 180)
  }

  return (
    <section
      className="relative px-5 md:px-[60px] pt-0 md:pt-0 pb-16 md:pb-24"
      style={{ background: '#E3DDCA' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {eyebrow && (
          <motion.p
            className="uppercase font-medium mb-3 text-center"
            style={{ fontSize: 11, letterSpacing: 4, color: '#D17DD0' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {eyebrow}
          </motion.p>
        )}

        {title && (
          <motion.h3
            className="text-center mb-12 text-[24px] md:text-[36px] leading-[1.15]"
            style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 400 }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {title}
          </motion.h3>
        )}

        {/* Bubble layout */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {sorted.map((item, i) => {
            const size = getSize(item.percentage)
            return (
              <motion.div
                key={i}
                className="rounded-full flex flex-col items-center justify-center text-center"
                style={{
                  width: size,
                  height: size,
                  background: item.color,
                  padding: size > 120 ? 16 : 10,
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: 'easeOut' }}
              >
                <div
                  className="leading-none"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: size > 140 ? 32 : size > 110 ? 24 : 20,
                    color: '#E3DDCA',
                    fontWeight: 700,
                  }}
                >
                  {item.percentage}%
                </div>
                <div
                  className="mt-1"
                  style={{
                    fontSize: 10,
                    color: '#E3DDCA',
                    lineHeight: 1.2,
                  }}
                >
                  {item.cause}
                </div>
                <div
                  className="mt-0.5"
                  style={{
                    fontSize: 10,
                    color: '#E3DDCA',
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {item.challenge}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
