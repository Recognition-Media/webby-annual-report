'use client'

import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import type { PortableTextBlock } from '@portabletext/types'
import type { DataStat } from '@/sanity/types'
import { AnimatedBg } from './AnimatedBg'

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
              color: '#8B70D1',
              fontWeight: 500,
            }}>
              {eyebrow}
            </span>
            <div style={{ width: 60, height: 2, background: '#8B70D1', borderRadius: 2 }} />
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

        {/* Divider */}
        <div style={{ width: 80, height: 1, background: 'rgba(255,255,255,0.14)', marginBottom: 32 }} />

        {/* Body */}
        {body && (
          <div
            data-content
            style={{
              fontSize: 16,
              lineHeight: '28px',
              color: '#D4D4D4',
              maxWidth: 700,
              marginBottom: 40,
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
            {stats.map((stat, i) => (
              <div key={i} style={{ flex: '1 1 180px', maxWidth: 240 }}>
                <div style={{
                  fontSize: 44,
                  fontWeight: 300,
                  color: '#8B70D1',
                  lineHeight: 1,
                  marginBottom: 8,
                }}>
                  {stat.value}%
                </div>
                <div style={{
                  width: '100%',
                  height: 3,
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 2,
                  marginBottom: 10,
                  overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.3 + i * 0.15 }}
                    style={{ height: '100%', background: '#8B70D1', borderRadius: 2 }}
                  />
                </div>
                <div style={{ fontSize: 13, color: '#999', lineHeight: 1.4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onCta}
          className="no-custom-cursor"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            padding: '18px 36px',
            background: '#8B70D1',
            border: 'none',
            borderRadius: 0,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.background = '#9B82E0' }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.background = '#8B70D1' }}
        >
          {ctaText || 'SEE THE TRENDS'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
