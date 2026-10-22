'use client'

import { motion } from 'framer-motion'
import type { WinEntry } from '@/sanity/types'

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  vimeo: 'Vimeo',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  website: 'Website',
}

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
      style={{ background: '#ffffff' }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        <motion.h3
          className="text-[22px] md:text-[28px] leading-[1.2] mb-4"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000', fontWeight: 700 }}
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
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(0,0,0,0.65)' }}
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
              style={{ borderColor: 'rgba(0,0,0,0.1)' }}
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
                  style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000', fontWeight: entry.highlight ? 700 : 500 }}
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
                        style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000', textUnderlineOffset: 2, fontStyle: 'italic' }}
                      >
                        {entry.workTitle}
                      </a>
                    ) : (
                      <span style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000', fontStyle: 'italic' }}>
                        {entry.workTitle}
                      </span>
                    )}
                  </>
                )}
              </span>
              {entry.metricValue && (
                <a
                  href={entry.metricUrl || entry.workUrl || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-[11px] md:text-[12px] py-1.5 px-3 rounded-full whitespace-nowrap"
                  style={{ background: 'rgba(0,0,0,0.06)', color: '#000000', fontFamily: "'Basetica', -apple-system, sans-serif" }}
                >
                  {entry.metricValue}
                  {entry.metricPlatform && ` · ${PLATFORM_LABELS[entry.metricPlatform] || entry.metricPlatform}`}
                </a>
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
