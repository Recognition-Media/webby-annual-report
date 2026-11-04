'use client'

import { motion } from 'framer-motion'

interface SectionStatDonutProps {
  heading?: string
  value: number
  caption: string
  accentColor: string
}

// A single donut-ring stat (same visual language as the per-trend data
// module elsewhere in the report) sized for sitting right below a
// section's sticky bar, before its first winner list — rather than up in
// the trend's intro copy. Telly only.
export function SectionStatDonut({ heading, value, caption, accentColor }: SectionStatDonutProps) {
  const size = 112
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div className="px-5 md:px-[60px] pt-12 md:pt-16">
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {heading && (
          <p
            className="leading-[1.4] mb-6"
            style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: '#ffffff', fontWeight: 400 }}
          >
            {heading}
          </p>
        )}
        <motion.div
          className="flex items-center gap-6"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={accentColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                whileInView={{ strokeDashoffset: circumference * (1 - value / 100) }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[20px] md:text-[22px]" style={{ fontFamily: 'var(--font-display)', color: '#ffffff', fontWeight: 700 }}>
                {value}%
              </span>
            </div>
          </div>
          <p className="text-[13px] md:text-[14px] leading-[1.5] max-w-[360px]" style={{ color: '#ffffff' }}>
            {caption}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
