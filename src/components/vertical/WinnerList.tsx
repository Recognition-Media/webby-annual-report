'use client'

import { motion } from 'framer-motion'
import type { WinEntry } from '@/sanity/types'

interface WinnerListProps {
  id?: string
  heading: string
  intro?: string
  entries: WinEntry[]
  accentColor?: string
}

export function WinnerList({ id, heading, intro, entries, accentColor = '#ef1e40' }: WinnerListProps) {
  if (!entries || entries.length === 0) return null
  return (
    <section
      id={id}
      className="relative px-5 md:px-[60px] py-16 md:py-20"
      style={{ background: '#110E1F' }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        <motion.h3
          className="text-[22px] md:text-[28px] leading-[1.2] mb-4"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 700 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {heading}
        </motion.h3>
        {intro && (
          <motion.p
            className="text-[14px] md:text-[16px] leading-[1.6] mb-8 max-w-[760px]"
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(255,255,255,0.65)' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {intro}
          </motion.p>
        )}
        <ol className="list-none p-0 m-0 flex flex-col">
          {entries.map((entry, i) => (
            <motion.li
              key={i}
              className="flex items-baseline gap-4 md:gap-6 py-4 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.12)' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.04 }}
            >
              <span
                className="text-[14px] md:text-[16px] font-bold flex-shrink-0"
                style={{ color: accentColor, minWidth: 28 }}
              >
                {i + 1}
              </span>
              <span className="flex-1 min-w-0">
                <span
                  className="text-[14px] md:text-[16px]"
                  style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: entry.highlight ? 700 : 500 }}
                >
                  {entry.name}
                </span>
                {entry.workTitle && (
                  <>
                    {' — '}
                    {entry.workUrl ? (
                      <a
                        href={entry.workUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', textUnderlineOffset: 2, fontStyle: 'italic' }}
                      >
                        {entry.workTitle}
                      </a>
                    ) : (
                      <span style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontStyle: 'italic' }}>
                        {entry.workTitle}
                      </span>
                    )}
                  </>
                )}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
