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
export function SectionStickyBar({ title, accentColor, sections, currentAnchorId }: SectionStickyBarProps) {
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

  const label = (
    <p
      className="text-[17px] md:text-[21px] truncate flex items-center gap-3 flex-1"
      style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 800, letterSpacing: 0.2 }}
    >
      <span style={{ color: accentColor, fontSize: '1.4em', lineHeight: 0, flexShrink: 0 }}>●</span> {title}
    </p>
  )

  return (
    <div ref={rootRef} className="sticky top-0 z-20" style={{ background: 'rgba(9,7,18,0.97)' }}>
      {interactive ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="w-full text-left px-5 md:px-[60px] py-4 flex items-center cursor-pointer"
          style={{
            borderBottom: `2px solid ${accentColor}`,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          }}
        >
          <span className="flex items-center" style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            {label}
            <motion.span
              aria-hidden
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0, marginLeft: 12 }}
            >
              ▾
            </motion.span>
          </span>
        </button>
      ) : (
        <div
          className="px-5 md:px-[60px] py-4"
          style={{
            borderBottom: `2px solid ${accentColor}`,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          }}
        >
          <span style={{ maxWidth: 1200, margin: '0 auto', display: 'block' }}>{label}</span>
        </div>
      )}

      <AnimatePresence>
        {interactive && open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 px-5 md:px-[60px]"
            style={{ top: '100%' }}
          >
            <div
              className="py-2 rounded-b-xl overflow-hidden"
              style={{ maxWidth: 1200, margin: '0 auto', background: '#110E1F', border: '1px solid rgba(255,255,255,0.12)', borderTop: 'none' }}
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
