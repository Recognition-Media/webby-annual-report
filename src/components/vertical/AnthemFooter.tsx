'use client'

import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import type { Report } from '@/sanity/types'

const FALLBACK_BODY: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'p1',
    style: 'normal',
    children: [
      { _type: 'span', _key: 'p1-s1', text: 'Launched in 2021 by The Webby Awards, ', marks: [] },
      { _type: 'span', _key: 'p1-s2', text: 'the Anthem Awards', marks: ['anthemLink'] },
      {
        _type: 'span',
        _key: 'p1-s3',
        text:
          ' recognizes impactful brands, nonprofits, and individuals that are setting the standard for good worldwide. We validate the impact of initiatives, content, and programs across causes: ',
        marks: [],
      },
      {
        _type: 'span',
        _key: 'p1-s4',
        text:
          'Belonging & Inclusion; Education, Art & Culture; Health; Human & Civil Rights; Humanitarian Action & Services; Technology; and Sustainability, Climate & Environment.',
        marks: ['strong'],
      },
    ],
    markDefs: [
      { _key: 'anthemLink', _type: 'link', href: 'https://www.anthemawards.com/' },
    ],
  },
  {
    _type: 'block',
    _key: 'p2',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'p2-s1',
        text:
          "This season's partners include The Bloom, The Social Innovation Summit, Sustainable Brands, and NationSwell. The Anthem Awards were founded in partnership with the Ad Council, Born This Way Foundation, Feeding America, Glaad, Mozilla, NAACP, NRDC, WWF, and XQ.",
        marks: [],
      },
    ],
    markDefs: [],
  },
]

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p
        className="text-[18px] leading-[1.7] mb-5 text-center"
        style={{
          fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
          color: '#E3DDCA',
          opacity: 0.78,
        }}
      >
        {children}
      </p>
    ),
  },
  marks: {
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#E3DDCA', textDecoration: 'underline' }}
      >
        {children}
      </a>
    ),
  },
}

/* ------------------------------------------------------------------ */
/*  Floating + draggable stickers (matches HeroSection's behavior)    */
/* ------------------------------------------------------------------ */

type FooterSticker = {
  src: string
  top?: string
  bottom?: string
  left?: string
  right?: string
  size: number
  rotate: number
  float: { y: [number, number]; duration: number }
}

// Mirror the HeroSection's cause-icon scatter so the report opens and closes
// with the same visual motif — the seven Anthem cause icons floating around
// the edges, draggable, gently bobbing.
const FOOTER_STICKERS: FooterSticker[] = [
  // Left edge
  { src: '/anthem/CAUSE_HEALTH.svg', top: '8%', left: '3%', size: 140, rotate: -8, float: { y: [-14, 14], duration: 3.6 } },
  { src: '/anthem/CAUSE_DIVERSITY.svg', top: '38%', left: '5%', size: 120, rotate: 10, float: { y: [-10, 10], duration: 4.4 } },
  { src: '/anthem/CAUSE_EDUCATION.svg', bottom: '14%', left: '4%', size: 130, rotate: -12, float: { y: [-16, 16], duration: 4 } },
  // Right edge
  { src: '/anthem/anthem-sticker.svg', top: '6%', right: '3%', size: 150, rotate: 6, float: { y: [-13, 13], duration: 3.8 } },
  { src: '/anthem/CAUSE_HUMANRIGHTS.svg', top: '34%', right: '4%', size: 124, rotate: 14, float: { y: [-15, 15], duration: 4.6 } },
  { src: '/anthem/CAUSE_TECHNOLOGY.svg', bottom: '18%', right: '5%', size: 138, rotate: -10, float: { y: [-12, 12], duration: 4.2 } },
  // Bottom-center accent
  { src: '/anthem/CAUSE_SUSTAINABILITY.svg', bottom: '4%', right: '32%', size: 116, rotate: 4, float: { y: [-11, 11], duration: 4.8 } },
]

