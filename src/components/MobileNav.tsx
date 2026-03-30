'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TREND_COLORS, TREND_OVERRIDES } from './TrendSection'

interface MobileNavProps {
  active: boolean
  trendTitles: string[]
}

interface NavSection {
  id: string
  label: string
  color?: string
  isTrend?: boolean
  trendIndex?: number
}

export function MobileNav({ active, trendTitles }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])


  // Track which section is currently visible using scroll position
  useEffect(() => {
    if (!active || !isMobile) return

    function updateActive() {
      const scrollTop = window.scrollY + 120

      // Build list fresh each time (elements may appear after initial render)
      const allSections: { id: string; top: number }[] = []

      ;['welcome-letter', 'entry-stats', 'how-judged'].forEach((id) => {
        const el = document.getElementById(id)
        if (el) allSections.push({ id, top: el.offsetTop })
      })

      // Trends: query the DOM directly each time
      for (let i = 0; i < 20; i++) {
        const el = document.getElementById(`mobile-trend-${i}`)
          || document.querySelector(`[data-mobile-trend="${i}"]`)
        if (el) allSections.push({ id: `mobile-trend-${i}`, top: (el as HTMLElement).offsetTop })
      }

      const thankYou = document.getElementById('thank-you')
      if (thankYou) allSections.push({ id: 'thank-you', top: thankYou.offsetTop })

      // Sort by position
      allSections.sort((a, b) => a.top - b.top)

      // Find the last section whose top is above scroll position
      let current = ''
      for (const s of allSections) {
        if (s.top <= scrollTop) current = s.id
      }
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', updateActive, { passive: true })
    // Run after a delay to let trends render
    const t1 = setTimeout(updateActive, 300)
    const t2 = setTimeout(updateActive, 1500)

    return () => {
      window.removeEventListener('scroll', updateActive)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [active, isMobile, trendTitles])

  if (!active || !isMobile) return null

  const sections: NavSection[] = [
    { id: 'welcome-letter', label: 'Welcome Letter', color: '#8B70D1' },
    { id: 'entry-stats', label: 'By the Numbers', color: '#80D064' },
    { id: 'how-judged', label: 'How We Judge', color: '#8B70D1' },
    ...trendTitles.map((title, i) => ({
      id: `mobile-trend-${i}`,
      label: title,
      color: TREND_COLORS[i % TREND_COLORS.length],
      isTrend: true,
      trendIndex: i,
    })),
    { id: 'thank-you', label: 'Thank You', color: '#8B70D1' },
  ]

  function scrollToSection(section: NavSection) {
    setOpen(false)
    setTimeout(() => {
      let el: Element | null = null
      if (section.isTrend) {
        el = document.querySelector(`[data-mobile-trend="${section.trendIndex}"]`)
      } else {
        el = document.getElementById(section.id)
      }
      if (el) {
        // Unlock any scroll locks that might be active
        document.body.style.overflow = ''
        document.documentElement.classList.remove('snap-active')
        const top = el.getBoundingClientRect().top + window.scrollY - 50
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }, 200)
  }

  const activeSectionData = sections.find((s) => {
    if (s.isTrend) return activeSection === `mobile-trend-${s.trendIndex}`
    return activeSection === s.id
  })

  return (
    <>
      {/* Fixed top bar background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: 'rgba(25, 25, 25, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          zIndex: 64,
        }}
      />

      {/* Hamburger button — fixed top right */}
      <button
        onClick={() => setOpen(!open)}
        className="no-custom-cursor"
        style={{
          position: 'fixed',
          top: 6,
          right: 12,
          zIndex: 70,
          width: 44,
          height: 44,
          borderRadius: 12,
          background: open ? 'rgba(255,255,255,0.1)' : 'transparent',
          border: open ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: open ? 0 : 5,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <span
          style={{
            width: 18,
            height: 1.5,
            background: '#fff',
            borderRadius: 1,
            transition: 'all 0.3s ease',
            transform: open ? 'rotate(45deg) translateY(0.75px)' : 'none',
          }}
        />
        {!open && (
          <span
            style={{
              width: 18,
              height: 1.5,
              background: '#fff',
              borderRadius: 1,
            }}
          />
        )}
        <span
          style={{
            width: 18,
            height: 1.5,
            background: '#fff',
            borderRadius: 1,
            transition: 'all 0.3s ease',
            transform: open ? 'rotate(-45deg) translateY(-0.75px)' : 'none',
          }}
        />
      </button>

      {/* Section indicator — shows current section name */}
      <AnimatePresence>
        {!open && activeSectionData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 18,
              left: 16,
              right: 64,
              zIndex: 65,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 11,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: activeSectionData.color || 'rgba(255,255,255,0.5)',
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {activeSectionData.isTrend
                ? `Trend ${String((activeSectionData.trendIndex ?? 0) + 1).padStart(2, '0')}`
                : activeSectionData.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.7)',
                zIndex: 60,
              }}
            />

            {/* Drawer */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 65,
                background: 'rgba(25, 25, 25, 0.97)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                padding: '72px 20px 28px',
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {sections.map((section, i) => {
                  const isActive = section.isTrend
                    ? activeSection === `mobile-trend-${section.trendIndex}`
                    : activeSection === section.id

                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section)}
                      className="no-custom-cursor"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px 0',
                        background: 'none',
                        border: 'none',
                        borderBottom: i < sections.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      {/* Indicator */}
                      <div style={{ width: 20, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                        {section.isTrend ? (
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: isActive ? section.color : 'rgba(255,255,255,0.15)',
                              transition: 'background 0.3s',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: isActive ? 16 : 0,
                              height: 2,
                              background: '#8B70D1',
                              borderRadius: 1,
                              transition: 'width 0.3s',
                            }}
                          />
                        )}
                      </div>

                      {/* Label */}
                      <div style={{ flex: 1 }}>
                        {section.isTrend && (
                          <span
                            style={{
                              fontSize: 9,
                              letterSpacing: 2,
                              textTransform: 'uppercase',
                              color: isActive ? section.color : 'rgba(255,255,255,0.3)',
                              fontWeight: 500,
                              marginRight: 8,
                            }}
                          >
                            {String((section.trendIndex ?? 0) + 1).padStart(2, '0')}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: 14,
                            color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                            fontWeight: isActive ? 500 : 400,
                            transition: 'color 0.3s',
                          }}
                        >
                          {section.label}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
