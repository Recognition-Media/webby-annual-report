'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { WinEntry } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { VideoPopoutModal } from './VideoPopoutModal'
import { PlayIcon } from './PlayIcon'
import { useChannelGuide, type ChannelGuideActiveEntry } from './ChannelGuideContext'
import { CHANNEL_ACTIVE_COLOR, DEFAULT_CHANNEL_COLOR, iconColorFor, titleColorFor } from '@/lib/channelColors'

interface WinnerListProps {
  id?: string
  heading: string
  intro?: string
  entries: WinEntry[]
  accentColor?: string
}

function toGuideEntry(entry: WinEntry): ChannelGuideActiveEntry | null {
  if (!entry.videoUrl) return null
  return {
    name: entry.name,
    workTitle: entry.workTitle,
    videoUrl: entry.videoUrl,
    videoThumbnail: entry.videoThumbnail,
    videoDescription: entry.videoDescription,
    orgDescription: entry.orgDescription,
    color: CHANNEL_ACTIVE_COLOR,
  }
}

export function WinnerList({ id, heading, intro, entries, accentColor = '#ef1e40' }: WinnerListProps) {
  const guide = useChannelGuide()
  const videoIndexes = entries ? entries.reduce<number[]>((acc, e, i) => (e.videoUrl ? [...acc, i] : acc), []) : []
  const [activeIndex, setActiveIndex] = useState<number | null>(videoIndexes[0] ?? null)
  const [openEntryIndex, setOpenEntryIndex] = useState<number | null>(null)

  // When grouped under a shared player, offer this list's first
  // video-enabled entry as the group's initial "now playing" pick —
  // only the first list across the whole group to call this wins.
  useEffect(() => {
    if (!guide || videoIndexes.length === 0) return
    const guideEntry = toGuideEntry(entries[videoIndexes[0]])
    if (guideEntry) guide.registerDefault(guideEntry)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!entries || entries.length === 0) return null

  const activeEntry = activeIndex !== null ? entries[activeIndex] : null
  const openEntry = openEntryIndex !== null ? entries[openEntryIndex] : null

  // Flip to the next/previous video-enabled entry in this same stream
  // without closing the modal.
  const openVideoPos = openEntryIndex !== null ? videoIndexes.indexOf(openEntryIndex) : -1
  const nextPlayableIndex = openVideoPos >= 0 && openVideoPos < videoIndexes.length - 1 ? videoIndexes[openVideoPos + 1] : null
  const prevPlayableIndex = openVideoPos > 0 ? videoIndexes[openVideoPos - 1] : null
  const activeColor = activeIndex !== null ? CHANNEL_ACTIVE_COLOR : accentColor

  function activateRow(i: number) {
    if (guide) {
      const guideEntry = toGuideEntry(entries[i])
      if (guideEntry) guide.setActiveEntry(guideEntry)
    } else {
      setActiveIndex(i)
    }
  }

  function isRowActive(i: number, entry: WinEntry) {
    if (!entry.videoUrl) return false
    return guide ? guide.activeEntry?.videoUrl === entry.videoUrl : activeIndex === i
  }

  const compactLabel = (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <p
        className="text-[16px] md:text-[18px] mb-1"
        style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 700 }}
      >
        {heading}
      </p>
      {intro && (
        <p
          className="text-[13px] md:text-[14px] leading-[1.5] max-w-[760px]"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.6)' }}
        >
          {intro}
        </p>
      )}
    </motion.div>
  )

  const columnHeaders = (
    <div className="grid mb-2" style={{ gridTemplateColumns: '48px minmax(160px, 280px) 1fr' }}>
      <div />
      <p className="uppercase px-4" style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(216,245,255,0.5)', fontWeight: 700 }}>
        Organizations
      </p>
      <p className="uppercase px-4" style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(216,245,255,0.5)', fontWeight: 700 }}>
        Programming
      </p>
    </div>
  )

  const rows = (
    <ol className="list-none p-0 m-0 flex flex-col gap-[2px]">
      {entries.map((entry, i) => {
        const titleColor = titleColorFor(!!entry.videoUrl, isRowActive(i, entry))
        const channelTextColor = iconColorFor(DEFAULT_CHANNEL_COLOR)
        const titleTextColor = titleColor ? iconColorFor(titleColor) : '#ffffff'
        return (
          <motion.li
            key={i}
            className="grid items-stretch"
            style={{ gridTemplateColumns: '48px minmax(160px, 280px) 1fr' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.04 }}
            onMouseEnter={entry.videoUrl ? () => activateRow(i) : undefined}
            onFocus={entry.videoUrl ? () => activateRow(i) : undefined}
          >
            {/* Rank — its own narrow column, matches the channel cell's color */}
            <div
              className="flex items-center justify-center text-[13px] md:text-[14px] font-bold"
              style={{ background: DEFAULT_CHANNEL_COLOR, color: channelTextColor }}
            >
              {i + 1}
            </div>

            {/* Channel / org name cell — always the pale-blue channel color */}
            <div
              className="flex items-center px-4 py-3 text-[14px] md:text-[16px]"
              style={{ background: DEFAULT_CHANNEL_COLOR, color: channelTextColor, fontFamily: "'Basetica', -apple-system, sans-serif", fontWeight: entry.highlight ? 700 : 600 }}
            >
              {entry.name}
            </div>

            {/* Work title cell — dark by default; standout (video) rows get their own color */}
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 text-[14px] md:text-[16px] transition-colors duration-200"
              style={{ background: titleColor || '#110E1F', fontFamily: "'Basetica', -apple-system, sans-serif" }}
            >
              {entry.workTitle ? (
                entry.workUrl ? (
                  <a
                    href={entry.workUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: titleTextColor, textUnderlineOffset: 2, fontStyle: 'italic' }}
                  >
                    {entry.workTitle}
                  </a>
                ) : (
                  <span style={{ color: titleTextColor, fontStyle: 'italic' }}>{entry.workTitle}</span>
                )
              ) : (
                <span />
              )}
              {entry.videoUrl && (
                <button
                  onClick={() => activateRow(i)}
                  aria-label={`Watch ${entry.workTitle || entry.name}`}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 cursor-pointer"
                  style={{ background: titleTextColor, border: `1px solid ${titleColor}` }}
                >
                  <PlayIcon size={9} color={titleColor ?? undefined} />
                </button>
              )}
            </div>
          </motion.li>
        )
      })}
    </ol>
  )

  // Grouped mode (shared Channel-Surfing player): no outer section/modal,
  // no local rotating headline or preview pane — just the compact label,
  // column headers, and rows. Hover/click routes into the shared player.
  if (guide) {
    return (
      <div id={id} className="mb-16 md:mb-20 scroll-mt-24">
        {compactLabel}
        {columnHeaders}
        {rows}
      </div>
    )
  }

  return (
    <section
      id={id}
      className="relative px-5 md:px-[60px] py-16 md:py-20"
      style={{ background: '#110E1F' }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        {/* When this list has a channel-guide preview, the heading/intro
            gets demoted to a small label above — the big headline spot
            is taken over by the active preview's own title/description
            below, and rotates as you "change the channel". */}
        {videoIndexes.length > 0 && compactLabel}

        <div className="flex flex-col lg:flex-row gap-8 lg:items-start mb-8">
          <div className="flex-1 min-w-0">
            {videoIndexes.length > 0 && activeEntry ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3
                    className="text-[22px] md:text-[28px] leading-[1.2] mb-4"
                    style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 700 }}
                  >
                    {activeEntry.name}
                    {activeEntry.workTitle ? `: ${activeEntry.workTitle}` : ''}
                  </h3>
                  {activeEntry.videoDescription && (
                    <p
                      className="text-[14px] md:text-[16px] leading-[1.6] max-w-[760px] mb-2"
                      style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.65)' }}
                    >
                      {activeEntry.videoDescription}
                    </p>
                  )}
                  {activeEntry.orgDescription && (
                    <p
                      className="text-[14px] md:text-[16px] leading-[1.6] max-w-[760px]"
                      style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.5)' }}
                    >
                      {activeEntry.orgDescription}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <>
                <motion.h3
                  className="text-[22px] md:text-[28px] leading-[1.2] mb-4"
                  style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 700 }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {heading}
                </motion.h3>
                {intro && (
                  <motion.p
                    className="text-[14px] md:text-[16px] leading-[1.6] max-w-[760px]"
                    style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.65)' }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                  >
                    {intro}
                  </motion.p>
                )}
              </>
            )}
          </div>

          {videoIndexes.length > 0 && activeEntry && (
            <motion.aside
              className="w-full lg:w-[280px] flex-shrink-0"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                role="button"
                aria-label={`Watch ${activeEntry.workTitle || activeEntry.name}`}
                onClick={() => activeIndex !== null && setOpenEntryIndex(activeIndex)}
                className="relative w-full rounded-lg overflow-hidden flex items-center justify-center cursor-pointer transition-colors duration-200"
                style={{ border: `1px solid ${activeColor}`, background: 'rgba(255,255,255,0.03)', aspectRatio: '16 / 9' }}
              >
                {activeEntry.videoThumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element -- CMS-driven preview thumbnail
                  <img
                    src={urlFor(activeEntry.videoThumbnail).width(480).height(270).fit('crop').url()}
                    alt={activeEntry.workTitle || activeEntry.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200" style={{ background: activeColor }}>
                    <PlayIcon size={11} color={iconColorFor(activeColor)} />
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </div>

        {columnHeaders}
        {rows}
      </div>

      {openEntry?.videoUrl && (
        <VideoPopoutModal
          videoUrl={openEntry.videoUrl}
          title={openEntry.workTitle || openEntry.name}
          subtitle={openEntry.workTitle ? openEntry.name : undefined}
          onClose={() => setOpenEntryIndex(null)}
          onNext={nextPlayableIndex !== null ? () => setOpenEntryIndex(nextPlayableIndex) : undefined}
          onPrev={prevPlayableIndex !== null ? () => setOpenEntryIndex(prevPlayableIndex) : undefined}
        />
      )}
    </section>
  )
}
