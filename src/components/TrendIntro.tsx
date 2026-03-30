'use client'

import { useEffect, useRef } from 'react'
import { PortableText } from '@portabletext/react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import type { PortableTextBlock } from '@portabletext/types'
import type { DataStat } from '@/sanity/types'
import { AnimatedBg } from './AnimatedBg'
const INTRO_COLORS = ['#82D8EB', '#8B70D1', '#FF7F63'] // blue, purple, coral/red

function AnimatedNumber({ value, color }: { value: number; color: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const display = useTransform(count, (v) => Math.round(v).toString())

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 1.5, ease: 'easeOut' })
    }
  }, [isInView, value, count])

  return (
    <span ref={ref} style={{ color, fontSize: 'clamp(56px, 8vw, 88px)', fontWeight: 400, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
      <motion.span>{display}</motion.span>%
    </span>
  )
}

export function TrendIntro({
  eyebrow,
  headline,
  body,
  stats,
  ctaText,
  onCta,
}: {
  eyebrow?: string
  headline?: string
  body?: PortableTextBlock[]
  stats?: DataStat[]
  ctaText?: string
  onCta: () => void
}) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '0 60px',
      }}
    >
      <AnimatedBg variant={0} />

      <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Eyebrow */}
        {eyebrow && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
            <span style={{
              fontSize: 11,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#82D8EB',
              fontWeight: 500,
            }}>
              {eyebrow}
            </span>
            <div style={{ width: 60, height: 2, background: '#82D8EB', borderRadius: 2 }} />
          </div>
        )}

        {/* Headline */}
        {headline && (
          <h2 style={{
            fontSize: 48,
            fontWeight: 400,
            color: '#fff',
            lineHeight: '58px',
            letterSpacing: '-2px',
            marginBottom: 32,
            maxWidth: 750,
          }}>
            {headline}
          </h2>
        )}

        {/* Body */}
        {body && (
          <div
            data-content
            style={{
              fontSize: 16,
              lineHeight: '28px',
              color: '#D4D4D4',
              maxWidth: 700,
              marginBottom: 32,
            }}
          >
            <div className="report-links [&_p]:mb-4">
              <PortableText value={body} />
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 48 }}>
            {stats.map((stat, i) => {
              const color = INTRO_COLORS[i % INTRO_COLORS.length]
              return (
              <div key={i} style={{ flex: '1 1 180px', maxWidth: 280 }}>
                <div style={{ marginBottom: 12 }}>
                  <AnimatedNumber value={stat.value} color={color} />
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.2 + i * 0.15 }}
                  style={{
                    height: 2,
                    background: `${color}40`,
                    borderRadius: 2,
                    marginBottom: 12,
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                  style={{ fontSize: 14, color: '#aaa', lineHeight: 1.5 }}
                >
                  {stat.label}
                </motion.div>
              </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
