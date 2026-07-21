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
      <Divider />
      <section id="opening-a"><OpeningOptionA /></section>
      <Divider />
      <section id="opening-b"><OpeningOptionB /></section>
      <Divider />
      <section id="sticker-a"><OpeningWithStickerA /></section>
      <Divider />
      <section id="sticker-b"><OpeningWithStickerB /></section>
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
      <span style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.7, marginRight: 16 }}>Hero:</span>
      <a href="#hero-text" style={link}>Text</a>
      <a href="#hero-blue" style={link}>Blue sticker</a>
      <a href="#hero-pink" style={link}>Pink sticker</a>
      <span style={{ fontSize: 12, opacity: 0.4 }}>|</span>
      <span style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.7 }}>Opening:</span>
      <a href="#opening-a" style={link}>Stacked</a>
      <a href="#opening-b" style={link}>Split column</a>
      <span style={{ fontSize: 12, opacity: 0.4 }}>|</span>
      <span style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.7 }}>Sticker:</span>
      <a href="#sticker-a" style={link}>Top-right</a>
      <a href="#sticker-b" style={link}>Above hook</a>
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

/* =========================================================================
 * OPENING HOOK + LETTER — 2 layouts for the section that follows the
 * hero. Both drop the author headshot and lead with a big editorial
 * hook statement (stateofaidesign.com pattern), then unfold the letter
 * body. Both sit on the beige body ground with moss text and Roc
 * Grotesk Variable for the display type.
 * ======================================================================= */

const OPENING_EYEBROW = 'A New Playbook'
const OPENING_HOOK =
  'The culture of philanthropy and influence has shifted. In 2026, creators integral to moving missions forward.'
const OPENING_BODY = [
  '2026 is challenging organizations to add creator partnerships to their strategies. There is one problem: many organizations are unsure of where to start, and are less sure of how to turn a one-off collaboration into a long-term partnership that drives action.',
  'If you are wondering the same, this report is for you. We have done the heavy lifting by gathering real advice from both sides of the partnership. We asked industry leaders — impact-focused creators, nonprofit leaders, and brand strategists at the forefront of this work — to learn what makes these partnerships work, and last.',
  'The result is a playbook: practical advice and tips on how creators and nonprofits find and vet collaborators, navigate creative control versus mission message, and make these efforts sustainable.',
]

