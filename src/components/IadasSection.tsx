'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { Report, HeroStat } from '@/sanity/types'
import { urlFor } from '@/sanity/image'

const FALLBACK_TEXT =
  'The Webby Awards are judged by the International Academy of Digital Arts and Sciences (IADAS), an invitation-only organization made up of Associate and Executive experts representing artists, creators, media companies, brands, agencies, production companies, cultural institutions, podcasts, games, technology, nonprofits, and beyond. The Academy is an intellectually diverse group of former Winners, creatives, organizers, entertainers, leaders and innovators that was founded to help drive the creative, technical, purpose-driven and professional progress of the Internet and evolving forms of digital media.'

const FALLBACK_STATS: HeroStat[] = [
  { label: 'Number of Academy Members', value: '3,300' },
  { label: 'Countries Represented', value: '77' },
  { label: 'Year Founded', value: '1998' },
]

function ScrollNumber({ value, progress }: { value: string; progress: MotionValue<number> }) {
  const match = value.match(/^([^0-9]*)([0-9,]+(?:\.\d+)?)(.*)$/)
  const num = match ? parseFloat(match[2].replace(/,/g, '')) : 0
  const prefix = match ? match[1] : ''
  const suffix = match ? match[3] : ''

  const count = useTransform(progress, [0.2, 0.6], [0, num])
  const display = useTransform(count, (v) =>
    Math.round(v).toLocaleString('en-US')
  )

  return (
    <span className="text-3xl md:text-[36px] font-black text-white leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}<motion.span>{display}</motion.span>{suffix}
    </span>
  )
}

/* Large IADAS diamond shape as background watermark */
function IadasWatermark() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/iadas-shape.png"
        alt=""
        width={400}
        height={400}
        style={{ opacity: 0.25 }}
        aria-hidden
      />
    </div>
  )
}

export function IadasSection({ report }: { report: Report }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const text = report.iadasDescription || FALLBACK_TEXT
  const stats = report.iadasStats && report.iadasStats.length > 0 ? report.iadasStats : FALLBACK_STATS

  return (
    <section ref={ref} className="relative bg-[#1268E3] text-white overflow-hidden h-screen flex flex-col justify-center">
      <IadasWatermark />

      <div className="relative mx-auto max-w-5xl px-8 md:px-16 py-10">
        {/* IADAS Logo */}
        <div className="text-center mb-6">
          <Image
            src="/iadas-logo.webp"
            alt="IADAS — International Academy of Digital Arts and Sciences"
            width={180}
            height={65}
            className="mx-auto"
          />
        </div>

        {/* Description */}
        <p className="text-xl md:text-[26px] md:leading-[1.5] font-light">
          The Webby Awards are judged by the{' '}
          <a
            href="https://www.iadas.net"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-80"
          >
            International Academy of Digital Arts and Sciences
          </a>{' '}
          {text.includes('(IADAS)')
            ? text.slice(text.indexOf('(IADAS)'))
            : `(IADAS), ${text.slice(text.indexOf('an invitation-only') >= 0 ? text.indexOf('an invitation-only') : 0)}`}
        </p>

        {/* Stats row */}
        <div className="flex flex-col sm:flex-row justify-between mt-8 pt-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`text-center flex-1 py-4 ${i > 0 ? 'sm:border-l sm:border-white/30' : ''}`}
            >
              <h3 className="text-xs uppercase tracking-wider font-bold text-white/70 mb-2">
                {stat.label}
              </h3>
              <ScrollNumber value={stat.value} progress={scrollYProgress} />
            </div>
          ))}
        </div>

        {/* KPMG banner */}
        <div className="mt-8 bg-[#001a4d] rounded-sm px-6 py-4 flex items-start gap-4">
          <div className="shrink-0 mt-0.5">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="4" fill="#4a90d9" />
              <path d="M7 14l5 5 9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Official Tabulation Consultant: KPMG</h4>
            <p className="text-xs text-white/70 mt-1 leading-relaxed">
              KPMG serves as the official Webby Awards vote tabulation consultant, ensuring the accuracy and quality of the voting process.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
