'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export type OnNowSection = {
  anchorId: string
  /** Full section title, shown as the "On Now" label. */
  title: string
  /** Short rail label for the following section, shown as "Up Next". */
  nextTitle?: string
  accentColor: string
}

// CSS variable the rail reads so it can start below this bar instead of
// underneath it. Published on the document element because there's exactly
// one of these bars per page, which keeps the rail from needing a ref into
// this component.
const HEIGHT_VAR = '--telly-onnow-h'

// A single "On Now" bar for the whole trend run, replacing the per-section
// bars that used to live inside the content column (and so began to the
// right of the StreamProgressRail). This one sits above both columns, spans
// the full width, and flips its title, "Up Next" and accent colour as each
// section's top edge passes beneath it — the channel-guide reading of
// "you're here now, this is what follows".
//
// It's sticky within the two-column block rather than fixed to the page, so
// it appears exactly when the first trend section reaches the top and
// releases again at the end of the run — the hero keeps its own bar above,
// and the two are never on screen together.
export function TellyOnNowBar({ sections }: { sections: OnNowSection[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  // Publish the bar's measured height so StreamProgressRail can offset by it.
  // Measured rather than hardcoded because the pill's height changes with the
  // breakpoint, and on a narrow column the label can wrap to a second line.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const publish = () => {
      document.documentElement.style.setProperty(HEIGHT_VAR, `${el.offsetHeight}px`)
    }
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => {
      ro.disconnect()
      document.documentElement.style.removeProperty(HEIGHT_VAR)
    }
  }, [])

  useEffect(() => {
    function onScroll() {
      const barHeight = ref.current?.offsetHeight ?? 0
      // A section counts as "on now" once its top edge has passed just under
      // the bar, so the bar changes over at the same moment the section's
      // heading appears beneath it rather than before or after.
      const line = barHeight + 8
      let active = 0
      sections.forEach((s, i) => {
        const el = document.getElementById(s.anchorId)
        if (el && el.getBoundingClientRect().top <= line) active = i
      })
      setActiveIndex(active)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [sections])

  const current = sections[activeIndex]
  if (!current) return null
  const accent = current.accentColor

  return (
    <div
      ref={ref}
      className="sticky top-0 z-30 pt-4 pb-3"
      style={{ background: '#110E1F' }}
    >
      {/* Same container geometry as the hero's own On Now bar
          (max-w-[1300px] centred, then mx-6/mx-10), so the two line up on
          the left edge at every width instead of the section bars starting
          further in than the hero's. */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-10">
      <span
        className="w-full flex items-center gap-3 px-5 md:px-6 py-3.5 md:py-4 rounded-xl"
        // Transparent fill with a solid stroke in the live section's own
        // full-strength colour, matching the hero's bar. The border colour
        // transitions so the change of section reads as a colour shift
        // rather than a hard cut.
        style={{
          background: 'transparent',
          border: `2px solid ${accent}`,
          transition: reduceMotion ? undefined : 'border-color 0.3s ease',
        }}
      >
        <motion.span
          className="w-2 h-2 rounded-full flex-shrink-0"
          animate={{ backgroundColor: accent }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current.anchorId}
            className="flex items-center gap-3 min-w-0"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            <span
              className="text-[12px] md:text-[13px] font-bold uppercase flex-shrink-0"
              style={{
                fontFamily: "'Basetica', -apple-system, sans-serif",
                letterSpacing: 1.5,
                color: accent,
              }}
            >
              On Now
            </span>
            <span
              className="text-[15px] md:text-[17px] font-semibold truncate"
              style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff' }}
            >
              {current.title}
            </span>
            {current.nextTitle && (
              <>
                <span className="text-[14px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  •
                </span>
                <span
                  className="text-[14px] md:text-[15px] truncate"
                  style={{
                    fontFamily: "'Basetica', -apple-system, sans-serif",
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  Up Next: {current.nextTitle}
                </span>
              </>
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      </div>
    </div>
  )
}
