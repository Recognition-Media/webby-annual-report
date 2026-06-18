'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { CountryItaly, CountryPortugal, CountrySpain } from '../lovie/CountryStickers'

export interface LovieDataBar {
  label: string
  value: number
  displayValue: string
  color?: string
  /** Shorter caption used under vertical bars where space is tight.
   * Falls back to `label` if not provided. */
  shortLabel?: string
}

export interface LovieDataModule {
  eyebrow?: string
  question: string
  bars: LovieDataBar[]
  /** Visualization style:
   *   `bar`         — horizontal bars (default; share-of-respondents data)
   *   `lollipop`    — thin stem with a dot at the value (ranked / scores)
   *   `verticalBar` — column chart (Anthem-style; many parallel categories)
   *   `donut`       — interactive donut with hover-to-highlight wedges
   *                   (single-choice / share-of-total data) */
  chartType?: 'bar' | 'lollipop' | 'verticalBar' | 'donut'
  /** Optional footnote rendered under the chart (e.g. "Avg. score out of 10"). */
  footnote?: string
}

export interface LovieInsideTheHubsContent {
  eyebrow?: string
  heading?: string
  spainCopy?: PortableTextBlock[] | React.ReactNode
  italyCopy?: PortableTextBlock[] | React.ReactNode
  portugalCopy?: PortableTextBlock[] | React.ReactNode
}

export interface LovieFeatureMedia {
  /** Video file URL (.mp4) for inline <video>, or iframe-embeddable URL for
   * external sites/YouTube. Detected by file extension. */
  url: string
  /** Eyebrow label above the player, e.g. "Standouts from the Mediterranean" */
  label?: string
  /** Headline shown under the player on the left (e.g. studio or speaker name) */
  name?: string
  /** Smaller line under `name` (e.g. project subtitle or speaker role) */
  title?: string
  /** Optional secondary caption below the metadata row */
  description?: string
  /** Label on the play button when paused. Defaults to "Watch Video". */
  buttonLabel?: string
}

export interface LovieQuote {
  text: string
  attribution: string
  role?: string
  /** Optional LinkedIn (or any) URL. When set, the attribution name becomes
   * a link. Source text typically already includes its own quote marks. */
  linkedInUrl?: string
  /** Optional circular headshot displayed to the left of the quote. */
  headshotUrl?: string
  /** Border color for the headshot circle. Defaults to the trend accent
   * color if not specified. */
  borderColor?: string
}

interface LovieTrendContentProps {
  trendNumber: string
  title: string
  body: React.ReactNode[]
  accentColor?: string
  dataModule?: LovieDataModule
  insideTheHubs?: LovieInsideTheHubsContent
  featureMedia?: LovieFeatureMedia
  /** Falls back to first quote in row 1 right if no dataModule, second quote
   * in row 2 right if no featureMedia. */
  quotes?: LovieQuote[]
}

