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
        fontSize: 'clamp(56px, 8vw, 88px)',
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
      style={{
        background: '#191919',
        minHeight: '100vh',
        padding: '0 60px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >

      <div data-content style={{ maxWidth: 1000, width: '100%', position: 'relative' }}>
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
          All work is reviewed by the International Academy of Digital Arts &amp; Sciences.
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
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 32 }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: 'easeOut' }}
              style={{
                padding: '20px 0',
                paddingRight: i < stats.length - 1 ? 40 : 0,
                marginRight: i < stats.length - 1 ? 40 : 0,
                borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.14)' : 'none',
              }}
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
        <div style={{ display: 'flex', gap: 24, marginTop: 26 }}>
          {/* IADAS card */}
          <a
            href="https://www.iadas.net"
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
                International Academy of Digital Arts &amp; Sciences
              </h4>
              <p style={{ fontSize: 12, color: '#999', lineHeight: 1.6, margin: '4px 0 0' }}>
                The judging body responsible for selecting all Webby Award Winners and Nominees.
              </p>
            </div>
          </a>

          {/* KPMG card */}
          <a
            href="https://www.kpmg.com"
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
              alt="KPMG"
              style={{ width: 72, height: 'auto', opacity: 0.9, flexShrink: 0 }}
            />
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 500, color: '#FFFFFF', margin: 0 }}>
                Official Tabulation Consultant
              </h4>
              <p style={{ fontSize: 12, color: '#999', lineHeight: 1.6, margin: '4px 0 0' }}>
                KPMG ensures the accuracy and integrity of the Webby Awards voting process.
              </p>
            </div>
          </a>
        </div>

        {/* Bottom gradient bar */}
      </div>
    </section>
  )
}
