'use client'

import { motion } from 'framer-motion'

// Section 1 opener — sentiment scale.
// Q: "How would you describe the current state of digital and creative
// work in your country in 2026?"
// Rows use the same `flex` value as their percentage so the label
// columns underneath line up with the bar segment above them.
const ROWS = [
  {
    label: 'At a turning point',
    detail: 'Something significant is shifting right now',
    value: 44.44,
    color: '#016BA7',
  },
  {
    label: 'Thriving',
    detail: 'The industry is growing',
    value: 22.22,
    color: '#A8D5F0',
  },
  {
    label: 'Under pressure',
    detail: 'Talent, funding, or structural issues are creating friction',
    value: 22.22,
    color: '#003D66',
  },
  {
    label: 'Stable',
    detail: 'Things are solid',
    value: 11.11,
    color: '#001A33',
  },
]

const QUESTION =
  'How would you describe the current state of digital and creative work in your country in 2026?'

const NORDICS_INK = '#000000'
const NORDICS_MUTED = 'rgba(0, 0, 0, 0.55)'

export function NordicsDataModule() {
  return (
    <section
      className="px-5 pt-6 pb-8 md:pt-[72px] md:pb-20"
      style={{ background: '#f2eeed' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h3
          className="md:whitespace-nowrap"
          style={{
            fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: NORDICS_INK,
            margin: '0 0 24px',
            lineHeight: 1.3,
            textAlign: 'center',
          }}
        >
          {QUESTION}
        </h3>

        {/* Desktop: horizontal stacked bar with aligned legend below.
            Hidden on mobile — the segments get too cramped and labels
            wrap awkwardly beneath 500px wide. */}
        <div className="hidden md:block">
          <div style={{
            display: 'flex',
            height: 80,
            borderRadius: 8,
            overflow: 'hidden',
            width: '100%',
          }}>
            {ROWS.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ width: '0%' }}
                whileInView={{ width: `${(row.value / 99.99) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 0.61, 0.36, 1] }}
                style={{
                  background: row.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {row.value.toFixed(1)}%
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'flex', marginTop: 24, width: '100%' }}>
            {ROWS.map((row) => (
              <div
                key={row.label}
                style={{
                  width: `${(row.value / 99.99) * 100}%`,
                  borderTop: `3px solid ${row.color}`,
                  paddingTop: 12,
                  paddingRight: 16,
                  boxSizing: 'border-box',
                  flexShrink: 0,
                }}
              >
                <p style={{
                  fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                  fontSize: 18,
                  color: NORDICS_INK,
                  margin: '0 0 4px',
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}>
                  {row.label}
                </p>
                <p style={{
                  fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                  fontSize: 13,
                  color: NORDICS_MUTED,
                  margin: 0,
                  lineHeight: 1.4,
                }}>
                  {row.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: each response gets a full-width row — label on top,
            horizontal bar sized to its share, description underneath.
            Reads top-to-bottom like a ranking. */}
        <div className="flex flex-col gap-5 md:hidden">
          {ROWS.map((row, i) => (
            <div key={row.label}>
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <p style={{
                  fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                  fontSize: 16,
                  color: NORDICS_INK,
                  margin: 0,
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}>
                  {row.label}
                </p>
                <p style={{
                  fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                  fontSize: 15,
                  color: NORDICS_INK,
                  margin: 0,
                  fontWeight: 700,
                }}>
                  {row.value.toFixed(1)}%
                </p>
              </div>
              <div style={{
                height: 10,
                borderRadius: 999,
                background: 'rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: '0%' }}
                  whileInView={{ width: `${(row.value / 99.99) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 0.61, 0.36, 1] }}
                  style={{
                    height: '100%',
                    background: row.color,
                    borderRadius: 999,
                  }}
                />
              </div>
              <p style={{
                fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                fontSize: 13,
                color: NORDICS_MUTED,
                margin: '8px 0 0',
                lineHeight: 1.4,
              }}>
                {row.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
