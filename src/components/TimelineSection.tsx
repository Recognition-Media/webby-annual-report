'use client'

import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import type { Report } from '@/sanity/types'
import { WebbyIntro } from './WebbyIntro'
import { StatsGrid } from './StatsGrid'
import { YearProgress } from './YearProgress'

export function TimelineSection({ report }: { report: Report }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 120%', 'end end'],
  })

  return (
    <div ref={ref} style={{ height: '300vh' }}>
      <div className="sticky top-[60px] h-[calc(100vh-60px)] overflow-hidden relative">
        {/* Content wrapper - 75% width on desktop */}
        <div className="w-full lg:w-[75%] h-full flex flex-col">
          {/* Green intro section - top half, slides in from left first */}
          <div className="flex-1 overflow-hidden">
            <WebbyIntro report={report} progress={scrollYProgress} />
          </div>

          {/* Black stats section - bottom half, slides in from left (delayed) */}
          <div className="flex-1 overflow-hidden">
            <StatsGrid stats={report.globalStats} progress={scrollYProgress} />
          </div>
        </div>

        {/* Year progress timeline */}
        <div className="absolute top-0 bottom-0 hidden lg:block" style={{ left: '87.5%' }}>
          <YearProgress progress={scrollYProgress} />
        </div>
      </div>
    </div>
  )
}
