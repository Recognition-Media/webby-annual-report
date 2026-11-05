'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/sanity/image'
import { getVideoEmbed } from '@/lib/videoEmbed'
import { iconColorFor, hexToRgb } from '@/lib/channelColors'
import { PlayIcon } from './PlayIcon'
import { ChannelGuideContext, type ChannelGuideActiveEntry } from './ChannelGuideContext'

function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

export interface StatBar {
  label: string
  value: number
  displayValue: string
  color: string
}

interface ChannelGuideGroupProps {
  id?: string
  accentColor?: string
  /** Optional stat (e.g. the "89% agree AI is changing..." data module)
   * shown under the shared player instead of up in the trend's hero copy
   * — keeps it near the list it's actually about. `variant: 'donut'`
   * (default) compares multiple answers to one `question` as small ring
   * charts; `variant: 'highlights'` renders each bar as its own large
   * standalone percentage, for independent facts rather than answers to
   * one question. */
  stat?: { eyebrow?: string; question?: string; bars: StatBar[]; variant?: 'donut' | 'highlights' }
  /** DOM id of the list (e.g. "trend-04-list-3") the stat is about —
   * the stat stays hidden until that list scrolls into view, so it
   * "bumps into" the sticky player and stacks under it right as you
   * reach that section, instead of showing from the very top. */
  statAnchorId?: string
  /** Once the stat has bumped into view, keep it shown for the rest of
   * the group instead of hiding it again when scrolling back up past
   * its anchor list. */
  statPersistOnceShown?: boolean
  children: ReactNode
}

