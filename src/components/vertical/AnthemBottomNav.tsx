'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Sections the bottom nav tracks. Each maps to a DOM id rendered by the
// Anthem ReportView (KeyFindings, the three ReportSectionCovers, and the
// thank-you / takeaways block). Color comes from the Anthem palette so the
// progress line + label tint match the section accent.
const SECTIONS = [
  { id: 'key-findings', label: 'Key Findings', color: '#8C001C' },
  { id: 'section-01', label: 'The State of Social Impact', color: '#8C001C' },
  { id: 'section-02', label: 'Where the Pressure Is Landing', color: '#D17DD0' },
  { id: 'section-03', label: 'How the Sector Is Responding', color: '#00B469' },
  { id: 'thank-you', label: 'Takeaways', color: '#066DBA' },
]

export function AnthemBottomNav({ active }: { active: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0)

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
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      {/* Progress line */}
      <div className="relative h-[2px]" style={{ background: 'rgba(227, 221, 202, 0.1)' }}>
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
          background: 'rgba(33, 38, 26, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-[1280px] mx-auto flex items-center gap-4">
          {/* Animated current-section label.
              Color is always cream for legibility on the dark moss bar
              (the section's accent color was unreadable on dark — e.g.
              #8C001C on moss). Section identity comes through the
              progress line above. A small cream-tinted dot before the
              label pairs the label with the progress bar's accent. */}
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
              style={{ color: 'var(--anthem-cream)', fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif" }}
            >
              {section.label}
            </motion.span>
          </AnimatePresence>

          {/* Counter */}
          <span
            className="text-[10px] tracking-[1px] ml-auto"
            style={{ color: 'rgba(227, 221, 202, 0.4)', fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif" }}
          >
            {activeIndex + 1} / {SECTIONS.length}
          </span>

          {/* Home button — only shows once you're past Key Findings */}
          {activeIndex > 0 && (
            <button
              onClick={goHome}
              className="text-[9px] md:text-[10px] tracking-[2px] uppercase px-3 py-1.5 rounded transition-colors cursor-pointer"
              style={{
                border: '1px solid rgba(227, 221, 202, 0.3)',
                color: 'rgba(227, 221, 202, 0.8)',
                fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(227, 221, 202, 0.7)'
                e.currentTarget.style.color = 'rgba(227, 221, 202, 1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(227, 221, 202, 0.3)'
                e.currentTarget.style.color = 'rgba(227, 221, 202, 0.8)'
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
