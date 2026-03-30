'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const IDLE_TIMEOUT = 2000

const arrowPath = {
  shaft: 'M-30,60 L100,60',
  chevron1: 'M100,60 L54,14',
  chevron2: 'M100,60 L54,106',
}

function Arrow({ rotation, onClick, position, isTouch }: {
  rotation: number
  onClick: () => void
  position: { top?: string | number; bottom?: string | number; left?: string | number; right?: string | number }
  isTouch?: boolean
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

function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function IdleArrows({ active }: { active: boolean }) {
  const [idle, setIdle] = useState(false)
  const [context, setContext] = useState<'vertical' | 'trend' | 'none'>('none')
  const [, forceUpdate] = useState(0)
  const [isTouch, setIsTouch] = useState(false)
  const timerRef = useRef<any>(null)

  useEffect(() => {
    setIsTouch(isTouchDevice())
  }, [])

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
      // Force re-render so arrows update when trend/phase changes
      forceUpdate((n) => n + 1)
    }

    checkContext()
    window.addEventListener('scroll', checkContext)
    const observer = new MutationObserver(checkContext)
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['data-trend-active', 'data-trend-phase', 'data-active-trend'] })

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

  // Hide entirely on touch/mobile — MobileNav handles navigation
  // On desktop, only show when idle
  // Hide on mobile — MobileNav handles navigation
  const [isMobileScreen, setIsMobileScreen] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobileScreen(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobileScreen(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (!active || !idle || isTouch || isMobileScreen) return null

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

  function getSpecialSlide() {
    const container = document.getElementById('trends')
    if (!container) return null
    const activeTrend = parseInt(container.getAttribute('data-active-trend') || '0', 10)
    const trendCount = parseInt(container.getAttribute('data-trend-count') || '0', 10)
    if (activeTrend === 0 && !document.querySelector('[data-trend-active]')) return 'intro'
    if (activeTrend === trendCount - 1 && !document.querySelector('[data-trend-active]')) return 'thankYou'
    return null
  }

  function clickRight() {
    const special = getSpecialSlide()
    if (special === 'intro') {
      window.dispatchEvent(new CustomEvent('trend-next-or-exit'))
      return
    }
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
    // On Thank You slide — go back to last trend
    if (getSpecialSlide() === 'thankYou') {
      window.dispatchEvent(new Event('trend-prev'))
      return
    }
    const trendActive = document.querySelector('[data-trend-active]')
    if (trendActive) {
      const trendPhase = trendActive.getAttribute('data-trend-phase')
      const trendIndex = trendActive.getAttribute('data-trend-index')
      if (trendPhase === '0' && trendIndex === '0') {
        // Back to intro slide
        window.dispatchEvent(new Event('trend-prev'))
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
                isTouch={isTouch}
              />
            )}
            {!onGoodbye && (
              <Arrow
                key="down"
                rotation={90}
                onClick={clickDown}
                position={{ bottom: isTouch ? '80px' : '35px', left: '50%', transform: 'translateX(-50%)' } as any}
                isTouch={isTouch}
              />
            )}
          </>
        )
      })()}
      {context === 'trend' && !isTouch && (() => {
        const special = getSpecialSlide()
        // Show left arrow unless on intro slide
        const showLeft = special !== 'intro'
        // Show right arrow unless on Thank You slide
        const showRight = special !== 'thankYou'
        return (
          <>
            {showLeft && (
              <Arrow
                key="left"
                rotation={180}
                onClick={clickLeft}
                position={{ top: 'calc(50% - 35px)', left: '15px' }}
                isTouch={isTouch}
              />
            )}
            {showRight && special === 'intro' && (
              <motion.button
                key="right-pill"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 0.75,
                  boxShadow: [
                    '0 0 0px rgba(130, 216, 235, 0)',
                    '0 0 12px rgba(130, 216, 235, 0.3)',
                    '0 0 0px rgba(130, 216, 235, 0)',
                  ],
                }}
                exit={{ opacity: 0.75 }}
                whileHover={{ opacity: 0.85 }}
                transition={{
                  opacity: { duration: 0.6 },
                  boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                }}
                onClick={(e) => { e.stopPropagation(); clickRight() }}
                className="no-custom-cursor"
                style={{
                  position: 'fixed',
                  top: 'calc(50% - 28px)',
                  right: '20px',
                  zIndex: 50,
                  background: 'rgba(0, 0, 0, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 32,
                  cursor: 'pointer',
                  padding: '14px 24px 14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  color: '#fff',
                }}
              >
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 2.5,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  See the Trends
                </span>
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 120 120"
                  fill="none"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <line x1="-30" y1="60" x2="100" y2="60" stroke="white" strokeWidth="5" strokeLinecap="round" />
                  <line x1="100" y1="60" x2="54" y2="14" stroke="white" strokeWidth="5" strokeLinecap="round" />
                  <line x1="100" y1="60" x2="54" y2="106" stroke="white" strokeWidth="5" strokeLinecap="round" />
                </motion.svg>
              </motion.button>
            )}
            {showRight && special !== 'intro' && (
              <Arrow
                key="right"
                rotation={0}
                onClick={clickRight}
                position={{ top: 'calc(50% - 35px)', right: '15px' }}
              />
            )}
          </>
        )
      })()}
    </AnimatePresence>
  )
}
