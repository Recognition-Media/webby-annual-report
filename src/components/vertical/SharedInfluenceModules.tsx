'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type {
  SIContentBlock,
  SIContentSlab,
  SIBodyBlock,
  SISectionHeaderBlock,
  SIAudienceBlock,
  SIPullQuoteBlock,
  SIVideoBlock,
  SITipsBlock,
} from '@/sanity/types'
import { urlFor } from '@/sanity/image'

// ─────────────────────────────────────────────────────────────────
// Shared Influence — reusable content modules for the report's six
// sections. Each module renders on the Anthem beige body ground and
// picks up colours from the Anthem palette (red #8C001C, purple
// #D17DD0, blue #066DBA, green #00B469, moss #21261A, beige #E3DDCA).
// Content is passed via props so a later pass can wire them to CMS
// fields without re-doing the layouts.
// ─────────────────────────────────────────────────────────────────

const BEIGE = '#E3DDCA'
const MOSS = '#21261A'
const TAN = '#d5cfbc'
const CARD_LIGHT = '#F5EFDB'
const RED = '#8C001C'

// ─────────────────────────────────────────────────────────────────
// Heading scale — Roc Grotesk Variable bold. Consistent across the
// Shared Influence report so section headers, CMS-inserted headings
// in Portable Text body, and future editorial headings all read from
// the same modular scale. Level 3 = 36px = the default SectionHeader
// size (the "Finding the right partner…" beat above each section).
// ─────────────────────────────────────────────────────────────────

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export const HEADING_SCALE: Record<HeadingLevel, {
  fontSize: number
  lineHeight: number
  letterSpacing: string
}> = {
  1: { fontSize: 64, lineHeight: 1.05, letterSpacing: '-0.02em' },
  2: { fontSize: 48, lineHeight: 1.1, letterSpacing: '-0.02em' },
  3: { fontSize: 36, lineHeight: 1.15, letterSpacing: '-0.01em' },
  4: { fontSize: 28, lineHeight: 1.2, letterSpacing: '-0.01em' },
  5: { fontSize: 22, lineHeight: 1.25, letterSpacing: '-0.005em' },
  6: { fontSize: 18, lineHeight: 1.3, letterSpacing: '-0.005em' },
}

// Heading — semantic h1..h6 element that pulls its size, line height,
// and letter spacing from the shared HEADING_SCALE. Font family, weight,
// and color are locked to the Shared Influence editorial style; pass
// `style` to override per-instance if needed.
export function Heading({
  level = 3,
  children,
  style,
  color = MOSS,
}: {
  level?: HeadingLevel
  children: React.ReactNode
  style?: React.CSSProperties
  color?: string
}) {
  const scale = HEADING_SCALE[level]
  const commonStyle: React.CSSProperties = {
    fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
    fontWeight: 500,
    color,
    margin: '0 0 24px',
    ...scale,
    ...style,
  }
  // React narrows the tag name so we render one of the six literal
  // elements based on `level`.
  switch (level) {
    case 1: return <h1 style={commonStyle}>{children}</h1>
    case 2: return <h2 style={commonStyle}>{children}</h2>
    case 3: return <h3 style={commonStyle}>{children}</h3>
    case 4: return <h4 style={commonStyle}>{children}</h4>
    case 5: return <h5 style={commonStyle}>{children}</h5>
    case 6: return <h6 style={commonStyle}>{children}</h6>
  }
}

interface SectionShellProps {
  children: React.ReactNode
  /** Extra bottom padding tuning (default section is beige with generous
   *  vertical rhythm — 96px top/bottom). */
  className?: string
}

/** Common shell: beige ground, max-1200 centered column, generous
 *  vertical padding. Modules compose inside this. */
