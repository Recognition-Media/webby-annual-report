'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Section {
  id: string
  label: string
}

interface SharedInfluenceTopNavProps {
  ctaUrl: string
  sections: Section[]
  onNavClick: (anchor: string) => void
  onCtaClick: () => void
}

// Sticky top-right nav for the Shared Influence report. Lives at the
// ReportView level (outside HeroSection) so `position: fixed` isn't
// affected by the hero's overflow / stacking context. Pill colours
// invert once the user scrolls past the hero for readability against
// the beige body sections.
export function SharedInfluenceTopNav({ ctaUrl, sections, onNavClick, onCtaClick }: SharedInfluenceTopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [overDarkOrBrand, setOverDarkOrBrand] = useState(false)
  const [hoverEnter, setHoverEnter] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 200)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track when the moss-dark Credits section or the lilac AnthemFooter
  // is in view. The moss "scrolled" pill styling doesn't read against
  // either background — snap back to beige while those sections
  // occupy the viewport.
  useEffect(() => {
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        })
        setOverDarkOrBrand(visible.size > 0)
      },
      { threshold: 0.1 },
    )
    const ids = ['credits', 'about-anthem']
    const timer = setTimeout(() => {
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 300)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  // Hero (top of page) and the Credits/About-Anthem sections use the
  // beige-filled pill treatment. All other scrolled positions use the
  // moss pill for max contrast against the Anthem beige body sections.
  const useBeige = !scrolled || overDarkOrBrand
  const pillBg = useBeige ? '#E3DDCA' : '#21261A'
  const pillText = useBeige ? '#21261A' : '#E3DDCA'
  const strokeColor = useBeige ? '#21261A' : '#E3DDCA'

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
            fontFamily: "'roc-grotesk-wide', 'roc-grotesk-variable', -apple-system, sans-serif",
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
                  background: 'rgba(33, 38, 26, 0.96)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(227, 221, 202, 0.14)',
                }}
              >
                {sections.map((section, i) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => { setMenuOpen(false); onNavClick(section.id) }}
                    className="w-full text-left px-5 py-4 transition-colors hover:bg-[#8C001C]/30 flex items-baseline gap-3"
                    style={{
                      borderBottom: i < sections.length - 1 ? '1px solid rgba(227, 221, 202, 0.1)' : 'none',
                    }}
                  >
                    <span className="text-[10px] tracking-[2px] uppercase" style={{ color: 'rgba(227, 221, 202, 0.5)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[13px] tracking-[1px] uppercase" style={{ color: '#E3DDCA' }}>
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

export const SHARED_INFLUENCE_NAV_SECTIONS: Section[] = [
  { id: 'section-01', label: 'The New Trusted Institutions' },
  { id: 'section-02', label: 'Finding the Right Partners' },
  { id: 'section-03', label: 'Making It Work' },
  { id: 'section-04', label: 'Formats That Drive Impact' },
  { id: 'section-05', label: 'The Challenges with Creator Partnerships' },
  { id: 'section-06', label: 'Navigating the Value Exchange' },
  { id: 'takeaways', label: 'Takeaways' },
]
