'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useShowOnScroll } from '@/lib/useShowOnScroll'

// Sections the bottom nav tracks. Each maps to a DOM id rendered by the
// Anthem ReportView (KeyFindings, the three ReportSectionCovers, and the
// thank-you / takeaways block). Color comes from the Anthem palette so the
// progress line + label tint match the section accent.
const ANTHEM_SECTIONS = [
  { id: 'key-findings', label: 'Key Findings', color: '#8C001C' },
  { id: 'section-01', label: 'The State of Social Impact', color: '#8C001C' },
  { id: 'section-02', label: 'Where the Pressure Is Landing', color: '#D17DD0' },
  { id: 'section-03', label: 'How the Sector Is Responding', color: '#00B469' },
  { id: 'section-04', label: 'Takeaways', color: '#066DBA' },
]

// Lovie sections — match "Inside the Report" labels and anchor ids.
// Orange accent throughout for consistency with the rest of the brand
// palette (the bar runs on black, so progress + dot in orange read).
const LOVIE_SECTIONS = [
  { id: 'key-findings', label: 'Inside The Report', color: '#ff6000' },
  { id: 'trend-01', label: 'Beyond Capital Cities', color: '#ff6000' },
  { id: 'trend-02', label: 'Smaller Players', color: '#ff6000' },
  { id: 'trend-03', label: 'Internationalism', color: '#ff6000' },
  { id: 'trend-04', label: 'Cultural Specificity', color: '#ff6000' },
  { id: 'trend-05', label: 'Digital Sovereignty', color: '#ff6000' },
  { id: 'section-takeaways', label: 'Takeaways', color: '#ff6000' },
]

type Property = 'webby' | 'anthem' | 'telly' | 'lovie'

export function AnthemBottomNav({ active, property }: { active: boolean; property?: Property }) {
  const isLovie = property === 'lovie'
  const SECTIONS = isLovie ? LOVIE_SECTIONS : ANTHEM_SECTIONS

  // Lovie palette — black bar, cream label, orange accents, Scto
  // Grotesk A. Anthem keeps dark moss + cream + Roc Grotesk.
  const theme = isLovie
    ? {
        barBg: 'rgba(0, 0, 0, 0.92)',
        progressTrack: 'rgba(238, 255, 187, 0.15)',
        labelColor: '#f2eeed',
        labelFont: "'Scto Grotesk A', -apple-system, sans-serif",
        counterColor: 'rgba(242, 238, 237, 0.5)',
        homeBorder: 'rgba(238, 255, 187, 0.4)',
        homeBorderHover: 'rgba(238, 255, 187, 0.9)',
        homeColor: 'rgba(242, 238, 237, 0.85)',
        homeColorHover: '#f2eeed',
      }
    : {
        barBg: 'rgba(33, 38, 26, 0.92)',
        progressTrack: 'rgba(227, 221, 202, 0.1)',
        labelColor: 'var(--anthem-cream)',
        labelFont: "'roc-grotesk-variable', -apple-system, sans-serif",
        counterColor: 'rgba(227, 221, 202, 0.4)',
        homeBorder: 'rgba(227, 221, 202, 0.3)',
        homeBorderHover: 'rgba(227, 221, 202, 0.7)',
        homeColor: 'rgba(227, 221, 202, 0.8)',
        homeColorHover: 'rgba(227, 221, 202, 1)',
      }

  const [activeIndex, setActiveIndex] = useState(0)
  const { visible, pin, unpin } = useShowOnScroll()

  // Track which section is currently in view via IntersectionObserver.
  // Threshold 0.4 = a section becomes "active" once 40% of it is visible,
  // which feels right for full-height sections.
  useEffect(() => {
    if (!active) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SECTIONS.findIndex((s) => s.id === entry.target.id)
            if (idx !== -1) setActiveIndex(idx)
          }
        })
      },
      { threshold: 0.4 }
    )
    // Defer registration so the DOM is mounted
    const timer = setTimeout(() => {
      SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id)
        if (el) observer.observe(el)
      })
    }, 200)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [active])

  function goHome() {
    const el = document.getElementById('key-findings')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!active) return null

  const section = SECTIONS[activeIndex]
  const progress = ((activeIndex + 1) / SECTIONS.length) * 100

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: visible ? 0 : 80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={pin}
      onMouseLeave={unpin}
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      {/* Progress line */}
      <div className="relative h-[2px]" style={{ background: theme.progressTrack }}>
        <motion.div
          className="h-[2px]"
          style={{ background: section.color }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>

      {/* Bar */}
      <div
        className="px-5 md:px-[60px] py-4"
        style={{
          background: theme.barBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-[1280px] mx-auto flex items-center gap-4">
          {/* Animated current-section label. Color stays cream/white for
              legibility on the dark bar; section identity comes through
              the progress line + the small accent-coloured dot. */}
          <span
            className="inline-block w-1.5 h-1.5 rounded-full transition-colors"
            style={{ background: section.color }}
            aria-hidden
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={`section-${activeIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-[10px] md:text-[11px] tracking-[3px] uppercase font-medium"
              style={{ color: theme.labelColor, fontFamily: theme.labelFont }}
            >
              {section.label}
            </motion.span>
          </AnimatePresence>

          {/* Counter */}
          <span
            className="text-[10px] tracking-[1px] ml-auto"
            style={{ color: theme.counterColor, fontFamily: theme.labelFont }}
          >
            {activeIndex + 1} / {SECTIONS.length}
          </span>

          {/* Home button — only shows once you're past Key Findings */}
          {activeIndex > 0 && (
            <button
              onClick={goHome}
              className="text-[9px] md:text-[10px] tracking-[2px] uppercase px-3 py-1.5 rounded transition-colors cursor-pointer"
              style={{
                border: `1px solid ${theme.homeBorder}`,
                color: theme.homeColor,
                fontFamily: theme.labelFont,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.homeBorderHover
                e.currentTarget.style.color = theme.homeColorHover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.homeBorder
                e.currentTarget.style.color = theme.homeColor
              }}
            >
              Home
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
