'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { ExpertQuote } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { onSectionJump } from '@/lib/sectionJump'

const QUOTE_DISPLAY_MS = 10000
const ACCENTS = ['#ef1e40', '#0C75FF', '#F41FC9', '#2EFB5E']

const quoteComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <>{children}</>,
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
  },
}

// An ad-break-style interstitial — "Choose Your Telly Judge To Hear
// From", 3 judges to pick from, then the chosen quote displays and
// auto-dismisses after 10 seconds. Appears once, after the viewer has
// naturally scrolled roughly to the MIDDLE of the trend section it's
// attached to — i.e. once the section's own vertical center has risen to
// the vertical center of the viewport (so it reads as "you're partway
// through Shows & Series, here's a judge break" rather than popping up
// the moment the section starts, or only once you've already finished
// it) — tracked via a scroll listener checking that section's own DOM
// id's bounding rect, gated on scroll direction (scrolling back up never
// (re-)triggers it). This is the only trigger: jumping straight to a
// section (Table of Contents, sticky-bar dropdown, hero nav, the
// stream-progress rail) never opens it on arrival, even landing exactly
// at its midpoint — it only opens once the viewer has actually scrolled
// there themselves, same as organic scrolling. sectionJump.ts is only
// used to suspend the scroll check for the duration of a jump, so the
// browser's own scroll-to animation can't be mistaken for having
// scrolled to a section's middle it's merely passing on the way to the
// jump's real destination. Shown at most once per section for the rest
// of the session, independently per section — once a viewer has seen a
// section's ad, scrolling back through that same section again never
// re-triggers it. Page scroll is locked for as long as the popup is
// open, so it can't be scrolled past into the next section's own popup
// while this one is still up — closing it (✕) or letting it auto-dismiss
// is what gives scroll back.
export function TellyJudgePopup({ quotes, anchorId }: { quotes: ExpertQuote[]; anchorId: string }) {
  const [phase, setPhase] = useState<'hidden' | 'choosing' | 'revealed' | 'dismissed'>('hidden')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealCountdown, setRevealCountdown] = useState(QUOTE_DISPLAY_MS / 1000)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollDirection = useRef<'down' | 'up'>('down')
  const lastScrollY = useRef(0)

  // Ticks the countdown ring down in step with the real auto-dismiss timer
  // below, so it isn't just a frozen "10" — purely atmospheric, doesn't
  // itself trigger anything (the dismiss timer already does).
  useEffect(() => {
    if (phase !== 'revealed') return
    setRevealCountdown(QUOTE_DISPLAY_MS / 1000)
    const interval = setInterval(() => {
      setRevealCountdown((c) => (c > 0 ? c - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [phase, selectedIndex])

  useEffect(() => {
    lastScrollY.current = window.scrollY
    function onScroll() {
      const y = window.scrollY
      scrollDirection.current = y > lastScrollY.current ? 'down' : 'up'
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const targetEl = document.getElementById(anchorId)
    if (!targetEl) return
    const target: HTMLElement = targetEl
    // Fires once the viewer has scrolled roughly to the MIDDLE of this
    // section — defined as the section's own vertical center rising to the
    // vertical center of the viewport — rather than on arrival at its top,
    // or only once they've reached its end. A plain isIntersecting/
    // rootMargin band can only ever key off the TARGET's top edge crossing
    // a fixed line (for a target taller than the viewport, which every
    // trend section is, that says nothing about how far through it the
    // viewer actually is), so the actual rect is checked on scroll instead.
    //
    // This is the ONLY trigger, regardless of how the viewer got here —
    // jumping straight to a section (Table of Contents, sticky-bar
    // dropdown, hero nav, the stream-progress rail) does not open the
    // popup on arrival even if the jump lands exactly at its midpoint; it
    // only opens once they've actually scrolled there themselves, same as
    // organic scrolling. The jump is tracked only to suspend this check
    // for its duration, so the browser's own scroll-to animation (which
    // fires a burst of scroll events while animating past intermediate
    // positions) can't be mistaken for the viewer having scrolled to a
    // section's middle it's merely passing on the way to the jump's real
    // destination.
    let jumpActive = false
    let shown = false
    // True once this section has actually been visible in the viewport
    // during a real (non-jump) scroll — i.e. the viewer has genuinely
    // scrolled through it, as opposed to a Table of Contents / rail /
    // hero jump leaping straight over it to land further down. Gates the
    // "already scrolled past" branch below: without this, a section that
    // a jump skipped over sits permanently above the viewport afterward
    // (its midpoint already above center), so the very next ordinary
    // downward scroll tick — even a small one, taken once safely inside
    // the destination section — would otherwise fire its popup too.
    //
    // Any jump — not just one that skips over this section — resets this
    // back to false (see the subscription below). Without that reset, a
    // viewer who only glanced partway into a section and then jumped
    // elsewhere via the Table of Contents would keep their "partial
    // credit": once they landed elsewhere and the glanced-at section's
    // midpoint was left above the viewport's own center, the very next
    // scroll tick would satisfy the threshold check and fire its ad —
    // even though they never actually scrolled there themselves. A
    // section should only ever fire from one continuous, uninterrupted
    // downward scroll through it.
    let hasBeenInView = false

    function open() {
      if (shown) return
      shown = true
      window.removeEventListener('scroll', onScroll)
      setPhase('choosing')
      unsubscribeJump()
    }

    function onScroll() {
      if (jumpActive || scrollDirection.current !== 'down') return
      const rect = target.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) hasBeenInView = true
      if (!hasBeenInView) return
      // Section's own vertical center (in viewport coordinates) has risen
      // to the viewport's own vertical center — i.e. the viewer is now
      // looking at roughly the middle of this section, having scrolled
      // halfway through it — rather than its bottom edge approaching the
      // end. Deliberately not also requiring the midpoint still be on
      // screen: once it's crossed, it stays crossed as scrolling
      // continues, so a single large wheel/trackpad tick that jumps
      // clean past the trigger line between two scroll events still
      // fires, same robustness as the old end-of-section check.
      const sectionMidY = rect.top + rect.height / 2
      if (sectionMidY <= window.innerHeight / 2) open()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const unsubscribeJump = onSectionJump((targetId) => {
      jumpActive = targetId !== null
      // Starting a jump — to this section, past it, or anywhere else —
      // discards any partial-viewing credit this section had built up.
      // Only a single uninterrupted scroll through it, start to finish,
      // should ever be able to fire its popup.
      if (jumpActive) hasBeenInView = false
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      unsubscribeJump()
    }
  }, [anchorId])

  useEffect(() => {
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
    }
  }, [])

  // Lock page scroll while the popup is up — otherwise the viewer can
  // keep scrolling behind it, straight into the next section's own
  // popup, stacking interstitials. Only released once this one is fully
  // dismissed (auto-timeout, choosing a different judge, or the ✕).
  useEffect(() => {
    if (phase !== 'choosing' && phase !== 'revealed') return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [phase])

  function choose(i: number) {
    setSelectedIndex(i)
    setPhase('revealed')
    dismissTimer.current = setTimeout(() => setPhase('dismissed'), QUOTE_DISPLAY_MS)
  }

  function dismissNow() {
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    setPhase('dismissed')
  }

  function pickAgain() {
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    setSelectedIndex(null)
    setPhase('choosing')
  }

  if (phase === 'hidden' || phase === 'dismissed') return null

  const selected = selectedIndex !== null ? quotes[selectedIndex] : null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center px-5"
        style={{ background: 'rgba(0,0,0,0.8)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={dismissNow}
      >
        <motion.div
          className="relative w-full rounded-2xl p-6 md:p-10"
          style={{ maxWidth: 880, background: '#110E1F', border: '1px solid rgba(255,255,255,0.12)' }}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={dismissNow}
            aria-label="Close"
            className="absolute top-4 right-4 md:top-5 md:right-5 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            ✕
          </button>

          {phase === 'choosing' && (
            <>
              <p className="text-[13px] md:text-[14px] mb-6 md:mb-8" style={{ color: 'rgba(216,245,255,0.5)' }}>
                Your report will resume after this message
              </p>
              <p
                className="text-[20px] md:text-[26px] font-bold text-center mb-10 md:mb-12"
                style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff' }}
              >
                Choose a Telly Judge To Hear From
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-6">
                {quotes.map((q, i) => {
                  const headshotUrl = q.headshot ? urlFor(q.headshot).width(240).height(240).fit('crop').url() : q.headshotUrl
                  return (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => choose(i)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          choose(i)
                        }
                      }}
                      className="group flex flex-col items-center text-center cursor-pointer"
                    >
                      <div className="relative w-[110px] h-[110px] md:w-[128px] md:h-[128px] rounded-2xl overflow-hidden mb-4">
                        {headshotUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element -- CMS-driven headshot
                          <img
                            src={headshotUrl}
                            alt={q.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        )}
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/30" />
                      </div>
                      <p className="text-[15px] md:text-[16px] mb-1" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 700 }}>
                        {q.name}
                      </p>
                      <p className="text-[13px]" style={{ color: 'rgba(216,245,255,0.6)' }}>
                        {q.title}
                      </p>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {phase === 'revealed' && selected && (() => {
            const selectedAccent = ACCENTS[(selectedIndex ?? 0) % ACCENTS.length]
            const headshotUrl = selected.headshot ? urlFor(selected.headshot).width(240).height(240).fit('crop').url() : selected.headshotUrl
            return (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center justify-between mb-6 md:mb-8 pr-10">
                  <p className="text-[13px] md:text-[14px]" style={{ color: 'rgba(216,245,255,0.5)' }}>
                    Your report will resume after this message
                  </p>
                  <span
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold ml-3"
                    style={{ border: '2px solid #2EFB5E', color: '#2EFB5E', fontFamily: 'monospace' }}
                  >
                    {revealCountdown}
                  </span>
                </div>
                <div className="flex gap-5 items-start mb-8">
                  {headshotUrl ? (
                    <div className="w-[88px] h-[88px] md:w-[104px] md:h-[104px] rounded-full overflow-hidden flex-shrink-0" style={{ border: `2px solid ${selectedAccent}` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- CMS-driven headshot */}
                      <img src={headshotUrl} alt={selected.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-[88px] h-[88px] md:w-[104px] md:h-[104px] rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)', border: `2px solid ${selectedAccent}` }} />
                  )}
                  <div className="pl-4" style={{ borderLeft: `3px solid ${selectedAccent}` }}>
                    <div
                      className="text-[16px] md:text-[18px] leading-[1.6] mb-3"
                      style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontStyle: 'italic' }}
                    >
                      "<PortableText value={selected.quoteText} components={quoteComponents} />"
                    </div>
                    <p className="text-[13px]" style={{ color: 'rgba(216,245,255,0.6)' }}>
                      <strong style={{ fontWeight: 600, color: '#ffffff' }}>{selected.name}</strong>
                      {selected.title && <><br />{selected.title}</>}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    onClick={pickAgain}
                    className="inline-flex items-center justify-center py-3 px-8 rounded-full uppercase transition-colors duration-200 bg-white border cursor-pointer"
                    style={{ color: selectedAccent, borderColor: selectedAccent, fontSize: 12, letterSpacing: 2, fontWeight: 700, fontFamily: "'Basetica', -apple-system, sans-serif" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = selectedAccent; e.currentTarget.style.color = '#ffffff' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = selectedAccent }}
                  >
                    Select a Different Judge
                  </button>
                </div>
              </motion.div>
            )
          })()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
