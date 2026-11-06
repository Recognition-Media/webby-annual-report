'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function ScrollGauge({ sentimentGauge, accentColor }: { sentimentGauge: { score: number; contextLeft?: string; contextRight?: string }; accentColor: string }) {
  const gaugeRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: gaugeRef,
    offset: ['start end', 'center center'],
  })
  const dashOffset = useTransform(
    scrollYProgress,
    [0, 1],
    [314, 314 - (314 * sentimentGauge.score / 100)]
  )

  return (
    <div ref={gaugeRef} className="mb-12 flex flex-col items-center">
      <div className="relative w-full max-w-[480px] md:max-w-[640px]" style={{ aspectRatio: '240/160' }}>
        <svg viewBox="0 0 240 160" className="w-full h-full">
          <path
            d="M 20 140 A 100 100 0 0 1 220 140"
            fill="none"
            stroke="rgba(33,38,26,0.1)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <motion.path
            d="M 20 140 A 100 100 0 0 1 220 140"
            fill="none"
            stroke={accentColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="314"
            style={{ strokeDashoffset: dashOffset }}
          />
          <text x="16" y="155" fill="#21261A" fontSize="9" opacity="0.4" textAnchor="start">0</text>
          <text x="16" y="148" fill="#21261A" fontSize="9" opacity="0.35" textAnchor="start" dy="20">Negative</text>
          <text x="120" y="22" fill="#21261A" fontSize="9" opacity="0.4" textAnchor="middle">50</text>
          <text x="224" y="155" fill="#21261A" fontSize="9" opacity="0.4" textAnchor="end">100</text>
          <text x="224" y="148" fill="#21261A" fontSize="9" opacity="0.35" textAnchor="end" dy="20">Positive</text>
        </svg>
        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 text-center">
          <div
            className="text-[56px] md:text-[112px] leading-none"
            style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 700 }}
          >
            {sentimentGauge.score}
          </div>
          <p className="text-[12px] md:text-[16px] mt-6 md:mt-11" style={{ color: '#21261A', opacity: 0.5 }}>
            Average Sentiment Score
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-6 justify-center">
        <span
          className="text-[13px] md:text-[14px] py-2 px-5 rounded-full"
          style={{ background: 'rgba(33,38,26,0.08)', color: '#21261A' }}
        >
          {sentimentGauge.contextLeft || '2025: 70% felt negative'}
        </span>
        <span
          className="text-[13px] md:text-[14px] py-2 px-5 rounded-full"
          style={{ background: accentColor, color: '#E3DDCA' }}
        >
          {sentimentGauge.contextRight || '2026: Moving toward neutral'}
        </span>
      </div>
    </div>
  )
}

interface ReportSectionCoverProps {
  sectionNumber: string
  title: string
  subtitle: string
  copy?: string
  accentColor?: string
  compact?: boolean
  property?: 'webby' | 'anthem' | 'telly' | 'lovie'
  /** Path to an SVG to render in place of the numeric `sectionNumber` text
   * (e.g. the Lovie heart-token assets in /public/lovie/no-*.svg). */
  sectionNumberSvg?: string
  /** Optional explicit desktop min-height (in px). When set, overrides the
   * default `md:min-h-screen` so a section cover can be shorter without
   * dropping to fully-compact mode. */
  minHeightPx?: number
  /** Override the title font family. Defaults to `var(--font-display)`
   * (Decoy). Shared Influence passes Roc Grotesk Variable. */
  titleFontFamily?: string
  /** Override the title font weight. Defaults to `400`. Shared Influence
   * passes 700 for a bolder editorial title. */
  titleFontWeight?: number
  /** Override the subtitle font family. Defaults to `var(--font-display)`. */
  subtitleFontFamily?: string
  /** Whether the subtitle renders in italic. Defaults to `false` (roman)
   * per Jordana's universal editorial preference across all reports. Pass
   * `true` only if a specific cover explicitly needs italic. */
  subtitleItalic?: boolean
  /** When true, the sectionNumber is used only for the DOM id and is
   * not rendered visually. Useful for transition covers (takeaways,
   * etc.) where the number token is unwanted. */
  hideSectionNumber?: boolean
  /** When true, collapses the title's own bottom margin and the cover's
   * bottom padding to near nothing — for a cover with no subtitle/copy of
   * its own, where whatever follows (e.g. Telly's TrendContent body
   * paragraph) should sit immediately under the title, same tight spacing
   * as a plain list heading, instead of the generous divider-style gap a
   * standalone section cover normally wants. */
  tightBottomSpacing?: boolean
}

