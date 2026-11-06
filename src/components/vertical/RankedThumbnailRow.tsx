'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { WinEntry } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { hexToRgb, iconColorFor } from '@/lib/channelColors'
import { VideoPopoutModal } from './VideoPopoutModal'
import { PlayIcon } from './PlayIcon'
import { InfoTooltip } from './InfoTooltip'

interface RankedThumbnailRowProps {
  id?: string
  heading: string
  intro?: string
  entries: WinEntry[]
  // Per-entry-index accent color, overriding the default red/blue/pink/green
  // rotation — for when a specific poster needs a specific color (e.g. to
  // match another standout work) rather than whatever the rotation lands on.
  colorOverrides?: Record<number, string>
  /** Optional longer-form context shown in a hover/tap popover off a small
   * "i" icon next to the heading — see PosterRowList's InfoTooltip. */
  infoTooltip?: string
}

// Same red/blue/pink/green rotation used elsewhere in the Telly report.
const ACCENTS = ['#ef1e40', '#0C75FF', '#F41FC9', '#2EFB5E']

// How far to pull each numeral's bottom-right corner past its wrapper's edge
// (in em, so it scales with the responsive font-size) so the glyph's ink —
// not just its font-box — sits flush against the poster. Most digits land
// flush with a modest pull; digits whose rightmost stroke is a diagonal or
// otherwise doesn't reach the box edge (4, 7) need a bigger pull or a visible
// gap remains. Keeping this per-digit (rather than one value tuned to the
// worst case) avoids over-hiding every other digit behind its poster.
const NUMERAL_RIGHT_PULL_EM: Record<number, number> = { 4: -0.17, 7: -0.22 }
const DEFAULT_NUMERAL_RIGHT_PULL_EM = -0.145

function colorScrim(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  return [
    'linear-gradient(to top,',
    'rgba(0,0,0,0.85) 0%,',
    `rgba(${r},${g},${b},0.6) 32%,`,
    `rgba(${r},${g},${b},0.2) 62%,`,
    `rgba(${r},${g},${b},0) 85%)`,
  ].join(' ')
}

