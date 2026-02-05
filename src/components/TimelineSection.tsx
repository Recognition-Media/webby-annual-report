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
    offset: ['start start', 'end end'],
  })

  return (
    <div ref={ref} style={{ height: '300vh' }}>
      <div className="sticky top-[60px] h-[calc(100vh-60px)] overflow-hidden relative">
        <div className="w-full lg:w-[75%] min-w-0 flex flex-col h-full">
          <div className="flex-1 overflow-hidden min-h-0">
            <WebbyIntro report={report} progress={scrollYProgress} />
          </div>
          <div className="flex-1 overflow-hidden min-h-0">
            <StatsGrid stats={report.globalStats} progress={scrollYProgress} />
          </div>
        </div>
        <div className="absolute top-0 bottom-0 hidden lg:block" style={{ left: '87.5%' }}>
          <YearProgress progress={scrollYProgress} />
        </div>
      </div>
    </div>
  )
}
