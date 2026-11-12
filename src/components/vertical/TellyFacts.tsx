'use client'

import { motion } from 'framer-motion'
import type { Report } from '@/sanity/types'

function RankedList({ heading, items, accentColor }: { heading?: string; items?: string[]; accentColor: string }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      {heading && (
        <p
          className="text-[13px] md:text-[14px] uppercase font-medium mb-4"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: accentColor, letterSpacing: 2 }}
        >
          {heading}
        </p>
      )}
      <ol className="list-none p-0 m-0 flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 items-baseline">
            <span className="text-[14px] font-bold" style={{ color: accentColor, minWidth: 20 }}>{i + 1}</span>
            <span className="text-[15px] md:text-[16px]" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff' }}>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// `transparentBg` drops the section's own solid background and tightens
// vertical padding so it can be embedded as a slide inside
// TellyHeroArticle's rotating carousel — letting that carousel's own
// background wash show through instead of this section painting over it.
export function TellyFacts({ report, transparentBg }: { report: Report; transparentBg?: boolean }) {
  return (
    <section
      id="telly-facts"
      className={`relative px-5 md:px-[60px] ${transparentBg ? 'py-6 md:py-8 max-h-[64vh] md:max-h-none overflow-y-auto md:overflow-visible' : 'py-20 md:py-28'}`}
      style={{ background: transparentBg ? 'transparent' : '#110E1F' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <motion.h2
          className={`text-[40px] md:text-[64px] leading-[1.05] text-left ${transparentBg ? 'mb-8 md:mb-10' : 'mb-14 md:mb-20'}`}
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 700 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          The Facts
        </motion.h2>

        {/* Two headline stats */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${transparentBg ? 'mb-8 md:mb-12' : 'mb-16 md:mb-24'}`}>
          {report.factsEntryCount && (
            <motion.div
              className="text-left"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-[56px] md:text-[88px] leading-none" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ef1e40', fontWeight: 700 }}>
                {report.factsEntryCount}
              </div>
              <p className="text-[14px] md:text-[16px] mt-2" style={{ color: '#ffffff' }}>{report.factsEntryLabel}</p>
            </motion.div>
          )}
          {report.factsJudgeCount && (
            <motion.div
              className="text-left"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-[56px] md:text-[88px] leading-none" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#c23799', fontWeight: 700 }}>
                {report.factsJudgeCount}
              </div>
              <p className="text-[14px] md:text-[16px] mt-2" style={{ color: '#ffffff' }}>{report.factsJudgeLabel}</p>
            </motion.div>
          )}
        </div>

        {/* Ranked lists — "Who's Behind the Best Video Work" moved out to
            TellyTitlesTicker (a scrolling banner between the Table of
            Contents and Shows & Series), so only the two city lists
            remain here. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <RankedList heading={report.factsTopCitiesNationalHeading} items={report.factsTopCitiesNational} accentColor="#c23799" />
          <RankedList heading={report.factsTopCitiesInternationalHeading} items={report.factsTopCitiesInternational} accentColor="#ef1e40" />
        </div>
      </div>
    </section>
  )
}
