'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

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
// accent divider below.
export function SectionHeader({
  title,
  accentColor = RED,
}: {
  title: string
  accentColor?: string
}) {
  return (
    <>
      <motion.h3
        style={{
          fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
          fontSize: 'clamp(1.5rem, 3vw, 36px)',
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          color: MOSS,
          margin: '0 0 24px',
        }}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h3>
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
