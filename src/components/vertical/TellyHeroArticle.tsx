'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Report } from '@/sanity/types'
import { TellyIntroSlide } from './TellyIntroSlide'

// Telly hero — "Option 1: Spliced Trophy w/ Icons" from the 48th Annual
// Telly Awards Figma deck (file KGIUkH0PpkaeX1S5hreOY7, node 2059:13037),
// adapted onto the site's dark #110E1F background per Ann's direction
// instead of the white card shown in the original mockup.
//
// The right-column visual ("MADE TO MOVE" + the spliced gold-trophy row
// + pop-art icon badges) is Ann's finished flattened graphic
// (trophy-row-final.jpg) rather than a hand-coded recreation — an
// earlier pass rebuilt the composition from raw Figma layer geometry,
// but the source trophy asset it used wasn't the right one.
//
// Streaming-homepage pass: the hero now rotates between this content and
// the report's intro letter (<TellyIntroSlide> — heading/body/tagline plus
// the author photo, same copy IntroLetter renders further down the page
// for every other property), with an on-air ticker above and dot
// pagination below. "More Info" advances the carousel to that second
// slide instead of opening a pop-out modal. "The Facts" used to be this
// second slide; it now lives as its own section near the bottom of the
// page, right after "About The Telly Awards" (see ReportView.tsx).

const SLIDE_INTERVAL_MS = 7000

interface TellyHeroArticleProps {
  report: Report
  titleLine1?: string
  titleLine2?: string
  subtitle?: string
  onEnter?: () => void
}

