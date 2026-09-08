'use client'

import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { trackCtaClick } from '@/lib/analytics'

const FALLBACK_HEADLINE = 'About The Telly Awards'
const FALLBACK_DEADLINE = 'Enter your work in the next Telly Awards season.'
const FALLBACK_BODY = [
  'The Telly Awards is the premier award honoring the best in TV and Cable, Digital and Streaming, and Non-Broadcast Productions.',
  'Our mission has been to strengthen the visual arts community by inspiring, promoting, and supporting creativity. On average, The Telly Awards receives over 13,000 entries yearly from all 50 states and 5 continents.',
]
const FALLBACK_CLOSING_LINE = 'Honoring excellence in video and television across all screens.'
const FALLBACK_CTA_URL = 'https://www.tellyawards.com/'
const FALLBACK_CTA_TEXT = 'Enter Your Work'

const RED = '#ef1e40'

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p style={{ fontSize: 16, lineHeight: 1.7, color: '#ffffff', margin: '0 0 20px', opacity: 0.9 }}>
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 700, color: '#ffffff' }}>{children}</strong>,
    em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: RED, textDecoration: 'underline', textUnderlineOffset: 3 }}
      >
        {children}
      </a>
    ),
  },
}

export function TellyFooter({ report }: { report: Report }) {
  const headline = report.footerHeadline || FALLBACK_HEADLINE
  const deadline = report.footerSubhead || FALLBACK_DEADLINE
  const ctaUrl = report.footerCtaUrl || FALLBACK_CTA_URL
  const body = report.footerBody && report.footerBody.length > 0 ? report.footerBody : null

  return (
    <footer
      id="about-telly"
      data-snap
      style={{
        backgroundColor: '#000000',
        padding: '140px 24px 200px',
        fontFamily: "'Basetica', -apple-system, sans-serif",
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.img
          src="/telly/telly-logo-white.svg"
          alt="The Telly Awards"
          style={{ width: 84, height: 'auto', margin: '0 auto 40px', display: 'block' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        />

        <motion.h2
          style={{
            fontSize: 'clamp(34px, 5vw, 56px)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
            color: '#ffffff',
            margin: '0 0 32px',
          }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          {headline}
        </motion.h2>

        <motion.div
          style={{ width: 48, height: 3, background: RED, margin: '0 auto 32px' }}
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        />

        <motion.p
          style={{ fontSize: 18, fontWeight: 700, color: RED, lineHeight: 1.45, margin: '0 0 28px' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {deadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {body ? (
            <PortableText value={body} components={portableTextComponents} />
          ) : (
            FALLBACK_BODY.map((p, i) => (
              <p key={i} style={{ fontSize: 16, lineHeight: 1.7, color: '#ffffff', margin: '0 0 20px', opacity: 0.9 }}>
                {p}
              </p>
            ))
          )}
        </motion.div>

        <motion.p
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: '#ffffff',
            opacity: 0.85,
            lineHeight: 1.55,
            margin: '8px auto 0',
            maxWidth: 640,
          }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {FALLBACK_CLOSING_LINE}
        </motion.p>

        <motion.a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCtaClick('footer', ctaUrl, report.property, report.slug.current)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 32,
            background: RED,
            color: '#ffffff',
            padding: '14px 28px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {FALLBACK_CTA_TEXT}
          <span aria-hidden>→</span>
        </motion.a>

        <p style={{ marginTop: 64, fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>
          © {new Date().getFullYear()} The Telly Awards
        </p>
      </div>
    </footer>
  )
}
