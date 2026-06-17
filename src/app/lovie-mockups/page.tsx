'use client'

import { useEffect } from 'react'
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
      <section id="opt1"><Option1 /></section>
      <Divider />
      <section id="opt2"><Option2 /></section>
      <Divider />
      <section id="opt3"><Option3 /></section>
      <Footer />
    </main>
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
      <a href="#opt1" style={linkStyle}>Option 1</a>
      <a href="#opt2" style={linkStyle}>Option 2</a>
      <a href="#opt3" style={linkStyle}>Option 3</a>
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
