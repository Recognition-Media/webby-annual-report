'use client'

import { useEffect, useState } from 'react'
import { jumpToSection } from '@/lib/sectionJump'

export interface RailStream {
  anchorId: string
  title: string
}

export interface RailSection {
  anchorId: string
  title: string
  accentColor: string
  streams: RailStream[]
}

// Left-hand "wayfinding" rail — Telly only, replaces the old top sticky
// bar's jump-menu. Every stream across every trend section stays listed
// and clickable; a slim line tracks scroll progress through the column,
// and the current stream's dot glows.
//
// A real flex column (rendered by ReportView as the first child of a
// flex row, trend content as the second), not a `position: fixed`
// overlay reserving padding elsewhere — the previous approach needed a
// scroll listener to fake "only exists from here down" (toggling a
// `visible` flag) and needed a second, separately-gated layer just to
// paint its own background, which could visibly lag the real scroll
// position on a fast scroll. A plain `position: sticky` child inside a
// column that only spans the trend-sections portion of the page gets
// both — scoped to exactly where it belongs, pinned while scrolling
// through it — for free, with no JS-driven visibility state at all.
export function StreamProgressRail({ sections }: { sections: RailSection[] }) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [activeStreamId, setActiveStreamId] = useState<string | null>(null)
  const [progressPct, setProgressPct] = useState(0)

  useEffect(() => {
    function update() {
      const triggerY = window.innerHeight * 0.3
      let curSection: string | null = null
      let curStream: string | null = null
      for (const s of sections) {
        const el = document.getElementById(s.anchorId)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= triggerY && r.bottom > 0) curSection = s.anchorId
      }
      for (const s of sections) {
        for (const st of s.streams) {
          const el = document.getElementById(st.anchorId)
          if (!el) continue
          const r = el.getBoundingClientRect()
          if (r.top <= triggerY + 60 && r.bottom > 0) curStream = st.anchorId
        }
      }
      setActiveSectionId(curSection)
      setActiveStreamId(curStream)

      const doc = document.documentElement
      const pct = (window.scrollY / (doc.scrollHeight - window.innerHeight)) * 100
      setProgressPct(Math.min(100, Math.max(0, pct)))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sections])

  if (sections.length === 0) return null

  const activeSection = sections.find((s) => s.anchorId === activeSectionId)

  return (
    <div className="hidden lg:block flex-shrink-0" style={{ width: 272 }}>
      <div className="sticky top-0 h-screen flex items-center" style={{ background: '#110E1F' }}>
        <div className="relative pl-9 pr-6 max-h-[80vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {/* Eyebrow for the whole rail — plain "watch next" framing rather
              than a literal table of contents, since the labels below are
              deliberately short, standalone call-outs rather than the
              report's own (much longer) section and list headings. */}
          <p
            className="text-[11px] font-bold uppercase mb-4"
            style={{
              letterSpacing: '0.14em',
              color: 'rgba(216,245,255,0.55)',
              fontFamily: "'Basetica', -apple-system, sans-serif",
            }}
          >
            Watch Next
          </p>
          <div
            className="absolute left-[15px] top-9 bottom-1 w-[2px] rounded-full"
            style={{ background: 'rgba(216,245,255,0.10)' }}
          >
            <div
              className="absolute left-0 top-0 w-full rounded-full transition-[height] duration-100 ease-linear"
              style={{ height: `${progressPct}%`, background: activeSection?.accentColor || '#2EFB5E' }}
            />
          </div>
          {sections.map((s) => (
            <div key={s.anchorId} className="mb-6 last:mb-0">
              <button
                type="button"
                onClick={() => jumpToSection(s.anchorId)}
                className="text-[18px] font-bold mb-3 uppercase transition-colors duration-200 cursor-pointer text-left w-full"
                style={{
                  letterSpacing: '0.01em',
                  lineHeight: 1.2,
                  color: s.anchorId === activeSectionId ? '#ffffff' : 'rgba(216,245,255,0.6)',
                  fontFamily: "'Basetica', -apple-system, sans-serif",
                }}
              >
                {s.title}
              </button>
              {s.streams.map((st) => {
                const active = st.anchorId === activeStreamId
                return (
                  <button
                    key={st.anchorId}
                    type="button"
                    onClick={() => jumpToSection(st.anchorId)}
                    className="flex items-center gap-3 py-[7px] cursor-pointer w-full text-left"
                  >
                    <span
                      className="rounded-full flex-shrink-0 transition-all duration-200"
                      style={{
                        width: active ? 13 : 9,
                        height: active ? 13 : 9,
                        background: s.accentColor,
                        border: '2px solid #110E1F',
                      }}
                    />
                    <span
                      className="text-[13.5px] leading-[1.4] uppercase transition-all duration-200"
                      style={{
                        // Active sub-section reads in its own section's
                        // color rather than plain white, so the rail stays
                        // colour-coded to the section you're inside.
                        color: active ? s.accentColor : 'rgba(216,245,255,0.5)',
                        fontWeight: active ? 600 : 500,
                        letterSpacing: '1.5px',
                        fontFamily: "'Basetica', -apple-system, sans-serif",
                      }}
                    >
                      {st.title}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
