'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { WinEntry } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { getVideoThumbnail } from '@/lib/videoEmbed'
import { VideoPopoutModal } from './VideoPopoutModal'
import { PlayIcon } from './PlayIcon'
import { iconColorFor, IMAGE_SCRIM } from '@/lib/channelColors'
import { InfoTooltip } from './InfoTooltip'

interface PosterRowListProps {
  id?: string
  heading: string
  intro?: string
  statValue?: string
  statCaption?: string
  entries: WinEntry[]
  /** The pop-out player's shape when a card is clicked — defaults to 16:9
   * (standard horizontal video). Only "Vertical Video Series" actually
   * contains vertical/mobile-native video, so that's the one list that
   * should pass '9 / 16' here; every other posterRow list (Online
   * Commercials, Trending Documentaries, etc.) just reuses this card
   * layout for its background/no-numeral styling, not for the video
   * orientation. */
  videoAspectRatio?: '16 / 9' | '9 / 16'
  /** Optional longer-form context shown in a hover/tap popover off a small
   * "i" icon next to the heading — for a note too long or too tangential
   * to put in the regular intro paragraph. Omit for the plain heading. */
  infoTooltip?: string
  /** This trend section's own color. Tints the list heading so sections
   * still read as colour-grouped now that the card images all share one
   * neutral scrim instead of per-section tinted ones. */
  accentColor?: string
}


// Same red/blue/pink/green rotation used for the ToC poster wall and the
// judge-popup accents elsewhere in the Telly report — cycling it per card
// here instead of one flat accentColor gives each poster its own identity.
const ACCENTS = ['#ef1e40', '#0C75FF', '#F41FC9', '#2EFB5E']

// Ombre wash over the poster art, tinted with the card's own accent color —
// solid black at the very bottom (for the title/eyebrow text to stay
// legible over any photo), warming into the accent hue through the middle,
// and fully clear by the top so the thumbnail reads on its own up there.
// Experimental alternate to the ranked-table WinnerList — a horizontal row
// of poster/thumbnail cards (streaming-guide style). Opt in per winnerList
// via the CMS `posterRow` toggle, so it's a one-line revert if it doesn't
// work out. The pop-out player defaults to a standard 16:9 shape;
// `videoAspectRatio="9 / 16"` is only passed in for Vertical Video Series,
// whose wins are actually vertical/mobile-native video.
export function PosterRowList({ id, heading, intro, statValue, statCaption, entries, videoAspectRatio = '16 / 9', infoTooltip, accentColor = '#ffffff' }: PosterRowListProps) {
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
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: accentColor, fontWeight: 700 }}
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
            className="text-[16px] md:text-[20px] leading-[1.6] mb-8"
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.65)' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {intro}
          </motion.p>
        )}

        {statValue && (
          <motion.div
            className="flex items-center gap-6 md:gap-7 mb-8 px-6 py-5 md:px-7 md:py-6 rounded-xl"
            style={{
              background: 'transparent',
              border: `2px solid ${ACCENTS[0]}`,
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span
              className="text-[48px] md:text-[64px] leading-none flex-shrink-0"
              style={{ fontFamily: 'var(--font-display)', color: ACCENTS[0], fontWeight: 700 }}
            >
              {statValue}
            </span>
            <span className="w-[2px] self-stretch flex-shrink-0" style={{ background: ACCENTS[0] }} />
            {statCaption && (
              <span
                className="text-[14px] md:text-[16px] leading-[1.5] max-w-[420px]"
                style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 600 }}
              >
                {statCaption}
              </span>
            )}
          </motion.div>
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
          <div ref={scrollRef} className="flex items-stretch gap-5 overflow-x-auto overflow-y-hidden pb-2 telly-scroll">
          {entries.map((entry, i) => {
            const hasVideo = !!entry.videoUrl
            const isInteractive = hasVideo || !!entry.workUrl
            const bgImageUrl = entry.videoThumbnail
              ? urlFor(entry.videoThumbnail).width(480).height(850).fit('crop').url()
              : getVideoThumbnail(entry.videoUrl)
            const color = ACCENTS[i % ACCENTS.length]
            const badgeTextColor = iconColorFor(color)

            return (
              <motion.div
                key={i}
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
                className="group relative flex-shrink-0 overflow-hidden isolate w-[220px] md:w-[280px]"
                style={{
                  aspectRatio: '9 / 16',
                  borderRadius: 14,
                  cursor: isInteractive ? 'pointer' : 'default',
                  opacity: isInteractive ? 1 : 0.55,
                }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: isInteractive ? 1 : 0.55 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 + i * 0.06 }}
              >
                <div
                  className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : `linear-gradient(165deg, rgba(5,4,10,0.95), ${color})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: IMAGE_SCRIM }}
                />
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
                  <h4
                    className="text-[18px] md:text-[21px] leading-[1.15]"
                    style={{ fontFamily: 'var(--font-display)', color: '#ffffff', fontWeight: 700, minHeight: '2.3em' }}
                  >
                    {entry.workTitle || entry.name}
                  </h4>
                </div>
                {hasVideo && (
                  <span
                    className="absolute flex items-center justify-center rounded-full"
                    style={{ top: 14, right: 14, width: 36, height: 36, background: color }}
                  >
                    <PlayIcon size={13} color={badgeTextColor} />
                  </span>
                )}
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
          subtitle={openEntry.orgDescription}
          aspectRatio={videoAspectRatio}
          onClose={() => setOpenIndex(null)}
          onNext={nextPlayableIndex !== null ? () => setOpenIndex(nextPlayableIndex) : undefined}
          onPrev={prevPlayableIndex !== null ? () => setOpenIndex(prevPlayableIndex) : undefined}
        />
      )}
    </section>
  )
}
