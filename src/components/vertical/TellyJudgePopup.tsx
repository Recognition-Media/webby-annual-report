'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { ExpertQuote } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { onSectionJump } from '@/lib/sectionJump'

const QUOTE_DISPLAY_MS = 10000
// Longer than the quote's: the chooser has to be noticed before it can be
// acted on, while the quote is already being read when its timer starts.
const CHOOSER_DISPLAY_MS = 14000
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
// re-triggers it. It sits as a small card in the bottom-right corner
// rather than taking over the screen, and deliberately does NOT lock
// page scroll — being trapped behind a full-screen interstitial was the
// specific complaint from the production team's creative review. Both
// phases close themselves on a timer, so it never waits on the reader.
export function TellyJudgePopup({ quotes, anchorId }: { quotes: ExpertQuote[]; anchorId: string }) {
  const [phase, setPhase] = useState<'hidden' | 'choosing' | 'revealed' | 'dismissed'>('hidden')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollDirection = useRef<'down' | 'up'>('down')
  const lastScrollY = useRef(0)

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

  // Both phases close themselves. The chooser gets a longer window than
  // the quote because it has to be noticed before it can be acted on,
  // whereas the quote is already being read by the time its timer starts.
  // Picking a judge, or going back to pick again, restarts the clock.
  useEffect(() => {
    if (phase !== 'choosing' && phase !== 'revealed') return
    const ms = phase === 'choosing' ? CHOOSER_DISPLAY_MS : QUOTE_DISPLAY_MS
    dismissTimer.current = setTimeout(() => setPhase('dismissed'), ms)
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
    }
  }, [phase, selectedIndex])

  function choose(i: number) {
    setSelectedIndex(i)
    setPhase('revealed')
  }

  function dismissNow() {
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    setPhase('dismissed')
  }

  function pickAgain() {
    setSelectedIndex(null)
    setPhase('choosing')
  }

  if (phase === 'hidden' || phase === 'dismissed') return null

  const selected = selectedIndex !== null ? quotes[selectedIndex] : null

  return (
    <AnimatePresence>
      {/* A corner card, not a full-height dock — it sits low on the right
          like a notification so it covers as little of the section behind
          it as possible. No backdrop and no scroll lock: the reader keeps
          going and the card times itself out. */}
      <motion.aside
        key="judge-panel"
        aria-label="A word from a Telly judge"
        className="fixed z-[200] overflow-hidden rounded-2xl
                   left-4 right-4 bottom-4
                   md:left-auto md:right-6 md:bottom-6 md:w-[340px]"
        style={{ background: '#1A1530', border: '1px solid rgba(216,245,255,0.14)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="p-5">
          <button
            onClick={dismissNow}
            aria-label="Close"
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer text-[13px] leading-none transition-colors"
            style={{ color: 'rgba(216,245,255,0.45)', border: '1px solid rgba(216,245,255,0.14)', background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(216,245,255,0.45)' }}
          >
            ✕
          </button>

          <p
            className="text-[10px] font-bold uppercase mb-1"
            style={{ letterSpacing: '0.16em', color: '#2EFB5E', fontFamily: "'Basetica', -apple-system, sans-serif" }}
          >
            Ad Break
          </p>

          {phase === 'choosing' && (
            <>
              <p className="text-[11.5px] mb-4" style={{ color: 'rgba(216,245,255,0.45)' }}>
                Your report keeps playing.
              </p>
              <p
                className="text-[17px] font-bold mb-4 pr-8"
                style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', lineHeight: 1.2 }}
              >
                Hear from a Telly judge
              </p>
              <div className="flex gap-2">
                {quotes.map((q, i) => {
                  const headshotUrl = q.headshot ? urlFor(q.headshot).width(120).height(120).fit('crop').url() : q.headshotUrl
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => choose(i)}
                      className="group flex flex-1 min-w-0 flex-col items-start gap-2 text-left rounded-[10px] p-2 cursor-pointer transition-colors"
                      style={{ background: 'transparent', border: '1px solid transparent' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#221B3C'; e.currentTarget.style.borderColor = 'rgba(216,245,255,0.14)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
                      title={q.name}
                    >
                      {headshotUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- CMS-driven headshot
                        <img src={headshotUrl} alt="" className="w-full aspect-square rounded-[8px] object-cover" />
                      ) : (
                        <div className="w-full aspect-square rounded-[8px]" style={{ background: 'rgba(255,255,255,0.08)' }} />
                      )}
                      <span className="min-w-0 w-full">
                        <span
                          className="block text-[11.5px] truncate"
                          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 700, lineHeight: 1.25 }}
                        >
                            {q.name.split(' ')[0]}
                        </span>
                        {q.title && (
                          <span className="block text-[10px] truncate" style={{ color: 'rgba(216,245,255,0.45)' }}>
                            {q.title}
                          </span>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {phase === 'revealed' && selected && (() => {
            const selectedAccent = ACCENTS[(selectedIndex ?? 0) % ACCENTS.length]
            const headshotUrl = selected.headshot ? urlFor(selected.headshot).width(160).height(160).fit('crop').url() : selected.headshotUrl
            return (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <p className="text-[11.5px] mb-4" style={{ color: 'rgba(216,245,255,0.45)' }}>
                  Your report keeps playing.
                </p>
                <div className="flex gap-3 items-start">
                  {headshotUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- CMS-driven headshot
                    <img
                      src={headshotUrl}
                      alt=""
                      className="w-[54px] h-[54px] rounded-full object-cover flex-shrink-0"
                      style={{ border: `2px solid ${selectedAccent}` }}
                    />
                  ) : (
                    <div className="w-[54px] h-[54px] rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)', border: `2px solid ${selectedAccent}` }} />
                  )}
                  <div className="pl-3 min-w-0" style={{ borderLeft: `3px solid ${selectedAccent}` }}>
                    <div
                      className="text-[13.5px] leading-[1.55]"
                      style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontStyle: 'italic' }}
                    >
                      "<PortableText value={selected.quoteText} components={quoteComponents} />"
                    </div>
                    <p className="text-[11.5px] mt-2" style={{ color: 'rgba(216,245,255,0.45)' }}>
                      <strong style={{ fontWeight: 700, color: '#ffffff' }}>{selected.name}</strong>
                      {selected.title && <> · {selected.title}</>}
                    </p>
                  </div>
                </div>
                <button
                  onClick={pickAgain}
                  className="mt-4 text-[11.5px] font-bold rounded-full py-1.5 px-3.5 cursor-pointer transition-colors"
                  style={{ background: 'transparent', border: '1.5px solid rgba(216,245,255,0.14)', color: 'rgba(216,245,255,0.72)', fontFamily: "'Basetica', -apple-system, sans-serif" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = selectedAccent; e.currentTarget.style.color = selectedAccent }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(216,245,255,0.14)'; e.currentTarget.style.color = 'rgba(216,245,255,0.72)' }}
                >
                  ← Choose someone else
                </button>
              </motion.div>
            )
          })()}
        </div>

        {/* Auto-close timer. Keyed on the phase so it restarts whenever the
            panel switches between choosing and reading a quote. */}
        <div className="absolute left-0 right-0 bottom-0 h-[3px]" style={{ background: 'rgba(216,245,255,0.12)' }}>
          <motion.div
            key={`${phase}-${selectedIndex ?? 'none'}`}
            className="h-full origin-left"
            style={{ background: '#2EFB5E' }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: (phase === 'choosing' ? CHOOSER_DISPLAY_MS : QUOTE_DISPLAY_MS) / 1000, ease: 'linear' }}
          />
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
