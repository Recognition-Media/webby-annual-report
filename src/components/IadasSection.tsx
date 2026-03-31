'use client'

import { useRef, useEffect, useState } from 'react'
import { AnimatedBg } from './AnimatedBg'
import { motion, useInView, animate } from 'framer-motion'
import type { Report, HeroStat } from '@/sanity/types'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const FALLBACK_DESCRIPTION =
  'An invitation-only body of 3,300+ innovators and visionaries across 77 countries, with the mission to drive the creative, technical, and professional growth of the Internet and evolving forms of digital media.'

const FALLBACK_STATS: (HeroStat & { color: string; description?: string })[] = [
  { label: 'IADAS Members', value: '3,300+', color: '#8B70D1' },
  { label: 'Countries', value: '77', color: '#82D8EB' },
  { label: 'Year Founded', value: '1998', color: '#FFB763' },
]

const STAT_COLORS = ['#8B70D1', '#82D8EB', '#FFB763']

function AnimatedNumber({ value, color, inView }: { value: string; color: string; inView: boolean }) {
  const [display, setDisplay] = useState('0')
  const match = value.match(/^([^0-9]*)([0-9,]+(?:\.\d+)?)(.*)$/)
  const num = match ? parseFloat(match[2].replace(/,/g, '')) : 0
  const prefix = match ? match[1] : ''
  const suffix = match ? match[3] : ''
  const hasComma = match ? match[2].includes(',') : false

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, num, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate(v) {
        const rounded = Math.round(v)
        setDisplay(hasComma ? rounded.toLocaleString('en-US') : rounded.toString())
      },
    })
    return () => controls.stop()
  }, [inView, num, hasComma])

  return (
    <span
      style={{
        fontSize: 'clamp(36px, 8vw, 88px)',
        fontWeight: 400,
        fontVariantNumeric: 'tabular-nums',
        color,
        lineHeight: 1,
      }}
    >
      {prefix}{display}{suffix}
    </span>
  )
}

export function IadasSection({ report }: { report: Report }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const heading = report.howWeJudgeHeading || 'All work is reviewed by the International Academy of Digital Arts & Sciences.'
  const description = report.iadasDescription || FALLBACK_DESCRIPTION
  const rawStats = report.iadasStats && report.iadasStats.length > 0 ? report.iadasStats : FALLBACK_STATS
  const stats = rawStats.map((s, i) => ({
    ...s,
    color: STAT_COLORS[i] || STAT_COLORS[0],
  }))

  return (
    <section
      id="how-judged"
      data-snap
      ref={ref}
      className="px-5 md:px-[60px] md:pt-[calc(13vh+47px)]"
      style={{
        background: '#191919',
        minHeight: '100vh',
        paddingBottom: 50,
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      <div data-content style={{ maxWidth: 1000, width: '100%', margin: '0 auto', position: 'relative' }}>
        {/* Section label */}
        <p
          style={{
            fontSize: 11,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#8B70D1',
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          How the Webby Awards Are Judged
        </p>

        {/* Heading */}
        <h2
          style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 400,
            color: '#FFFFFF',
            lineHeight: 1.2,
            letterSpacing: '-0.5px',
            maxWidth: 850,
            marginBottom: 24,
          }}
        >
          {heading}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: '#D4D4D4',
            fontWeight: 400,
            maxWidth: 750,
            marginBottom: 40,
          }}
        >
          {description}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-row" style={{ marginBottom: 32 }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: 'easeOut' }}
              className="py-4 md:pr-10 md:mr-10 md:border-r md:border-white/[0.14] last:md:border-r-0 last:md:pr-0 last:md:mr-0"
            >
              <div style={{ marginBottom: 8 }}>
                <AnimatedNumber value={stat.value} color={stat.color} inView={isInView} />
              </div>
              <p
                style={{
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  color: '#999',
                  fontWeight: 500,
                  marginBottom: 4,
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Credential cards */}
        <div className="flex flex-col gap-4 md:flex-row md:gap-6" style={{ marginTop: 26 }}>
          {/* IADAS card */}
          <a
            href={report.iadasCardUrl || 'https://www.iadas.net'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '28px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/iadas-logo.png`}
              alt="IADAS"
              style={{ width: 48, height: 'auto', opacity: 0.9, flexShrink: 0 }}
            />
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 500, color: '#FFFFFF', margin: 0 }}>
                {report.iadasCardTitle || 'International Academy of Digital Arts & Sciences'}
              </h4>
              <p style={{ fontSize: 12, color: '#999', lineHeight: 1.6, margin: '4px 0 0' }}>
                {report.iadasCardDescription || 'The judging body responsible for selecting all Webby Award Winners and Nominees.'}
              </p>
            </div>
          </a>

          {/* Auditor card */}
          <a
            href={report.auditorCardUrl || 'https://www.kpmg.com'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '28px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/kpmg-logo.svg`}
              alt="Auditor"
              style={{ width: 72, height: 'auto', opacity: 0.9, flexShrink: 0 }}
            />
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 500, color: '#FFFFFF', margin: 0 }}>
                {report.auditorCardTitle || 'Official Tabulation Consultant'}
              </h4>
              <p style={{ fontSize: 12, color: '#999', lineHeight: 1.6, margin: '4px 0 0' }}>
                {report.auditorCardDescription || 'KPMG ensures the accuracy and integrity of the Webby Awards voting process.'}
              </p>
            </div>
          </a>
        </div>

        {/* Bottom gradient bar */}
      </div>
    </section>
  )
}
