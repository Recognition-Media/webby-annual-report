'use client'

import { useRef } from 'react'
import { AnimatedBg } from './AnimatedBg'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type MotionValue,
} from 'framer-motion'
import type { HeroStat } from '@/sanity/types'

/* ------------------------------------------------------------------ */
/*  Defaults                                                          */
/* ------------------------------------------------------------------ */

const FALLBACK_STATS: (HeroStat & {
  suffix?: string
  color: string
  description: string
})[] = [
  {
    label: 'Entries Received',
    value: '13000',
    suffix: '+',
    color: '#80D064',
    description: 'Across every category',
  },
  {
    label: 'Countries',
    value: '71',
    color: '#82D8EB',
    description: 'Represented worldwide',
  },
  {
    label: 'US States',
    value: '50',
    color: '#8B70D1',
    description: 'Coast to coast',
  },
  {
    label: 'Became Nominees',
    value: '12',
    suffix: '%',
    color: '#FFB763',
    description: 'The best of the best',
  },
]

/* ------------------------------------------------------------------ */
/*  Animated counter                                                  */
/* ------------------------------------------------------------------ */

function CountUpNumber({
  value,
  suffix,
  color,
  progress,
}: {
  value: string
  suffix?: string
  color: string
  progress: MotionValue<number>
}) {
  const num = parseFloat(value.replace(/,/g, ''))
  const count = useTransform(progress, [0.15, 0.5], [0, num])
  const display = useTransform(count, (v) =>
    num >= 1000
      ? Math.round(v).toLocaleString('en-US')
      : Math.round(v).toString()
  )

  return (
    <span
      style={{
        fontSize: 'clamp(56px, 8vw, 88px)',
        fontWeight: 400,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
        color,
      }}
    >
      <motion.span>{display}</motion.span>
      {suffix ?? ''}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Timeline strip                                                    */
/* ------------------------------------------------------------------ */

function TimelineStrip({
  progress,
}: {
  progress: MotionValue<number>
}) {
  const fillWidth = useTransform(progress, [0.05, 0.45], ['0%', '100%'])
  const tooltipLeft = useTransform(progress, [0.05, 0.45], ['0%', '100%'])
  const yearRaw = useTransform(progress, [0.05, 0.45], [1996, 2026])
  const yearLabel = useTransform(yearRaw, (v) => Math.round(v).toString())
  const labelOpacity = useTransform(progress, [0.05, 0.25], [0.35, 1])

  return (
    <div
      style={{
        padding: '20px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        maxWidth: 1000,
        width: '100%',
        margin: '0 auto',
        borderTop: '1px solid #3d3d3d',
        borderBottom: '1px solid #3d3d3d',
      }}
    >
      {/* 1996 label */}
      <motion.span
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: 1,
          color: '#999',
          opacity: labelOpacity,
          whiteSpace: 'nowrap',
        }}
      >
        1996
      </motion.span>

      {/* Track */}
      <div
        style={{
          flex: 1,
          height: 3,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.14)',
          position: 'relative',
        }}
      >
        {/* Fill */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: fillWidth,
            borderRadius: 2,
            background:
              'linear-gradient(to right, #80D064, #559DDF, #FF7F63, #FF67CB)',
          }}
        />

        {/* Tooltip */}
        <motion.div
          style={{
            position: 'absolute',
            top: -28,
            left: tooltipLeft,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              background: '#fff',
              color: '#000',
              fontSize: 10,
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 4,
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
          >
            <motion.span>{yearLabel}</motion.span>
            {/* Triangle pointer */}
            <div
              style={{
                position: 'absolute',
                bottom: -4,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '4px solid #fff',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* 2026 label */}
      <motion.span
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: 1,
          color: '#999',
          opacity: labelOpacity,
          whiteSpace: 'nowrap',
        }}
      >
        2026
      </motion.span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Stat block                                                        */
/* ------------------------------------------------------------------ */

function StatBlock({
  stat,
  index,
  progress,
}: {
  stat: (typeof FALLBACK_STATS)[number]
  index: number
  progress: MotionValue<number>
}) {
  const blockRef = useRef(null)
  const inView = useInView(blockRef, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={blockRef}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
      style={{
        flex: 1,
        paddingLeft: index > 0 ? 24 : 0,
        paddingRight: 24,
        borderLeft: index > 0 ? '1px solid rgba(255,255,255,0.14)' : 'none',
      }}
    >
      <CountUpNumber
        value={stat.value}
        suffix={stat.suffix}
        color={stat.color}
        progress={progress}
      />
      <div
        style={{
          marginTop: 12,
          fontSize: 12,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#999',
        }}
      >
        {stat.label}
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 13,
          color: '#999',
        }}
      >
        {stat.description}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function EntryStats({ stats }: { stats?: HeroStat[] }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Merge Sanity data with defaults
  const data: (typeof FALLBACK_STATS) = stats && stats.length > 0
    ? stats.map((s, i) => ({
        ...FALLBACK_STATS[i < FALLBACK_STATS.length ? i : FALLBACK_STATS.length - 1],
        label: s.label,
        value: s.value,
      }))
    : FALLBACK_STATS

  // Fade-up for the statement
  const statementOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1])
  const statementY = useTransform(scrollYProgress, [0.05, 0.25], [24, 0])

  return (
    <section
      id="entry-stats"
      data-snap
      ref={ref}
      style={{
        background: '#191919',
        minHeight: '100vh',
        padding: '0 60px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >

      {/* 1. Scroll-driven timeline strip */}
      <TimelineStrip progress={scrollYProgress} />

      {/* 2. Big typography statement */}
      <motion.div
        data-content
        style={{
          padding: '80px 0 20px',
          maxWidth: 1000,
          width: '100%',
          margin: '0 auto',
          opacity: statementOpacity,
          y: statementY,
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#80D064',
            fontWeight: 500,
            marginBottom: 24,
          }}
        >
          Webby 30: By The Numbers
        </p>
        <p
          style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 400,
            color: '#fff',
            lineHeight: 1.2,
            letterSpacing: -1,
          }}
        >
          This year,{' '}
          <span style={{ color: '#80D064' }}>13,000+</span> entries poured in
          from <span style={{ color: '#82D8EB' }}>71 countries</span> and all{' '}
          <span style={{ color: '#8B70D1' }}>50 US states</span> — making it the
          most globally represented year in Webby history. Only{' '}
          <span style={{ color: '#FFB763' }}>12%</span> became nominees.
        </p>
      </motion.div>

      {/* 3. Four stat blocks */}
      <div
        data-content
        style={{
          maxWidth: 1000,
          width: '100%',
          margin: '0 auto',
          padding: '60px 0',
          display: 'flex',
        }}
      >
        {data.map((stat, i) => (
          <StatBlock
            key={i}
            stat={stat}
            index={i}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  )
}
