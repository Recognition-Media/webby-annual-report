'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { WinEntry } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { InfoTooltip } from './InfoTooltip'

interface PartnerDirectoryListProps {
  id?: string
  heading: string
  intro?: string
  entries: WinEntry[]
  /** Tints the eyebrow label and the surrounding card, matching the
   * gradient-tinted "By The Numbers" stat-card look elsewhere in the
   * report. Defaults to Social Impact's green since that's the only
   * directoryRow list in the report today. */
  accentColor?: string
  /** Optional longer-form context shown in a hover/tap popover off a small
   * "i" icon next to the heading — see PosterRowList's InfoTooltip. */
  infoTooltip?: string
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}
function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

// Non-video alternate to the ranked-table WinnerList — a horizontally
// scrolling row of partner logo tiles, one per entry (same scroll
// mechanics as PosterRowList). Logos only in the row itself; clicking one
// opens a pop-out card with that partner's name, full description, and a
// link to their website, matching the overlay-card style already
// established by TellyJudgePopup. Opt in per winnerList via the CMS
// `directoryRow` toggle (e.g. "Our Social Work Partners"). The whole
// group — eyebrow label, intro, and the logo row — sits inside one
// gradient-tinted bordered card, the same treatment StatHighlightsRow
// uses for "By The Numbers", so a non-stat directory list reads with the
// same visual weight as a stat module instead of a full-size section
// heading.
export function PartnerDirectoryList({ id, heading, intro, entries, accentColor = '#2EFB5E', infoTooltip }: PartnerDirectoryListProps) {
  // Which tile is showing its blurb from a tap. Only used on touch, where
  // there's no hover to reveal it.
  const [touchedIndex, setTouchedIndex] = useState<number | null>(null)
  // `any-hover: hover` is false on touch-only devices. Read once on mount so
  // SSR and the first client render agree.
  const [canHover, setCanHover] = useState(true)
  useEffect(() => {
    setCanHover(window.matchMedia('(any-hover: hover)').matches)
  }, [])
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    function update() {
      setCanScrollLeft(el!.scrollLeft > 2)
      setCanScrollRight(el!.scrollLeft < el!.scrollWidth - el!.clientWidth - 2)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [entries])

  if (!entries || entries.length === 0) return null

  function scrollByAmount(direction: 1 | -1) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  const openEntry = openIndex !== null ? entries[openIndex] : null

  return (
    <section id={id} className="relative px-5 md:px-[60px] py-6 md:py-8" style={{ background: '#110E1F' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div className="flex items-center gap-3 mb-4">
          <motion.p
            className="uppercase"
            style={{ fontSize: 12, letterSpacing: 3, color: accentColor, fontWeight: 700, fontFamily: "'Basetica', -apple-system, sans-serif" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {heading}
          </motion.p>
          {infoTooltip && <InfoTooltip text={infoTooltip} />}
        </div>
        <motion.div
          className="rounded-xl px-6 py-8 md:px-8 md:py-10"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(accentColor, 0.14)}, ${hexToRgba(accentColor, 0.03)})`,
            border: `1px solid ${hexToRgba(accentColor, 0.3)}`,
          }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative group/row">
            {canScrollLeft && (
              <button
                type="button"
                aria-label="Scroll left"
                onClick={() => scrollByAmount(-1)}
                className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-4 z-10 w-9 h-9 rounded-full items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 cursor-pointer"
                style={{ background: 'rgba(17,14,31,0.75)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            {canScrollRight && (
              <button
                type="button"
                aria-label="Scroll right"
                onClick={() => scrollByAmount(1)}
                className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-4 z-10 w-9 h-9 rounded-full items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 cursor-pointer"
                style={{ background: 'rgba(17,14,31,0.75)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}

            <div ref={scrollRef} className="flex items-stretch gap-5 overflow-x-auto overflow-y-hidden pb-2 telly-scroll">
              {entries.map((entry, i) => {
                const logoUrl = entry.logo ? urlFor(entry.logo).width(320).url() : null
                const blurb = entry.hoverBlurb
                const revealed = touchedIndex === i
                return (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => {
                      // No hover on touch: the first tap reveals the blurb,
                      // the second opens the full card, so nothing becomes
                      // unreachable on a phone. Pointer devices have already
                      // seen the blurb on hover and open on the first click.
                      if (blurb && !canHover && !revealed) {
                        setTouchedIndex(i)
                        return
                      }
                      setOpenIndex(i)
                    }}
                    aria-label={blurb ? `${entry.name} — ${blurb}` : entry.name}
                    className="group relative flex-shrink-0 w-[200px] md:w-[220px] flex items-center justify-center rounded-xl cursor-pointer overflow-hidden transition-transform duration-200 hover:-translate-y-1"
                    style={{ height: 130, background: '#FBF9F4', padding: '20px 24px' }}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.05 + i * 0.06 }}
                  >
                    {logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logoUrl}
                        alt={`${entry.name} logo`}
                        className="transition-opacity duration-200"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          opacity: revealed ? 0.05 : undefined,
                        }}
                      />
                    ) : (
                      <span
                        className="text-[14px] font-bold text-center"
                        style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#110E1F' }}
                      >
                        {entry.name}
                      </span>
                    )}
                    {blurb && (
                      <>
                        {/* Fades the logo back so the copy reads cleanly over it. */}
                        <span
                          aria-hidden
                          className="absolute inset-0 pointer-events-none transition-opacity duration-200 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                          style={{ background: '#FBF9F4', opacity: revealed ? 1 : undefined }}
                        />
                        <span
                          aria-hidden
                          className="absolute inset-0 flex items-center justify-center text-center px-4 pointer-events-none transition-opacity duration-200 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                          style={{
                            background: '#2A2735',
                            color: '#ffffff',
                            fontFamily: "'Basetica', -apple-system, sans-serif",
                            fontSize: 12.5,
                            fontWeight: 600,
                            lineHeight: 1.42,
                            opacity: revealed ? 1 : undefined,
                          }}
                        >
                          {blurb}
                        </span>
                      </>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {openEntry && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center px-5"
            style={{ background: 'rgba(0,0,0,0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpenIndex(null)}
          >
            <motion.div
              className="relative w-full rounded-2xl p-6 md:p-10 text-center"
              style={{ maxWidth: 560, background: '#110E1F', border: '1px solid rgba(255,255,255,0.12)' }}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
                className="absolute top-4 right-4 md:top-5 md:right-5 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                ✕
              </button>

              {openEntry.logo && (
                <div
                  className="flex items-center justify-center rounded-xl mb-6 mx-auto"
                  style={{ height: 110, background: '#FBF9F4', padding: '18px 24px', maxWidth: 260 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={urlFor(openEntry.logo).width(320).url()}
                    alt={`${openEntry.name} logo`}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}

              {openEntry.orgDescription && (
                <p
                  className="text-[14px] md:text-[15px] leading-[1.6] mb-6"
                  style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.75)' }}
                >
                  {openEntry.orgDescription}
                </p>
              )}

              {openEntry.workUrl && (
                <div className="flex justify-center">
                  <a
                    href={openEntry.workUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-full uppercase transition-colors duration-200 cursor-pointer"
                    style={{
                      color: '#110E1F',
                      background: '#2EFB5E',
                      fontSize: 12,
                      letterSpacing: 1.5,
                      fontWeight: 700,
                      fontFamily: "'Basetica', -apple-system, sans-serif",
                    }}
                  >
                    Visit Website ↗
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
