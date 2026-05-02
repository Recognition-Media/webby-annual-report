'use client'

import { motion } from 'framer-motion'

interface DemographicItem {
  label: string
  percent: number
}

const SOURCE: DemographicItem[] = [
  { label: 'Community Members', percent: 90.4 },
  { label: 'Judges', percent: 9.6 },
]

const ORG_TYPE: DemographicItem[] = [
  { label: 'Nonprofit / NGO', percent: 41.5 },
  { label: 'Agency or Consultancy', percent: 21.5 },
  { label: 'For-Profit Brand or Company', percent: 9.6 },
  { label: 'Other', percent: 8.9 },
  { label: 'Educational or Cultural Institution', percent: 8.1 },
  { label: 'Foundation or Philanthropy', percent: 4.4 },
  { label: 'Government or Public Sector', percent: 3.0 },
  { label: 'Healthcare Organization', percent: 1.5 },
  { label: 'Technology Company', percent: 1.5 },
]

const ORG_SIZE: DemographicItem[] = [
  { label: '< 10', percent: 53.3 },
  { label: '10–49', percent: 22.2 },
  { label: '50–249', percent: 11.1 },
  { label: '250–999', percent: 5.2 },
  { label: '1,000+', percent: 8.1 },
]

const FOCUS_AREAS: DemographicItem[] = [
  { label: 'Belonging & Inclusion', percent: 20.0 },
  { label: 'Education, Art & Culture', percent: 18.5 },
  { label: 'Human & Civil Rights', percent: 18.5 },
  { label: 'Humanitarian Action & Services', percent: 11.9 },
  { label: 'Sustainability, Environment & Climate', percent: 11.9 },
  { label: 'Health', percent: 10.4 },
  { label: 'Technology', percent: 8.9 },
]

const ACCENT = '#066DBA'

