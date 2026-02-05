'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import type { HeroStat } from '@/sanity/types'

const STAT_ICONS: Record<string, React.ReactNode> = {
  'Global Population': (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5">
      <circle cx="14" cy="10" r="4" /><path d="M7 28v-4a7 7 0 0 1 14 0v4" />
      <circle cx="26" cy="10" r="4" /><path d="M19 28v-4a7 7 0 0 1 14 0v4" />
    </svg>
  ),
  'Social Media Users': (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5">
      <circle cx="20" cy="20" r="14" />
      <circle cx="12" cy="14" r="2" fill="white" /><circle cx="28" cy="14" r="2" fill="white" />
      <circle cx="20" cy="28" r="2" fill="white" /><circle cx="10" cy="26" r="2" fill="white" />
      <circle cx="30" cy="26" r="2" fill="white" />
      <path d="M12 14l8 0M28 14l-8 14M12 14l-2 12M28 14l2 12" />
    </svg>
  ),
  'Total Internet Users': (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5">
      <rect x="4" y="4" width="32" height="24" rx="2" /><path d="M14 32h12M20 28v4" />
    </svg>
  ),
  'Mobile Phone Subscribers': (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5">
      <rect x="10" y="2" width="20" height="36" rx="3" /><path d="M17 33h6" />
    </svg>
  ),
}

const FALLBACK_STATS: HeroStat[] = [
  { label: 'Global Population', value: '8,193,236,715' },
  { label: 'Social Media Users', value: '5,242,995,169' },
  { label: 'Total Internet Users', value: '5,548,270,531' },
  { label: 'Mobile Phone Subscribers', value: '7,300,966,184' },
]

function AnimatedNumber({ value, progress }: { value: string; progress: MotionValue<number> }) {
  const match = value.match(/^([^0-9]*)([0-9,]+(?:\.\d+)?)(.*)$/)
  const num = match ? parseFloat(match[2].replace(/,/g, '')) : 0
  const prefix = match ? match[1] : ''
  const suffix = match ? match[3] : ''

  const count = useTransform(progress, [0.1, 0.85], [0, num])
  const display = useTransform(count, (v) =>
    Math.round(v).toLocaleString('en-US')
  )

  return (
    <span className="text-4xl md:text-5xl font-bold text-white">
      {prefix}<motion.span>{display}</motion.span>{suffix}
    </span>
  )
}

export function StatsGrid({ stats, progress }: { stats?: HeroStat[]; progress: MotionValue<number> }) {
  const data = stats && stats.length > 0 ? stats : FALLBACK_STATS

  return (
    <section className="bg-black text-white h-full flex items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full">
        {data.map((stat, i) => (
          <div
            key={i}
            className="flex items-end gap-4 py-14 px-8 md:px-12"
          >
            <div className="shrink-0 mb-1">
              {STAT_ICONS[stat.label] || <div className="w-10 h-10 rounded-full bg-white/20" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white/50 mb-1">{stat.label}</h3>
              <AnimatedNumber value={stat.value} progress={progress} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
