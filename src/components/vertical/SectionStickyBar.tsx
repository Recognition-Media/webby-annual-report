'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { jumpToSection } from '@/lib/sectionJump'

export interface JumpSection {
  anchorId: string
  title: string
  accentColor: string
}

interface SectionStickyBarProps {
  title: string
  accentColor: string
  /** The next trend section's title, e.g. "Up Next: Branded Content" —
   * matches the same "On Now / Up Next" pattern as the hero's own ticker.
   * Omit on the last section (nothing to point to). */
  nextTitle?: string
  /** Every trend section in the report, in order — when provided (and
   * containing more than one section), the bar becomes clickable and
   * opens a dropdown to jump to any of them, Telly acting as its own
   * scroll-along table of contents. Omit to keep the bar as a plain,
   * non-interactive label. */
  sections?: JumpSection[]
  /** This bar's own section, so it can be marked current in the dropdown
   * and excluded from being clicked (no point "jumping" to where you
   * already are). */
  currentAnchorId?: string
}

// Slim sticky label pinned to the top of the viewport while scrolling
// through a trend's winner lists — makes it clear every list below still
// belongs to the same trend section, even once its own heading has
// scrolled out of view. Shared by `ChannelGuideGroup` (the shared-player
// trends) and `StickySectionGroup` below (trends that keep each list's
// own independent layout, e.g. Shows & Series).
//
// Doubles as a scroll-along table of contents: click the bar to drop down
// every other trend section and jump straight there.
export function SectionStickyBar({ title, accentColor, nextTitle, sections, currentAnchorId }: SectionStickyBarProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const interactive = !!sections && sections.length > 1

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function jumpTo(anchorId: string) {
    setOpen(false)
    jumpToSection(anchorId)
  }

  // Same "On Now" ticker language as the hero (see TellyHeroArticle.tsx —
  // dot, eyebrow, bold current label, bullet, dimmer "Up Next") but run
  // as a long, full-width bar rather than a content-hugging pill, per
  // Ann's reference (the "What's Inside This Report" bar) — tinted to
  // this section's own accent color instead of the hero's fixed red.
  const pill = (
    <span
      className="w-full flex items-center gap-3 flex-wrap px-5 md:px-6 py-3.5 md:py-4 rounded-xl"
      // Transparent fill with a solid 2px stroke in this section's own
      // full-strength color — no tinted wash, no translucent border.
      style={{ background: 'transparent', border: `2px solid ${accentColor}` }}
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: accentColor }} />
      <span
        className="text-[12px] md:text-[13px] font-bold uppercase flex-shrink-0"
        style={{ fontFamily: "'Basetica', -apple-system, sans-serif", letterSpacing: 1.5, color: accentColor }}
      >
        On Now
      </span>
      <span className="text-[15px] md:text-[17px] font-semibold truncate" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff' }}>
        {title}
      </span>
      {nextTitle && (
        <>
          <span className="text-[14px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>•</span>
          <span className="text-[14px] md:text-[15px] truncate" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(255,255,255,0.6)' }}>
            Up Next: {nextTitle}
          </span>
        </>
      )}
    </span>
  )

  return (
    <div ref={rootRef} className="sticky top-0 z-20 px-5 md:px-[60px] pt-4 pb-3" style={{ background: '#110E1F' }}>
      {interactive ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="text-left flex items-center cursor-pointer"
          style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}
        >
          {pill}
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0, marginLeft: 10 }}
          >
            ▾
          </motion.span>
        </button>
      ) : (
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>{pill}</div>
      )}

      <AnimatePresence>
        {interactive && open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0"
            style={{ top: 'calc(100% - 4px)' }}
          >
            <div
              className="py-2 rounded-xl overflow-hidden"
              style={{ maxWidth: 1280, margin: '0 auto', background: '#110E1F', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              {sections!.map((s) => {
                const isCurrent = s.anchorId === currentAnchorId
                return (
                  <button
                    key={s.anchorId}
                    type="button"
                    role="menuitem"
                    disabled={isCurrent}
                    onClick={() => jumpTo(s.anchorId)}
                    className="w-full text-left px-5 py-3 flex items-center gap-3 transition-colors duration-150"
                    style={{
                      fontFamily: "'Basetica', -apple-system, sans-serif",
                      fontSize: 15,
                      fontWeight: isCurrent ? 800 : 600,
                      color: isCurrent ? '#ffffff' : 'rgba(216,245,255,0.75)',
                      cursor: isCurrent ? 'default' : 'pointer',
                      background: isCurrent ? 'rgba(255,255,255,0.06)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrent) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrent) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <span style={{ color: s.accentColor, fontSize: '1.1em', lineHeight: 0, flexShrink: 0 }}>●</span>
                    {s.title}
                    {isCurrent && (
                      <span className="ml-auto text-[11px] uppercase tracking-[1.5px]" style={{ color: 'rgba(216,245,255,0.45)', fontWeight: 700 }}>
                        You're here
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface StickySectionGroupProps {
  id?: string
  children: ReactNode
}

// Lightweight counterpart to `ChannelGuideGroup` for trends that don't use
// the shared-video-guide layout (Shows & Series keeps its table list and
// poster row independent). The section's sticky name bar lives above this
// group (rendered by the caller, alongside the section's heading/intro)
// rather than inside it, so it pins from the very top of the section
// instead of only once the winner lists begin.
export function StickySectionGroup({ id, children }: StickySectionGroupProps) {
  return (
    <div id={id} className="relative" style={{ background: '#110E1F' }}>
      {children}
    </div>
  )
}