// Option A — Stacked editorial.
// Full-width hook headline anchored to the top of the section, then the
// letter body copy centered in a narrow column below. Feels like the
// stateofaidesign hero: one big idea, then the argument.
function OpeningOptionA() {
  return (
    <div>
      <OptionLabel
        n={1}
        title="Stacked — hook up top, letter below"
        description="Full-width hook headline commands the section, letter body flows underneath in a narrow centered column. Reads like a magazine feature opener; the hook does the heavy lifting and the letter is quiet supporting copy."
      />
      <div style={{
        background: CREAM,
        color: MOSS,
        padding: '120px 40px',
        fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Eyebrow — small monospace-feel label like stateofaidesign */}
          <p style={{
            fontSize: 11,
            letterSpacing: 4,
            textTransform: 'uppercase',
            fontWeight: 500,
            color: ANTHEM_PURPLE,
            margin: '0 0 40px',
          }}>
            {OPENING_EYEBROW}
          </p>

          {/* Hook — big editorial. Max 60px on desktop; scales down on
              narrower viewports so it doesn't run into gutter padding. */}
          <h2 style={{
            fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
            fontSize: 'clamp(2rem, 4.5vw, 60px)',
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: MOSS,
            margin: '0 0 96px',
            maxWidth: 1200,
          }}>
            {OPENING_HOOK}
          </h2>

          {/* Letter body — narrow centered column */}
          <div style={{
            maxWidth: 720,
            marginLeft: 'auto',
            marginRight: 'auto',
            fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
          }}>
            <p style={{
              fontSize: 13,
              letterSpacing: 3,
              textTransform: 'uppercase',
              fontWeight: 500,
              color: RED,
              margin: '0 0 24px',
            }}>
              An Opening Letter
            </p>
            {OPENING_BODY.map((p, i) => (
              <p key={i} style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: MOSS,
                margin: '0 0 24px',
              }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Option B — Split column.
// Hook lives in the left rail as a big statement; the letter body sits
// in the right rail as a signed opening letter. Asymmetric, editorial,
// closer in feel to the stateofaidesign second reference — big idea
// paired with the argument, side by side, plenty of whitespace.
function OpeningOptionB() {
  return (
    <div>
      <OptionLabel
        n={2}
        title="Split column — hook left, letter right"
        description="Asymmetric two-column: hook headline holds the left rail, opening letter runs down the right. Feels like a magazine spread — reader sees the argument alongside the big idea, not below it. More sophisticated composition, slightly less immediate impact."
      />
      <div style={{
        background: CREAM,
        color: MOSS,
        padding: '120px 40px',
        fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: 96,
          alignItems: 'start',
        }}>
          {/* LEFT — Eyebrow + Hook */}
          <div>
            <p style={{
              fontSize: 11,
              letterSpacing: 4,
              textTransform: 'uppercase',
              fontWeight: 500,
              color: ANTHEM_PURPLE,
              margin: '0 0 32px',
            }}>
              {OPENING_EYEBROW}
            </p>
            <h2 style={{
              fontSize: 'clamp(2rem, 4.5vw, 72px)',
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: MOSS,
              margin: 0,
            }}>
              {OPENING_HOOK}
            </h2>
          </div>

          {/* RIGHT — Opening letter */}
          <div style={{ paddingTop: 8 }}>
            <p style={{
              fontSize: 12,
              letterSpacing: 3,
              textTransform: 'uppercase',
              fontWeight: 500,
              color: RED,
              margin: '0 0 20px',
            }}>
              An Opening Letter
            </p>
            {OPENING_BODY.map((p, i) => (
              <p key={i} style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: MOSS,
                margin: '0 0 20px',
              }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
 * OPENING + STICKER — 2 placements for the Shared Influence title
 * sticker within the stacked opening layout. Both keep the eyebrow +
 * hook + lede + body layout intact; only the sticker's position changes.
 * ======================================================================= */

const OPENING_LEDE_TEXT = '2026 is challenging organizations to add creator partnerships to their strategies.'
const OPENING_BODY_REST = [
  'There is one problem: many organizations are unsure of where to start, and are less sure of how to turn a one-off collaboration into a long-term partnership that drives action.',
  'If you are wondering the same, this report is for you. We have done the heavy lifting by gathering real advice from both sides of the partnership. We asked industry leaders — impact-focused creators, nonprofit leaders, and brand strategists at the forefront of this work — to learn what makes these partnerships work, and last.',
  'The result is a playbook: practical advice and tips on how creators and nonprofits find and vet collaborators, navigate creative control versus mission message, and make these efforts sustainable.',
]

function StickerOpeningFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: CREAM,
      color: MOSS,
      padding: '120px 40px',
      fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative' }}>
        {children}
      </div>
    </div>
  )
}

function OpeningInner() {
  return (
    <>
      <p style={{
        fontSize: 11,
        letterSpacing: 4,
        textTransform: 'uppercase',
        fontWeight: 500,
        color: ANTHEM_PURPLE,
        margin: '0 0 40px',
      }}>
        {OPENING_EYEBROW}
      </p>

      <h2 style={{
        fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
        fontSize: 'clamp(2rem, 4.2vw, 55px)',
        fontWeight: 500,
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        color: MOSS,
        margin: '0 0 96px',
        maxWidth: 1000,
      }}>
        {OPENING_HOOK}
      </h2>

      <div style={{
        maxWidth: 720,
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
      }}>
        <p style={{
          fontSize: 30,
          lineHeight: 1.3,
          fontWeight: 500,
          color: MOSS,
          margin: '0 0 32px',
        }}>
          {OPENING_LEDE_TEXT}
        </p>
        {OPENING_BODY_REST.map((p, i) => (
          <p key={i} style={{
            fontSize: 17,
            lineHeight: 1.7,
            color: MOSS,
            margin: '0 0 24px',
          }}>
            {p}
          </p>
        ))}
      </div>
    </>
  )
}

// Option A — Sticker floats top-right, opposite the eyebrow.
// The sticker acts like a masthead brand mark: readers immediately see
// what publication they're inside without duplicating "Shared Influence"
// as typeset copy. Editorial magazine feel; keeps the hook doing the
// storytelling.
function OpeningWithStickerA() {
  return (
    <div>
      <OptionLabel
        n={1}
        title="Sticker floats top-right, masthead style"
        description="Sticker hangs in the upper-right whitespace, opposite the 'A New Playbook' eyebrow. Reads like a magazine masthead — the sticker IS the title, so the hook stays clean and does the storytelling. Compact and unobtrusive."
      />
      <StickerOpeningFrame>
        <img
          src="/anthem/shared-influence-sticker-blue.png"
          alt="Shared Influence"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 'clamp(180px, 20vw, 280px)',
            height: 'auto',
            transform: 'rotate(-4deg)',
            zIndex: 2,
          }}
        />
        <OpeningInner />
      </StickerOpeningFrame>
    </div>
  )
}

// Option B — Sticker sits above the eyebrow, centered.
// Anchors the section with a bold brand statement before any copy. The
// sticker announces the report; eyebrow + hook + body flow below.
// Bigger visual moment; more direct "you've arrived at Shared Influence"
// energy — closer to a landing-page feel for email-gated entrants.
function OpeningWithStickerB() {
  return (
    <div>
      <OptionLabel
        n={2}
        title="Sticker centered above the hook — announcement"
        description="Sticker sits centered above the eyebrow like a landing-page banner. First thing readers see when they arrive at the section. Bigger moment; more direct 'welcome to Shared Influence' energy for gated-entry landing use."
      />
      <StickerOpeningFrame>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 64 }}>
          <img
            src="/anthem/shared-influence-sticker-blue.png"
            alt="Shared Influence"
            style={{
              width: 'clamp(240px, 28vw, 400px)',
              height: 'auto',
            }}
          />
        </div>
        <OpeningInner />
      </StickerOpeningFrame>
    </div>
  )
}
