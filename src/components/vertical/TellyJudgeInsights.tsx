'use client'

import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { ExpertQuote } from '@/sanity/types'
import { urlFor } from '@/sanity/image'

// Telly's pop-art accent palette (48th Annual Telly Awards Figma deck),
// cycled per quote so headshot borders show more than just red/purple.
const ACCENTS = ['#ef1e40', '#0C75FF', '#F41FC9', '#2EFB5E']

const quoteComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-2">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
  },
}

export function TellyJudgeInsights({
  eyebrow = 'Insights From The Season',
  heading,
  quotes,
}: {
  eyebrow?: string
  heading?: string
  quotes: ExpertQuote[]
}) {
  if (!quotes || quotes.length === 0) return null
  return (
    <section
      id="judge-insights"
      className="relative px-5 md:px-[60px] py-20 md:py-28"
      style={{ background: '#110E1F' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <motion.p
          className="uppercase font-medium mb-4 text-center"
          style={{ fontSize: 13, letterSpacing: 3, color: '#ef1e40', fontFamily: "'Basetica', -apple-system, sans-serif" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {eyebrow}
        </motion.p>
        {heading && (
          <motion.h2
            className="text-[32px] md:text-[48px] leading-[1.1] mb-14 md:mb-20 text-center"
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 700 }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            {heading}
          </motion.h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
          {quotes.map((q, i) => {
            const accent = ACCENTS[i % ACCENTS.length]
            const headshotUrl = q.headshot ? urlFor(q.headshot).width(160).height(160).fit('crop').url() : q.headshotUrl
            return (
              <motion.div
                key={i}
                className="flex gap-4 items-start"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.06 }}
              >
                {headshotUrl ? (
                  <div
                    className="w-[64px] h-[64px] md:w-[80px] md:h-[80px] rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: `2px solid ${accent}` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- CMS-driven headshot, not a static project asset */}
                    <img src={headshotUrl} alt={q.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="w-[64px] h-[64px] md:w-[80px] md:h-[80px] rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.08)', border: `2px solid ${accent}` }}
                  />
                )}
                <div className="pl-4" style={{ borderLeft: `3px solid ${accent}` }}>
                  <div
                    className="text-[15px] md:text-[17px] leading-[1.6] mb-3"
                    style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontStyle: 'italic' }}
                  >
                    <PortableText value={q.quoteText} components={quoteComponents} />
                  </div>
                  <p className="text-[13px]" style={{ color: 'rgba(216,245,255,0.6)' }}>
                    — <strong style={{ fontWeight: 600 }}>{q.name}</strong>{q.title ? `, ${q.title}` : ''}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
