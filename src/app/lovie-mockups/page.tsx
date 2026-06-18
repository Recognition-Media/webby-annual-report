'use client'

import { useEffect, useState } from 'react'
import { CountryItaly, CountryPortugal, CountrySpain } from '@/components/lovie/CountryStickers'

// Local mockup page for picking the "Inside The Report" treatment.
// Not linked from anywhere — visit /lovie-mockups directly. Delete this
// file (or convert to dev-only) before the branch merges.

const TRENDS = [
  { number: '01', title: 'A Creative Scene Building Beyond Capital Cities' },
  { number: '02', title: 'Smaller Players Are Setting the Standard' },
  { number: '03', title: 'Internationalism & Collaboration by Necessity' },
  { number: '04', title: 'Rooted in Local Culture for Global Reach' },
  { number: '05', title: 'Building Digital Sovereignty & AI Infrastructure' },
]

const LIME = '#eeffbb'
const ORANGE = '#ff6000'
const CREAM = '#f2eeed'
const BLACK = '#000'

export default function LovieMockupsPage() {
  useEffect(() => {
    document.body.classList.add('lovie-template')
    return () => { document.body.classList.remove('lovie-template') }
  }, [])

  return (
    <main>
      <TopNav />
      <PageHeader />
      <section id="about-a"><AboutOptionA /></section>
      <section id="about-b"><AboutOptionB /></section>
      <Divider />
      <section id="credits-a"><CreditsOptionA /></section>
      <section id="credits-b"><CreditsOptionB /></section>
      <Divider />
      <section id="take-a"><TakeawaysOptionA /></section>
      <section id="take-b"><TakeawaysOptionB /></section>
      <Divider />
      <section id="t5-donut"><T5DataOptionDonut /></section>
      <section id="t5-waffle"><T5DataOptionWaffle /></section>
      <section id="t5-spectrum"><T5DataOptionSpectrum /></section>
      <Divider />
      <section id="data-a"><DataVizOptionA /></section>
      <section id="data-b"><DataVizOptionB /></section>
      <section id="data-c"><DataVizOptionC /></section>
      <Divider />
      <section id="head-a"><HeadshotOptionA /></section>
      <section id="head-b"><HeadshotOptionB /></section>
      <Divider />
      <section id="title-a"><TitleOptionA /></section>
      <section id="title-b"><TitleOptionB /></section>
      <Divider />
      <section id="opt1"><Option1 /></section>
      <Divider />
      <section id="opt2"><Option2 /></section>
      <Divider />
      <section id="opt3"><Option3 /></section>
      <Footer />
    </main>
  )
}

/* =========================================================================
 * Data Viz Mockups for Trend 3's ranked-order question
 * All 3 use the same data and the same {value, label} schema as the
 * existing CMS dataStat. Drop-in replacements for the bar chart.
 * ======================================================================= */

const RANKED_CHALLENGES = [
  { label: 'AI and automation', value: 5.3 },
  { label: 'Concentration of opportunity in major hubs', value: 4.5 },
  { label: 'Difficulty scaling beyond local markets', value: 4.4 },
  { label: 'Competition and market saturation', value: 4.2 },
  { label: 'Economic instability or funding gaps', value: 4.0 },
  { label: 'Regulatory complexity', value: 2.9 },
  { label: 'Talent scarcity and/or brain drain', value: 2.7 },
]
const MAX_SCORE = 10
const QUESTION = 'In ranked order, what are the top challenges currently shaping your career in your country?'

function DataVizFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#f2eeed', padding: '64px 40px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', fontFamily: "'Scto Grotesk A', sans-serif" }}>
        <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: ORANGE, marginBottom: 12, fontWeight: 500 }}>
          Data Module
        </p>
        <h4 style={{ fontSize: 18, fontWeight: 700, color: '#000', marginBottom: 32, lineHeight: 1.35 }}>
          {QUESTION}
        </h4>
        {children}
      </div>
    </div>
  )
}

// Option A — Editorial ranked list. Numbered rows with full label + score.
// Most typographic / on-brand for Lovie. Hover lifts the row.
function DataVizOptionA() {
  return (
    <div>
      <OptionLabel
        n={1}
        title="Data Viz Option A — Editorial Ranked List"
        description="Numbered rows with the full challenge name and raw score. Quietest, most editorial — fits Lovie's typographic feel. Hover slides the row right + accents the number in orange."
      />
      <DataVizFrame>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: '1px solid rgba(0,0,0,0.15)' }}>
          {RANKED_CHALLENGES.map((row, i) => (
            <li
              key={row.label}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 20,
                padding: '16px 8px',
                borderBottom: '1px solid rgba(0,0,0,0.15)',
                cursor: 'default',
                transition: 'transform 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLLIElement).style.transform = 'translateX(6px)'
                ;(e.currentTarget as HTMLLIElement).style.background = 'rgba(255,96,0,0.05)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLLIElement).style.transform = 'translateX(0)'
                ;(e.currentTarget as HTMLLIElement).style.background = 'transparent'
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: ORANGE, minWidth: 32 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: 16, color: '#000', flex: 1, lineHeight: 1.4 }}>
                {row.label}
              </span>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#000', minWidth: 50, textAlign: 'right' }}>
                {row.value.toFixed(1)}
              </span>
            </li>
          ))}
        </ol>
        <p style={{ marginTop: 16, fontSize: 11, color: '#000', opacity: 0.5 }}>
          Average score out of {MAX_SCORE} · n=respondents
        </p>
      </DataVizFrame>
    </div>
  )
}

// Option B — Lollipop chart. Label on the left, score on the right of a
// horizontal stem ending in a dot. Cleaner than bars; more chart-y than
// editorial. Dot grows on hover.
function DataVizOptionB() {
  return (
    <div>
      <OptionLabel
        n={2}
        title="Data Viz Option B — Lollipop Chart"
        description="Each row is a horizontal stem with a dot at its score. Bars compress to lines so the dot does the talking. Cleaner than the current bars, still chart-shaped. Dots scale up on hover with a tooltip-style score reveal."
      />
      <DataVizFrame>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {RANKED_CHALLENGES.map((row) => (
            <LollipopRow key={row.label} row={row} max={MAX_SCORE} />
          ))}
        </div>
        <p style={{ marginTop: 24, fontSize: 11, color: '#000', opacity: 0.5 }}>
          Average score out of {MAX_SCORE}
        </p>
      </DataVizFrame>
    </div>
  )
}