export function TellyHeroArticle({
  report,
  titleLine1 = 'The Telly Awards',
  titleLine2 = "What's On Demand",
  subtitle = "This is what moves us, this is what's moving the needle, this is what's moving the market.",
  onEnter,
}: TellyHeroArticleProps) {
  const [activeSlide, setActiveSlide] = useState<0 | 1>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const wheelLockRef = useRef(false)
  const touchStartXRef = useRef<number | null>(null)
  const trendCount = report.trendSections?.length || 4

  function stopAutoplay() {
    if (timerRef.current) clearInterval(timerRef.current)
  }
  function startAutoplay() {
    stopAutoplay()
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    timerRef.current = setInterval(() => {
      setActiveSlide((s) => (s === 0 ? 1 : 0))
    }, SLIDE_INTERVAL_MS)
  }

  // Manual navigation (dots, trackpad, touch swipe) all funnel through here
  // so picking a slide also resets the autoplay clock — otherwise autoplay
  // could flip it again moments after someone just chose one on purpose.
  function goToSlide(index: 0 | 1) {
    setActiveSlide(index)
    startAutoplay()
  }

  useEffect(() => {
    startAutoplay()
    return stopAutoplay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Trackpad/mouse-wheel horizontal scroll switches slides — only when the
  // gesture is clearly horizontal (deltaX dominant), so normal vertical
  // page scrolling over the hero is never hijacked. A short lock prevents
  // one swipe's burst of wheel events from flipping through both slides.
  function handleWheel(e: React.WheelEvent) {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 24) return
    const next = Math.min(Math.max(activeSlide + (e.deltaX > 0 ? 1 : -1), 0), 1) as 0 | 1
    if (next === activeSlide || wheelLockRef.current) return
    e.preventDefault()
    wheelLockRef.current = true
    goToSlide(next)
    setTimeout(() => {
      wheelLockRef.current = false
    }, 700)
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const startX = touchStartXRef.current
    touchStartXRef.current = null
    if (startX == null) return
    const dx = e.changedTouches[0].clientX - startX
    if (Math.abs(dx) < 40) return
    const next = Math.min(Math.max(activeSlide + (dx < 0 ? 1 : -1), 0), 1) as 0 | 1
    if (next !== activeSlide) goToSlide(next)
  }

  const onNowLabel = activeSlide === 0 ? `${titleLine1} ${titleLine2}` : "What's Inside This Report"

  return (
    <div
      className="relative w-full max-w-[1300px] mx-auto pointer-events-auto"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background wash — crossfades between slides, same red/blue glow
          at rest and a blue-dominant wash while the intro slide is showing. */}
      <div
        className="absolute pointer-events-none transition-opacity duration-700"
        style={{
          inset: '-10% -5%',
          opacity: activeSlide === 0 ? 1 : 0,
          background:
            'radial-gradient(ellipse 900px 500px at 15% -10%, rgba(239,30,64,0.16), transparent 60%), radial-gradient(ellipse 700px 400px at 95% 0%, rgba(12,117,255,0.14), transparent 60%)',
        }}
      />
      <div
        className="absolute pointer-events-none transition-opacity duration-700"
        style={{
          inset: '-10% -5%',
          opacity: activeSlide === 1 ? 1 : 0,
          background:
            'radial-gradient(ellipse 1100px 650px at 50% -10%, rgba(12,117,255,0.28), transparent 62%), radial-gradient(ellipse 700px 400px at 90% 30%, rgba(244,31,201,0.1), transparent 60%)',
        }}
      />

      {/* On-air ticker */}
      <div
        className="relative mx-6 md:mx-10 mb-6 flex items-center gap-2.5 flex-wrap px-3.5 py-2 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: '#ef1e40' }} />
        <span
          className="text-[10.5px] font-bold uppercase"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", letterSpacing: 1.5, color: '#ef1e40' }}
        >
          On Now
        </span>
        <span className="text-[12px] font-semibold" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff' }}>
          {onNowLabel}
        </span>
        <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>•</span>
        <span className="text-[12px]" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(255,255,255,0.6)' }}>
          Up Next: Just Released
        </span>
      </div>

      {activeSlide === 0 ? (
        <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-14 px-6 md:px-10">
          {/* Left: headline, metadata, subtitle, buttons */}
          <div className="w-full md:w-[42%] flex-shrink-0 text-center md:text-left">
            <motion.h1
              className="uppercase font-bold leading-[0.95] mb-4"
              style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', letterSpacing: '0.04em', fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {titleLine1}<br />{titleLine2}
            </motion.h1>

            <motion.div
              className="flex items-center justify-center md:justify-start flex-wrap gap-2.5 mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <span className="text-[13px] font-bold" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#2EFB5E' }}>
                2026 Edition
              </span>
              <span className="text-[13px] font-bold" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(255,255,255,0.6)' }}>
                {trendCount} Trends
              </span>
              <span className="text-[11px] font-bold px-[7px] py-[1px] rounded" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", border: '1px solid rgba(255,255,255,0.35)', color: 'rgba(255,255,255,0.6)' }}>
                HD
              </span>
              <span className="text-[11px] font-bold px-[7px] py-[1px] rounded" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", border: '1px solid rgba(255,255,255,0.35)', color: 'rgba(255,255,255,0.6)' }}>
                48th Annual
              </span>
            </motion.div>

            <motion.p
              className="mb-8 mx-auto md:mx-0"
              style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(255,255,255,0.75)', fontWeight: 700, fontSize: 'clamp(1rem, 1.6vw, 1.35rem)', lineHeight: 1.4, maxWidth: 420 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              {subtitle}
            </motion.p>

            <motion.div
              className="flex items-center justify-center md:justify-start gap-3 flex-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <button
                onClick={() => onEnter?.()}
                className="inline-flex items-center gap-3 uppercase text-[13px] md:text-[14px] tracking-[2px] py-5 px-10 rounded-full cursor-pointer transition-colors bg-[#ef1e40] hover:bg-[#c8152f] text-white"
              >
                <span>Explore The Report</span>
                <span>↓</span>
              </button>
              <button
                onClick={() => goToSlide(1)}
                className="inline-flex items-center gap-2 uppercase text-[13px] md:text-[14px] tracking-[2px] py-5 px-7 rounded-full cursor-pointer transition-colors bg-white/15 hover:bg-white/25 text-white"
              >
                <span>ⓘ</span>
                <span>More Info</span>
              </button>
            </motion.div>
          </div>

          {/* Right: "Made To Move" + spliced trophy composition, framed as a
              retro CRT television — the "old cable guide" concept from the
              Figma deck carried through to the hero itself. */}
          <motion.div
            className="relative w-full md:w-[58%] flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: '130%',
                height: '130%',
                left: '-15%',
                top: '-15%',
                background: 'radial-gradient(circle, rgba(190,200,255,0.3), rgba(190,200,255,0.08) 45%, transparent 70%)',
                filter: 'blur(34px)',
              }}
              animate={{ opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <RetroTv />
          </motion.div>
        </div>
      ) : (
        <div className="relative">
          <TellyIntroSlide report={report} />
        </div>
      )}

      {/* Dot pagination — each button's actual hit area (36x36) is much
          bigger than the small visual dot it contains, so they're easy to
          click/tap without needing to land precisely on a few pixels. */}
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => goToSlide(0)}
          aria-label={`Show ${titleLine1}`}
          className="flex items-center justify-center cursor-pointer"
          style={{ width: 36, height: 36 }}
        >
          <span
            className="rounded-full transition-all duration-200"
            style={{ width: activeSlide === 0 ? 24 : 9, height: 9, background: activeSlide === 0 ? '#ffffff' : 'rgba(255,255,255,0.3)' }}
          />
        </button>
        <button
          onClick={() => goToSlide(1)}
          aria-label="Show What's Inside This Report"
          className="flex items-center justify-center cursor-pointer"
          style={{ width: 36, height: 36 }}
        >
          <span
            className="rounded-full transition-all duration-200"
            style={{ width: activeSlide === 1 ? 24 : 9, height: 9, background: activeSlide === 1 ? '#ffffff' : 'rgba(255,255,255,0.3)' }}
          />
        </button>
      </div>
    </div>
  )
}

