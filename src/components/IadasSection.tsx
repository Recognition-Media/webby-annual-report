'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import type { Report, HeroStat } from '@/sanity/types'

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
        fontSize: 'clamp(48px, 6vw, 72px)',
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
      ref={ref}
      style={{
        background: '#191919',
        padding: '60px 60px 30px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background watermark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/iadas-shape.png"
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          right: '-5%',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.04,
          width: 500,
          height: 500,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>
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
            fontWeight: 500,
            color: '#FFFFFF',
            lineHeight: 1.2,
            letterSpacing: '-0.5px',
            marginBottom: 24,
            maxWidth: 850,
          }}
        >
          All work is reviewed by the International Academy of Digital Arts &amp; Sciences.
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: '#BABABA',
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
                borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
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
                  color: '#555',
                  fontWeight: 500,
                  marginBottom: 4,
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* KPMG Banner */}
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '24px 32px',
            display: 'flex',
            gap: 16,
            maxWidth: 700,
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#559DDF" />
              <path
                d="M7 14l5 5 9-9"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 500, color: '#FFFFFF', margin: 0 }}>
              Official Tabulation Consultant: KPMG
            </h4>
            <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6, margin: '4px 0 0' }}>
              KPMG serves as the official Webby Awards vote tabulation consultant, ensuring the
              accuracy and quality of the voting process.
            </p>
          </div>
        </div>

        {/* Bottom gradient bar */}
        <div className="gradient-bar" style={{ maxWidth: 200, marginTop: 60 }} />
      </div>
    </section>
  )
}
