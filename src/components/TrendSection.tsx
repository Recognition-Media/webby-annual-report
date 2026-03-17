'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TrendSection as TrendSectionType } from '@/sanity/types'
import { urlFor } from '@/sanity/image'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function TrendSection({ section, index }: { section: TrendSectionType; index: number }) {
  const allQuotes = section.expertQuotes || []
  const quotes = allQuotes.slice(0, 3) // Max 3 quotes
  // Phases: 0 = title+copy, 1..3 = quotes, 4 = video
  const totalPhases = 1 + quotes.length + 1
  const [phase, setPhase] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [completed, setCompleted] = useState(false)
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
        } else {
          setPhase(0)
          // Don't reset completed — once unlocked, stays unlocked
        }
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
      setPhase(nextPhase)
      if (nextPhase === totalPhases - 1) {
        setCompleted(true)
      }
      setTimeout(() => { lockRef.current = false }, 600)
    }
  }, [phase, totalPhases])

  const retreatPhase = useCallback(() => {
    if (lockRef.current) return
    if (phase > 0) {
      lockRef.current = true
      setPhase((p) => p - 1)
      setTimeout(() => { lockRef.current = false }, 600)
      return true
    }
    return false
  }, [phase])

  // Lock scrolling while inside an incomplete trend
  useEffect(() => {
    if (!isActive) return

    // Let the snap scroll finish, then lock
    document.documentElement.classList.remove('snap-active')
    const lockTimeout = setTimeout(() => {
      if (!completed) {
        document.body.style.overflow = 'hidden'
      }
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
      document.documentElement.classList.add('snap-active')
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
      data-trend-active={isActive && !completed ? 'true' : undefined}
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
      {/* Animated corner squiggles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Top-left — purple, tall narrow zigzag */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: 400, height: 750, opacity: 0.5, filter: 'blur(60px)', animation: 'blobDrift1 20s ease-in-out infinite' }} viewBox="0 0 80 250" fill="#8B70D1">
          <path d="M40 0 L75 35 L40 70 L75 105 L40 140 L75 175 L40 210 L40 250 L5 215 L40 180 L5 145 L40 110 L5 75 L40 40 Z" />
        </svg>
        {/* Top-right — coral, wide short squiggle */}
        <svg style={{ position: 'absolute', top: 0, right: 0, width: 700, height: 400, opacity: 0.5, filter: 'blur(55px)', animation: 'blobDrift2 25s ease-in-out infinite' }} viewBox="0 0 120 120" fill="#FF7F63">
          <path d="M0 60 L30 20 L60 60 L90 20 L120 60 L90 100 L60 60 L30 100 Z" />
        </svg>
        {/* Bottom-left — yellow, compact chunky bolt */}
        <svg style={{ position: 'absolute', bottom: 0, left: 0, width: 350, height: 450, opacity: 0.5, filter: 'blur(50px)', animation: 'blobDrift3 22s ease-in-out infinite' }} viewBox="0 0 100 160" fill="#FFDE67">
          <path d="M50 0 L95 40 L50 50 L95 90 L50 100 L50 160 L5 120 L50 110 L5 70 L50 60 Z" />
        </svg>
        {/* Bottom-right — pink, large sweeping wave */}
        <svg style={{ position: 'absolute', bottom: 0, right: 0, width: 650, height: 600, opacity: 0.5, filter: 'blur(65px)', animation: 'blobDrift4 18s ease-in-out infinite' }} viewBox="0 0 200 180" fill="#FF67CB">
          <path d="M0 90 L40 30 L80 90 L120 30 L160 90 L200 30 L200 150 L160 90 L120 150 L80 90 L40 150 L0 90 Z" />
        </svg>
      </div>

      <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '80vh' }}>
        {/* Phase 0: Title + Body */}
        <AnimatePresence>
          {phase === 0 && (
            <PhaseTitle
              key="title"
              title={section.trendTitle}
              body={section.trendBody}
              featuredProjects={section.featuredProjects}
              index={index}
            />
          )}
        </AnimatePresence>

        {/* Quotes — accumulate, spread across the page, stay during video */}
        {phase >= 1 && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            {quotes.map((quote, i) => {
              const quotePhase = i + 1
              if (phase < quotePhase) return null
              const isVideoPhase = phase === totalPhases - 1
              const visibleCount = Math.min(phase, quotes.length)
              const position = visibleCount - (i + 1)
              return (
                <PhaseQuote
                  key={`quote-${i}`}
                  quote={quote}
                  position={position}
                  visibleCount={visibleCount}
                  isNew={phase === quotePhase}
                  videoActive={isVideoPhase}
                />
              )
            })}
          </div>
        )}

        {/* Phase dots — clickable progress indicator, only when active */}
        {isActive && (
          <div
            style={{
              position: 'fixed',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 60,
              display: 'flex',
              gap: 10,
            }}
          >
            {Array.from({ length: totalPhases }).map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  setPhase(i)
                }}
                style={{
                  width: i === phase ? 14 : 12,
                  height: i === phase ? 14 : 12,
                  borderRadius: '50%',
                  border: 'none',
                  background: i === phase ? '#fff' : 'rgba(255,255,255,0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Video — centered on full viewport */}
      <AnimatePresence>
        {phase === totalPhases - 1 && (
          <PhaseVideo key="video" />
        )}
      </AnimatePresence>
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
}: {
  title: string
  body?: any[]
  featuredProjects?: { title: string; url?: string }[]
  index: number
}) {
  // Strip emojis from title
  const cleanTitle = title.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim()
  const trendNumber = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -200 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Large trend number — background element */}
      <div
        style={{
          position: 'absolute',
          right: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(300px, 35vw, 500px)',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.025)',
          lineHeight: 0.85,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {trendNumber}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Eyebrow with trend number */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#8B70D1',
              fontWeight: 500,
            }}
          >
            Trend {trendNumber}
          </span>
          <div className="gradient-bar" style={{ width: 60, height: 2 }} />
        </div>

        {/* Title — large, editorial */}
        <h2
          style={{
            fontSize: 'clamp(44px, 5vw, 64px)',
            fontWeight: 500,
            color: '#fff',
            lineHeight: 1.08,
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
              <div className="[&_p]:mb-4">
                <PortableText value={body} />
              </div>

              {/* Featured projects */}
              {featuredProjects && featuredProjects.length > 0 && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#8B70D1', fontWeight: 500, marginBottom: 8 }}>
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
                            style={{ color: '#D4D4D4', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.14)' }}
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
    </motion.div>
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
  videoActive = false,
}: {
  quote: { name: string; title?: string; quoteText: any[]; linkedInUrl?: string }
  position: number
  visibleCount: number
  isNew: boolean
  videoActive?: boolean
}) {
  const layout = getQuoteLayout(position, visibleCount)
  const isLatest = position === 0

  // When video is active, all quotes dim further and the newest shrinks too
  const finalOpacity = videoActive ? 0.15 : layout.opacity
  const finalScale = videoActive && isLatest ? 0.8 : layout.scale

  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, x: 300 } : false}
      animate={{
        opacity: finalOpacity,
        scale: finalScale,
        x: 0,
      }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: 'absolute',
        top: layout.top,
        left: layout.left,
        transform: `translate(${layout.xOffset}, ${layout.yOffset})`,
        maxWidth: layout.maxWidth,
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
        <div className="[&_p]:inline">
          <PortableText value={quote.quoteText} />
        </div>
      </div>

      {/* Attribution */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="gradient-bar" style={{ width: 40, height: 2 }} />
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

function PhaseVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(false)

  // Attempt to play with audio — fall back to muted if browser blocks it
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    video.play().catch(() => {
      // Browser blocked unmuted autoplay — fall back to muted
      video.muted = true
      setMuted(true)
      video.play()
    })
  }, [])

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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 60,
        pointerEvents: 'none',
      }}
    >
    <motion.div
      initial={{ opacity: 0, scale: 0.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      style={{ position: 'relative' }}
    >
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
    </motion.div>
    </div>
  )
}