function LollipopRow({ row, max }: { row: { label: string; value: number }; max: number }) {
  const [hover, setHover] = useState(false)
  const pct = (row.value / max) * 100
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'default' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span style={{ fontSize: 13, color: '#000', flex: '0 0 38%', lineHeight: 1.3 }}>
        {row.label}
      </span>
      <div style={{ position: 'relative', flex: 1, height: 28, display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            height: 2,
            background: 'rgba(0,0,0,0.08)',
            transform: 'translateY(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            height: 2,
            width: `${pct}%`,
            background: ORANGE,
            transform: 'translateY(-50%)',
            transition: 'width 0.4s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `calc(${pct}% - ${hover ? 12 : 8}px)`,
            top: '50%',
            width: hover ? 24 : 16,
            height: hover ? 24 : 16,
            background: ORANGE,
            borderRadius: '50%',
            transform: 'translateY(-50%)',
            transition: 'all 0.2s ease',
            boxShadow: hover ? '0 0 0 4px rgba(255,96,0,0.15)' : 'none',
          }}
        />
      </div>
      <span style={{ fontSize: 18, fontWeight: 700, color: '#000', minWidth: 36, textAlign: 'right' }}>
        {row.value.toFixed(1)}
      </span>
    </div>
  )
}

// Option C — Stacked score badges. Each rank is a card with its number, the
// label, and a circular score badge. Top item is largest, taper down. The
// most "graphic" of the three.
function DataVizOptionC() {
  // Linear taper from largest at rank 1 to smallest at rank 7.
  const sizes = [1, 0.94, 0.88, 0.82, 0.76, 0.7, 0.64]
  return (
    <div>
      <OptionLabel
        n={3}
        title="Data Viz Option C — Tapered Score Badges"
        description="Cards arranged vertically with circular score badges on the right. Each card scales down slightly as you descend the ranking — visual hierarchy reflects importance. Most graphic / dashboard-feeling. Hover lifts the card and saturates the badge."
      />
      <DataVizFrame>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RANKED_CHALLENGES.map((row, i) => (
            <ScoreBadgeCard key={row.label} row={row} rank={i + 1} scale={sizes[i]} max={MAX_SCORE} />
          ))}
        </div>
        <p style={{ marginTop: 16, fontSize: 11, color: '#000', opacity: 0.5 }}>
          Average score out of {MAX_SCORE}
        </p>
      </DataVizFrame>
    </div>
  )
}

function ScoreBadgeCard({ row, rank, scale, max }: { row: { label: string; value: number }; rank: number; scale: number; max: number }) {
  const [hover, setHover] = useState(false)
  const intensity = row.value / max  // 0–1
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 18px',
        background: '#fff',
        borderRadius: 12,
        border: `1px solid ${hover ? ORANGE : 'rgba(0,0,0,0.08)'}`,
        cursor: 'default',
        transform: `scale(${scale}) translateY(${hover ? -2 : 0}px)`,
        transformOrigin: 'left center',
        transition: 'all 0.2s ease',
        boxShadow: hover ? '0 6px 18px rgba(0,0,0,0.08)' : 'none',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span style={{ fontSize: 14, fontWeight: 700, color: ORANGE, minWidth: 24 }}>
        {String(rank).padStart(2, '0')}
      </span>
      <span style={{ fontSize: 15, color: '#000', flex: 1, lineHeight: 1.35 }}>
        {row.label}
      </span>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: `rgba(255, 96, 0, ${hover ? 1 : 0.25 + intensity * 0.55})`,
          color: hover ? '#fff' : '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 700,
          flexShrink: 0,
          transition: 'all 0.2s ease',
        }}
      >
        {row.value.toFixed(1)}
      </div>
    </div>
  )
}

/* =========================================================================
 * Trend 5 Data Viz Mockups — single-choice sentiment question
 * "How are European regulations around AI and digital platforms
 *  affecting creative work in your market?" (5 responses, % of total)
 * ======================================================================= */

const T5_RESPONSES = [
  { label: "It's creating useful guardrails", short: 'Useful guardrails', value: 0, color: '#000000' /* Black */ },
  { label: "It's adding a compliance burden that affects smaller players", short: 'Compliance burden', value: 11.11, color: '#ffb986' /* Lovie Peach */ },
  { label: "It's doing both, depending on the type of organisation", short: 'Both, depending', value: 33.33, color: '#ca86ff' /* Lovie Lilac */ },
  { label: "It's too early to see a real effect", short: 'Too early to tell', value: 44.44, color: '#ff6000' /* Lovie Orange */ },
  { label: "I'm not seeing a direct effect on the work I do", short: 'No direct effect', value: 11.11, color: '#6D48FF' /* Lovie Washed Blue */ },
]
const T5_QUESTION = '“How are European regulations around AI and digital platforms affecting creative work in your market?”'

function T5DataFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#f2eeed', padding: '64px 40px' }}>
      <div style={{ maxWidth: 740, margin: '0 auto', fontFamily: "'Scto Grotesk A', sans-serif", background: LIME, borderRadius: 14, padding: 28 }}>
        <h4 style={{ fontSize: 18, fontWeight: 700, color: '#000', marginBottom: 28, lineHeight: 1.35 }}>
          {T5_QUESTION}
        </h4>
        {children}
      </div>
    </div>
  )
}

// Option A — Donut chart with hover-to-highlight
function T5DataOptionDonut() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  // Compute cumulative angles for SVG donut
  const total = T5_RESPONSES.reduce((sum, r) => sum + r.value, 0)
  let startAngle = -90  // start at top
  const arcs = T5_RESPONSES.map((r) => {
    const angle = (r.value / total) * 360
    const arc = { ...r, start: startAngle, end: startAngle + angle }
    startAngle += angle
    return arc
  })

  const center = 110
  const radius = 80
  const innerRadius = 50
  const focused = activeIdx !== null ? arcs[activeIdx] : null

  return (
    <div>
      <OptionLabel
        n={1}
        title="Trend 5 Option A — Animated Donut"
        description="Classic donut chart. Each response is a wedge sized by its share of respondents. Hover a wedge → it expands outward + center reveals the response label and percentage. Strong for single-choice / share-of-total questions."
      />
      <T5DataFrame>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          <svg width={220} height={220} viewBox="0 0 220 220" style={{ flexShrink: 0 }}>
            {arcs.map((arc, i) => {
              if (arc.value === 0) return null
              const isActive = activeIdx === i
              const expand = isActive ? 8 : 0
              const r = radius + expand
              const startRad = (arc.start * Math.PI) / 180
              const endRad = (arc.end * Math.PI) / 180
              const x1 = center + r * Math.cos(startRad)
              const y1 = center + r * Math.sin(startRad)
              const x2 = center + r * Math.cos(endRad)
              const y2 = center + r * Math.sin(endRad)
              const ix1 = center + innerRadius * Math.cos(startRad)
              const iy1 = center + innerRadius * Math.sin(startRad)
              const ix2 = center + innerRadius * Math.cos(endRad)
              const iy2 = center + innerRadius * Math.sin(endRad)
              const largeArc = arc.end - arc.start > 180 ? 1 : 0
              const d = [
                `M ${x1} ${y1}`,
                `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
                `L ${ix2} ${iy2}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
                'Z',
              ].join(' ')
              return (
                <path
                  key={i}
                  d={d}
                  fill={arc.color}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    opacity: activeIdx === null || isActive ? 1 : 0.4,
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                />
              )
            })}
            {/* Center text */}
            <text
              x={center}
              y={center - 4}
              textAnchor="middle"
              fontSize={focused ? 28 : 11}
              fontWeight={700}
              fill="#000"
              style={{ pointerEvents: 'none' }}
            >
              {focused ? `${focused.value.toFixed(2)}%` : 'Hover to'}
            </text>
            <text
              x={center}
              y={center + 16}
              textAnchor="middle"
              fontSize={10}
              fill="#000"
              opacity={focused ? 0.7 : 0.5}
              style={{ pointerEvents: 'none' }}
            >
              {focused ? focused.short : 'explore'}
            </text>
          </svg>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 240, flex: 1 }}>
            {T5_RESPONSES.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  cursor: 'pointer',
                  opacity: activeIdx === null || activeIdx === i ? 1 : 0.5,
                  transition: 'opacity 0.18s ease',
                }}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <span style={{ width: 12, height: 12, background: r.color, borderRadius: 3, marginTop: 4, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#000', flex: 1, lineHeight: 1.35 }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#000', minWidth: 50, textAlign: 'right' }}>{r.value.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </T5DataFrame>
    </div>
  )
}