// Netflix "Top 10"-style ranked row — a single winning work per org, shown
// as a poster with a giant outline numeral tucked behind it. Entries with a
// `videoUrl` play right in the report via the same pop-out player used
// elsewhere; entries with only a `workUrl` (no embeddable video) fall back
// to linking out to that page.
export function RankedThumbnailRow({ id, heading, intro, entries, colorOverrides, infoTooltip }: RankedThumbnailRowProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
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

  const openEntry = openIndex !== null ? entries[openIndex] : null

  // Flip to the next/previous video-enabled entry in this same stream
  // without closing the modal — skips over any entry with no videoUrl
  // (it wouldn't have been clickable to open in the first place).
  function findPlayable(from: number, direction: 1 | -1) {
    for (let i = from + direction; i >= 0 && i < entries.length; i += direction) {
      if (entries[i].videoUrl) return i
    }
    return null
  }
  const nextPlayableIndex = openIndex !== null ? findPlayable(openIndex, 1) : null
  const prevPlayableIndex = openIndex !== null ? findPlayable(openIndex, -1) : null

  function scrollByAmount(direction: 1 | -1) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  function activate(i: number) {
    const entry = entries[i]
    if (entry.videoUrl) {
      setOpenIndex(i)
    } else if (entry.workUrl) {
      window.open(entry.workUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section id={id} className="relative px-5 md:px-[60px] py-8 md:py-10" style={{ background: '#110E1F' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div className="flex items-center gap-3 mb-4">
          <motion.h3
            className="text-[22px] md:text-[28px] leading-[1.2]"
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 700 }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {heading}
          </motion.h3>
          {infoTooltip && <InfoTooltip text={infoTooltip} />}
        </div>
        {intro && (
          <motion.p
            className="text-[16px] md:text-[20px] leading-[1.6] mb-10"
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.7)' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {intro}
          </motion.p>
        )}

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
          <div ref={scrollRef} className="flex items-stretch gap-6 md:gap-8 overflow-x-auto overflow-y-hidden pb-2" style={{ scrollbarWidth: 'thin' }}>
          {entries.map((entry, i) => {
            const hasVideo = !!entry.videoUrl
            const isInteractive = hasVideo || !!entry.workUrl
            const bgImageUrl = entry.videoThumbnail ? urlFor(entry.videoThumbnail).width(480).height(850).fit('crop').url() : null
            const color = colorOverrides?.[i] ?? ACCENTS[i % ACCENTS.length]
            const badgeTextColor = iconColorFor(color)

            return (
              <motion.div
                key={i}
                className="flex items-stretch flex-shrink-0"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 + i * 0.06 }}
              >
                {/* Giant outline numeral — its own slot before the poster,
                    never overlapping it, so every poster shows its full
                    frame and every numeral (including the first) is fully
                    visible rather than clipped. The wrapper stretches (via
                    items-stretch on this row/unit) to the poster's own
                    height and clips with overflow-hidden, so the numeral
                    can never be taller than the poster — no unwanted
                    vertical overflow/scroll. The span itself is absolutely
                    positioned bottom-right, pulled further right per-digit
                    (see NUMERAL_RIGHT_PULL_EM) so its glyph ink — not just
                    its font-box — sits flush against the poster regardless
                    of per-digit font metrics. The wrapper is kept wide
                    enough (170/220px) that the glyph's ink isn't clipped on
                    its left edge — a narrower box here was what previously
                    fragmented the glyph into stray line fragments. */}
                <div className="relative overflow-hidden flex-shrink-0 w-[170px] md:w-[220px]">
                  <span
                    className="absolute bottom-0 select-none text-[380px] md:text-[500px]"
                    style={{
                      right: `${NUMERAL_RIGHT_PULL_EM[i + 1] ?? DEFAULT_NUMERAL_RIGHT_PULL_EM}em`,
                      lineHeight: 1,
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontVariantNumeric: 'tabular-nums',
                      color: 'rgba(255,255,255,0.22)',
                      WebkitTextStroke: '2.5px rgba(255,255,255,0.55)',
                    }}
                  >
                    {i + 1}
                  </span>
                </div>

                <div
                  role={isInteractive ? 'button' : undefined}
                  tabIndex={isInteractive ? 0 : undefined}
                  onClick={isInteractive ? () => activate(i) : undefined}
                  onKeyDown={
                    isInteractive
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            activate(i)
                          }
                        }
                      : undefined
                  }
                  className="group relative overflow-hidden isolate rounded-[14px] flex-shrink-0 w-[220px] md:w-[280px]"
                  style={{ aspectRatio: '2 / 3', cursor: isInteractive ? 'pointer' : 'default' }}
                >
                  <PosterInner entry={entry} color={color} bgImageUrl={bgImageUrl} />
                  {hasVideo && (
                    <span
                      className="absolute flex items-center justify-center rounded-full"
                      style={{ top: 14, right: 14, width: 36, height: 36, background: color }}
                    >
                      <PlayIcon size={13} color={badgeTextColor} />
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
          </div>
        </div>
      </div>

      {openEntry?.videoUrl && (
        <VideoPopoutModal
          videoUrl={openEntry.videoUrl}
          title={openEntry.workTitle ? `${openEntry.name}: ${openEntry.workTitle}` : openEntry.name}
          subtitle={openEntry.videoDescription || openEntry.orgDescription}
          onClose={() => setOpenIndex(null)}
          onNext={nextPlayableIndex !== null ? () => setOpenIndex(nextPlayableIndex) : undefined}
          onPrev={prevPlayableIndex !== null ? () => setOpenIndex(prevPlayableIndex) : undefined}
        />
      )}
    </section>
  )
}

function PosterInner({
  entry,
  color,
  bgImageUrl,
}: {
  entry: WinEntry
  color: string
  bgImageUrl: string | null
}) {
  return (
    <>
      <div
        className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : `linear-gradient(165deg, rgba(5,4,10,0.95), ${color})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0" style={{ background: colorScrim(color) }} />
      <div className="absolute left-0 right-0 bottom-0 p-4 md:p-5">
        <span
          className="inline-block uppercase mb-2 truncate max-w-full"
          style={{
            fontFamily: "'Basetica', -apple-system, sans-serif",
            fontSize: 10,
            letterSpacing: 1.2,
            fontWeight: 800,
            color: 'rgba(15,12,25,0.92)',
            background: 'rgba(245,245,248,0.82)',
            padding: '4px 10px',
            borderRadius: 100,
          }}
        >
          {entry.name}
        </span>
        {entry.workTitle && (
          <h4
            className="text-[18px] md:text-[21px] leading-[1.15] min-h-[41px] md:min-h-[48px]"
            style={{ fontFamily: 'var(--font-display)', color: '#ffffff', fontWeight: 700 }}
          >
            {entry.workTitle}
          </h4>
        )}
      </div>
    </>
  )
}
