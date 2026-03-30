'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const IDLE_TIMEOUT = 2000

const arrowPath = {
  shaft: 'M-30,60 L100,60',
  chevron1: 'M100,60 L54,14',
  chevron2: 'M100,60 L54,106',
}

function Arrow({ rotation, onClick, position }: {
  rotation: number
  onClick: () => void
  position: { top?: string | number; bottom?: string | number; left?: string | number; right?: string | number }
}) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.75 }}
      exit={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      className="no-custom-cursor"
      style={{
        position: 'fixed',
        ...position,
        zIndex: 50,
        background: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '50%',
        cursor: 'pointer',
        width: 64,
        height: 64,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 120 120"
        fill="none"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <line x1="-30" y1="60" x2="100" y2="60" stroke="white" strokeWidth="5" strokeLinecap="round" />
        <line x1="100" y1="60" x2="54" y2="14" stroke="white" strokeWidth="5" strokeLinecap="round" />
        <line x1="100" y1="60" x2="54" y2="106" stroke="white" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </motion.button>
  )
}

export function IdleArrows({ active }: { active: boolean }) {
  const [idle, setIdle] = useState(false)
  const [context, setContext] = useState<'vertical' | 'trend' | 'none'>('none')
  const timerRef = useRef<any>(null)

  // Detect context: are we in trends or vertical sections
  useEffect(() => {
    if (!active) return

    function checkContext() {
      const trendActive = document.querySelector('[data-trend-active]')
      const trendsContainer = document.getElementById('trends')
      const trendsRect = trendsContainer?.getBoundingClientRect()
      const inTrends = trendsRect && trendsRect.top <= 50 && trendsRect.bottom >= window.innerHeight - 50

      if (trendActive || inTrends) {
        setContext('trend')
      } else {
        setContext('vertical')
      }
    }

    checkContext()
    window.addEventListener('scroll', checkContext)
    const observer = new MutationObserver(checkContext)
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['data-trend-active'] })

    return () => {
      window.removeEventListener('scroll', checkContext)
      observer.disconnect()
    }
  }, [active])

  // Idle timer — show after initial delay, stay visible
  useEffect(() => {
    if (!active) return

    function resetIdle() {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setIdle(true), IDLE_TIMEOUT)
    }

    resetIdle()
    window.addEventListener('scroll', resetIdle)

    return () => {
      clearTimeout(timerRef.current)
      window.removeEventListener('scroll', resetIdle)
    }
  }, [active])

  if (!active || !idle) return null

  function clickDown() {
    // Simulate clicking the right side of screen (forward)
    const trendActive = document.querySelector('[data-trend-active]')
    if (trendActive) {
      const isCompleted = trendActive.getAttribute('data-trend-completed') === 'true'
      if (isCompleted) {
        window.dispatchEvent(new CustomEvent('trend-next-or-exit'))
      } else {
        window.dispatchEvent(new Event('trend-advance'))
      }
    } else {
      // Vertical: scroll to next snap section
      const sections = document.querySelectorAll('[data-snap]')
      const scrollY = window.scrollY
      for (const el of sections) {
        const top = (el as HTMLElement).offsetTop
        if (top > scrollY + 50) {
          el.scrollIntoView({ behavior: 'smooth' })
          break
        }
      }
    }
  }

  function clickUp() {
    const trendActive = document.querySelector('[data-trend-active]')
    if (trendActive) {
      window.dispatchEvent(new Event('trend-retreat'))
    } else {
      // Disable goodbye scroll clamp if on goodbye page
      window.dispatchEvent(new Event('goodbye-exit'))
      // Vertical: scroll to previous snap section
      const sections = Array.from(document.querySelectorAll('[data-snap]'))
      const scrollY = window.scrollY
      for (let i = sections.length - 1; i >= 0; i--) {
        const top = (sections[i] as HTMLElement).offsetTop
        if (top < scrollY - 50) {
          sections[i].scrollIntoView({ behavior: 'smooth' })
          break
        }
      }
    }
  }

  function clickRight() {
    const trendActive = document.querySelector('[data-trend-active]')
    if (trendActive) {
      const isCompleted = trendActive.getAttribute('data-trend-completed') === 'true'
      if (isCompleted) {
        window.dispatchEvent(new CustomEvent('trend-next-or-exit'))
      } else {
        window.dispatchEvent(new Event('trend-advance'))
      }
    }
  }

  function clickLeft() {
    const trendActive = document.querySelector('[data-trend-active]')
    if (trendActive) {
      const trendPhase = trendActive.getAttribute('data-trend-phase')
      const trendIndex = trendActive.getAttribute('data-trend-index')
      if (trendPhase === '0' && trendIndex === '0') {
        // Back to judging
        document.body.style.overflow = ''
        document.documentElement.classList.add('snap-active')
        document.getElementById('how-judged')?.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.dispatchEvent(new Event('trend-retreat'))
      }
    }
  }

  return (
    <AnimatePresence>
      {context === 'vertical' && (() => {
        const thankYou = document.getElementById('thank-you')
        const thankYouRect = thankYou?.getBoundingClientRect()
        const onGoodbye = thankYouRect && thankYouRect.top <= 50 && thankYouRect.bottom >= window.innerHeight - 50
        return (
          <>
            {window.scrollY > 100 && (
              <Arrow
                key="up"
                rotation={-90}
                onClick={clickUp}
                position={{ top: '15px', left: '50%', transform: 'translateX(-50%)' } as any}
              />
            )}
            {!onGoodbye && (
              <Arrow
                key="down"
                rotation={90}
                onClick={clickDown}
                position={{ bottom: '35px', left: '50%', transform: 'translateX(-50%)' } as any}
              />
            )}
          </>
        )
      })()}
      {context === 'trend' && (() => {
        const trendEl = document.querySelector('[data-trend-active]')
        const isFirstTrendStart = trendEl?.getAttribute('data-trend-index') === '0' && trendEl?.getAttribute('data-trend-phase') === '0'
        return (
          <>
            {!isFirstTrendStart && (
              <Arrow
                key="left"
                rotation={180}
                onClick={clickLeft}
                position={{ top: 'calc(50% - 35px)', left: '15px' }}
              />
            )}
            <Arrow
              key="right"
              rotation={0}
              onClick={clickRight}
              position={{ top: 'calc(50% - 35px)', right: '15px' }}
            />
          </>
        )
      })()}
    </AnimatePresence>
  )
}