// Option B — 100-dot waffle chart
function T5DataOptionWaffle() {
  // Build 100 dots, allocated proportionally to each response.
  // Use rounding so dot counts sum to 100.
  const counts = T5_RESPONSES.map((r) => Math.round(r.value))
  let sum = counts.reduce((a, b) => a + b, 0)
  // Adjust last category to make exactly 100
  while (sum < 100) { counts[counts.length - 1]++; sum++ }
  while (sum > 100) { counts[counts.length - 1]--; sum-- }
  const dots: { idx: number }[] = []
  counts.forEach((count, idx) => {
    for (let i = 0; i < count; i++) dots.push({ idx })
  })

  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  return (
    <div>
      <OptionLabel
        n={2}
        title="Trend 5 Option B — 100-Dot Waffle"
        description="One hundred dots arranged in a 10×10 grid; each dot represents one respondent and is colored by their answer. Visceral 'out of every 100 creative leaders' framing. Hover any dot or legend row → all matching dots glow, others fade. The most distinctive visualization of the three."
      />
      <T5DataFrame>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: 6,
            flexShrink: 0,
            maxWidth: 240,
          }}>
            {dots.map((dot, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1 / 1',
                  width: 20,
                  background: T5_RESPONSES[dot.idx].color,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  opacity: activeIdx === null || activeIdx === dot.idx ? 1 : 0.18,
                  transform: activeIdx === dot.idx ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={() => setActiveIdx(dot.idx)}
                onMouseLeave={() => setActiveIdx(null)}
              />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 240 }}>
            <p style={{ fontSize: 11, color: '#000', opacity: 0.6, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>
              Of every 100 creative leaders…
            </p>
            {T5_RESPONSES.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '6px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  opacity: activeIdx === null || activeIdx === i ? 1 : 0.4,
                  background: activeIdx === i ? 'rgba(0,0,0,0.05)' : 'transparent',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <span style={{ width: 12, height: 12, background: r.color, borderRadius: '50%', marginTop: 4, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#000', flex: 1, lineHeight: 1.35 }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#000', minWidth: 50, textAlign: 'right' }}>
                  {Math.round(r.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </T5DataFrame>
    </div>
  )
}

// Option C — Stacked sentiment spectrum (single horizontal bar)
/* =========================================================================
 * Takeaways Layout Mockups
 * Five conclusions from the report, each marked with a numbered heart
 * icon (no-1.svg through no-5.svg). Dotted curves connect the icons
 * across the section like the social-asset reference.
 * ======================================================================= */

const TAKEAWAYS = [
  {
    title: 'Creative innovation is decentralising towards the margins',
    body: "Distinctive digital work across Mediterranean countries is increasingly being produced outside of its capital cities. Emerging markets like Coimbra, Bilbao, Verona, Bologna, and Málaga have become sites for new ideas. Creative leaders are split on whether decentralisation has happened or is underway.",
  },
  {
    title: 'Independent structures are producing world-class work',
    body: "Across Spain, Italy, and Portugal, the most internationally recognised work is coming from smaller organisations. Lean agencies, production studios, and collaborative collectives are operating at a high level, without network infrastructure — but staying lean often means struggling to keep pace with innovation.",
  },
  {
    title: 'Organisations embrace internationalism by necessity',
    body: "Creative leaders across the Mediterranean agree that their domestic markets limit growth. Spain's creator and media industries embrace a global audience of 500 million Spanish speakers across Latin America; Portugal has positioned itself as a startup and AI infrastructure hub.",
  },
  {
    title: 'Cultural specificity as a competitive advantage',
    body: "In a landscape pushing for AI-enabled optimisation, creative outputs are homogenising. Mediterranean companies' most travelled work is rooted in cultural specificity over global appeal — Portuguese saudade as a creative baseline, Italian craft heritage as a foundation for digital storytelling.",
  },
  {
    title: 'The region is investing in digital infrastructure',
    body: "Portugal is embedding responsible AI as a national strategy. Spain is becoming a model for regulated AI compliance. Italy is the first EU member state with a comprehensive AI framework. For nearly half of creative leaders working in the region, it is still too early to see the effects of that regulatory architecture.",
  },
]

// Option A — Vertical Editorial Stack
// Each takeaway = numbered heart icon on left, title + body on right.
// Clean — no dotted curves, just the hearts marking each takeaway.
function TakeawaysOptionA() {
  return (
    <div>
      <OptionLabel
        n={1}
        title="Takeaways Option A — Vertical Editorial Stack"
        description="Each takeaway is a row: numbered heart icon (1 – 5) on the left, title + body on the right. Reads top-to-bottom like a list with strong visual markers for each conclusion. Calmer / most readable."
      />
      <div style={{ background: '#f2eeed', padding: '80px 40px', fontFamily: "'Scto Grotesk A', sans-serif" }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          {TAKEAWAYS.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 40,
                alignItems: 'flex-start',
                marginBottom: i === TAKEAWAYS.length - 1 ? 0 : 64,
              }}
            >
              <img
                src={`/lovie/no-${i + 1}.svg`}
                alt={`Takeaway ${i + 1}`}
                style={{ width: 130, height: 'auto', flexShrink: 0 }}
              />
              <div style={{ flex: 1, paddingTop: 8 }}>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: '#000', marginBottom: 12, lineHeight: 1.2 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 16, color: '#000', lineHeight: 1.6, fontWeight: 400 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Option B — Zigzag / Alternating Columns
// Icons alternate sides (left, right, left, right, left). No curves —
// the zigzag layout itself creates the visual journey.
function TakeawaysOptionB() {
  return (
    <div>
      <OptionLabel
        n={2}
        title="Takeaways Option B — Zigzag Alternating Columns"
        description="Icons alternate left/right across the page. More distinctive / magazine-spread feel. Eye traces a zigzag down the page instead of a straight list."
      />
      <div style={{ background: '#f2eeed', padding: '80px 40px', fontFamily: "'Scto Grotesk A', sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {TAKEAWAYS.map((item, i) => {
            const isLeft = i % 2 === 0
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 40,
                  alignItems: 'flex-start',
                  flexDirection: isLeft ? 'row' : 'row-reverse',
                  marginBottom: i === TAKEAWAYS.length - 1 ? 0 : 72,
                }}
              >
                <img
                  src={`/lovie/no-${i + 1}.svg`}
                  alt={`Takeaway ${i + 1}`}
                  style={{ width: 140, height: 'auto', flexShrink: 0 }}
                />
                <div style={{ flex: 1, paddingTop: 8, maxWidth: 560, textAlign: isLeft ? 'left' : 'right' }}>
                  <h3 style={{ fontSize: 24, fontWeight: 700, color: '#000', marginBottom: 12, lineHeight: 1.2 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 16, color: '#000', lineHeight: 1.6, fontWeight: 400 }}>{item.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function T5DataOptionSpectrum() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  return (
    <div>
      <OptionLabel
        n={3}
        title="Trend 5 Option C — Sentiment Spectrum"
        description="A single horizontal bar broken into 5 colored segments, sized by share. Tells the distribution story in one glance — eye runs left-to-right across sentiment buckets. Hover any segment to expand it slightly + emphasize its label below. Cleanest, most editorial of the three."
      />
      <T5DataFrame>
        {/* The stacked bar */}
        <div style={{ display: 'flex', height: 56, borderRadius: 10, overflow: 'hidden' }}>
          {T5_RESPONSES.map((r, i) => {
            if (r.value === 0) return null
            const isActive = activeIdx === i
            return (
              <div
                key={i}
                style={{
                  flex: r.value,
                  background: r.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'flex 0.25s ease, opacity 0.2s ease',
                  opacity: activeIdx === null || isActive ? 1 : 0.45,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#fff',
                  ...(isActive ? { flex: r.value * 1.15 } : {}),
                }}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {r.value >= 8 ? `${r.value.toFixed(0)}%` : ''}
              </div>
            )
          })}
        </div>

        {/* Legend below */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
          {T5_RESPONSES.map((r, i) => {
            const isActive = activeIdx === i
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '6px 0',
                  cursor: 'pointer',
                  opacity: activeIdx === null || isActive ? 1 : 0.5,
                  transform: isActive ? 'translateX(4px)' : 'none',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <span style={{ width: 14, height: 14, background: r.color, borderRadius: 3, marginTop: 4, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#000', flex: 1, lineHeight: 1.4, fontWeight: isActive ? 600 : 400 }}>{r.label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#000', minWidth: 60, textAlign: 'right' }}>{r.value.toFixed(2)}%</span>
              </div>
            )
          })}
        </div>
      </T5DataFrame>
    </div>
  )
}

/* =========================================================================
 * Quote-Headshot Treatment Mockups
 * ======================================================================= */

const SAMPLE_QUOTES = [
  {
    text: '“The tension between cultural relevance and commercial sustainability is, in my view, the most underestimated structural challenge for independent creative studios in Europe right now — and nobody talks about it honestly.”',
    name: 'Giacomo Scando',
    role: 'CEO, Giga Design Studio Srl',
    photo: '/lovie/quote-giacomo.jpg',
  },
  {
    text: '“We live in a moment where mid-sized companies face the challenge of building the digital solidity needed to compete at the level of the great ones — while large companies must spend less time focused on the day-to-day and instead set the direction for their sector.”',
    name: 'Miguel Priera',
    role: 'Senior Visual & Interaction Designer, Hanzo',
    photo: '/lovie/quote-miguel.jpg',
  },
]

function MockQuoteCard({
  quote,
  headshot,
}: {
  quote: (typeof SAMPLE_QUOTES)[number]
  headshot: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', maxWidth: 720 }}>
      <div style={{ flexShrink: 0 }}>{headshot}</div>
      <figure style={{ margin: 0 }}>
        <blockquote
          style={{
            fontSize: 17,
            lineHeight: 1.4,
            margin: 0,
            marginBottom: 12,
            paddingLeft: 16,
            borderLeft: `3px solid ${ORANGE}`,
            color: '#000',
            fontWeight: 500,
          }}
        >
          {quote.text}
        </blockquote>
        <figcaption style={{ fontSize: 13, paddingLeft: 16, color: '#000' }}>
          — <strong style={{ fontWeight: 700 }}>{quote.name}</strong>
          <span style={{ opacity: 0.7 }}>, {quote.role}</span>
        </figcaption>
      </figure>
    </div>
  )
}

function MockQuotesContainer({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#f2eeed', padding: '64px 40px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48, maxWidth: 800, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  )
}

// Option A — Circular headshots with brand-color borders
function HeadshotOptionA() {
  return (
    <div>
      <OptionLabel
        n={1}
        title="Headshot Option A — Circular Border"
        description="Anthem-style circular crop with a brand-color stroke. Each speaker can take a different border color so the two quotes feel like a pair rather than a clone. Subtle, clean, familiar."
      />
      <MockQuotesContainer>
        <MockQuoteCard
          quote={SAMPLE_QUOTES[0]}
          headshot={
            <img
              src={SAMPLE_QUOTES[0].photo}
              alt=""
              style={{
                width: 92,
                height: 92,
                borderRadius: '50%',
                objectFit: 'cover',
                border: `3px solid ${LIME}`,
              }}
            />
          }
        />
        <MockQuoteCard
          quote={SAMPLE_QUOTES[1]}
          headshot={
            <img
              src={SAMPLE_QUOTES[1].photo}
              alt=""
              style={{
                width: 92,
                height: 92,
                borderRadius: '50%',
                objectFit: 'cover',
                border: `3px solid ${ORANGE}`,
              }}
            />
          }
        />
      </MockQuotesContainer>
    </div>
  )
}

// Option B — Heart container with diagonal slash overlay. The portrait
// fits inside the rounded heart, and the diagonal "1" stripe sits on top
// in a solid brand color so the No-1 mark stays graphic, not photographic.
function HeartWithSlashHeadshot({ src, slashColor }: { src: string; slashColor: string }) {
  const SIZE = 124
  const HEIGHT = 120
  const maskCommon = {
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  } as const
  return (
    <div style={{ position: 'relative', width: SIZE, height: HEIGHT, flexShrink: 0 }}>
      {/* Photo masked into the heart shape */}
      <img
        src={src}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          WebkitMaskImage: 'url(/lovie/no-1-heart.svg)',
          maskImage: 'url(/lovie/no-1-heart.svg)',
          ...maskCommon,
        }}
      />
      {/* Colored slash overlay, exact same viewBox so it sits in register */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: slashColor,
          WebkitMaskImage: 'url(/lovie/no-1-slash.svg)',
          maskImage: 'url(/lovie/no-1-slash.svg)',
          ...maskCommon,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

function HeadshotOptionB() {
  return (
    <div>
      <OptionLabel
        n={2}
        title="Headshot Option B — Lovie “No.” mark (heart + slash overlay)"
        description="Photo crops into the rounded heart container; the diagonal '1' slash is layered on top in a solid color. Most on-brand option — matches the section-1 cover mark. Showing one quote with a BLACK slash and one with LIME so you can compare which reads better against the headshot."
      />
      <MockQuotesContainer>
        <MockQuoteCard
          quote={SAMPLE_QUOTES[0]}
          headshot={<HeartWithSlashHeadshot src={SAMPLE_QUOTES[0].photo} slashColor="#000" />}
        />
        <MockQuoteCard
          quote={SAMPLE_QUOTES[1]}
          headshot={<HeartWithSlashHeadshot src={SAMPLE_QUOTES[1].photo} slashColor={LIME} />}
        />
      </MockQuotesContainer>
    </div>
  )
}

/* =========================================================================
 * Title Treatment Mockups — pick one for the actual hero
 * Both use Scto Grotesk A Medium, drop the "x", break into 3 lines.
 * ======================================================================= */

function MockHero({ children, label, description }: { children: React.ReactNode; label: string; description: string }) {
  return (
    <div>
      <div style={{ padding: '28px 40px', background: BLACK, color: LIME }}>
        <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: ORANGE }}>{label}</p>
        <p style={{ marginTop: 6, opacity: 0.75, fontSize: 14, maxWidth: 720 }}>{description}</p>
      </div>
      <div
        style={{
          position: 'relative',
          minHeight: 560,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: '10vh',
          background: 'linear-gradient(135deg, #1a1d2e 0%, #2a1f1f 50%, #1a1d1a 100%)',
          textAlign: 'center',
        }}
      >
        <div style={{ padding: '0 24px', maxWidth: 1200 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// Subtitle that both options share, so you compare titles in equal context.
function MockSubtitle() {
  return (
    <p
      style={{
        color: '#E3DDCA',
        fontSize: 'clamp(13px, 1.5vw, 16px)',
        letterSpacing: '0.5px',
        marginTop: 24,
        marginBottom: 32,
        maxWidth: 500,
        marginLeft: 'auto',
        marginRight: 'auto',
        lineHeight: 1.5,
      }}
    >
      Mapping the cities, communities, and ideas shaping Europe&rsquo;s contributions to the Internet in 2026.
    </p>
  )
}

// Option A: same weight on lines 1 & 2, smaller weight on line 3.
// Quieter, restrained editorial — relies purely on size for hierarchy.
function TitleOptionA() {
  return (
    <MockHero
      label="Title Option A — Restrained Editorial"
      description="All three lines in Scto Grotesk A Medium. Lines 1 & 2 share the same display size; line 3 (&ldquo;The Mediterranean&rdquo;) drops to ~45% of that size. Quiet hierarchy from size alone, no italic, no separator."
    >
      <h1
        style={{
          fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
          color: '#eeffbb',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        <span style={{ display: 'block', fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}>
          The Lovie Awards
        </span>
        <span style={{ display: 'block', fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}>
          Creative Hubs Series
        </span>
        <span style={{ display: 'block', fontSize: 'clamp(1rem, 2.5vw, 2rem)', marginTop: 12, fontWeight: 500, opacity: 0.95 }}>
          The Mediterranean
        </span>
      </h1>
      <MockSubtitle />
    </MockHero>
  )
}

// Option B: bold line 1, italic line 2, eyebrow line 3.
// More contrast — Lines play different roles via weight, style, and eyebrow.
function TitleOptionB() {
  return (
    <MockHero
      label="Title Option B — Mixed Weight & Italic Accent"
      description="Line 1 (&ldquo;The Lovie Awards&rdquo;) is the brand mark — largest, bolder weight. Line 2 (&ldquo;Creative Hubs Series&rdquo;) sits below in italic medium for a refined editorial feel. Line 3 (&ldquo;The Mediterranean&rdquo;) is an uppercase eyebrow with letter-spacing, like a section label or magazine standfirst."
    >
      <h1
        style={{
          fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
          color: '#eeffbb',
          margin: 0,
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: 'clamp(2.25rem, 6.5vw, 5.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.015em',
            lineHeight: 1.05,
          }}
        >
          The Lovie Awards
        </span>
        <span
          style={{
            display: 'block',
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: 500,
            fontStyle: 'italic',
            letterSpacing: '-0.005em',
            lineHeight: 1.1,
            marginTop: 4,
            opacity: 0.95,
          }}
        >
          Creative Hubs Series
        </span>
        <span
          style={{
            display: 'block',
            fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.35em',
            marginTop: 22,
            color: ORANGE,
          }}
        >
          — The Mediterranean —
        </span>
      </h1>
      <MockSubtitle />
    </MockHero>
  )
}

function TopNav() {
  const linkStyle: React.CSSProperties = {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'white',
    textDecoration: 'none',
    padding: '6px 14px',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 999,
  }
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: BLACK, color: 'white',
      padding: '14px 24px',
      display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center',
      borderBottom: `2px solid ${ORANGE}`,
    }}>
      <span style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.7, marginRight: 16 }}>Jump to:</span>
      <a href="#about-a" style={linkStyle}>About A</a>
      <a href="#about-b" style={linkStyle}>About B</a>
      <span style={{ fontSize: 12, opacity: 0.4 }}>|</span>
      <a href="#credits-a" style={linkStyle}>Credits A</a>
      <a href="#credits-b" style={linkStyle}>Credits B</a>
      <span style={{ fontSize: 12, opacity: 0.4 }}>|</span>
      <a href="#take-a" style={linkStyle}>Takeaways A</a>
      <a href="#take-b" style={linkStyle}>Takeaways B</a>
      <span style={{ fontSize: 12, opacity: 0.4 }}>|</span>
      <a href="#t5-donut" style={linkStyle}>T5 Donut</a>
      <a href="#t5-waffle" style={linkStyle}>T5 Waffle</a>
      <a href="#t5-spectrum" style={linkStyle}>T5 Spectrum</a>
      <span style={{ fontSize: 12, opacity: 0.4 }}>|</span>
      <a href="#data-a" style={linkStyle}>Data A</a>
      <a href="#data-b" style={linkStyle}>Data B</a>
      <a href="#data-c" style={linkStyle}>Data C</a>
      <span style={{ fontSize: 12, opacity: 0.4 }}>|</span>
      <a href="#head-a" style={linkStyle}>Headshot A</a>
      <a href="#head-b" style={linkStyle}>Headshot B</a>
      <span style={{ fontSize: 12, opacity: 0.4 }}>|</span>
      <a href="#title-a" style={linkStyle}>Title A</a>
      <a href="#title-b" style={linkStyle}>Title B</a>
      <span style={{ fontSize: 12, opacity: 0.4 }}>|</span>
      <a href="#opt1" style={linkStyle}>Inside 1</a>
      <a href="#opt2" style={linkStyle}>Inside 2</a>
      <a href="#opt3" style={linkStyle}>Inside 3</a>
    </div>
  )
}

function PageHeader() {
  return (
    <div style={{ padding: '40px 24px', background: ORANGE, color: 'white' }}>
      <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.85 }}>Local Mockup Page</p>
      <h1 style={{ fontSize: 36, fontWeight: 700, marginTop: 8, lineHeight: 1.1 }}>
        Lovie &ldquo;Inside The Report&rdquo; — three options
      </h1>
      <p style={{ marginTop: 12, fontSize: 15, maxWidth: 720, lineHeight: 1.5 }}>
        Each option uses the country stickers + dotted curve as the cover-art device, but
        treats the five trend titles differently. Scroll through, compare, and tell me which
        one to wire into the real section.
      </p>
    </div>
  )
}

function OptionLabel({ n, title, description }: { n: number; title: string; description: string }) {
  return (
    <div style={{ padding: '28px 40px', background: BLACK, color: LIME }}>
      <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: ORANGE }}>Option {n}</p>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginTop: 6, lineHeight: 1.2 }}>{title}</h2>
      <p style={{ marginTop: 6, opacity: 0.75, fontSize: 14, maxWidth: 720 }}>{description}</p>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 24, background: BLACK }} />
}

function Footer() {
  return (
    <div style={{ padding: '40px 24px', background: BLACK, color: LIME, textAlign: 'center' }}>
      <p style={{ fontSize: 14 }}>Pick a number (1, 2, or 3) and I&rsquo;ll wire the chosen design into the real KeyFindings.tsx.</p>
    </div>
  )
}

/* =========================================================================
 * Option 1 — Hero band on top, editorial numbered list below
 * ======================================================================= */
function Option1() {
  return (
    <div style={{ background: LIME }}>
      <OptionLabel
        n={1}
        title="Hero on top, editorial list below"
        description="The country stickers + dotted curve sit as a focused banner. Below it, the five trends are a clean editorial numbered list with big Scto type. Each row is a click target."
      />

      {/* Hero banner — stickers + curve. Curve is shortened (path stays
          between x=240 and x=760) so the Portugal sticker on the left has
          room to breathe instead of getting overlapped. */}
      <div style={{ position: 'relative', height: 380, marginTop: 16 }}>
        <svg
          viewBox="0 0 1000 380" preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          aria-hidden="true"
        >
          <path
            d="M 100 230 Q 360 100 500 210 Q 640 320 900 230"
            fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 14"
          />
        </svg>
        <CountryPortugal aria-hidden="true" style={{ position: 'absolute', top: '40%', left: '2%', width: 220, height: 'auto', transform: 'rotate(-6deg)' }} />
        <CountryItaly aria-hidden="true" style={{ position: 'absolute', top: '15%', left: '50%', width: 240, height: 'auto', transform: 'translateX(-50%)' }} />
        <CountrySpain aria-hidden="true" style={{ position: 'absolute', top: '40%', right: '2%', width: 220, height: 'auto', transform: 'rotate(6deg)' }} />
      </div>

      {/* Editorial trend list */}
      <div style={{ maxWidth: 1100, margin: '60px auto 0', padding: '0 40px 100px' }}>
        <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: ORANGE, marginBottom: 12 }}>Inside The Report</p>
        <h3 style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1, marginBottom: 40, maxWidth: 800 }}>
          Five Trends Shaping the Mediterranean
        </h3>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {TRENDS.map((t) => (
            <li
              key={t.number}
              style={{
                display: 'flex', alignItems: 'baseline', gap: 32, padding: '24px 0',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 700, color: ORANGE, minWidth: 50 }}>{t.number}</span>
              <span style={{ fontSize: 26, fontWeight: 500, lineHeight: 1.2 }}>{t.title}</span>
              <span style={{ marginLeft: 'auto', fontSize: 20, color: ORANGE }}>→</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* =========================================================================
 * Option 2 — Cards on the map: stickers + curve behind, 2-2-1 card grid
 * ======================================================================= */
function Option2() {
  return (
    <div style={{ background: LIME }}>
      <OptionLabel
        n={2}
        title="Cards on the map"
        description="Stickers + curve sit as a softened background spanning the whole section. The five trend cards float on top in a 2-2-1 grid (two on top, two middle, one centered at the bottom)."
      />

      <div style={{ position: 'relative', padding: '60px 40px 100px', overflow: 'hidden' }}>
        {/* Soft background graphic */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }} aria-hidden="true">
          <svg viewBox="0 0 1000 800" preserveAspectRatio="none" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
            <path
              d="M 40 600 Q 280 100 500 360 Q 740 620 960 320"
              fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 14"
            />
          </svg>
          <img src="/lovie/country-portugal.svg" alt="" style={{ position: 'absolute', top: '65%', left: '-3%', width: 200 }} />
          <img src="/lovie/country-italy.svg" alt="" style={{ position: 'absolute', top: '6%', left: '50%', width: 200, transform: 'translateX(-50%)' }} />
          <img src="/lovie/country-spain.svg" alt="" style={{ position: 'absolute', top: '32%', right: '-3%', width: 200 }} />
        </div>

        {/* Foreground content */}
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: ORANGE, marginBottom: 12 }}>Inside The Report</p>
          <h3 style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1, marginBottom: 40, maxWidth: 800 }}>
            Five trends shaping digital creativity in the Mediterranean
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 720, margin: '0 auto' }}>
            {TRENDS.map((t, i) => (
              <div
                key={t.number}
                style={{
                  background: CREAM,
                  padding: 24,
                  borderRadius: 10,
                  minHeight: 180,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gridColumn: i === 4 ? '1 / 3' : undefined,
                  maxWidth: i === 4 ? 350 : undefined,
                  margin: i === 4 ? '0 auto' : undefined,
                  width: i === 4 ? '100%' : undefined,
                }}
              >
                <div style={{ fontSize: 36, fontWeight: 700, color: ORANGE }}>{t.number}</div>
                <h4 style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.3 }}>{t.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
 * Option 3 — Trends along the path: vertical winding curve with markers
 * ======================================================================= */
function Option3() {
  // Each trend's anchor point along the path (top is a % of section height,
  // left is a % of section width). Tuned to roughly track the SVG path below.
  const positions = [
    { left: '15%', top: '8%' },
    { left: '55%', top: '23%' },
    { left: '12%', top: '42%' },
    { left: '58%', top: '63%' },
    { left: '18%', top: '85%' },
  ]

  return (
    <div style={{ background: LIME }}>
      <OptionLabel
        n={3}
        title="Trends along the path"
        description="The dotted curve is the spine: five trends sit at points along it like mile-markers. Country stickers anchor the start and end. Most distinctive, most ambitious."
      />

      <div style={{ maxWidth: 1100, margin: '40px auto 0', padding: '0 40px' }}>
        <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: ORANGE, marginBottom: 12 }}>Inside The Report</p>
        <h3 style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1, marginBottom: 40, maxWidth: 800 }}>
          Five trends shaping digital creativity in the Mediterranean
        </h3>
      </div>

      <div style={{ position: 'relative', height: 900, maxWidth: 1000, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Winding S-curve dotted path */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          aria-hidden="true"
        >
          <path
            d="M 20 8 Q 90 18 30 28 Q 0 50 75 60 Q 95 75 25 88"
            fill="none" stroke="#000" strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeDasharray="2 8"
          />
        </svg>

        {/* Country stickers as start/middle/end anchors */}
        <img src="/lovie/country-italy.svg" alt="" style={{ position: 'absolute', top: '0%', right: '6%', width: 110, transform: 'rotate(-8deg)' }} />
        <img src="/lovie/country-portugal.svg" alt="" style={{ position: 'absolute', top: '45%', left: '0%', width: 110, transform: 'rotate(-4deg)' }} />
        <img src="/lovie/country-spain.svg" alt="" style={{ position: 'absolute', bottom: '2%', right: '8%', width: 110, transform: 'rotate(6deg)' }} />

        {/* Trend markers + titles */}
        {TRENDS.map((t, i) => (
          <div
            key={t.number}
            style={{
              position: 'absolute',
              top: positions[i].top,
              left: positions[i].left,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              cursor: 'pointer',
              maxWidth: '42%',
            }}
          >
            <div style={{
              width: 44, height: 44,
              background: ORANGE,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: 'white',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              {t.number}
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.25, background: LIME, padding: '2px 0' }}>
              {t.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* =========================================================================
 * CREDITS — 2 fresh layouts that feel more Lovie than Anthem.
 * Both lean into the actual lovieawards.com visual language: light
 * backgrounds, asymmetric layouts, generous whitespace, editorial
 * typography with selective brand accents.
 * ======================================================================= */

const CREDITS_CREATED_BY = [
  { name: 'Selin Clayton', title: 'Research Lead & Strategist' },
  { name: 'Jordana Jarrett', title: 'Head of Brand Strategy' },
  { name: 'Jesse Feister', title: 'Executive Director' },
  { name: 'Nick Farnhill', title: 'Founder of FOOD' },
  { name: 'Nick Shizeng Ni', title: 'Lead Designer' },
  { name: 'Nidha Kattil Veetil', title: 'Marketing Director' },
]

const CREDITS_CONTRIBUTORS = [
  { name: 'Christine McGinnis', title: 'Director of Design, Wave Design Consultants' },
  { name: 'Enrique Dans', title: 'Professor of Innovation, IE UNIVERSITY' },
  { name: 'Fabrizio Piccolini', title: 'Executive Creative Director, Mirror' },
  { name: 'Giacomo Scandolara', title: 'CEO, Giga Design Studio Srl' },
  { name: 'Miguel Priera', title: 'Senior Visual & Interaction Designer, Hanzo' },
  { name: 'Pepe Garcia', title: 'Executive Creative Director, Now Independent (exMcCann, exFCB, exGrey, exJellyfish)' },
  { name: 'Stefanie Palomino', title: 'Vice President Product, Marketing and Innovation, Middelhoffconsulting S.L.' },
]

// Option A — "Cream Asymmetric Editorial"
// No hard dark break. Continues the beige body of the report. Asymmetric
// magazine-style grid: section label sits as a big display heading in
// the left rail, names stack cleanly on the right. Single orange
// hairline under each label. Most restrained / most "Lovie site" feel.
function CreditsOptionA() {
  return (
    <div>
      <OptionLabel
        n={1}
        title="Credits Option A — Cream Asymmetric Editorial"
        description="Light cream background continues from the body. Asymmetric magazine layout: section label as a display heading on the left, names listed on the right. Thin orange hairlines mark each section. Restraint > drama. Closest to lovieawards.com."
      />
      <div style={{ background: CREAM, padding: '96px 40px 120px', fontFamily: "'Scto Grotesk A', -apple-system, sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Top wordmark — left aligned, big. No center treatment. */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 80, gap: 24 }}>
            <h2 style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 700, color: BLACK, lineHeight: 1, letterSpacing: '-0.02em', margin: 0 }}>
              Credits
            </h2>
            <img src="/lovie/no-1-heart.svg" alt="" aria-hidden style={{ width: 80, height: 'auto', marginTop: 8 }} />
          </div>

          {/* Two sections — same grid pattern, different content */}
          <CreditsSectionA label="Created By" people={CREDITS_CREATED_BY} />
          <div style={{ height: 64 }} />
          <CreditsSectionA label="Contributors" people={CREDITS_CONTRIBUTORS} />
        </div>
      </div>
    </div>
  )
}

function CreditsSectionA({ label, people }: { label: string; people: { name: string; title: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 56, alignItems: 'start' }}>
      {/* Left rail — display-sized section label */}
      <div>
        <div style={{ height: 2, background: ORANGE, width: 48, marginBottom: 24 }} />
        <h3 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: BLACK, lineHeight: 1.05, letterSpacing: '-0.01em', margin: 0 }}>
          {label}
        </h3>
      </div>

      {/* Right — clean stacked list */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {people.map((p) => (
          <li key={p.name}>
            <p style={{ fontSize: 18, fontWeight: 500, color: BLACK, lineHeight: 1.3, margin: 0 }}>{p.name}</p>
            <p style={{ fontSize: 14, color: BLACK, opacity: 0.55, lineHeight: 1.5, margin: '4px 0 0' }}>{p.title}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Option B — "Lime Brand Moment"
// Lime ground floods the section as a closing brand statement,
// bookending the hero. Black text throughout for max contrast. Centered
// composition but with editorial typography weight. A single black
// heart sticker tops the section. Bolder than Option A but still light
// and restrained — no decorative clutter.
function CreditsOptionB() {
  return (
    <div>
      <OptionLabel
        n={2}
        title="Credits Option B — Lime Brand Moment"
        description="Lime ground bookends the hero. Black text throughout. Centered composition with editorial weight. Bolder than Option A but still light — no decorative clutter. Functions as a closing brand statement."
      />
      <div style={{ background: LIME, padding: '96px 40px 120px', fontFamily: "'Scto Grotesk A', -apple-system, sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          {/* Heart wordmark + Credits title */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 72 }}>
            <img src="/lovie/no-1-heart.svg" alt="" aria-hidden style={{ width: 64, height: 'auto', marginBottom: 24 }} />
            <h2 style={{ fontSize: 'clamp(56px, 9vw, 112px)', fontWeight: 700, color: BLACK, lineHeight: 1, letterSpacing: '-0.02em', margin: 0 }}>
              Credits
            </h2>
          </div>

          {/* Created By — 2-col grid */}
          <CreditsSectionB label="Created By" people={CREDITS_CREATED_BY} columns={2} />
          <div style={{ height: 72 }} />

          {/* Contributors — 3-col grid */}
          <CreditsSectionB label="Contributors" people={CREDITS_CONTRIBUTORS} columns={3} />
        </div>
      </div>
    </div>
  )
}

function CreditsSectionB({ label, people, columns }: { label: string; people: { name: string; title: string }[]; columns: 2 | 3 }) {
  return (
    <div>
      {/* Label — small caps eyebrow with a black hairline rule across the full width */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ flex: 1, height: 1, background: BLACK, opacity: 0.4 }} />
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', color: BLACK, margin: 0 }}>
          {label}
        </p>
        <div style={{ flex: 1, height: 1, background: BLACK, opacity: 0.4 }} />
      </div>

      {/* Grid of names */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '32px 40px',
          textAlign: 'left',
        }}
      >
        {people.map((p) => (
          <li key={p.name}>
            <p style={{ fontSize: 16, fontWeight: 700, color: BLACK, lineHeight: 1.25, margin: 0 }}>{p.name}</p>
            <p style={{ fontSize: 13, color: BLACK, opacity: 0.65, lineHeight: 1.45, margin: '4px 0 0' }}>{p.title}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* =========================================================================
 * ABOUT THE LOVIE AWARDS — 2 mockups on the purple report background.
 * Both share the same copy. Option A is a centered editorial statement.
 * Option B mimics the 2024 Lovie report scrapbook collage with
 * browser-window-style cards and hand-drawn squiggles.
 * ======================================================================= */

const ABOUT_HEADLINE = 'Enter Your Work Before the Final Entry Deadline on 26 June 2026'
const ABOUT_BODY = [
  "The Lovie Awards is the Webby Awards' benchmark for European digital excellence, recognising the people, projects, and ideas shaping Europe's contributions to the internet.",
  'Launched in 2010, The Lovie Award is presented by the European arm of the International Academy of Digital Arts and Sciences (IADAS)—a 3,000+ membership body which also judges The Webby Awards. The Academy is comprised of leading Internet experts, business figures, luminaries, visionaries, artists, and talented entertainers and creators. Work is judged in seven native languages, including Spanish, Italian, Dutch, French, German, Swedish, and English.',
]
const ABOUT_CTA_URL = 'https://www.lovieawards.com/'

// Option A — Centered Editorial Statement on Purple.
// Purple report background as the stage. Single-column centered layout.
// White body text, lime accents on eyebrow + CTA. Restrained.
function AboutOptionA() {
  return (
    <div>
      <OptionLabel
        n={1}
        title="About Option A — Centered Editorial Statement"
        description="Purple report background as the stage. Centered single-column layout, white body text, lime accents on eyebrow + CTA. Restrained, big editorial typography. Functions as a closing brand statement."
      />
      <div
        style={{
          backgroundImage: 'url(/lovie/about-bg-purple.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '120px 24px 140px',
          fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
          color: '#ffffff',
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 500, color: LIME, margin: '0 0 24px' }}>
            About The Lovie Awards
          </p>
          <h2 style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.01em', color: '#ffffff', margin: '0 0 40px' }}>
            {ABOUT_HEADLINE}
          </h2>
          <div style={{ width: 48, height: 2, background: LIME, margin: '0 auto 32px' }} />
          {ABOUT_BODY.map((p, i) => (
            <p key={i} style={{ fontSize: 16, lineHeight: 1.7, color: '#ffffff', margin: '0 0 20px', opacity: 0.92 }}>
              {p}
            </p>
          ))}
          <a
            href={ABOUT_CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 32,
              background: LIME,
              color: BLACK,
              padding: '14px 28px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Enter Your Work
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}

// Option B — Scrapbook Collage. Mimics the 2024 Lovie report:
// browser-window-style cards on the purple ground, hand-drawn squiggles
// in lime/orange between them. Playful, layered, magazine-spread feel.
function AboutOptionB() {
  return (
    <div>
      <OptionLabel
        n={2}
        title="About Option B — Scrapbook Collage"
        description="Purple report background. Browser-window-style cards (mimicking the 2024 Lovie report) hold the about copy and CTA separately. Hand-drawn squiggles in lime/orange weave between them. Playful, layered, magazine-spread feel."
      />
      <div
        style={{
          backgroundImage: 'url(/lovie/about-bg-purple.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '96px 24px 140px',
          fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
          position: 'relative',
          minHeight: 720,
        }}
      >
        {/* Decorative hand-drawn squiggles */}
        <svg aria-hidden style={{ position: 'absolute', top: 60, left: '46%', width: 80, height: 60, pointerEvents: 'none' }} viewBox="0 0 80 60">
          <path d="M 5 30 Q 20 5 35 30 Q 50 55 65 30 Q 75 18 78 24" stroke={LIME} strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
        <svg aria-hidden style={{ position: 'absolute', bottom: 100, right: '8%', width: 70, height: 100, pointerEvents: 'none' }} viewBox="0 0 70 100">
          <path d="M 10 10 Q 30 30 20 60 Q 10 85 35 95" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 35 95 L 28 85 M 35 95 L 45 92" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          {/* Main about card — browser-window style */}
          <BrowserWindowCard offset={{ top: 0, left: 0 }} width={620} accent={ORANGE}>
            <p style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontWeight: 500, color: ORANGE, margin: '0 0 16px' }}>
              About The Lovie Awards
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.1, color: BLACK, margin: '0 0 24px', letterSpacing: '-0.01em' }}>
              The benchmark for European digital excellence
            </h2>
            {ABOUT_BODY.map((p, i) => (
              <p key={i} style={{ fontSize: 14, lineHeight: 1.6, color: BLACK, margin: '0 0 16px' }}>
                {p}
              </p>
            ))}
          </BrowserWindowCard>

          {/* Smaller CTA card — offset to the right */}
          <BrowserWindowCard offset={{ top: 420, left: 480 }} width={420} accent={LIME}>
            <p style={{ fontSize: 18, fontWeight: 700, color: BLACK, lineHeight: 1.35, margin: '0 0 8px' }}>
              {ABOUT_HEADLINE}
            </p>
            <div style={{ marginTop: 20 }}>
              <a
                href={ABOUT_CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: ORANGE,
                  color: '#ffffff',
                  padding: '12px 22px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                Enter Your Work
                <span aria-hidden>→</span>
              </a>
            </div>
          </BrowserWindowCard>

          {/* Spacer so the absolutely-positioned cards have room */}
          <div style={{ height: 620 }} />
        </div>
      </div>
    </div>
  )
}

function BrowserWindowCard({
  children,
  offset,
  width,
  accent,
}: {
  children: React.ReactNode
  offset: { top: number; left: number }
  width: number
  accent: string
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: offset.top,
        left: offset.left,
        width,
        maxWidth: 'calc(100% - 32px)',
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 24px 60px -20px rgba(0,0,0,0.35)',
        overflow: 'hidden',
      }}
    >
      {/* Window title bar — accent stripe with 3 traffic lights */}
      <div style={{ background: accent, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: BLACK, opacity: 0.85 }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffffff', opacity: 0.85 }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: BLACK, opacity: 0.4 }} />
      </div>
      <div style={{ padding: '32px 32px 36px' }}>{children}</div>
    </div>
  )
}
