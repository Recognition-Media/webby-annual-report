'use client'

// Local mockup page for picking the hero treatment for the
// "Shared Influence" Anthem report. Not linked from anywhere — visit
// /shared-influence-mockups directly.

const ANTHEM_PURPLE = '#D17DD0'
const CREAM = '#E3DDCA'
const MOSS = '#21261A'
const RED = '#8C001C'

export default function SharedInfluenceMockups() {
  return (
    <main style={{ background: '#111', minHeight: '100vh', color: CREAM }}>
      <TopBar />
      <section id="hero-text"><HeroWithText /></section>
      <Divider />
      <section id="hero-blue"><HeroWithSticker color="blue" /></section>
      <Divider />
      <section id="hero-pink"><HeroWithSticker color="pink" /></section>
    </main>
  )
}

function TopBar() {
  const link: React.CSSProperties = {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#fff',
    textDecoration: 'none',
    padding: '6px 14px',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 999,
  }
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: MOSS,
      padding: '14px 24px',
      display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center',
      borderBottom: `2px solid ${ANTHEM_PURPLE}`,
    }}>
      <span style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.7, marginRight: 16 }}>Compare title:</span>
      <a href="#hero-text" style={link}>Text</a>
      <a href="#hero-blue" style={link}>Blue sticker</a>
      <a href="#hero-pink" style={link}>Pink sticker</a>
    </div>
  )
}

function Divider() {
  return (
    <div style={{
      padding: '48px 24px', textAlign: 'center',
      background: '#111', color: 'rgba(255,255,255,0.5)',
      fontSize: 12, letterSpacing: 3, textTransform: 'uppercase',
    }}>
      — vs —
    </div>
  )
}

function OptionLabel({ n, title, description }: { n: number; title: string; description: string }) {
  return (
    <div style={{
      padding: '20px 32px',
      background: MOSS,
      borderBottom: `2px solid ${ANTHEM_PURPLE}`,
      color: CREAM,
    }}>
      <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: ANTHEM_PURPLE, margin: '0 0 4px' }}>
        Option {n}
      </p>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>{title}</h2>
      <p style={{ fontSize: 13, opacity: 0.7, margin: 0, maxWidth: 720 }}>{description}</p>
    </div>
  )
}

// PNG background with the title rendered as a text headline.
function HeroWithText() {
  return (
    <div>
      <OptionLabel
        n={1}
        title="Text title"
        description="Standard headline — 'Shared Influence' set in the display typeface over the purple artwork. Most versatile if the title copy ever changes; matches the current State of Social Impact hero's typography rhythm."
      />
      <HeroFrame>
        <HeroTitle />
        <HeroSubtitle />
        <HeroCta />
      </HeroFrame>
    </div>
  )
}

// PNG background with the illustrated title sticker (blue or pink) as
// the hero mark. Skips the text headline entirely — the sticker IS
// the title.
function HeroWithSticker({ color }: { color: 'blue' | 'pink' }) {
  const n = color === 'blue' ? 2 : 3
  const title = color === 'blue' ? 'Blue sticker' : 'Pink sticker'
  const description = color === 'blue'
    ? 'The illustrated sticker as the hero mark — reads as a designed object rather than typeset copy. Blue ties into Anthem Blue (#066DBA) which shows up in the section covers.'
    : 'The illustrated sticker in pink — closer in feel to the purple background, so the sticker and ground harmonise. Softer, warmer read than the blue.'

  return (
    <div>
      <OptionLabel
        n={n}
        title={title}
        description={description}
      />
      <HeroFrame>
        <img
          src={`/anthem/shared-influence-sticker-${color}.svg`}
          alt="Shared Influence"
          style={{
            width: 'clamp(320px, 55vw, 720px)',
            height: 'auto',
            marginBottom: 32,
          }}
        />
        <HeroSubtitle />
        <HeroCta />
      </HeroFrame>
    </div>
  )
}

// Shared PNG-background frame — cover-scaled artwork, top-right nav,
// and bottom-anchored content column.
function HeroFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'relative',
      height: '90vh',
      minHeight: 700,
      overflow: 'hidden',
      backgroundImage: 'url(/anthem/shared-influence-hero-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
    }}>
      <TopRightNav />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end',
        textAlign: 'center', padding: '0 32px 12vh',
      }}>
        {children}
      </div>
    </div>
  )
}

// ---- Shared hero elements ----

function TopRightNav() {
  return (
    <div style={{
      position: 'absolute', top: 20, right: 24, zIndex: 20,
      display: 'flex', gap: 12, alignItems: 'center',
    }}>
      <a
        href="https://www.anthemawards.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500,
          background: RED, color: CREAM,
          padding: '10px 20px', borderRadius: 999, textDecoration: 'none',
        }}
      >
        Enter Now
      </a>
      <button
        type="button"
        aria-label="Open menu"
        style={{
          width: 44, height: 44, borderRadius: '50%',
          border: `1.5px solid ${RED}`,
          background: 'transparent',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 4, cursor: 'pointer',
        }}
      >
        <span style={{ width: 18, height: 1.5, background: MOSS, borderRadius: 1 }} />
        <span style={{ width: 18, height: 1.5, background: MOSS, borderRadius: 1 }} />
        <span style={{ width: 18, height: 1.5, background: MOSS, borderRadius: 1 }} />
      </button>
    </div>
  )
}

function HeroTitle() {
  return (
    <h1 style={{
      // Roc Grotesk Variable at 125px desktop; scales down on narrower
      // viewports so it doesn't overflow on tablet/mobile. Anthem Cream
      // reads against the purple ground.
      fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
      fontSize: 'clamp(3rem, 9.5vw, 125px)',
      fontWeight: 500,
      color: CREAM,
      textTransform: 'uppercase',
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
      margin: '0 0 24px',
      maxWidth: 1200,
    }}>
      Shared Influence
    </h1>
  )
}

function HeroSubtitle() {
  return (
    <p style={{
      // Decoy — Adobe display serif — for the tagline. Roman (upright),
      // bold. 55px desktop; scales down on narrower viewports so the
      // long copy doesn't shatter into awkward line breaks on mobile.
      fontFamily: "'decoy', Georgia, serif",
      // 37px — aligns visually with the title's width without
      // overshooting; scales down on narrower viewports so it stays on
      // a single line at typical desktop and mobile widths.
      fontSize: 'clamp(1.125rem, 2.8vw, 37px)',
      fontWeight: 700,
      color: '#21261A',
      maxWidth: 1200,
      lineHeight: 1.2,
      margin: '0 0 40px',
      whiteSpace: 'nowrap',
    }}>
      A playbook for creator partnerships that drive social impact
    </p>
  )
}

function HeroCta() {
  return (
    <button
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        background: RED, color: CREAM,
        padding: '18px 44px', borderRadius: 999,
        fontSize: 14, fontWeight: 500,
        letterSpacing: 2, textTransform: 'uppercase',
        border: 'none', cursor: 'pointer',
      }}
    >
      Explore The Report
      <span>↓</span>
    </button>
  )
}
