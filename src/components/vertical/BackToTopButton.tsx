'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { jumpToSection, onSectionJump } from '@/lib/sectionJump'

// Jumps back to the Table of Contents ("Recommended For You"), not the
// literal top of the page — that's the section a reader actually wants to
// get back to in order to pick somewhere else to go.
const TARGET_ID = 'key-findings'

// Only offer the jump once the reader is clearly below the Table of
// Contents. Above it there's nothing to go back to, and a button that
// appears on every small upward nudge near the top is just noise.
const PAST_TARGET_PX = 240

// Below `lg` the StreamProgressRail (the left-hand chapter list) is hidden,
// so there's no wayfinding at all on phones and tablets — this is the
// stand-in. It only appears once the reader starts scrolling back UP, on the
// assumption that going up is the "I want to get out of here" gesture;
// scrolling down hides it again so it never sits over the content a reader
// is actually moving toward.
export function BackToTopButton() {
  const [visible, setVisible] = useState(false)
  const reduceMotion = useReducedMotion()
  // Suppressed while our own smooth scroll runs: that scroll is upward, so
  // without this the button would re-show mid-flight and then vanish on
  // arrival, which reads as a flicker.
  const jumping = useRef(false)

  useEffect(() => {
    let lastY = window.scrollY

    function onScroll() {
      const y = window.scrollY
      const goingUp = y < lastY - 2 // small deadzone, so jitter isn't a direction change
      const goingDown = y > lastY + 2
      lastY = y

      if (jumping.current) return
      if (goingDown) {
        setVisible(false)
        return
      }
      if (!goingUp) return

      const target = document.getElementById(TARGET_ID)
      if (!target) return
      setVisible(target.getBoundingClientRect().top < -PAST_TARGET_PX)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    const unsubscribe = onSectionJump((targetId) => {
      jumping.current = targetId !== null
      // Re-baseline on arrival so the jump's own travel isn't read as the
      // reader scrolling up the moment the next real scroll lands.
      if (targetId === null) lastY = window.scrollY
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      unsubscribe()
    }
  }, [])

  function handleClick() {
    setVisible(false)
    jumpToSection(TARGET_ID)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          onClick={handleClick}
          aria-label="Back to the top — Recommended For You"
          // lg:hidden — shown only where the progress rail isn't.
          // z-[150] sits under the judge break (z-[200]) so the two can
          // never fight for the same corner; in practice they rarely
          // coincide, since breaks only fire while scrolling down and this
          // only appears while scrolling up.
          className="lg:hidden fixed z-[150] bottom-5 right-5 flex items-center gap-2
                     rounded-full pl-4 pr-5 py-3 cursor-pointer"
          style={{
            // Telly red rather than a dark chip: on this report's near-black
            // ground a black button disappears, and this one has to be
            // noticed to be useful.
            background: '#ef1e40',
            color: '#ffffff',
            fontFamily: "'Basetica', -apple-system, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.04em',
            boxShadow: '0 10px 30px rgba(239,30,64,0.35), 0 2px 8px rgba(0,0,0,0.4)',
          }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <span aria-hidden style={{ fontSize: 15, lineHeight: 1 }}>↑</span>
          <span>Back to the Top</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
