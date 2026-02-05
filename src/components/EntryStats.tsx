'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { HeroStat } from '@/sanity/types'

const FALLBACK_STATS: HeroStat[] = [
  { label: 'Entries Received', value: '13,000' },
  { label: 'Countries Represented', value: '71' },
  { label: 'US States Entering', value: '50' },
]

const FLAG_CODES = [
  'do', 'at', 'hu', 'ch', 'ge', 'is', 'de', 'it',
  'fr', 'kr', 'nl', 'us', 'gb', 'ca', 'gr', 'tr',
  'jp', 'br', 'in', 'ph', 'za', 'pl', 'es', 'ng',
  'qa', 'cz', 'il', 'fi', 'gy', 'lv', 'ru', 'cn',
  'tn', 'ro', 'se', 'au',
]

const FLAG_POSITIONS = FLAG_CODES.map((_, i) => ({
  top: `${4 + ((i * 37 + 11) % 88)}%`,
  left: `${1 + ((i * 53 + 7) % 94)}%`,
  rotate: -20 + ((i * 11) % 40),
  size: 60 + ((i * 7) % 30),
  duration: 8 + ((i * 3) % 12),
  dx: -20 + ((i * 13) % 40),
  dy: -15 + ((i * 9) % 30),
}))

function ScrollNumber({ value, progress }: { value: string; progress: MotionValue<number> }) {
  const match = value.match(/^([^0-9]*)([0-9,]+(?:\.\d+)?)(.*)$/)
  const num = match ? parseFloat(match[2].replace(/,/g, '')) : 0
  const prefix = match ? match[1] : ''
  const suffix = match ? match[3] : ''

  const count = useTransform(progress, [0.1, 0.42], [0, num])
  const display = useTransform(count, (v) =>
    Math.round(v).toLocaleString('en-US')
  )

  return (
    <span className="text-5xl md:text-[80px] font-black text-black leading-none tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}<motion.span>{display}</motion.span>{suffix}
    </span>
  )
}

export function EntryStats({ stats }: { stats?: HeroStat[]; historyText?: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const data = stats && stats.length > 0 ? stats : FALLBACK_STATS

  return (
    <section
      ref={ref}
      className="relative bg-[#ddd] overflow-hidden flex items-center justify-center"
      style={{ height: '100vh' }}
    >
      {/* Animated scattered flag images */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {FLAG_CODES.map((code, i) => (
          <motion.img
            key={code}
            src={`https://flagcdn.com/w80/${code}.png`}
            alt=""
            className="absolute rounded-sm shadow-sm"
            style={{
              top: FLAG_POSITIONS[i].top,
              left: FLAG_POSITIONS[i].left,
              width: FLAG_POSITIONS[i].size,
              opacity: 0.9,
            }}
            animate={{
              x: [0, FLAG_POSITIONS[i].dx, 0],
              y: [0, FLAG_POSITIONS[i].dy, 0],
              rotate: [FLAG_POSITIONS[i].rotate, FLAG_POSITIONS[i].rotate + 5, FLAG_POSITIONS[i].rotate],
            }}
            transition={{
              duration: FLAG_POSITIONS[i].duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
        {/* Decorative white squiggle ribbons */}
        <svg className="absolute top-[15%] left-[3%] opacity-80" width="40" height="200" viewBox="0 0 40 200" fill="none">
          <path d="M20 0 Q35 25 20 50 Q5 75 20 100 Q35 125 20 150 Q5 175 20 200" stroke="white" strokeWidth="6" fill="none" />
        </svg>
        <svg className="absolute bottom-[10%] left-[25%] opacity-80" width="40" height="180" viewBox="0 0 40 180" fill="none">
          <path d="M20 0 Q35 22 20 45 Q5 68 20 90 Q35 112 20 135 Q5 158 20 180" stroke="white" strokeWidth="6" fill="none" />
        </svg>
        <svg className="absolute top-[30%] right-[8%] opacity-80" width="40" height="200" viewBox="0 0 40 200" fill="none">
          <path d="M20 0 Q35 25 20 50 Q5 75 20 100 Q35 125 20 150 Q5 175 20 200" stroke="white" strokeWidth="6" fill="none" />
        </svg>
      </div>

      {/* Center card */}
      <div className="relative mx-auto bg-white border-[10px] border-black py-12 px-10 md:px-14 text-center w-[420px] max-w-[90vw]">
        {data.map((stat, i) => (
          <div key={i} className={i > 0 ? 'mt-6' : ''}>
            {i > 0 && <div className="squiggle-divider mx-auto mb-6" />}
            <h3 className="text-base font-bold text-black mb-1">{stat.label}</h3>
            <ScrollNumber value={stat.value} progress={scrollYProgress} />
          </div>
        ))}
      </div>
    </section>
  )
}