export function ReportSectionCover({
  sectionNumber,
  title,
  subtitle,
  copy,
  accentColor = '#8C001C',
  compact = false,
  property,
  sectionNumberSvg,
  minHeightPx,
  titleFontFamily = 'var(--font-display)',
  titleFontWeight = 400,
  subtitleFontFamily = 'var(--font-display)',
  subtitleItalic = false,
  hideSectionNumber = false,
  tightBottomSpacing = false,
}: ReportSectionCoverProps) {
  const isLovie = property === 'lovie'
  const isTelly = property === 'telly'
  const coverTextColor = isTelly ? '#ffffff' : '#21261A'
  const hasExplicitMinHeight = typeof minHeightPx === 'number'
  // Skip the explicit min-height on mobile — it forces a large gap
  // between the cover and the first content block when the cover's
  // actual content is shorter than the pixel value.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return (
    <section
      id={`section-${sectionNumber}`}
      className={`relative px-5 md:px-[60px] ${
        compact
          ? ''
          : hasExplicitMinHeight
            ? 'md:flex md:flex-col md:items-center md:justify-center'
            : 'md:min-h-screen md:flex md:flex-col md:items-center md:justify-center'
      }`}
      style={{
        background: isLovie ? '#f2eeed' : isTelly ? '#110E1F' : '#E3DDCA',
        paddingTop: compact ? (isMobile ? 56 : 80) : 50,
        paddingBottom: tightBottomSpacing ? 0 : compact ? (isMobile ? 24 : 60) : 50,
        ...(hasExplicitMinHeight && !isMobile ? { minHeight: minHeightPx } : {}),
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {/* Center-aligned: number, title, rule, subtitle — Telly reads
            left-aligned instead, flush with the trend body copy and the
            winner lists below it rather than centered independently. */}
        <div className={isTelly ? 'text-left' : 'text-center'}>
          {/* Section number (or SVG token for Lovie). Telly reads the
              number as a small raised mark inline with the title
              instead — rendered below, inside the heading. */}
          {hideSectionNumber || isTelly ? null : sectionNumberSvg ? (
            <motion.img
              src={sectionNumberSvg}
              alt={`Section ${sectionNumber}`}
              className="mx-auto mb-4 select-none"
              draggable={false}
              style={{
                // Nordics uses the plain-heart lockup — read a touch
                // smaller than the numbered Lovie tokens so it sits as
                // an accent rather than a title-competing mark.
                height: sectionNumberSvg.includes('lovie-heart-black')
                  ? 'clamp(44px, 6vw, 80px)'
                  : 'clamp(64px, 9vw, 120px)',
                width: 'auto',
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <motion.p
              className="text-[48px] md:text-[72px] leading-none mb-4"
              style={{ fontFamily: 'var(--font-display)', color: accentColor, fontWeight: 700 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {sectionNumber}
            </motion.p>
          )}

          {/* Title */}
          <motion.h2
            className={`text-[32px] md:text-[56px] lg:text-[64px] leading-[1.05] ${tightBottomSpacing ? 'mb-0' : 'mb-6'}`}
            style={{ fontFamily: titleFontFamily, color: coverTextColor, fontWeight: titleFontWeight }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {isTelly && !hideSectionNumber && (
              <span
                style={{
                  fontSize: '0.3em',
                  fontWeight: 700,
                  color: accentColor,
                  position: 'relative',
                  top: '-0.5em',
                  marginRight: '0.12em',
                }}
              >
                {sectionNumber}
              </span>
            )}
            {title}
          </motion.h2>

          {/* Divider — centered. Telly drops it: with the heading now
              left-aligned flush to the body copy and winner lists below,
              the short accent line read as a stray mark rather than a
              deliberate rule. */}
          {!isTelly && (
            <motion.div
              style={{ width: 48, height: 2, background: accentColor, marginBottom: 28, marginLeft: 'auto', marginRight: 'auto' }}
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            />
          )}

          {/* Subtitle — Telly folds this straight into the body copy
              paragraph below (same small size, no gap) instead of
              rendering it as its own larger headline line. */}
          {!isTelly && (
            <motion.p
              className="text-[18px] md:text-[22px] leading-[1.4] mb-8 max-w-[800px] mx-auto"
              style={{
                fontFamily: subtitleFontFamily,
                color: coverTextColor,
                fontStyle: subtitleItalic ? 'italic' : 'normal',
                fontWeight: 400,
              }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Left-aligned: body copy, centered on page axis. Telly merges
            the subtitle sentence in here too so the whole description
            reads as one continuous paragraph at a single size. Skipped
            when the cover doesn't ship a paragraph (e.g. Nordics Ones
            to Watch, where the subtitle alone tells the whole story). */}
        {(isTelly ? subtitle || copy : copy) && (
          <div className="max-w-[588px] mx-auto">
            <motion.p
              className="text-[16px] md:text-[18px] leading-[30px] text-center"
              style={{
                fontFamily: isLovie
                  ? "'Scto Grotesk A', -apple-system, sans-serif"
                  : isTelly
                    ? "'Basetica', -apple-system, sans-serif"
                    : "'roc-grotesk-variable', -apple-system, sans-serif",
                color: coverTextColor,
                opacity: 0.65,
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              {isTelly ? [subtitle, copy].filter(Boolean).join(' ') : copy}
            </motion.p>
          </div>
        )}
      </div>
    </section>
  )
}

interface DataBar {
  label: string
  value: number
  displayValue: string
  change?: string
  color: string
}

interface DataModule {
  eyebrow?: string
  question: string
  bars: DataBar[]
}

interface TrendQuote {
  name: string
  title: string
  text: string
  headshotUrl?: string
  borderColor?: string
}

interface TrendVideo {
  url: string
  label?: string
  name: string
  title: string
}

interface SentimentGauge {
  score: number
  label?: string
  contextLeft?: string
  contextRight?: string
}

interface TrendContentProps {
  trendNumber: string
  /** Omit when a section cover right above already shows this title —
   * avoids repeating the same heading twice in a row. */
  title?: string
  body: React.ReactNode[]
  accentColor?: string
  stats?: { label: string; value: string; change?: string }[]
  dataModule?: DataModule
  sentimentGauge?: SentimentGauge
  customRightColumn?: React.ReactNode
  quotes?: TrendQuote[]
  quotesEyebrow?: string
  video?: TrendVideo
  background?: string
  /** Drives text-color theming (Telly reads white instead of the
   * default Anthem near-black). Other properties are unaffected. */
  property?: 'webby' | 'anthem' | 'telly' | 'lovie'
}

export function TrendContent({
  trendNumber,
  title,
  body,
  accentColor = '#8C001C',
  stats,
  dataModule,
  sentimentGauge,
  customRightColumn,
  quotes,
  quotesEyebrow = 'What Our Community Is Saying',
  video,
  background = '#E3DDCA',
  property,
}: TrendContentProps) {
  const defaultBorderColors = ['#8C001C', '#D17DD0', '#066DBA', '#00B469']
  const isTelly = property === 'telly'
  const textColor = isTelly ? '#ffffff' : '#21261A'
  const dividerColor = isTelly ? 'rgba(255,255,255,0.15)' : 'rgba(33,38,26,0.15)'
  const trackColor = isTelly ? 'rgba(255,255,255,0.1)' : 'rgba(33,38,26,0.1)'
  // With no right column (a Telly trend whose stat is placed inline
  // elsewhere, or has none at all), the copy stack used to stay pinned to
  // a 50%-wide column anyway, wrapping onto far more lines than it needed
  // to and leaving the whole right half of the section empty — the gap
  // that pushed the first winner list well below the fold. Telly-only:
  // let the copy run the full container width instead (capped for
  // readability), closing that gap. Every other property keeps the
  // original 50/50 split regardless of whether a right column renders.
  const hasRightColumn = !!(dataModule || sentimentGauge || customRightColumn)
  const widenCopy = isTelly && !hasRightColumn
  return (
    <section
      className={`relative px-5 md:px-[60px] ${
        title ? 'py-20 md:py-28' : widenCopy ? 'pt-0 pb-0' : 'pt-0 pb-20 md:pb-28'
      }`}
      style={{ background }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          {/* Left column: copy stack — widenCopy runs the full 1280
              container width (no readability cap) so the paragraph lines
              up flush with the cover heading above and the winner lists'
              own full-width rows below, per Ann's alignment note. */}
          <div className={widenCopy ? 'md:w-full' : 'md:w-[50%]'}>
            {/* Trend eyebrow — skipped along with the title when a cover
                right above already shows the section number/name */}
            {title && (
              <motion.p
                className="uppercase font-medium mb-6"
                style={{ fontSize: 14, letterSpacing: 4, color: accentColor }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Trend {trendNumber}
              </motion.p>
            )}

            {/* Trend title — skipped when a cover right above already shows it */}
            {title && (
              <motion.h3
                className="text-[24px] md:text-[36px] leading-[1.15] mb-6"
                style={{ fontFamily: 'var(--font-display)', color: textColor, fontWeight: 400 }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {title}
              </motion.h3>
            )}

            {/* Accent divider — Telly drops it (see the matching note on
                ReportSectionCover's own divider above). */}
            {!isTelly && <div style={{ width: 36, height: 2, background: accentColor, marginBottom: 24 }} />}

            {/* Body paragraphs */}
            {body.map((paragraph, i) => (
              <motion.p
                key={i}
                className="text-[15px] md:text-[18px] leading-[1.6] md:leading-[30px] mb-6"
                style={{
                  fontFamily: isTelly ? "'Basetica', -apple-system, sans-serif" : "'roc-grotesk-variable', -apple-system, sans-serif",
                  color: textColor,
                }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              >
                {paragraph}
              </motion.p>
            ))}

            {/* Stats grid */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-10">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className="py-5 border-t"
                    style={{ borderColor: dividerColor }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  >
                    <div
                      className="text-[28px] md:text-[36px] leading-none mb-2"
                      style={{ fontFamily: 'var(--font-display)', color: accentColor, fontWeight: 700 }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-[12px] md:text-[13px] leading-[1.4]"
                      style={{ color: textColor, opacity: 0.6 }}
                    >
                      {stat.label}
                    </div>
                    {stat.change && (
                      <div
                        className="text-[11px] mt-1 font-medium"
                        style={{ color: accentColor }}
                      >
                        {stat.change}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

          </div>

          {/* Right column: data module, sentiment gauge, or custom */}
          {(dataModule || sentimentGauge || customRightColumn) && (
            <div className="md:w-[50%] md:pt-[38px]">
              {/* Sentiment gauge — Option A: Scroll-driven half-circle arc */}
              {sentimentGauge && (
                <ScrollGauge sentimentGauge={sentimentGauge} accentColor={accentColor} />
              )}

              {dataModule && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {dataModule.eyebrow && (
                  <p
                    className="uppercase font-medium mb-3"
                    style={{ fontSize: 11, letterSpacing: 4, color: accentColor }}
                  >
                    {dataModule.eyebrow}
                  </p>
                )}
                <h4
                  className="leading-[1.4] mb-8 w-full"
                  style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: textColor, fontWeight: 400 }}
                >
                  {dataModule.question}
                </h4>

                {/* Telly reads each stat as a donut ring with the
                    percentage front and center, since leading with a
                    label ("agree that...") before the number it refers
                    to reads backwards. Other properties keep the
                    horizontal fill bar below. */}
                {isTelly ? (
                  <div className="flex flex-col gap-8 w-full">
                    {dataModule.bars.map((bar, i) => {
                      const size = 112
                      const strokeWidth = 10
                      const radius = (size - strokeWidth) / 2
                      const circumference = 2 * Math.PI * radius
                      return (
                        <motion.div
                          key={i}
                          className="flex items-center gap-6"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                        >
                          <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
                            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                              <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={trackColor}
                                strokeWidth={strokeWidth}
                              />
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
                                transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span
                                className="text-[20px] md:text-[22px]"
                                style={{ fontFamily: 'var(--font-display)', color: textColor, fontWeight: 700 }}
                              >
                                {bar.displayValue}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] md:text-[14px] leading-[1.5]" style={{ color: textColor }}>
                              {bar.label}
                            </p>
                            {bar.change && (
                              <p className="text-[11px] mt-1.5 font-medium" style={{ color: bar.color }}>
                                {bar.change}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 w-full">
                    {dataModule.bars.map((bar, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                      >
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-[13px] md:text-[14px]" style={{ color: textColor }}>{bar.label}</span>
                          <span className="text-[18px] md:text-[22px]" style={{ fontFamily: 'var(--font-display)', color: textColor, fontWeight: 700 }}>{bar.displayValue}</span>
                        </div>
                        <div className="h-[8px] rounded-full" style={{ background: trackColor }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: bar.color }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${bar.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                          />
                        </div>
                        {bar.change && (
                          <p className="text-[11px] mt-1.5 font-medium" style={{ color: bar.color }}>
                            {bar.change}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
              )}

              {/* Custom right column content */}
              {customRightColumn}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
