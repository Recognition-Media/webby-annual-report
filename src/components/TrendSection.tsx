'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import type { TrendSection as TrendSectionType } from '@/sanity/types'
import { AnimatedBg } from './AnimatedBg'
import { urlFor } from '@/sanity/image'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const TREND_COLORS = [
  '#8B70D1', // purple
  '#82D8EB', // cyan
  '#FF7F63', // coral
  '#80D064', // green
  '#FFB763', // orange
]

export function TrendSection({ section, index }: { section: TrendSectionType; index: number }) {
  const trendColor = TREND_COLORS[index % TREND_COLORS.length]
  const allQuotes = section.expertQuotes || []
  const quotes = allQuotes.slice(0, 3) // Max 3 quotes
  // Phases: 0 = title+copy, 1..3 = quotes, +video for trend 1 only
  const hasVideo = index === 0
  const totalPhases = 1 + quotes.length + (hasVideo ? 1 : 0)
  const [phase, setPhase] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [videoClosed, setVideoClosed] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const lockRef = useRef(false)
  const enterCooldownRef = useRef(false)

  // Track when this section is in view
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting)
        if (entry.isIntersecting) {
          enterCooldownRef.current = true
          setTimeout(() => { enterCooldownRef.current = false }, 800)
          // Reset video closed state when returning to this trend
          setVideoClosed(false)
        }
        // Never reset phase — preserve wherever the user left off
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const advancePhase = useCallback(() => {
    if (lockRef.current) return
    if (phase < totalPhases - 1) {
      lockRef.current = true
      const nextPhase = phase + 1
      // Skip video if it was closed — go straight to next trend
      if (hasVideo && nextPhase === totalPhases - 1 && videoClosed) {
        setCompleted(true)
        setTimeout(() => { lockRef.current = false }, 600)
        window.dispatchEvent(new CustomEvent('trend-next-or-exit'))
        return
      }
      setPhase(nextPhase)
      if (nextPhase === totalPhases - 1) {
        setCompleted(true)
      }
      setTimeout(() => { lockRef.current = false }, 600)
    } else if (phase === totalPhases - 1) {
      // Already on last phase — go to next trend or exit
      window.dispatchEvent(new CustomEvent('trend-next-or-exit'))
    }
  }, [phase, totalPhases, hasVideo, videoClosed])

  const retreatPhase = useCallback(() => {
    if (lockRef.current) return
    if (phase > 0) {
      lockRef.current = true
      setPhase((p) => p - 1)
      setTimeout(() => { lockRef.current = false }, 600)
      return true
    }
    // At phase 0 — go to previous trend
    if (index > 0) {
      window.dispatchEvent(new Event('trend-prev'))
    }
    return false
  }, [phase, index])

  // Lock scrolling while inside an incomplete trend
  useEffect(() => {
    if (!isActive) return

    // Let the snap scroll finish, then lock
    document.documentElement.classList.remove('snap-active')
    const lockTimeout = setTimeout(() => {
      document.body.style.overflow = 'hidden'
    }, 600)

    function handleWheel(e: WheelEvent) {
      if (Math.abs(e.deltaY) < 5) return
      // Allow scroll up on phase 0 to go back
      if (e.deltaY < 0 && phase === 0) {
        document.body.style.overflow = ''
        if (index === 0) {
          // First trend — scroll back to judging page
          document.documentElement.classList.add('snap-active')
        } else {
          // Other trends — scroll back to previous trend
          const prevTrend = document.getElementById(`trend-${index - 1}`)
          if (prevTrend) {
            prevTrend.scrollIntoView({ behavior: 'smooth' })
          }
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true, capture: true })

    return () => {
      clearTimeout(lockTimeout)
      window.removeEventListener('wheel', handleWheel, true)
      document.body.style.overflow = ''
      // Only re-enable snap if not on the goodbye page
      const thankYou = document.getElementById('thank-you')
      const thankYouRect = thankYou?.getBoundingClientRect()
      const goingToGoodbye = thankYouRect && thankYouRect.top < window.innerHeight
      if (!goingToGoodbye) {
        document.documentElement.classList.add('snap-active')
      }
    }
  }, [isActive, phase])

  // Expose advance/retreat for click-to-navigate (via custom events)
  useEffect(() => {
    if (!isActive) return
    function handleAdvance() { advancePhase() }
    function handleRetreat() { retreatPhase() }
    window.addEventListener('trend-advance', handleAdvance)
    window.addEventListener('trend-retreat', handleRetreat)
    return () => {
      window.removeEventListener('trend-advance', handleAdvance)
      window.removeEventListener('trend-retreat', handleRetreat)
    }
  }, [isActive, advancePhase, retreatPhase])

  return (
    <div
      data-trend-active={isActive ? 'true' : undefined}
      data-trend-completed={completed ? 'true' : undefined}
      data-trend-total-phases={totalPhases}
      data-trend-index={index}
      data-trend-phase={phase}
      ref={sectionRef}
      style={{
        width: '100vw',
        height: '100vh',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        padding: '0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatedBg variant={index} />

      <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '80vh' }}>

        {/* Page 0: Title + Body — always rendered */}
        <motion.div
          animate={{ opacity: phase === 0 ? 1 : 0, x: phase === 0 ? 0 : -200 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: 'absolute', top: 12, left: 0, right: 0, bottom: 0,
            pointerEvents: phase === 0 ? 'auto' : 'none',
          }}
        >
          <PhaseTitle
            title={section.trendTitle}
            body={section.trendBody}
            featuredProjects={section.featuredProjects}
            index={index}
            color={trendColor}
          />
        </motion.div>

        {/* Quote pages — each always rendered, accumulating on screen */}
        {quotes.map((quote, i) => {
          const quotePhase = i + 1
          const isCurrentPage = phase === quotePhase
          const isVisible = phase >= quotePhase && phase < (hasVideo ? totalPhases - 1 : totalPhases)
          const isVideoPhase = hasVideo && phase === totalPhases - 1
          const visibleCount = Math.min(phase, quotes.length)
          const position = visibleCount - (i + 1)

          return (
            <div
              key={`quote-wrapper-${i}`}
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: isCurrentPage ? 'auto' : 'none',
              }}
            >
              <PhaseQuote
                quote={quote}
                position={position}
                visibleCount={visibleCount}
                isNew={phase === quotePhase}
                visible={isVisible || isVideoPhase}
                videoActive={isVideoPhase}
                color={trendColor}
              />
            </div>
          )
        })}
      </div>

      {/* Video page — always rendered if trend has video */}
      {hasVideo && (
        <motion.div
          animate={{
            opacity: phase === totalPhases - 1 ? 1 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: phase === totalPhases - 1 ? 'auto' : 'none',
            zIndex: 20,
          }}
        >
          <PhaseVideo onClose={() => { setVideoClosed(true); setPhase(totalPhases - 2) }} isActive={isActive && phase === totalPhases - 1} />
        </motion.div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Phase: Title + Body                                                */
/* ------------------------------------------------------------------ */

function PhaseTitle({
  title,
  body,
  featuredProjects,
  index,
  color,
}: {
  title: string
  body?: any[]
  featuredProjects?: { title: string; url?: string }[]
  index: number
  color: string
}) {
  // Strip emojis from title
  const cleanTitle = title.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim()
  const trendNumber = String(index + 1).padStart(2, '0')

  return (
    <div style={{ position: 'relative' }}>


      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Eyebrow with trend number */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: color,
              fontWeight: 500,
            }}
          >
            Trend {trendNumber}
          </span>
          <div style={{ width: 60, height: 2, background: color, borderRadius: 2 }} />
        </div>

        {/* Title — large, editorial */}
        <h2
          style={{
            fontSize: 48,
            fontWeight: 400,
            color: '#fff',
            lineHeight: '58px',
            letterSpacing: '-2px',
            marginBottom: 40,
            maxWidth: 750,
          }}
        >
          {cleanTitle}
        </h2>

        {/* Divider line */}
        <div
          style={{
            width: 80,
            height: 1,
            background: 'rgba(255,255,255,0.14)',
            marginBottom: 32,
          }}
        />

        {/* Body — two column feel with narrower text */}
        {body && (
          <div style={{ display: 'flex', gap: 60 }}>
            <div
              data-content
              style={{
                fontSize: 16,
                lineHeight: '28px',
                color: '#D4D4D4',
                maxWidth: 749,
                flex: '0 0 auto',
              }}
            >
              <div className="report-links [&_p]:mb-4">
                <PortableText value={body} />
              </div>

              {/* Featured projects */}
              {featuredProjects && featuredProjects.length > 0 && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: color, fontWeight: 500, marginBottom: 8 }}>
                    Standout Projects
                  </p>
                  <p style={{ fontSize: 14, color: '#999', lineHeight: 1.6 }}>
                    {featuredProjects.map((project, i) => (
                      <span key={i}>
                        {i > 0 && '  ·  '}
                        {project.url ? (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="report-link"
                          >
                            {project.title}
                          </a>
                        ) : (
                          <span style={{ color: '#D4D4D4' }}>{project.title}</span>
                        )}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Phase: Quote                                                       */
/* ------------------------------------------------------------------ */

// Positions for quotes as they accumulate
// Counter-clockwise: newest enters right-center, older ones rotate left and up
function getQuoteLayout(position: number, visibleCount: number) {
  if (visibleCount === 1) {
    // Single quote: centered
    return { top: '50%', left: '50%', xOffset: '-50%', yOffset: '-50%', scale: 1, opacity: 1, maxWidth: 600 }
  }
  if (visibleCount === 2) {
    if (position === 0) {
      // Newest: centered but moved up above the dots
      return { top: '40%', left: '50%', xOffset: '-50%', yOffset: '-50%', scale: 1, opacity: 1, maxWidth: 550 }
    }
    // Older: top-left
    return { top: '15%', left: '0%', xOffset: '0%', yOffset: '0%', scale: 0.8, opacity: 0.35, maxWidth: 420 }
  }
  // 3 quotes
  if (position === 0) {
    // Newest: above the 2nd quote, 5px left of its left margin
    return { top: '-8%', left: 'calc(50% - 5px)', xOffset: '-50%', yOffset: '0%', scale: 1, opacity: 1, maxWidth: 550 }
  }
  if (position === 1) {
    // 2nd quote: down and right, shrinks and dims
    return { top: '52%', left: '35%', xOffset: '-50%', yOffset: '-50%', scale: 0.8, opacity: 0.35, maxWidth: 800 }
  }
  // Oldest: stays top-left, unchanged
  return { top: '15%', left: '0%', xOffset: '0%', yOffset: '0%', scale: 0.8, opacity: 0.35, maxWidth: 420 }
}

function PhaseQuote({
  quote,
  position,
  visibleCount,
  isNew,
  visible = false,
  videoActive = false,
  color,
}: {
  quote: { name: string; title?: string; quoteText: any[]; linkedInUrl?: string }
  position: number
  visibleCount: number
  isNew: boolean
  visible?: boolean
  videoActive?: boolean
  color: string
}) {
  const layout = getQuoteLayout(position, visibleCount)
  const isLatest = position === 0

  // When video is active, all quotes dim further and the newest shrinks too
  const finalOpacity = !visible ? 0 : videoActive ? 0.15 : layout.opacity
  const finalScale = videoActive && isLatest ? 0.8 : layout.scale

  return (
    <motion.div
      initial={isNew ? { opacity: 0, x: 300, scale: 1 } : false}
      animate={{
        opacity: finalOpacity,
        scale: finalScale,
        x: 0,
        top: layout.top,
        left: layout.left,
        maxWidth: layout.maxWidth,
      }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: 'absolute',
        transform: `translate(${layout.xOffset}, ${layout.yOffset})`,
        transformOrigin: 'top left',
      }}
    >
      {/* Large quote mark */}
      <div
        style={{
          fontSize: 100,
          lineHeight: 0.8,
          color: 'rgba(139, 112, 209, 0.15)',
          fontWeight: 700,
          marginBottom: -24,
          userSelect: 'none',
        }}
      >
        &ldquo;
      </div>

      {/* Quote text */}
      <div
        data-content
        style={{
          fontSize: 20,
          lineHeight: 1.5,
          color: '#fff',
          fontWeight: 400,
          marginBottom: 20,
        }}
      >
        <div className="report-links [&_p]:inline">
          <PortableText value={quote.quoteText} />
        </div>
      </div>

      {/* Attribution */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 2, background: color, borderRadius: 2 }} />
        <div>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>
            {quote.linkedInUrl ? (
              <a
                href={quote.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fff', textDecoration: 'none' }}
              >
                {quote.name}
              </a>
            ) : (
              quote.name
            )}
          </p>
          {quote.title && (
            <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>{quote.title}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Phase: Video                                                       */
/* ------------------------------------------------------------------ */

function PhaseVideo({ onClose, isActive }: { onClose: () => void; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(false)

  // Play with audio when active, pause when not
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isActive) {
      video.currentTime = 0
      video.muted = false
      video.play().catch(() => {
        video.muted = true
        setMuted(true)
        video.play()
      })
      setMuted(false)
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isActive])

  function toggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setMuted(videoRef.current.muted)
    }
  }

  function replay() {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="no-custom-cursor"
        style={{
          position: 'absolute',
          top: -40,
          right: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30,
          pointerEvents: 'auto',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5">
          <line x1="2" y1="2" x2="12" y2="12" />
          <line x1="12" y1="2" x2="2" y2="12" />
        </svg>
      </button>
      <video
        ref={videoRef}
        src={`${basePath}/trend-video-test.mp4`}
        playsInline
        style={{
          maxHeight: '70vh',
          width: 'auto',
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      />
      {/* Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          display: 'flex',
          gap: 8,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={toggleMute}
          className="no-custom-cursor"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
          }}
        >
          {muted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
        <button
          onClick={replay}
          className="no-custom-cursor"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
      </div>
    </div>
  )
}
