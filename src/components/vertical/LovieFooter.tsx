'use client'

import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { Report } from '@/sanity/types'

const FALLBACK_HEADLINE = 'About The Lovie Awards'
const FALLBACK_DEADLINE = 'Enter Your Work Before the Final Entry Deadline on 26 June 2026'
const FALLBACK_BODY = [
  "The Lovie Awards is the Webby Awards' benchmark for European digital excellence, recognising the people, projects, and ideas shaping Europe's contributions to the internet.",
  "Launched in 2010, The Lovie Award is presented by the European arm of the International Academy of Digital Arts and Sciences (IADAS)—a 3,000+ membership body which also judges The Webby Awards. The Academy is comprised of leading Internet experts, business figures, luminaries, visionaries, artists, and talented entertainers and creators. Work is judged in seven native languages, including Spanish, Italian, Dutch, French, German, Swedish, and English.",
]
const FALLBACK_CLOSING_LINE = "If you're redefining digital creativity from the Mediterranean, in ways only your country can, we want to see your work in the Lovie Awards."
const FALLBACK_CTA_URL = 'https://www.lovieawards.com/'
const FALLBACK_CTA_TEXT = 'Enter Your Work'

const LIME = '#eeffbb'

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p style={{ fontSize: 16, lineHeight: 1.7, color: '#ffffff', margin: '0 0 20px', opacity: 0.92 }}>
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
        style={{ color: LIME, textDecoration: 'underline', textUnderlineOffset: 3 }}
      >
        {children}
      </a>
    ),
  },
}

export function LovieFooter({ report }: { report: Report }) {
  const headline = report.footerHeadline || FALLBACK_HEADLINE
  const deadline = report.footerSubhead || FALLBACK_DEADLINE
  const ctaUrl = report.footerCtaUrl || FALLBACK_CTA_URL
  const ctaText = FALLBACK_CTA_TEXT
  const body = report.footerBody && report.footerBody.length > 0 ? report.footerBody : null

  return (
    <footer
      id="about-lovie"
      data-snap
      style={{
        // Solid purple ground (matches the image's bg colour) with the
        // illustrated band — hearts + dotted curve — sitting as a
        // decorative footer beneath the CTA, anchored to center-bottom.
        backgroundImage: 'url(/lovie/about-bg-purple.png)',
        backgroundSize: 'cover',
        // Negative y shifts the image up so the heart's lower black
        // portion lands behind "About The Lovie Awards." instead of
        // sitting fully above the headline.
        backgroundPosition: 'center -144px',
        padding: '120px 24px 220px',
        fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
        color: '#ffffff',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
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
          style={{ width: 48, height: 2, background: LIME, margin: '0 auto 32px' }}
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        />

        {/* Deadline — bold + lime, treated as the first body paragraph */}
        <motion.p
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: LIME,
            lineHeight: 1.45,
            margin: '0 0 28px',
          }}
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
              <p
                key={i}
                style={{ fontSize: 16, lineHeight: 1.7, color: '#ffffff', margin: '0 0 20px', opacity: 0.92 }}
              >
                {p}
              </p>
            ))
          )}
        </motion.div>

        {/* Closing transitional line — leads into the CTA. Italic so it
            reads as a final editorial beat, not another body paragraph. */}
        <motion.p
          style={{
            fontSize: 18,
            fontStyle: 'italic',
            fontWeight: 400,
            color: '#ffffff',
            lineHeight: 1.55,
            margin: '8px 0 0',
            maxWidth: 640,
            marginLeft: 'auto',
            marginRight: 'auto',
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
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 32,
            background: LIME,
            color: '#000000',
            padding: '14px 28px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {ctaText}
          <span aria-hidden>→</span>
        </motion.a>
      </div>
    </footer>
  )
}
