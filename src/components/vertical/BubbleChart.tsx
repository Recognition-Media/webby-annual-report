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
  // Alphabetical by cause name.
  const sorted = [...data].sort((a, b) => a.cause.localeCompare(b.cause))

  return (
    <section
      className="relative px-5 md:px-[60px] -mt-px md:mt-0 pt-8 md:pt-0 pb-16 md:pb-24"
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
          {sorted.map((item, i) => (
            <motion.div
              key={i}
              className="rounded-full flex flex-col items-center justify-center text-center w-[120px] h-[120px] md:w-[150px] md:h-[150px]"
              style={{
                background: item.color,
                padding: 16,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: 'easeOut' }}
            >
              <div
                className="leading-tight"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 14,
                  color: '#E3DDCA',
                  fontWeight: 700,
                }}
              >
                {item.cause}
              </div>
              <div
                className="mt-1.5"
                style={{
                  fontSize: 10,
                  color: '#E3DDCA',
                  opacity: 0.85,
                  lineHeight: 1.3,
                }}
              >
                {item.challenge}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
