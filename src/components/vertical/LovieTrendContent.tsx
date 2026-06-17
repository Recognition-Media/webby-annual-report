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
}

export interface LovieDataModule {
  eyebrow?: string
  question: string
  bars: LovieDataBar[]
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
  const row1Right = dataModule ?? (quotes[0] && { quote: quotes[0] })
  const row2Right = featureMedia ?? (quotes[1] && { quote: quotes[1] })

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
                className="text-[15px] md:text-[18px] leading-[1.6] md:leading-[30px] mb-6"
                style={{ color: '#000' }}
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
              {'bars' in row1Right ? (
                <DataModuleBlock module={row1Right} accentColor={accentColor} />
              ) : (
                <QuoteBlock quote={row1Right.quote} accentColor={accentColor} />
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
                {'url' in row2Right ? (
                  <FeatureMediaBlock media={row2Right} accentColor={accentColor} />
                ) : (
                  <QuoteBlock quote={row2Right.quote} accentColor={accentColor} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function DataModuleBlock({ module, accentColor }: { module: LovieDataModule; accentColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {module.eyebrow && (
        <p className="uppercase font-medium mb-3" style={{ fontSize: 11, letterSpacing: 4, color: accentColor }}>
          {module.eyebrow}
        </p>
      )}
      <h4 className="leading-[1.35] mb-8 w-full" style={{ fontSize: 18, color: '#000', fontWeight: 700 }}>
        {module.question}
      </h4>
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
                <div className="text-[14px] md:text-[15px] leading-[1.55]" style={{ color: '#000' }}>
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
  return (
    <motion.figure
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="md:pt-[38px]"
    >
      <blockquote
        className="text-[18px] md:text-[22px] leading-[1.35] mb-5 pl-5"
        style={{ color: '#000', borderLeft: `3px solid ${accentColor}`, fontWeight: 500 }}
      >
        {`"${quote.text}"`}
      </blockquote>
      <figcaption className="text-[13px] md:text-[14px] pl-5" style={{ color: '#000' }}>
        — <strong style={{ fontWeight: 700 }}>{quote.attribution}</strong>
        {quote.role && <span style={{ opacity: 0.7 }}>{`, ${quote.role}`}</span>}
      </figcaption>
    </motion.figure>
  )
}