// One big, sticky, muted-autoplay player shared across every winner list
// in a trend section — replaces each list having its own small preview
// pane. Stays pinned beside the stacked lists on desktop; renders once,
// non-sticky, above them on mobile. The section's sticky name bar lives
// above this group (rendered by the caller, alongside the section's
// heading/intro) rather than inside it, so it pins from the very top of
// the section instead of only once the winner lists begin.
export function ChannelGuideGroup({ id, accentColor = '#ef1e40', stat, statAnchorId, statPersistOnceShown, children }: ChannelGuideGroupProps) {
  const [activeEntry, setActiveEntry] = useState<ChannelGuideActiveEntry | null>(null)
  const [showStat, setShowStat] = useState(!statAnchorId)
  const hasDefaulted = useRef(false)

  function registerDefault(entry: ChannelGuideActiveEntry) {
    if (hasDefaulted.current) return
    hasDefaulted.current = true
    setActiveEntry(entry)
  }

  useEffect(() => {
    if (!statAnchorId) return
    const target = document.getElementById(statAnchorId)
    if (!target) return
    // By default, keep watching (don't disconnect after the first
    // trigger) so the stat also hides again when scrolling back up past
    // this list — otherwise it stays welded to the sticky player and
    // visibly "follows" it back up instead of staying put. When
    // statPersistOnceShown is set, the opposite is wanted: once it
    // bumps into view, leave it shown for the rest of the group.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowStat(true)
          if (statPersistOnceShown) observer.disconnect()
        } else if (!statPersistOnceShown) {
          setShowStat(false)
        }
      },
      { rootMargin: '0px 0px -40% 0px' }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [statAnchorId, statPersistOnceShown])

  const player = activeEntry && (
    <div>
      <div
        className="relative w-full rounded-lg overflow-hidden transition-colors duration-200"
        style={{ border: `1px solid ${activeEntry.color}`, background: '#000000', aspectRatio: '16 / 9' }}
      >
        <PlayerEmbed entry={activeEntry} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeEntry.videoUrl}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="pt-4"
        >
          <p
            className="text-[18px] md:text-[20px] leading-[1.2] mb-2"
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 700 }}
          >
            {activeEntry.name}
            {activeEntry.workTitle ? `: ${activeEntry.workTitle}` : ''}
          </p>
          {activeEntry.videoDescription && (
            <p
              className="text-[13px] md:text-[14px] leading-[1.6] mb-2"
              style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.65)' }}
            >
              {activeEntry.videoDescription}
            </p>
          )}
          {activeEntry.orgDescription && (
            <p
              className="text-[13px] md:text-[14px] leading-[1.6]"
              style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.5)' }}
            >
              {activeEntry.orgDescription}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )

  return (
    <ChannelGuideContext.Provider value={{ activeEntry, setActiveEntry, registerDefault }}>
      <div id={id} className="relative" style={{ background: '#110E1F' }}>
        <div className="relative px-5 md:px-[60px] py-16 md:py-20">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            {/* Mobile: the shared player renders once, inline, above the
                stacked lists — a sticky sidebar doesn't make sense in a
                single column. */}
            {player && (
              <div className="lg:hidden mb-12">
                {player}
                <AnimatePresence>
                  {stat && showStat && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StatCard stat={stat} accentColor={accentColor} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="flex-1 min-w-0">{children}</div>

              {player && (
                <aside className="hidden lg:block w-[440px] xl:w-[500px] flex-shrink-0 sticky" style={{ top: 100 }}>
                  {player}
                  <AnimatePresence>
                    {stat && showStat && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StatCard stat={stat} accentColor={accentColor} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </aside>
              )}
            </div>
          </div>
        </div>
      </div>
    </ChannelGuideContext.Provider>
  )
}

function StatCard({ stat, accentColor }: { stat: { eyebrow?: string; question?: string; bars: StatBar[]; variant?: 'donut' | 'highlights' }; accentColor: string }) {
  if (stat.variant === 'highlights') {
    return (
      <div className="mt-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {stat.eyebrow && (
          <p className="uppercase mb-6" style={{ fontSize: 11, letterSpacing: 3, color: accentColor, fontWeight: 700 }}>
            {stat.eyebrow}
          </p>
        )}
        <div className="flex flex-col gap-8">
          {stat.bars.map((bar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.15 + i * 0.18 }}
            >
              <p
                style={{
                  fontFamily: "'roc-grotesk-wide', 'roc-grotesk-variable', -apple-system, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(40px, 4vw, 56px)',
                  lineHeight: 1,
                  color: bar.color,
                  margin: 0,
                }}
              >
                {bar.displayValue}
              </p>
              <div style={{ width: 36, height: 3, background: bar.color, margin: '12px 0 14px', borderRadius: 2 }} />
              <p
                className="text-[14px] md:text-[15px] leading-[1.6]"
                style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.75)', margin: 0, maxWidth: 380 }}
              >
                {bar.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      {stat.eyebrow && (
        <p className="uppercase mb-2" style={{ fontSize: 11, letterSpacing: 3, color: accentColor, fontWeight: 700 }}>
          {stat.eyebrow}
        </p>
      )}
      {stat.question && (
        <p
          className="mb-6"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 700, fontSize: 16 }}
        >
          {stat.question}
        </p>
      )}
      <div className="flex flex-col gap-6">
        {stat.bars.map((bar, i) => {
          const size = 100
          const strokeWidth = 9
          const radius = (size - strokeWidth) / 2
          const circumference = 2 * Math.PI * radius
          return (
            <div key={i} className="flex items-center gap-5">
              <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
                  <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={bar.color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{ strokeDashoffset: circumference * (1 - bar.value / 100) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span style={{ fontFamily: 'var(--font-display)', color: '#ffffff', fontWeight: 700, fontSize: 18 }}>
                    {bar.displayValue}
                  </span>
                </div>
              </div>
              <p className="text-[13px] leading-[1.5]" style={{ color: 'rgba(216,245,255,0.65)' }}>
                {bar.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PlayerEmbed({ entry }: { entry: ChannelGuideActiveEntry }) {
  const embed = getVideoEmbed(entry.videoUrl, { autoplayMuted: true })

  if (embed?.kind === 'video') {
    return (
      <video
        key={entry.videoUrl}
        src={embed.src}
        autoPlay
        muted
        loop
        playsInline
        controls
        className="absolute inset-0 w-full h-full object-contain"
      />
    )
  }

  if (embed?.kind === 'iframe') {
    return (
      <iframe
        key={entry.videoUrl}
        src={embed.src}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    )
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {entry.videoThumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element -- CMS-driven preview thumbnail
        <img
          src={urlFor(entry.videoThumbnail).width(960).height(540).fit('crop').url()}
          alt={entry.workTitle || entry.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: entry.color }}>
          <PlayIcon size={16} color={iconColorFor(entry.color)} />
        </div>
      )}
    </div>
  )
}

// A "big-number highlights" stat module rendered inline in the main
// content column (horizontally, 3-across on desktop) rather than in the
// sidebar under the shared video player. Used when a trend's stats
// should sit between two winner lists instead — keeps the sidebar short
// so the sticky player has room to keep tracking all the way to the end
// of the section (a tall, persistently-visible sidebar stat can make the
// aside run out of "stick" room and get left behind partway down a
// list).
// Compact highlight cards, one per stat, laid out side by side in a
// single horizontal row — matches the bordered "85% | believe that..."
// stat-banner card already used above winner lists elsewhere (see
// PosterRowList.tsx's statValue/statCaption block) rather than the
// earlier tall stacked gauge-bar style, so 3+ stats read across one line
// instead of each eating a full-height row. Stacks to one column on
// mobile, where a horizontal row wouldn't fit.
export function StatHighlightsRow({ eyebrow, bars, accentColor }: { eyebrow?: string; bars: StatBar[]; accentColor: string }) {
  return (
    <div
      className="px-5 md:px-[60px] py-16 md:py-20"
      style={{ borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        {eyebrow && (
          <p className="uppercase mb-8" style={{ fontSize: 12, letterSpacing: 3, color: accentColor, fontWeight: 700 }}>
            {eyebrow}
          </p>
        )}
        <div className="flex flex-col md:flex-row gap-5 md:gap-6">
          {bars.map((bar, i) => {
            // A single stat has the whole row to itself (no neighboring
            // cards competing for width) — read it bigger, across two
            // generous lines instead of cramming the same small size used
            // when several stats share the row side by side.
            const solo = bars.length === 1
            return (
            <motion.div
              key={i}
              className="flex-1 min-w-0 flex items-center gap-5 px-6 py-5 md:px-6 md:py-6 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${hexToRgba(bar.color, 0.14)}, ${hexToRgba(bar.color, 0.03)})`,
                border: `1px solid ${hexToRgba(bar.color, 0.3)}`,
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              <span
                className={solo ? 'text-[56px] md:text-[72px] leading-none flex-shrink-0' : 'text-[40px] md:text-[48px] leading-none flex-shrink-0'}
                style={{ fontFamily: 'var(--font-display)', color: bar.color, fontWeight: 700 }}
              >
                {bar.displayValue}
              </span>
              <span className="w-[2px] self-stretch flex-shrink-0" style={{ background: hexToRgba(bar.color, 0.35) }} />
              <span
                className={solo ? 'text-[20px] md:text-[23px] leading-[1.35] max-w-[720px]' : 'text-[13.5px] md:text-[14.5px] leading-[1.5]'}
                style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 600 }}
              >
                {bar.label}
              </span>
            </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
