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
    <span ref={ref} className="text-[40px] md:text-[clamp(56px,8vw,88px)]" style={{ color, fontWeight: 400, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
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
      id="trend-intro"
      data-slide-type="trend-intro"
      className="px-5 md:px-[60px] py-12 md:py-0"
      style={{
        width: '100vw',
        minHeight: '100vh',
        paddingBottom: 50,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: '#191919',
      }}
    >
      <AnimatedBg variant={0} />

      <div className="md:mt-[-60px]" style={{ maxWidth: 1000, width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Eyebrow */}
        {eyebrow && (
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
            <span style={{
              fontSize: 11,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#82D8EB',
              fontWeight: 500,
            }}>
              {eyebrow}
            </span>
          </div>
        )}

        {/* Headline */}
        {headline && (
          <h2 className="text-[28px] leading-[36px] md:text-[48px] md:leading-[58px] mb-6 md:mb-8" style={{
            fontWeight: 400,
            color: '#fff',
            letterSpacing: '-2px',
            maxWidth: 750,
          }}>
            {headline}
          </h2>
        )}

        {/* Body */}
        {body && (
          <div
            data-content
            className="text-sm md:text-base mb-6 md:mb-8"
            style={{
              lineHeight: '26px',
              color: '#D4D4D4',
              maxWidth: 700,
            }}
          >
            <div className="report-links [&_p]:mb-4">
              <PortableText value={body} />
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8 md:mb-12">
            {stats.map((stat, i) => {
              const color = INTRO_COLORS[i % INTRO_COLORS.length]
              return (
              <div key={i} className="flex-1 md:max-w-[280px]">
                <div className="mb-2 md:mb-3">
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
                  }}
                  className="mb-2 md:mb-3"
                />
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                  className="text-xs md:text-sm"
                  style={{ color: '#aaa', lineHeight: 1.5 }}
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
