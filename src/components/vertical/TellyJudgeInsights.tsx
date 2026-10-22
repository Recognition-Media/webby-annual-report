'use client'

import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { ExpertQuote } from '@/sanity/types'

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
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              className="pl-5"
              style={{ borderLeft: `3px solid ${i % 2 === 0 ? '#ef1e40' : '#c23799'}` }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.06 }}
            >
              <div
                className="text-[15px] md:text-[17px] leading-[1.6] mb-3"
                style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontStyle: 'italic' }}
              >
                <PortableText value={q.quoteText} components={quoteComponents} />
              </div>
              <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                — <strong style={{ fontWeight: 600 }}>{q.name}</strong>{q.title ? `, ${q.title}` : ''}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
