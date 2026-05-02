'use client'

import { useRef } from 'react'
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
      <div className="relative w-[480px] md:w-[640px]" style={{ aspectRatio: '240/160' }}>
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
            className="text-[80px] md:text-[112px] leading-none"
            style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 700 }}
          >
            {sentimentGauge.score}
          </div>
          <p className="text-[14px] md:text-[16px] mt-11" style={{ color: '#21261A', opacity: 0.5 }}>
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
  copy: string
  accentColor?: string
}

export function ReportSectionCover({
  sectionNumber,
  title,
  subtitle,
  copy,
  accentColor = '#8C001C',
}: ReportSectionCoverProps) {
  return (
    <section
      id={`section-${sectionNumber}`}
      className="relative px-5 md:px-[60px] md:min-h-screen md:flex md:flex-col md:items-center md:justify-center"
      style={{ background: '#E3DDCA', paddingTop: 50, paddingBottom: 50 }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {/* Center-aligned: number, title, rule, subtitle */}
        <div className="text-center">
          {/* Section number */}
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

          {/* Title */}
          <motion.h2
            className="text-[32px] md:text-[56px] lg:text-[64px] leading-[1.05] mb-6"
            style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 400 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {title}
          </motion.h2>

          {/* Divider — centered */}
          <motion.div
            style={{ width: 48, height: 2, background: accentColor, marginBottom: 28, marginLeft: 'auto', marginRight: 'auto' }}
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />

          {/* Subtitle */}
          <motion.p
            className="text-[18px] md:text-[22px] leading-[1.4] mb-8 max-w-[800px] mx-auto"
            style={{
              fontFamily: 'var(--font-display)',
              color: '#21261A',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Left-aligned: body copy, centered on page axis */}
        <div className="max-w-[588px] mx-auto">
          <motion.p
            className="text-[16px] md:text-[18px] leading-[30px] text-center"
            style={{
              fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
              color: '#21261A',
              opacity: 0.65,
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {copy}
          </motion.p>
        </div>
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
  title: string
  body: React.ReactNode[]
  accentColor?: string
  stats?: { label: string; value: string; change?: string }[]
  dataModule?: DataModule
  sentimentGauge?: SentimentGauge
  customRightColumn?: React.ReactNode
  quotes?: TrendQuote[]
  quotesEyebrow?: string
  video?: TrendVideo
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
}: TrendContentProps) {
  const defaultBorderColors = ['#8C001C', '#D17DD0', '#066DBA', '#00B469']
  return (
    <section
      className="relative px-5 md:px-[60px] py-20 md:py-28"
      style={{ background: '#E3DDCA' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          {/* Left column: copy stack */}
          <div className="md:w-[50%]">
            {/* Trend eyebrow */}
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

            {/* Trend title */}
            <motion.h3
              className="text-[24px] md:text-[36px] leading-[1.15] mb-6"
              style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 400 }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {title}
            </motion.h3>

            {/* Accent divider */}
            <div style={{ width: 36, height: 2, background: accentColor, marginBottom: 24 }} />

            {/* Body paragraphs */}
            {body.map((paragraph, i) => (
              <motion.p
                key={i}
                className="text-[16px] md:text-[18px] leading-[30px] mb-6"
                style={{
                  fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
                  color: '#21261A',
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
                    style={{ borderColor: 'rgba(33,38,26,0.15)' }}
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
                      style={{ color: '#21261A', opacity: 0.6 }}
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
                  style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 400 }}
                >
                  {dataModule.question}
                </h4>

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
                        <span className="text-[13px] md:text-[14px]" style={{ color: '#21261A' }}>{bar.label}</span>
                        <span className="text-[18px] md:text-[22px]" style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 700 }}>{bar.displayValue}</span>
                      </div>
                      <div className="h-[8px] rounded-full" style={{ background: 'rgba(33,38,26,0.1)' }}>
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
