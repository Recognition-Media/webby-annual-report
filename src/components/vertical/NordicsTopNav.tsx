'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Section {
  id: string
  label: string
}

interface NordicsTopNavProps {
  ctaUrl: string
  sections: Section[]
  onNavClick: (anchor: string) => void
  onCtaClick: () => void
}

// Sticky top-right nav for the Nordics report. Mirrors the Shared
// Influence pattern (position: fixed, colour-swap on scroll for
// contrast), styled for the Lovie palette — Scto Grotesk typography,
// black + purple accent, cream reading surface.
export function NordicsTopNav({ ctaUrl, sections, onNavClick, onCtaClick }: NordicsTopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoverEnter, setHoverEnter] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 200)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Nordics uses the brand purple as its floating pill throughout the
  // report. `scrolled` still tracks position so we can flip the label
  // colour on darker sections if we add any later; for now the pill
  // stays purple + white text on both cream and darker surfaces.
  const pillBg = '#016BA7'
  const pillText = '#FFFFFF'
  const strokeColor = '#FFFFFF'
  void scrolled // reserved for future contrast-switching

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 20,
        zIndex: 9999,
      }}
      className="md:right-[60px]"
    >
      <div className="flex items-center gap-4">
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCtaClick}
          onMouseEnter={() => setHoverEnter(true)}
          onMouseLeave={() => setHoverEnter(false)}
          className="hidden md:block text-[10px] tracking-[2px] uppercase rounded-full py-2.5 px-6 transition-all duration-300"
          style={{
            background: pillBg,
            color: pillText,
            border: `1px solid ${pillBg}`,
            fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
            fontWeight: 500,
            opacity: hoverEnter ? 0.85 : 1,
          }}
        >
          Enter Now
        </a>
        <div className="relative">
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
            className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300"
            style={{
              background: pillBg,
              border: `1px solid ${pillBg}`,
            }}
          >
            {menuOpen ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <line x1="1" y1="1" x2="13" y2="13" stroke={strokeColor} strokeWidth="1.5" />
                <line x1="13" y1="1" x2="1" y2="13" stroke={strokeColor} strokeWidth="1.5" />
              </svg>
            ) : (
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <line x1="0" y1="1" x2="16" y2="1" stroke={strokeColor} strokeWidth="1.5" />
                <line x1="0" y1="5" x2="16" y2="5" stroke={strokeColor} strokeWidth="1.5" />
                <line x1="0" y1="9" x2="16" y2="9" stroke={strokeColor} strokeWidth="1.5" />
              </svg>
            )}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute top-[52px] right-0 w-[280px] rounded-lg overflow-hidden"
                style={{
                  background: 'rgba(0, 0, 0, 0.96)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                }}
              >
                {sections.map((section, i) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => { setMenuOpen(false); onNavClick(section.id) }}
                    className="w-full text-left px-5 py-4 transition-colors hover:bg-[#016BA7]/30 flex items-baseline gap-3"
                    style={{
                      borderBottom: i < sections.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                    }}
                  >
                    <span className="text-[10px] tracking-[2px] uppercase" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[13px] tracking-[1px] uppercase" style={{ color: '#FFFFFF' }}>
                      {section.label}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export const NORDICS_NAV_SECTIONS: Section[] = [
  { id: 'section-01', label: 'Small Populations, Outsized Infrastructure' },
  { id: 'section-02', label: "Capitals Don't Tell the Full Story" },
  { id: 'section-03', label: 'Sustainability & Circularity' },
  { id: 'section-04', label: 'Cross-Border Collaboration' },
  { id: 'ones-to-watch', label: 'The Ones to Watch' },
  { id: 'takeaways', label: 'Takeaways' },
]
