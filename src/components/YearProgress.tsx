'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'

const START_YEAR = 1996
const END_YEAR = 2025

export function YearProgress({ progress }: { progress: MotionValue<number> }) {
  const currentYear = useTransform(progress, [0.1, 0.85], [START_YEAR, END_YEAR])
  const progressHeight = useTransform(progress, [0.1, 0.85], ['0%', '100%'])
  const tooltipTop = useTransform(progress, [0.1, 0.85], ['0%', '100%'])
  const yearDisplay = useTransform(currentYear, (v) => Math.round(v).toString())

  // Fade in as green/black sections slide in (progress 0 to 0.35)
  const opacity = useTransform(progress, [0, 0.35], [0, 1])

  return (
    <motion.div className="flex flex-col items-center py-8 h-full" style={{ opacity }}>
      <span className="text-sm text-black/30 mb-2">{START_YEAR}</span>

      {/* Full-height track — thin gray line, thicker gradient fill */}
      <div className="flex-1 relative flex justify-center" style={{ width: 6 }}>
        <div className="absolute inset-y-0 rounded-full bg-black/10" style={{ width: 1 }} />
        {/* Gradient fill */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full origin-top"
          style={{
            width: 6,
            height: progressHeight,
            background: 'linear-gradient(to bottom, #7ACA6C, #85CEFF)',
          }}
        />

        {/* Year tooltip that moves along the track */}
        <motion.div
          className="absolute bg-black text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap"
          style={{
            top: tooltipTop,
            right: 16,
          }}
        >
          <motion.span>{yearDisplay}</motion.span>
        </motion.div>
      </div>

      <span className="text-sm text-black/30 mt-2">{END_YEAR}</span>
    </motion.div>
  )
}