export function LovieTrendContent({
  trendNumber,
  title,
  body,
  accentColor = '#ff6000',
  dataModule,
  insideTheHubs,
  featureMedia,
  quotes = [],
}: LovieTrendContentProps) {
  // Right-column composition. Quotes act as a flexible fill so trends with
  // different module combinations all read cleanly:
  //   - dataModule present → row1 = data
  //   - dataModule absent → row1 stacks ALL quotes alongside the body
  //   - featureMedia present → row2 = media
  //   - featureMedia absent → row2 stacks remaining quotes
  //   - anything still leftover → row3 (full-width pulled quotes)
  let quoteCursor = 0
  let row1Right:
    | { kind: 'data'; module: LovieDataModule }
    | { kind: 'quotes'; quotes: LovieQuote[] }
    | undefined
  if (dataModule) {
    row1Right = { kind: 'data', module: dataModule }
  } else if (quotes.length > 0) {
    row1Right = { kind: 'quotes', quotes }
    quoteCursor = quotes.length
  }
  let row2Right:
    | { kind: 'media'; media: LovieFeatureMedia }
    | { kind: 'quotes'; quotes: LovieQuote[] }
    | undefined
  if (featureMedia) {
    row2Right = { kind: 'media', media: featureMedia }
  } else if (quotes.length > quoteCursor) {
    row2Right = { kind: 'quotes', quotes: quotes.slice(quoteCursor) }
    quoteCursor = quotes.length
  }
  const leftoverQuotes = quotes.slice(quoteCursor)

  return (
    <section
      id={`trend-${trendNumber}`}
      className="relative px-5 md:px-[60px] py-20 md:py-28"
      style={{ background: '#f2eeed' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {/* ROW 1 — body / data */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 mb-16 md:mb-24">
          <div className="md:w-[50%]">
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
            <motion.h3
              className="text-[24px] md:text-[36px] leading-[1.15] mb-6"
              style={{ color: '#000', fontWeight: 700 }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {title}
            </motion.h3>
            <div style={{ width: 36, height: 2, background: accentColor, marginBottom: 24 }} />
            {body.map((para, i) => (
              <motion.p
                key={i}
                className="text-[16px] leading-[1.6] mb-6"
                style={{
                  color: '#000',
                  fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                  fontWeight: 400,
                }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          {row1Right && (
            <div className="md:w-[50%] md:pt-[38px]">
              {row1Right.kind === 'data' ? (
                <DataModuleBlock module={row1Right.module} accentColor={accentColor} />
              ) : (
                <div className="flex flex-col gap-10">
                  {row1Right.quotes.map((quote, i) => (
                    <QuoteBlock key={i} quote={quote} accentColor={accentColor} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ROW 2 — inside the hubs / video */}
        {(insideTheHubs || row2Right) && (
          <div className="flex flex-col md:flex-row gap-12 md:gap-16">
            {insideTheHubs && (
              <div className="md:w-[50%]">
                <InsideTheHubsBlock content={insideTheHubs} accentColor={accentColor} />
              </div>
            )}
            {row2Right && (
              <div className="md:w-[50%]">
                {row2Right.kind === 'media' ? (
                  <>
                    <FeatureMediaBlock media={row2Right.media} accentColor={accentColor} />
                    {/* When the feature media slot consumed the right column
                        but quotes are still left over, stack them directly
                        under the media so the column reads as one composed
                        unit (rather than throwing a pulled quote into row 3). */}
                    {leftoverQuotes.length > 0 && (
                      <div className="mt-10 flex flex-col gap-10">
                        {leftoverQuotes.map((quote, i) => (
                          <QuoteBlock key={i} quote={quote} accentColor={accentColor} />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col gap-10">
                    {row2Right.quotes.map((quote, i) => (
                      <QuoteBlock key={i} quote={quote} accentColor={accentColor} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ROW 3 — fallback pulled quotes for trends WITHOUT a feature
            media. (Trends with media route leftovers below the media in
            row 2 instead — see above.) */}
        {leftoverQuotes.length > 0 && row2Right?.kind !== 'media' && (
          <div className="mt-16 md:mt-24 mx-auto" style={{ maxWidth: 900 }}>
            <div className="flex flex-col gap-10">
              {leftoverQuotes.map((quote, i) => (
                <QuoteBlock key={i} quote={quote} accentColor={accentColor} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function DataModuleBlock({ module, accentColor }: { module: LovieDataModule; accentColor: string }) {
  const chartType = module.chartType ?? 'bar'
  // Donut charts sit on the beige section directly (no lime tile) — the
  // colored wedges are already strong enough that an additional color
  // block underneath fights for attention.
  const useLimeTile = chartType !== 'donut'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={useLimeTile ? {
        background: '#eeffbb',
        borderRadius: 14,
        padding: '28px 28px',
      } : undefined}
    >
      {module.eyebrow && (
        <p className="uppercase font-medium mb-3" style={{ fontSize: 11, letterSpacing: 4, color: accentColor }}>
          {module.eyebrow}
        </p>
      )}
      <h4 className="leading-[1.35] mb-8 w-full" style={{ fontSize: 18, color: '#000', fontWeight: 700 }}>
        {module.question}
      </h4>

      {chartType === 'lollipop' ? (
        <div className="flex flex-col gap-5 w-full">
          {module.bars.map((bar, i) => (
            <LollipopRow key={i} bar={bar} accentColor={accentColor} delay={0.1 + i * 0.08} />
          ))}
        </div>
      ) : chartType === 'verticalBar' ? (
        <VerticalBarChart bars={module.bars} accentColor={accentColor} />
      ) : chartType === 'donut' ? (
        <DonutChart bars={module.bars} />
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {module.bars.map((bar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            >
              <div className="flex justify-between items-baseline mb-2 gap-3">
                <span className="text-[13px] md:text-[14px]" style={{ color: '#000' }}>{bar.label}</span>
                <span className="text-[18px] md:text-[22px] flex-shrink-0" style={{ color: '#000', fontWeight: 700 }}>{bar.displayValue}</span>
              </div>
              <div className="h-[8px] rounded-full" style={{ background: 'rgba(0,0,0,0.1)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: bar.color || accentColor }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${bar.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {module.footnote && (
        <p className="mt-5" style={{ fontSize: 11, color: '#000', opacity: 0.6 }}>
          {module.footnote}
        </p>
      )}
    </motion.div>
  )
}

// Vertical bar chart — Anthem-style column chart for many parallel
// categories. Bars animate from 0 → value height on scroll-in. Each bar
// hovers to highlight; percentages sit above, short labels below.
function VerticalBarChart({ bars, accentColor }: { bars: LovieDataBar[]; accentColor: string }) {
  const max = Math.max(...bars.map((b) => b.value), 1)
  const CHART_HEIGHT = 240
  return (
    <div
      className="flex items-end w-full"
      style={{ height: CHART_HEIGHT + 90, gap: 12, paddingTop: 28 }}
    >
      {bars.map((bar, i) => (
        <VerticalBarColumn
          key={i}
          bar={bar}
          accentColor={accentColor}
          maxValue={max}
          chartHeight={CHART_HEIGHT}
          delay={0.08 + i * 0.06}
        />
      ))}
    </div>
  )
}

function VerticalBarColumn({
  bar,
  accentColor,
  maxValue,
  chartHeight,
  delay,
}: {
  bar: LovieDataBar
  accentColor: string
  maxValue: number
  chartHeight: number
  delay: number
}) {
  const [hover, setHover] = useState(false)
  const targetHeight = (bar.value / maxValue) * chartHeight
  return (
    <div
      className="flex flex-col items-center justify-end"
      style={{ flex: 1, minWidth: 0, cursor: 'default' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Percentage label above bar */}
      <span
        className="mb-1"
        style={{ fontSize: 13, fontWeight: 700, color: '#000' }}
      >
        {bar.displayValue}
      </span>
      {/* The bar itself */}
      <motion.div
        style={{
          width: '100%',
          background: bar.color || accentColor,
          borderRadius: '4px 4px 0 0',
          opacity: hover ? 1 : 0.92,
          transition: 'opacity 0.2s ease',
        }}
        initial={{ height: 0 }}
        whileInView={{ height: targetHeight }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      />
      {/* Short label below — block-level + hyphenation so single long
          words ("Internationalism", "Collaborations") can break instead
          of spilling across into the next column. */}
      <span
        className="mt-2 text-center"
        style={{
          fontSize: 9,
          lineHeight: 1.2,
          color: '#000',
          minHeight: 28,
          display: 'block',
          width: '100%',
          overflowWrap: 'break-word',
          wordBreak: 'normal',
          hyphens: 'auto',
        }}
      >
        {bar.shortLabel || bar.label}
      </span>
    </div>
  )
}

// Donut chart — interactive single-choice viz. Each wedge is a bar in the
// data, sized by its share. Hover any wedge or legend row → wedge expands
// outward, others fade, center reveals the label and percentage.
function DonutChart({ bars }: { bars: LovieDataBar[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const total = bars.reduce((sum, b) => sum + b.value, 0) || 1
  let cursor = -90 // start at top
  const arcs = bars.map((bar) => {
    const angleSpan = (bar.value / total) * 360
    const slice = { ...bar, start: cursor, end: cursor + angleSpan }
    cursor += angleSpan
    return slice
  })
  const SIZE = 300
  const center = SIZE / 2
  const radius = 115
  const innerRadius = 72
  const focused = activeIdx !== null ? arcs[activeIdx] : null
  return (
    <div className="flex items-center justify-center md:justify-start gap-8 flex-wrap" style={{ rowGap: 24 }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ flexShrink: 0 }}>
        {arcs.map((arc, i) => {
          if (arc.value === 0) return null
          const isActive = activeIdx === i
          const expand = isActive ? 8 : 0
          const r = radius + expand
          const startRad = (arc.start * Math.PI) / 180
          const endRad = (arc.end * Math.PI) / 180
          const x1 = center + r * Math.cos(startRad)
          const y1 = center + r * Math.sin(startRad)
          const x2 = center + r * Math.cos(endRad)
          const y2 = center + r * Math.sin(endRad)
          const ix1 = center + innerRadius * Math.cos(startRad)
          const iy1 = center + innerRadius * Math.sin(startRad)
          const ix2 = center + innerRadius * Math.cos(endRad)
          const iy2 = center + innerRadius * Math.sin(endRad)
          const largeArc = arc.end - arc.start > 180 ? 1 : 0
          const d = [
            `M ${x1} ${y1}`,
            `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L ${ix2} ${iy2}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
            'Z',
          ].join(' ')
          return (
            <motion.path
              key={i}
              d={d}
              fill={arc.color || '#ff6000'}
              style={{
                cursor: 'pointer',
                opacity: activeIdx === null || isActive ? 1 : 0.35,
                transition: 'opacity 0.18s ease, d 0.18s ease',
              }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: activeIdx === null || isActive ? 1 : 0.35 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            />
          )
        })}
        {/* Center label */}
        <text
          x={center}
          y={center - 6}
          textAnchor="middle"
          fontSize={focused ? 34 : 13}
          fontWeight={700}
          fill="#000"
          style={{ pointerEvents: 'none', transition: 'font-size 0.18s ease' }}
        >
          {focused ? `${focused.displayValue}` : 'Hover to'}
        </text>
        <text
          x={center}
          y={center + 20}
          textAnchor="middle"
          fontSize={12}
          fill="#000"
          opacity={focused ? 0.7 : 0.5}
          style={{ pointerEvents: 'none' }}
        >
          {focused ? (focused.shortLabel || focused.label) : 'explore'}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-col" style={{ gap: 10, flex: 1, minWidth: 220 }}>
        {bars.map((bar, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              cursor: 'pointer',
              opacity: activeIdx === null || activeIdx === i ? 1 : 0.45,
              transition: 'opacity 0.18s ease',
            }}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <span style={{ width: 12, height: 12, background: bar.color || '#ff6000', borderRadius: 3, marginTop: 4, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#000', flex: 1, lineHeight: 1.35 }}>{bar.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#000', minWidth: 56, textAlign: 'right' }}>{bar.displayValue}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Lollipop row — thin orange stem ending in a dot at the data value, with
// the score on the right. Dot scales up on hover with a soft orange halo.
function LollipopRow({ bar, accentColor, delay }: { bar: LovieDataBar; accentColor: string; delay: number }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: 'default' }}
    >
      <span className="text-[12px] md:text-[13px]" style={{ color: '#000', flex: '0 0 40%', lineHeight: 1.3 }}>
        {bar.label}
      </span>
      <div style={{ position: 'relative', flex: 1, height: 24, display: 'flex', alignItems: 'center' }}>
        {/* Track */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 2, background: 'rgba(0,0,0,0.12)', transform: 'translateY(-50%)' }} />
        {/* Filled stem */}
        <motion.div
          style={{ position: 'absolute', left: 0, top: '50%', height: 2, background: bar.color || accentColor, transform: 'translateY(-50%)' }}
          initial={{ width: 0 }}
          whileInView={{ width: `${bar.value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.1, ease: 'easeOut' }}
        />
        {/* Dot */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            width: hover ? 22 : 14,
            height: hover ? 22 : 14,
            background: bar.color || accentColor,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: hover ? '0 0 0 5px rgba(255,96,0,0.18)' : 'none',
            transition: 'width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease',
          }}
          initial={{ left: '0%' }}
          whileInView={{ left: `${bar.value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.1, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[16px] md:text-[18px]" style={{ color: '#000', fontWeight: 700, minWidth: 36, textAlign: 'right' }}>
        {bar.displayValue}
      </span>
    </motion.div>
  )
}

function InsideTheHubsBlock({ content, accentColor }: { content: LovieInsideTheHubsContent; accentColor: string }) {
  const rows = [
    { label: 'Spain', copy: content.spainCopy, Icon: CountrySpain },
    { label: 'Italy', copy: content.italyCopy, Icon: CountryItaly },
    { label: 'Portugal', copy: content.portugalCopy, Icon: CountryPortugal },
  ].filter((r) => !!r.copy)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {content.eyebrow && (
        <p className="uppercase font-medium mb-3" style={{ fontSize: 11, letterSpacing: 4, color: accentColor }}>
          {content.eyebrow}
        </p>
      )}
      {content.heading && (
        <h4 className="text-[20px] md:text-[26px] leading-[1.25] mb-8" style={{ color: '#000', fontWeight: 700 }}>
          {content.heading}
        </h4>
      )}
      <div className="flex flex-col gap-6">
        {rows.map((row, i) => {
          const Icon = row.Icon
          return (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="flex items-start gap-3"
            >
              {/* Icon column (fixed-width, doesn't shrink). Label + body
                  share the second column so the body copy aligns under the
                  label rather than the icon. No clipping because the icon
                  stays inside the section content area. */}
              <Icon
                aria-hidden="true"
                style={{
                  height: '2.3em',
                  width: 'auto',
                  flexShrink: 0,
                  // Tiny offset so the heart visually centers with the
                  // first line of the country label (the SVG's tab adds
                  // bottom weight that pulls the visual center down).
                  marginTop: '-0.25em',
                }}
              />
              <div className="flex-1 min-w-0">
                <h5
                  className="text-[14px] md:text-[15px] uppercase mb-2"
                  style={{ color: accentColor, letterSpacing: 2, fontWeight: 700 }}
                >
                  {row.label}
                </h5>
                {/* Match body-paragraph typography exactly so the trend
                    copy and hubs copy read as one continuous voice. */}
                <div
                  className="text-[16px] leading-[1.6]"
                  style={{
                    color: '#000',
                    fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  {Array.isArray(row.copy)
                    ? <PortableText value={row.copy as PortableTextBlock[]} />
                    : row.copy}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function FeatureMediaBlock({ media, accentColor }: { media: LovieFeatureMedia; accentColor: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const isInView = useInView(containerRef, { amount: 0.3 })
  const isVideoFile = /\.(mp4|webm|ogg)(\?|$)/i.test(media.url)
  const buttonLabel = media.buttonLabel ?? 'Watch Video'
  // Lovie play-button color — lime brand green with black text. Dark border
  // keeps the button readable against the cream section background.
  const buttonBg = '#eeffbb'
  const buttonFg = '#000000'

  // Auto-pause when scrolled out of frame, same behavior as Anthem.
  useEffect(() => {
    if (!isInView && isPlaying && videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [isInView, isPlaying])

  function togglePlay() {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {media.label && (
        <p className="uppercase font-medium mb-3" style={{ fontSize: 11, letterSpacing: 4, color: accentColor }}>
          {media.label}
        </p>
      )}

      {isVideoFile ? (
        <>
          <div
            className="rounded-lg overflow-hidden relative cursor-pointer"
            style={{ background: '#000', paddingBottom: '56.25%' }}
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              src={media.url}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              onEnded={() => setIsPlaying(false)}
            />
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
              style={{ opacity: isPlaying ? 0 : 1 }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: buttonBg, border: '2px solid #000' }}
              >
                <svg width="16" height="18" viewBox="0 0 12 14" fill="none">
                  <path d="M0 0L12 7L0 14V0Z" fill="#000" />
                </svg>
              </div>
            </div>
          </div>

          {/* Metadata row + Watch/Pause button */}
          <div className="py-3 flex items-center justify-between gap-3">
            <div>
              {media.name && (
                <p className="text-[14px] font-semibold" style={{ color: '#000' }}>{media.name}</p>
              )}
              {media.title && (
                <p className="text-[13px]" style={{ color: '#000', opacity: 0.6 }}>{media.title}</p>
              )}
            </div>
            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[2px] py-2.5 px-5 rounded-full cursor-pointer flex-shrink-0 transition-transform hover:scale-105"
              style={{ background: buttonBg, color: buttonFg, border: '1px solid #000' }}
            >
              <svg width="12" height="10" viewBox="0 0 14 12" fill="none">
                <path d={isPlaying ? 'M0 0H4V12H0V0ZM10 0H14V12H10V0Z' : 'M0 12L7 0L14 12H0Z'} fill={buttonFg} />
              </svg>
              {isPlaying ? 'Pause' : buttonLabel}
            </button>
          </div>
        </>
      ) : (
        // External URL — embed as iframe (no play/pause; the host site
        // controls playback).
        <div className="aspect-video w-full overflow-hidden rounded-lg" style={{ background: '#000' }}>
          <iframe
            src={media.url}
            title={media.label || 'Feature'}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      )}

      {media.description && (
        <p className="text-[13px] md:text-[14px] mt-3" style={{ color: '#000', opacity: 0.7 }}>
          {media.description}
        </p>
      )}
    </motion.div>
  )
}

function QuoteBlock({ quote, accentColor }: { quote: LovieQuote; accentColor: string }) {
  // The source text often already includes its own quote marks (CMS PortableText
  // preserves curly quotes from the editor). Render the text as-is rather than
  // wrapping it in straight double-quotes ourselves — avoids double-quoting.
  const nameNode = quote.linkedInUrl ? (
    <a
      href={quote.linkedInUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'inherit', textDecoration: 'underline' }}
    >
      <strong style={{ fontWeight: 700 }}>{quote.attribution}</strong>
    </a>
  ) : (
    <strong style={{ fontWeight: 700 }}>{quote.attribution}</strong>
  )
  const borderColor = quote.borderColor ?? accentColor
  return (
    <motion.figure
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="md:pt-[38px] flex gap-4 md:gap-5 items-start"
      style={{ margin: 0 }}
    >
      {quote.headshotUrl && (
        <img
          src={quote.headshotUrl}
          alt={quote.attribution}
          className="flex-shrink-0"
          style={{
            width: 92,
            height: 92,
            borderRadius: '50%',
            objectFit: 'cover',
            border: `3px solid ${borderColor}`,
          }}
        />
      )}
      <div className="flex-1 min-w-0">
        <blockquote
          className="text-[16px] md:text-[19px] leading-[1.4] mb-4 pl-5"
          style={{ color: '#000', borderLeft: `3px solid ${borderColor}`, fontWeight: 500, margin: 0 }}
        >
          {quote.text}
        </blockquote>
        <figcaption className="text-[13px] md:text-[14px] pl-5" style={{ color: '#000' }}>
          — {nameNode}
          {quote.role && <span style={{ opacity: 0.7 }}>{`, ${quote.role}`}</span>}
        </figcaption>
      </div>
    </motion.figure>
  )
}
