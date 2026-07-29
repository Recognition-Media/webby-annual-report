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
      style={{
        background: '#f2eeed',
        padding: '72px 20px 80px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h3 style={{
          fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
          fontSize: 20,
          fontWeight: 700,
          color: NORDICS_INK,
          margin: '0 0 24px',
          lineHeight: 1.3,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}>
          {QUESTION}
        </h3>

        <div>
          {/* Stacked bar — 4 segments sized to their share */}
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

          {/* Legend — explicit width % that matches the bar segments
              above exactly so the coloured underlines sit under their
              corresponding segments. */}
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
      </div>
    </section>
  )
}