export function SurveyDemographics() {
  return (
    <section
      id="survey-demographics"
      className="relative px-5 md:px-[60px] py-20 md:py-28"
      style={{ background: '#E3DDCA' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        {/* Eyebrow */}
        <motion.p
          className="uppercase font-medium mb-3 text-center"
          style={{ fontSize: 11, letterSpacing: 4, color: ACCENT }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Respondent Data
        </motion.p>

        {/* Heading */}
        <motion.h2
          className="text-[28px] md:text-[40px] leading-[1.15] mb-12 text-center"
          style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 400 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          Survey Demographics &amp; Responder Breakdown
        </motion.h2>

        {/* 2x2 grid of chart cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <Card title="Source" delay={0.1}>
            <DonutChart data={SOURCE} />
          </Card>

          <Card title="Organization Type" delay={0.18}>
            <HBarList data={ORG_TYPE} maxVisible={5} />
          </Card>

          <Card title="Organization Size" delay={0.26}>
            <VBarChart data={ORG_SIZE} />
          </Card>

          <Card title="Focus Areas" delay={0.34}>
            <HBarList data={FOCUS_AREAS} maxVisible={7} />
          </Card>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Card shell                                                         */
/* ------------------------------------------------------------------ */

function Card({
  title,
  delay,
  children,
}: {
  title: string
  delay: number
  children: React.ReactNode
}) {
  return (
    <motion.div
      className="p-6 md:p-7 rounded-lg"
      style={{ background: '#d5cfbc' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
    >
      <h3
        className="text-[11px] md:text-[12px] uppercase tracking-[2px] font-semibold mb-4 pb-2"
        style={{
          color: '#21261A',
          fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
          borderBottom: `1px solid ${ACCENT}`,
        }}
      >
        {title}
      </h3>
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Donut chart (Source — 2 items)                                     */
/* ------------------------------------------------------------------ */

function DonutChart({ data }: { data: DemographicItem[] }) {
  // Build a conic-gradient based on cumulative percentages
  const colors = [ACCENT, '#21261A']
  let cumulative = 0
  const stops = data
    .map((item, i) => {
      const start = cumulative
      cumulative += item.percent
      return `${colors[i % colors.length]} ${start}% ${cumulative}%`
    })
    .join(', ')

  return (
    <div className="flex items-center gap-5">
      <motion.div
        className="relative flex-shrink-0"
        style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: `conic-gradient(${stops})`,
        }}
        initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        {/* Inner cutout to make it a donut */}
        <div
          className="absolute"
          style={{ inset: 18, borderRadius: '50%', background: '#d5cfbc' }}
        />
      </motion.div>

      {/* Legend */}
      <ul className="flex flex-col gap-2.5 flex-1" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {data.map((item, i) => (
          <li key={i} className="flex items-center gap-2.5 text-[12px]">
            <span
              className="inline-block flex-shrink-0"
              style={{ width: 10, height: 10, borderRadius: 2, background: colors[i % colors.length] }}
            />
            <span style={{ color: '#21261A', opacity: 0.78 }}>{item.label}</span>
            <span
              className="ml-auto tabular-nums"
              style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 700 }}
            >
              {Math.round(item.percent)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Horizontal bar list (Org Type, Focus Areas)                        */
/* ------------------------------------------------------------------ */

function HBarList({ data, maxVisible }: { data: DemographicItem[]; maxVisible: number }) {
  const visible = data.slice(0, maxVisible)
  const collapsed = data.slice(maxVisible)
  const max = Math.max(...data.map((d) => d.percent))

  return (
    <ul className="flex flex-col gap-2.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {visible.map((item, i) => (
        <li key={i}>
          <div className="flex justify-between items-baseline gap-3 mb-1">
            <span
              className="text-[11px] leading-tight"
              style={{
                color: '#21261A',
                opacity: 0.78,
                fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
              }}
            >
              {item.label}
            </span>
            <span
              className="text-[12px] flex-shrink-0 tabular-nums"
              style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 700 }}
            >
              {Math.round(item.percent)}%
            </span>
          </div>
          <div className="h-[4px] rounded-full" style={{ background: 'rgba(33,38,26,0.1)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: ACCENT }}
              initial={{ width: 0 }}
              whileInView={{ width: `${(item.percent / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.04, ease: 'easeOut' }}
            />
          </div>
        </li>
      ))}
      {collapsed.length > 0 && (
        <li className="pt-1 flex justify-between items-baseline gap-3">
          <span
            className="text-[10px] italic"
            style={{
              color: '#21261A',
              opacity: 0.5,
              fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
            }}
          >
            + {collapsed.length} more ({collapsed.map((c) => c.label.split(/[—,/]/)[0].trim()).join(', ')})
          </span>
          <span
            className="text-[11px] flex-shrink-0 tabular-nums"
            style={{
              fontFamily: 'var(--font-display)',
              color: '#21261A',
              opacity: 0.5,
              fontWeight: 700,
            }}
          >
            {Math.round(collapsed.reduce((sum, c) => sum + c.percent, 0))}%
          </span>
        </li>
      )}
    </ul>
  )
}

/* ------------------------------------------------------------------ */
/*  Vertical bar chart (Org Size)                                      */
/* ------------------------------------------------------------------ */

function VBarChart({ data }: { data: DemographicItem[] }) {
  const max = Math.max(...data.map((d) => d.percent))

  return (
    <div className="flex items-end gap-2 md:gap-3" style={{ height: 170, paddingBottom: 6 }}>
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <span
            className="text-[12px] tabular-nums"
            style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 700 }}
          >
            {Math.round(item.percent)}%
          </span>
          <motion.div
            className="w-full rounded-t"
            style={{ background: ACCENT }}
            initial={{ height: 0 }}
            whileInView={{ height: `${(item.percent / max) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
          />
          <span
            className="text-[9px] uppercase tracking-[1px] text-center leading-tight"
            style={{
              color: '#21261A',
              opacity: 0.6,
              fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}