// A CSS-built mid-century CRT television — wood cabinet, control knobs,
// speaker grille, tapered legs — framing the trophy graphic like a
// broadcast on an old set. The screen "powers on" (collapses to a thin
// line, then expands with a bright flash) on mount, then settles into a
// slow looping scanline sweep so the set reads as live.
function AntennaRod({ angle }: { angle: number }) {
  return (
    <div
      className="absolute left-1/2"
      style={{ bottom: 8, width: 3, height: 54, transformOrigin: 'bottom center', transform: `translateX(-50%) rotate(${angle}deg)` }}
    >
      <div className="w-full h-full rounded-full" style={{ background: 'linear-gradient(180deg, #e8e8ec, #8e8e96)' }} />
      <div
        className="absolute left-1/2 rounded-full"
        style={{ top: -5, width: 10, height: 10, transform: 'translateX(-50%)', background: 'radial-gradient(circle at 35% 30%, #f4f4f8, #8e8e96 70%)', boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
      />
    </div>
  )
}

function RetroTv() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Antenna */}
      <div className="relative" style={{ height: 62, width: 90, marginBottom: -10, zIndex: 2 }}>
        <AntennaRod angle={-27} />
        <AntennaRod angle={27} />
        <div
          className="absolute left-1/2 rounded-full"
          style={{ bottom: 0, width: 26, height: 14, transform: 'translateX(-50%)', background: 'radial-gradient(circle at 35% 30%, #e8e8ec, #9a9aa2 60%, #6b6b74 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }}
        />
      </div>

      <div
        className="relative w-full rounded-[20px] md:rounded-[26px] p-4 md:p-6"
        style={{
          background: 'linear-gradient(180deg, #e4e4e8 0%, #c9c9d1 45%, #aeaeb7 100%)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -8px 16px rgba(0,0,0,0.2)',
        }}
      >
        {/* Top face — gives the cabinet real depth instead of a flat front elevation */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: '6%',
            right: '6%',
            top: -16,
            height: 18,
            background: 'linear-gradient(180deg, #f0f0f4, #c4c4cc)',
            clipPath: 'polygon(2% 100%, 100% 100%, 90% 0%, 12% 0%)',
          }}
        />
        {/* Right face */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '6%',
            bottom: '8%',
            right: -18,
            width: 22,
            background: 'linear-gradient(90deg, #9a9aa2, #5e5e66)',
            clipPath: 'polygon(0 4%, 0 96%, 100% 86%, 100% 10%)',
          }}
        />
        <div className="flex items-stretch gap-3 md:gap-4">
          {/* Screen */}
          <div
            className="relative flex-1 rounded-[20px] md:rounded-[26px] p-[10px] md:p-[14px]"
            style={{ background: '#0c0a08', boxShadow: 'inset 0 0 22px rgba(0,0,0,0.9), inset 0 0 2px rgba(0,0,0,1)' }}
          >
            <div className="relative w-full overflow-hidden rounded-[12px] md:rounded-[16px]" style={{ aspectRatio: '4 / 3' }}>
              {/* The picture itself — always fully rendered, never faded,
                  so nothing bleeds through the black cover below. Only
                  its scale animates, for the classic tube unfold. */}
              <motion.div
                className="absolute inset-0"
                style={{ transformOrigin: 'center' }}
                initial={{ scaleY: 0.04 }}
                animate={{ scaleY: [0.04, 1.05, 0.98, 1.01, 1] }}
                transition={{ duration: 0.5, delay: 0.95, times: [0, 0.5, 0.7, 0.85, 1], ease: [0.16, 1, 0.3, 1] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- hero visual sized to its own container, not a next/image fit */}
                <img
                  src="/telly/hero-v2/trophy-row-final.gif"
                  alt="Made to Move — The Telly Awards"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </motion.div>

              {/* Opaque black cover — screen reads as fully off, then
                  flickers open in a couple of uneven bright glimpses
                  before the picture locks in, like an old CRT warming
                  up. Nothing underneath is ever visible except during
                  these deliberate flicker gaps. */}
              <motion.div
                className="absolute inset-0 bg-black pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 1, 0.1, 1, 0.05, 0.7, 0, 0.25, 0] }}
                transition={{ duration: 1, delay: 0.65, times: [0, 0.3, 0.36, 0.44, 0.52, 0.62, 0.7, 0.8, 1] }}
              />

              {/* Power-on flash, right as the picture locks in */}
              <motion.div
                className="absolute inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.4, delay: 1.3, times: [0, 0.3, 1] }}
              />

              {/* Scanlines */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                  background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 3px)',
                  opacity: 0.35,
                }}
              />

              {/* Slow scanline sweep, suggests the set is live */}
              <motion.div
                className="absolute inset-x-0 pointer-events-none"
                style={{ height: '35%', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)' }}
                initial={{ top: '-40%' }}
                animate={{ top: '110%' }}
                transition={{ duration: 5, delay: 1.3, repeat: Infinity, repeatDelay: 2.5, ease: 'linear' }}
              />

              {/* Glass vignette + diagonal glare */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)' }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 16%, transparent 34%)' }}
              />
            </div>

            {/* Speaker grille, under the screen */}
            <div className="flex gap-3 mt-3 md:mt-4 px-1">
              <div
                className="flex-1 h-3 md:h-4 rounded-[2px]"
                style={{ background: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 3px, transparent 3px, transparent 7px)' }}
              />
              <div
                className="flex-1 h-3 md:h-4 rounded-[2px]"
                style={{ background: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 3px, transparent 3px, transparent 7px)' }}
              />
            </div>
          </div>

          {/* Control panel */}
          <div className="hidden sm:flex w-[52px] md:w-[64px] flex-shrink-0 flex-col items-center justify-between py-2">
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <div
                className="w-6 h-6 md:w-7 md:h-7 rounded-full"
                style={{ background: 'radial-gradient(circle at 35% 30%, #f4f4f8, #b8b8c0 55%, #7a7a82 100%)', boxShadow: '0 2px 3px rgba(0,0,0,0.3)' }}
              />
              <div
                className="w-6 h-6 md:w-7 md:h-7 rounded-full"
                style={{ background: 'radial-gradient(circle at 35% 30%, #f4f4f8, #b8b8c0 55%, #7a7a82 100%)', boxShadow: '0 2px 3px rgba(0,0,0,0.3)' }}
              />
            </div>
            <div
              className="w-full flex-1 mt-4 rounded-[6px]"
              style={{
                background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 2px, transparent 2px, transparent 6px)',
                opacity: 0.6,
              }}
            />
          </div>
        </div>
      </div>

      {/* Tapered legs — longer and splayed outward */}
      <div className="hidden sm:flex w-[78%] justify-between" style={{ marginTop: -2 }}>
        {[-14, 14].map((angle, i) => (
          <div
            key={i}
            style={{ transformOrigin: 'top center', transform: `rotate(${angle}deg)` }}
          >
            <div
              className="w-3 md:w-4 h-16 md:h-20"
              style={{
                background: 'linear-gradient(180deg, #4a4a52, #202024)',
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