function DraggableSticker({ sticker, index }: { sticker: FooterSticker; index: number }) {
  const sizeClamp = `clamp(${Math.round(sticker.size * 0.55)}px, ${Math.round(sticker.size / 16)}vw + 40px, ${sticker.size}px)`
  const enterDelay = 0.2 + index * 0.15
  const settleDelay = enterDelay + 0.8

  return (
    <motion.div
      className="absolute z-10 cursor-grab active:cursor-grabbing pointer-events-auto"
      style={{
        width: sizeClamp,
        height: sizeClamp,
        ...(sticker.top ? { top: sticker.top } : {}),
        ...(sticker.bottom ? { bottom: sticker.bottom } : {}),
        ...(sticker.left ? { left: sticker.left } : {}),
        ...(sticker.right ? { right: sticker.right } : {}),
      }}
      drag
      dragMomentum={false}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.15, zIndex: 50 }}
      initial={{ y: 60, rotate: sticker.rotate - 30, opacity: 0 }}
      whileInView={{ y: 0, rotate: sticker.rotate, opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        y: { type: 'spring', damping: 14, stiffness: 70, delay: enterDelay },
        rotate: { type: 'spring', damping: 16, stiffness: 90, delay: enterDelay },
        opacity: { duration: 0.5, delay: enterDelay },
      }}
    >
      <motion.img
        src={sticker.src}
        alt=""
        className="w-full h-full pointer-events-none select-none"
        draggable={false}
        animate={{ y: sticker.float.y }}
        transition={{
          duration: sticker.float.duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: settleDelay,
        }}
      />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function AnthemFooter({ report }: { report: Report }) {
  const eyebrow = report.footerEyebrow || 'About the Anthem Awards'
  const headline = report.footerHeadline || 'Set the New Standard for Good'
  const subhead = report.footerSubhead || 'Enter Your Work Before the Early Entry Deadline on May 22, 2026'
  const ctaUrl = report.footerCtaUrl || 'https://www.anthemawards.com/'
  const body = report.footerBody && report.footerBody.length > 0 ? report.footerBody : FALLBACK_BODY

  return (
    <footer
      id="about-anthem"
      className="relative overflow-hidden px-5 md:px-[60px] py-16 md:py-28"
      style={{ background: '#066DBA', color: '#E3DDCA' }}
    >
      {/* Floating draggable celebration stickers */}
      {FOOTER_STICKERS.map((sticker, i) => (
        <DraggableSticker key={i} sticker={sticker} index={i} />
      ))}

      <div
        className="relative z-20 pointer-events-none"
        style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}
      >
        {/* Centered banner: eyebrow + headline */}
        <motion.p
          className="uppercase font-medium text-center mb-6 pointer-events-auto"
          style={{ fontSize: 11, letterSpacing: 4, color: '#E3DDCA' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {eyebrow}
        </motion.p>

        <motion.h2
          className="mb-12 text-center text-[36px] md:text-[56px] lg:text-[64px] leading-[1.05] pointer-events-auto whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-display)',
            color: '#E3DDCA',
            fontWeight: 400,
            letterSpacing: '-1px',
          }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {headline}
        </motion.h2>

        {/* Body block: narrow centered column, all content centered */}
        <div
          className="mx-auto pointer-events-auto flex flex-col items-center"
          style={{ maxWidth: 640 }}
        >
          {/* Divider */}
          <div style={{ width: 40, height: 2, background: '#8C001C', marginBottom: 24 }} />

          {/* Italic subhead */}
          <motion.p
            className="text-[16px] md:text-[18px] leading-[1.5] mb-10 text-center"
            style={{
              fontFamily: 'var(--font-display)',
              color: '#E3DDCA',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subhead}
          </motion.p>

          {/* Body paragraphs */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <PortableText value={body} components={portableTextComponents} />
          </motion.div>

          {/* CTA button — centered */}
          <motion.a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between gap-4 uppercase font-medium py-4 px-8 text-xs md:text-sm tracking-wider rounded-full transition-transform hover:scale-[1.02] mt-6"
            style={{
              background: '#8C001C',
              color: '#E3DDCA',
              fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
              minWidth: 240,
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span>Enter Your Work</span>
            <span className="text-base md:text-lg">→</span>
          </motion.a>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="relative z-20 mt-16 md:mt-20 pt-6 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6"
        style={{
          borderTop: '1px solid rgba(227, 221, 202, 0.14)',
          maxWidth: 1280,
          margin: '64px auto 0',
        }}
      >
        <img
          src="/anthem/anthem-logo-green.svg"
          alt="The Anthem Awards"
          className="h-7 w-auto"
          style={{ opacity: 0.85 }}
        />
        <p
          className="text-[11px] md:text-[12px]"
          style={{
            color: '#E3DDCA',
            opacity: 0.4,
            fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
          }}
        >
          © {new Date().getFullYear()} The Anthem Awards. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
