'use client'

import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { trackCtaClick } from '@/lib/analytics'

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

// Med portable-text components — white body on purple, lime links.
// Nordics uses `nordicsPortableTextComponents` below (black body on cream
// with Swedish blue links) since the ground colour flips.
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

const nordicsPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p style={{ fontSize: 16, lineHeight: 1.7, color: '#000000', margin: '0 0 20px', opacity: 0.85 }}>
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 700, color: '#000000' }}>{children}</strong>,
    em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#016BA7', textDecoration: 'underline', textUnderlineOffset: 3 }}
      >
        {children}
      </a>
    ),
  },
}

export function LovieFooter({ report }: { report: Report }) {
  const isNordics = report.slug?.current === 'lovie-creative-hubs-nordics'
  const headline = report.footerHeadline || FALLBACK_HEADLINE
  const deadline =
    report.footerSubhead ||
    (isNordics
      ? 'Enter Your Work Before the Extended Entry Deadline on 7 August 2026'
      : FALLBACK_DEADLINE)
  const ctaUrl = report.footerCtaUrl || FALLBACK_CTA_URL
  const ctaText = FALLBACK_CTA_TEXT
  const body = report.footerBody && report.footerBody.length > 0 ? report.footerBody : null
  // Nordics uses the cream Lovie gray for the CTA button (per Jordana's
  // instruction) and swaps "Mediterranean" for "Nordics" in the closing
  // line so the transition into the CTA reads correctly.
  const buttonBg = isNordics ? '#016BA7' : LIME
  const buttonFg = isNordics ? '#ffffff' : '#000000'
  const closingLine = isNordics
    ? "If you're redefining digital creativity from the Nordics, in ways only your country can, we want to see your work in the Lovie Awards."
    : FALLBACK_CLOSING_LINE

  return (
    <footer
      id="about-lovie"
      data-snap
      style={{
        // Solid purple ground. Med bakes Spain/Italy/Portugal flag hearts
        // + a dashed curve into the PNG; Nordics uses just the plain
        // purple ground with the SE/DK/FI/NO country stickers overlaid
        // in code so the same layout supports both regions.
        backgroundImage: isNordics ? undefined : 'url(/lovie/about-bg-purple.png)',
        backgroundColor: isNordics ? '#FFF3D1' : undefined,
        backgroundSize: 'cover',
        // Negative y shifts the image up so the heart's lower black
        // portion lands behind "About The Lovie Awards." instead of
        // sitting fully above the headline.
        backgroundPosition: 'center -144px',
        padding: isNordics ? '240px 24px 220px' : '120px 24px 220px',
        fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
        color: isNordics ? '#000000' : '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isNordics && <NordicsStickerBand />}
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.h2
          style={{
            fontSize: 'clamp(34px, 5vw, 56px)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
            color: isNordics ? '#000000' : '#ffffff',
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
          style={{ width: 48, height: 2, background: isNordics ? '#016BA7' : LIME, margin: '0 auto 32px' }}
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        />

        {/* Deadline — bold accent, treated as the first body paragraph */}
        <motion.p
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: isNordics ? '#016BA7' : LIME,
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
            <PortableText value={body} components={isNordics ? nordicsPortableTextComponents : portableTextComponents} />
          ) : (
            FALLBACK_BODY.map((p, i) => (
              <p
                key={i}
                style={{ fontSize: 16, lineHeight: 1.7, color: isNordics ? '#000000' : '#ffffff', margin: '0 0 20px', opacity: isNordics ? 0.85 : 0.92 }}
              >
                {p}
              </p>
            ))
          )}
        </motion.div>

        {/* Closing transitional line — leads into the CTA. Roman on
            Nordics per the no-italic-subheaders rule; italic on Med. */}
        <motion.p
          style={{
            fontSize: 18,
            fontStyle: isNordics ? 'normal' : 'italic',
            fontWeight: 400,
            color: isNordics ? '#000000' : '#ffffff',
            opacity: isNordics ? 0.85 : 1,
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
          {closingLine}
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
            background: buttonBg,
            color: buttonFg,
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

// Decorative band of 4 Nordic country heart-stickers arranged along a
// dashed curve at the top of the About Lovie footer. Mirrors the
// Mediterranean baked-in PNG treatment (Portugal / Italy / Spain along a
// curve) but with SE / DK / FI / NO instead. Sticker positions echo the
// asymmetric flow of the Med PNG — one dips low on the left, two ride
// the top, one dips low on the right.
function NordicsStickerBand() {
  // Stickers hug the far left / far right so the centered "About The
  // Lovie Awards" title + deadline copy stay uncovered. Two on each
  // side, staggered vertically for a bit of rhythm.
  const stickers = [
    { src: '/lovie/norway-sticker.svg',  left: '3%',  top: 40, size: 170, rotate: -4 },
    { src: '/lovie/sweden-sticker.svg',  left: '18%', top: 0,  size: 170, rotate: 3 },
    { src: '/lovie/denmark-sticker.svg', left: '76%', top: 20, size: 170, rotate: -2 },
    { src: '/lovie/finland-sticker.svg', left: '90%', top: 30, size: 170, rotate: 5 },
  ]
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 210,
        pointerEvents: 'none',
      }}
    >
      {/* Dashed curve winding through the 4 stickers. Confined to the
          top ~200px of the section so it never runs through the
          "About The Lovie Awards" title below. */}
      <svg
        viewBox="0 0 1000 160"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <path
          d="M 0 140 C 200 20, 340 20, 500 90 S 780 150, 1000 60"
          fill="none"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="2 14"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {stickers.map((s, i) => (
        <img
          key={i}
          src={s.src}
          alt=""
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: `clamp(90px, 12vw, ${s.size}px)`,
            height: 'auto',
            transform: `translateX(-50%) rotate(${s.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}