export function SectionShell({ children, className = '' }: SectionShellProps) {
  return (
    <section
      className={`relative px-5 md:px-[60px] py-16 md:py-24 ${className}`}
      style={{ background: BEIGE }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>{children}</div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// Body — long-form editorial paragraphs. Max-720 centered column
// keeps line lengths in the readable range.
// ─────────────────────────────────────────────────────────────────
// SectionHeader — big content-level header used inside a 2-column slab
// (mirrors the SoSI "trend title" beat, without the eyebrow). Sits
// above the body paragraphs in the left column and pairs with a short
// accent divider below. Renders via <Heading level={...}> so the size
// stays in sync with the shared HEADING_SCALE. Default level 3 = 36px.
export function SectionHeader({
  title,
  level = 3,
  accentColor = RED,
}: {
  title: string
  level?: HeadingLevel
  accentColor?: string
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Heading level={level} style={{ margin: '0 0 24px' }}>
          {title}
        </Heading>
      </motion.div>
      <div style={{ width: 36, height: 2, background: accentColor, marginBottom: 28 }} />
    </>
  )
}

export function SharedInfluenceBody({ paragraphs }: { paragraphs: React.ReactNode[] }) {
  return (
    <div>
      {paragraphs.map((p, i) => (
        <motion.p
          key={i}
          style={{
            fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
            fontSize: 17,
            lineHeight: 1.7,
            color: MOSS,
            margin: '0 0 24px',
          }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
        >
          {p}
        </motion.p>
      ))}
    </div>
  )
}

// TwoColumnSlab — the SoSI "TrendContent" pattern. Left rail + right
// rail, each 50% on desktop, stacked on mobile. Beige ground, generous
// vertical padding. Compose modules into it.
export function TwoColumnSlab({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <section
      className="relative px-5 md:px-[60px] py-16 md:py-24"
      style={{ background: BEIGE }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div className="flex flex-col md:flex-row gap-10 md:gap-16">
          <div className="md:w-[50%]">{left}</div>
          <div className="md:w-[50%]">{right}</div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────
// ComparisonCallout — two side-by-side cards with a "vs." pivot in
// the middle. Uses the reference design's editorial rhythm: small
// caps eyebrow, big Decoy display word, description below.
// ─────────────────────────────────────────────────────────────────

interface ComparisonSide {
  label: string
  word: string
  description: string
}

export function ComparisonCallout({
  left,
  right,
  description,
}: {
  left: ComparisonSide
  right: ComparisonSide
  /** Optional short intro line rendered above the split panel. */
  description?: string
}) {
  return (
    <div>
      {description && (
        <motion.p
          style={{
            fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
            fontSize: 14,
            lineHeight: 1.5,
            color: MOSS,
            opacity: 0.7,
            margin: '0 0 16px',
          }}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {description}
        </motion.p>
      )}
      {/* Stacked layout: cards fill the column width, "vs." pivots
          between them. Gives each card room to breathe when the module
          sits inside a 50% slab column. */}
      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 12,
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        <ComparisonCard side={left} variant="red" />
        <div
          style={{
            fontFamily: "'decoy', Georgia, serif",
            fontSize: 22,
            fontStyle: 'italic',
            color: MOSS,
            opacity: 0.55,
            textAlign: 'center',
            padding: '4px 0',
          }}
        >
          vs.
        </div>
        <ComparisonCard side={right} variant="cream" />
      </motion.div>
    </div>
  )
}

function ComparisonCard({ side, variant }: { side: ComparisonSide; variant: 'red' | 'cream' }) {
  const isRed = variant === 'red'
  const bg = isRed ? RED : '#F5EFDB'
  const textColor = isRed ? '#E3DDCA' : MOSS
  const labelColor = isRed ? '#E3DDCA' : RED
  const wordColor = isRed ? '#E3DDCA' : MOSS
  return (
    <div
      style={{
        background: bg,
        color: textColor,
        padding: '32px 28px 36px',
        borderRadius: 14,
      }}
    >
      <p
        style={{
          fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
          fontSize: 11,
          letterSpacing: 3,
          textTransform: 'uppercase',
          fontWeight: 700,
          color: labelColor,
          margin: '0 0 16px',
        }}
      >
        {side.label}
      </p>
      <h3
        style={{
          fontFamily: "'decoy', Georgia, serif",
          fontSize: 45,
          fontWeight: 700,
          lineHeight: 1,
          color: wordColor,
          margin: '0 0 20px',
        }}
      >
        {side.word}
      </h3>
      <p
        style={{
          fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
          fontSize: 14,
          lineHeight: 1.5,
          margin: 0,
          opacity: isRed ? 0.9 : 1,
        }}
      >
        {side.description}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// TipsForSuccess — small numbered list with a bold title.
// ─────────────────────────────────────────────────────────────────

export function TipsForSuccess({
  title = 'Tips for Success',
  tips,
  accentColor = RED,
}: {
  title?: string
  tips: string[]
  accentColor?: string
}) {
  return (
    <div>
      <motion.h3
        style={{
          fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
          fontSize: 32,
          fontWeight: 700,
          color: MOSS,
          margin: '0 0 24px',
        }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h3>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {tips.map((tip, i) => (
          <motion.li
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr',
              gap: 16,
              padding: '14px 0',
              fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
              fontSize: 18,
              lineHeight: 1.55,
              color: MOSS,
            }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <span style={{ fontWeight: 700, color: accentColor }}>{String(i + 1).padStart(2, '0')}</span>
            <span>{tip}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// VideoModule — embed a descript.com clip (or any iframe-able source)
// with an attribution block below.
// ─────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────
// PullQuote — inline editorial pull quote with attribution. Used for
// expert quotes throughout the Shared Influence sections. Red vertical
// rule on the left, quote text in Decoy roman, attribution below.
// ─────────────────────────────────────────────────────────────────

export function PullQuote({
  quote,
  name,
  role,
  headshotSrc,
  accentColor = RED,
}: {
  quote: string
  name: string
  role: string
  /** Optional headshot image path. When supplied, renders as a large
   *  circular avatar to the LEFT of the quote text (SoSI-style
   *  structure, Lovie-sized headshot). */
  headshotSrc?: string
  accentColor?: string
}) {
  return (
    <motion.blockquote
      style={{
        margin: '32px 0 0',
        padding: 0,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 20,
      }}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {headshotSrc && (
        <img
          src={headshotSrc}
          alt={name}
          style={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      )}
      <div
        style={{
          borderLeft: `3px solid ${accentColor}`,
          paddingLeft: 20,
          flex: 1,
        }}
      >
        <p
          style={{
            fontFamily: "'decoy', Georgia, serif",
            fontSize: 22,
            lineHeight: 1.35,
            color: MOSS,
            margin: '0 0 12px',
          }}
        >
          {quote}
        </p>
        <p
          style={{
            fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
            fontSize: 13,
            color: MOSS,
            opacity: 0.65,
            margin: 0,
          }}
        >
          — <strong style={{ fontWeight: 600, opacity: 1 }}>{name}</strong>, {role}
        </p>
      </div>
    </motion.blockquote>
  )
}

// ─────────────────────────────────────────────────────────────────
// AudienceBlock — the "If You Are A Creator" / "If You Are An Impact
// Leader" sub-section pattern. Small caps label + body text; can host
// a nested PullQuote below.
// ─────────────────────────────────────────────────────────────────

export function AudienceBlock({
  label,
  paragraphs,
  children,
  accentColor = RED,
}: {
  label: string
  paragraphs: React.ReactNode[]
  /** Optional nested content (e.g. a PullQuote). */
  children?: React.ReactNode
  accentColor?: string
}) {
  return (
    <div>
      <motion.p
        style={{
          fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
          fontSize: 13,
          letterSpacing: 3,
          textTransform: 'uppercase',
          fontWeight: 700,
          color: accentColor,
          margin: '0 0 16px',
        }}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {label}
      </motion.p>
      {paragraphs.map((p, i) => (
        <motion.p
          key={i}
          style={{
            fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
            fontSize: 17,
            lineHeight: 1.65,
            color: MOSS,
            margin: '0 0 20px',
          }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 + i * 0.06 }}
        >
          {p}
        </motion.p>
      ))}
      {children}
    </div>
  )
}

// VideoModule — native <video> element with play/pause toggle, mirroring
// the SoSI (State of Social Impact) QuoteVideoSection treatment:
// 16:9 dark frame, big play-triangle overlay when paused, pill-shaped
// "Watch Video" button in the caption row that toggles Watch/Pause.
// Auto-pauses when the section scrolls out of view so audio doesn't
// keep playing over the reader.
export function VideoModule({
  src,
  name,
  title,
  eyebrow,
  buttonLabel = 'Watch Video',
  accentColor = RED,
  orientation = 'landscape',
}: {
  /** Local /public path or absolute URL to an mp4. */
  src: string
  name: string
  title: string
  /** Optional small-caps eyebrow above the video (e.g. "Watch").
   *  Omit to render the module without one. */
  eyebrow?: string
  buttonLabel?: string
  accentColor?: string
  /** `landscape` = 16:9 (default). `portrait` = 9:16 at 480px tall
   *  with caption + button stacked vertically alongside the video. */
  orientation?: 'landscape' | 'portrait'
}) {
  const isPortrait = orientation === 'portrait'
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const isInView = useInView(containerRef, { amount: 0.3 })

  // Pause when the module scrolls out of view.
  useEffect(() => {
    if (!isInView && isPlaying && videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [isInView, isPlaying])

  function togglePlay() {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const videoFrame = (
    <motion.div
      onClick={togglePlay}
      style={{
        position: 'relative',
        background: MOSS,
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        ...(isPortrait
          ? {
              aspectRatio: '9 / 16',
              height: 480,
              width: 'auto',
            }
          : {
              width: '100%',
              paddingBottom: '56.25%',
            }),
      }}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        onEnded={() => setIsPlaying(false)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {/* Play-triangle overlay — fades out while playing */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 0.3s ease',
          opacity: isPlaying ? 0 : 1,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: '2px solid #E3DDCA',
            background: 'rgba(33,38,26,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="18" viewBox="0 0 12 14" fill="none">
            <path d="M0 0L12 7L0 14V0Z" fill="#E3DDCA" />
          </svg>
        </div>
      </div>
    </motion.div>
  )

  const nameBlock = (
    <div>
      <p
        style={{
          fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
          fontSize: 16,
          fontWeight: 700,
          color: MOSS,
          margin: 0,
        }}
      >
        {name}
      </p>
      <p
        style={{
          fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
          fontSize: 14,
          color: MOSS,
          opacity: 0.55,
          margin: '4px 0 0',
        }}
      >
        {title}
      </p>
    </div>
  )

  const watchButton = (
    <button
      onClick={togglePlay}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 20px',
        borderRadius: 999,
        border: 'none',
        background: accentColor,
        color: '#E3DDCA',
        fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
        fontSize: 11,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontWeight: 500,
        cursor: 'pointer',
        flexShrink: 0,
        alignSelf: 'flex-start',
      }}
    >
      <svg width="12" height="10" viewBox="0 0 14 12" fill="none">
        {/* Left-pointing triangle — cues that this button controls the
            video sitting to the left of it. */}
        <path d="M14 0L0 6L14 12Z" fill="#E3DDCA" />
      </svg>
      {isPlaying ? 'Pause' : buttonLabel}
    </button>
  )

  return (
    <div ref={containerRef}>
      {eyebrow && (
        <p
          style={{
            fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
            fontSize: 11,
            letterSpacing: 4,
            textTransform: 'uppercase',
            fontWeight: 500,
            color: accentColor,
            margin: '0 0 16px',
          }}
        >
          {eyebrow}
        </p>
      )}

      {isPortrait ? (
        // Portrait layout: video on the left, caption + button stacked
        // together (name + title + Watch pill as one group), anchored
        // to the bottom of the video's height so the group sits parallel
        // to the CC track on the video.
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 24 }}>
          {videoFrame}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: 16,
              flex: 1,
              paddingBottom: 24,
            }}
          >
            {nameBlock}
            {watchButton}
          </div>
        </div>
      ) : (
        // Landscape layout: video full-width, caption row underneath.
        <>
          {videoFrame}
          <div
            style={{
              paddingTop: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            {nameBlock}
            {watchButton}
          </div>
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// CMS block renderers (Option C — repeatable content blocks)
// Each renderer maps a Sanity block type → the existing React module
// so the same visual language is preserved whether content is hardcoded
// or CMS-driven.
// ─────────────────────────────────────────────────────────────────

// Rich text components as a factory so each render can inject the
// current section's accentColor into link marks (and anywhere else
// colour should follow the section palette).
function makeRichTextComponents(accentColor: string): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => (
        <p
          style={{
            fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
            fontSize: 17,
            lineHeight: 1.7,
            color: MOSS,
            margin: '0 0 20px',
          }}
        >
          {children}
        </p>
      ),
    },
    marks: {
      strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
      em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
      link: ({ value, children }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: accentColor, textDecoration: 'underline', textUnderlineOffset: 3 }}
        >
          {children}
        </a>
      ),
    },
  }
}

function BodyBlockRenderer({ block, accentColor }: { block: SIBodyBlock; accentColor: string }) {
  if (!block.body || block.body.length === 0) return null
  return <PortableText value={block.body} components={makeRichTextComponents(accentColor)} />
}

function SectionHeaderBlockRenderer({ block, accentColor }: { block: SISectionHeaderBlock; accentColor: string }) {
  return <SectionHeader title={block.title} level={block.level ?? 3} accentColor={accentColor} />
}

function PullQuoteBlockRenderer({ block, accentColor }: { block: SIPullQuoteBlock; accentColor: string }) {
  const headshotSrc = block.headshot ? urlFor(block.headshot).width(360).height(360).fit('crop').url() : undefined
  return (
    <PullQuote
      quote={block.quote}
      name={block.name}
      role={block.role ?? ''}
      headshotSrc={headshotSrc}
      accentColor={accentColor}
    />
  )
}

function AudienceBlockRenderer({ block, accentColor }: { block: SIAudienceBlock; accentColor: string }) {
  const paragraphs: React.ReactNode[] = block.body && block.body.length > 0
    ? [<PortableText key="body" value={block.body} components={makeRichTextComponents(accentColor)} />]
    : []
  return (
    <AudienceBlock label={block.label} paragraphs={paragraphs} accentColor={accentColor}>
      {block.inlineQuote && <PullQuoteBlockRenderer block={block.inlineQuote} accentColor={accentColor} />}
    </AudienceBlock>
  )
}

function VideoBlockRenderer({ block, accentColor }: { block: SIVideoBlock; accentColor: string }) {
  const src = block.videoFile?.url
  if (!src) return null
  return (
    <VideoModule
      src={src}
      name={block.name ?? ''}
      title={block.title ?? ''}
      orientation={block.orientation ?? 'landscape'}
      eyebrow={block.eyebrow}
      accentColor={accentColor}
    />
  )
}

function TipsBlockRenderer({ block, accentColor }: { block: SITipsBlock; accentColor: string }) {
  if (!block.items || block.items.length === 0) return null
  return <TipsForSuccess title={block.title || 'Tips for Success'} tips={block.items} accentColor={accentColor} />
}

/** Renders a single CMS content block. Returns null for empty/unknown
 *  block types so slabs stay clean when partially populated.
 *  `accentColor` flows down from the trendSection so every block picks
 *  up the section's palette (red default, purple for Section 2, etc.). */
function ContentBlockRenderer({ block, accentColor }: { block: SIContentBlock; accentColor: string }) {
  switch (block._type) {
    case 'siBodyBlock': return <BodyBlockRenderer block={block} accentColor={accentColor} />
    case 'siSectionHeaderBlock': return <SectionHeaderBlockRenderer block={block} accentColor={accentColor} />
    case 'siAudienceBlock': return <AudienceBlockRenderer block={block} accentColor={accentColor} />
    case 'siPullQuoteBlock': return <PullQuoteBlockRenderer block={block} accentColor={accentColor} />
    case 'siVideoBlock': return <VideoBlockRenderer block={block} accentColor={accentColor} />
    case 'siTipsBlock': return <TipsBlockRenderer block={block} accentColor={accentColor} />
    default: return null
  }
}

/** Renders an array of CMS content blocks as a single column stack.
 *  Adjacent blocks are separated visually via each module's own margin. */
export function ContentBlockList({ blocks, accentColor }: { blocks?: SIContentBlock[]; accentColor: string }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <>
      {blocks.map((block, i) => (
        <ContentBlockRenderer key={block._key || i} block={block} accentColor={accentColor} />
      ))}
    </>
  )
}

/** Renders a single CMS-driven slab: 2-column layout via TwoColumnSlab
 *  with block arrays composed on each side. */
export function ContentSlabRenderer({ slab, accentColor }: { slab: SIContentSlab; accentColor: string }) {
  return (
    <TwoColumnSlab
      left={<ContentBlockList blocks={slab.leftBlocks} accentColor={accentColor} />}
      right={<ContentBlockList blocks={slab.rightBlocks} accentColor={accentColor} />}
    />
  )
}

/** Renders all slabs in order. `accentColor` comes from the parent
 *  trendSection so blocks pick up the section palette by default. */
export function ContentSlabsRenderer({
  slabs,
  accentColor = RED,
}: {
  slabs?: SIContentSlab[]
  accentColor?: string
}) {
  if (!slabs || slabs.length === 0) return null
  return (
    <>
      {slabs.map((slab, i) => (
        <ContentSlabRenderer key={slab._key || i} slab={slab} accentColor={accentColor} />
      ))}
    </>
  )
}
