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
      <Divider />
      <section id="inside-a"><InsideReportOptionA /></section>
      <Divider />
      <section id="inside-b"><InsideReportOptionB /></section>
      <Divider />
      <section id="compare-a"><InfluencerCreatorOptionA /></section>
      <Divider />
      <section id="compare-b"><InfluencerCreatorOptionB /></section>
      <Divider />
      <section id="compare-c"><InfluencerCreatorOptionC /></section>
      <Divider />
      <section id="audience-split"><AudienceSplitModule /></section>
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
      <span style={{ fontSize: 12, opacity: 0.4 }}>|</span>
      <span style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.7 }}>Inside:</span>
      <a href="#inside-a" style={link}>List rows</a>
      <a href="#inside-b" style={link}>Tight 3-col grid</a>
      <span style={{ fontSize: 12, opacity: 0.4 }}>|</span>
      <span style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.7 }}>Inf vs Cr:</span>
      <a href="#compare-a" style={link}>Split panel</a>
      <a href="#compare-b" style={link}>Table rows</a>
      <a href="#compare-c" style={link}>Display type</a>
      <span style={{ fontSize: 12, opacity: 0.4 }}>|</span>
      <a href="#audience-split" style={link}>Audience Split</a>
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

/* =========================================================================
 * INSIDE THE REPORT — 2 card treatments for the Shared Influence
 * report's 6-section table of contents. The existing Anthem 2×2 grid
 * feels clunky at 6 items; both options here shrink the chrome and
 * lean editorial (stateofaidesign.com direction).
 * ======================================================================= */

const INSIDE_SECTIONS = [
  { number: '01', title: 'The New Trusted Institutions', description: 'Public trust has shifted from institutions to individuals — creators are the new distribution.' },
  { number: '02', title: 'Finding the Right Partners', description: 'The most impactful partnerships start with mutual evaluation. Strong vetting is a shared responsibility.' },
  { number: '03', title: 'Making It Work', description: 'Give creators a brief, not a script. Trust them to deliver your organization’s message their way.' },
  { number: '04', title: 'Formats That Drive Impact', description: 'Formats that move people feel native to the creator and give audiences a reason to care.' },
  { number: '05', title: 'The Challenges with Creator Partnerships', description: 'Not every video will be a home run. Measure engagement, not views.' },
  { number: '06', title: 'Navigating the Value Exchange', description: 'The impact sector is inventing new models to reflect each relationship.' },
]

function InsideReportFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: CREAM,
      color: MOSS,
      padding: '96px 32px 120px',
      fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <img
            src="/anthem/justice-sticker.svg"
            alt=""
            style={{ width: 60, height: 60, transform: 'rotate(-8deg)' }}
            aria-hidden
          />
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4.5vw, 56px)',
            fontWeight: 400,
            lineHeight: 1.1,
            color: MOSS,
            margin: 0,
          }}>
            Inside The Report
          </h2>
        </div>
        <p style={{
          fontSize: 15,
          color: MOSS,
          opacity: 0.6,
          margin: '0 0 56px',
          maxWidth: 640,
        }}>
          A playbook for creator partnerships that drive social impact.
        </p>
        {children}
      </div>
    </div>
  )
}

// Option A — Editorial list rows.
// One row per section: two-digit number on the left, title dominant,
// short description below at low opacity. Thin hairline between rows.
// Compact and scannable at 6 items; closest to the stateofaidesign row
// treatment.
function InsideReportOptionA() {
  return (
    <div>
      <OptionLabel
        n={1}
        title="Editorial list rows"
        description="Full-width rows, one section per line. Small number, big title, subtle description underneath. Thin hairline between rows. Ultra-minimal chrome — the type does the work. All 6 items fit into a compact vertical block."
      />
      <InsideReportFrame>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {INSIDE_SECTIONS.map((section, i) => (
            <li
              key={section.number}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                columnGap: 24,
                alignItems: 'baseline',
                padding: '28px 0',
                borderTop: i === 0 ? '1px solid rgba(33,38,26,0.15)' : 'none',
                borderBottom: '1px solid rgba(33,38,26,0.15)',
                cursor: 'pointer',
              }}
            >
              <span style={{
                fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: 2,
                color: RED,
              }}>
                {section.number}
              </span>
              <div>
                <p style={{
                  fontSize: 22,
                  fontWeight: 500,
                  lineHeight: 1.25,
                  color: MOSS,
                  margin: '0 0 6px',
                }}>
                  {section.title}
                </p>
                <p style={{
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: MOSS,
                  opacity: 0.55,
                  margin: 0,
                }}>
                  {section.description}
                </p>
              </div>
              <span style={{ fontSize: 20, color: MOSS, opacity: 0.4 }}>&rarr;</span>
            </li>
          ))}
        </ol>
      </InsideReportFrame>
    </div>
  )
}

// Option B — Tight 3-column grid.
// Same card idea as the current Anthem treatment but shrunk down: 3
// cols × 2 rows fits all 6 items comfortably; each card is small enough
// to scan quickly. Numbers become secondary; titles lead.
function InsideReportOptionB() {
  return (
    <div>
      <OptionLabel
        n={2}
        title="Tight 3-column grid"
        description="6 items in a 3×2 grid of compact cards. Number tucks in the top corner, title dominates, short description below. Keeps the visual card language of the existing Anthem treatment but scales it down for scannability."
      />
      <InsideReportFrame>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {INSIDE_SECTIONS.map((section) => (
            <div
              key={section.number}
              style={{
                background: '#d5cfbc',
                borderRadius: 10,
                padding: '20px 22px 24px',
                cursor: 'pointer',
                transition: 'background-color 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 26,
                fontWeight: 700,
                color: RED,
                lineHeight: 1,
              }}>
                {section.number}
              </span>
              <p style={{
                fontSize: 15,
                fontWeight: 500,
                lineHeight: 1.3,
                color: MOSS,
                margin: 0,
              }}>
                {section.title}
              </p>
              <p style={{
                fontSize: 12,
                lineHeight: 1.5,
                color: MOSS,
                opacity: 0.6,
                margin: 0,
              }}>
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </InsideReportFrame>
    </div>
  )
}

/* =========================================================================
 * INFLUENCER vs CREATOR — 3 alternative treatments of the Section 1
 * data callout. Each renders in a 50%-column-width simulator so the
 * mockup matches what the module will look like when it sits inside a
 * TwoColumnSlab on the live report.
 * ======================================================================= */

const COMPARE_LEFT = {
  label: 'Influencer',
  word: 'Sells.',
  description: 'Someone who sells you something, from a promotion to a paid placement.',
}
const COMPARE_RIGHT = {
  label: 'Creator',
  word: 'Collaborates.',
  description: 'Someone you collaborate with, through storytelling or building something together.',
}

// Wrapper that simulates the module sitting inside a 50% column slot.
function CompareFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: CREAM,
      color: MOSS,
      padding: '80px 40px',
      fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Simulated 2-col slab — left rail is placeholder body copy,
            right rail hosts the comparison module we're evaluating. */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          <div style={{ opacity: 0.35 }}>
            <p style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px', color: MOSS }}>
              One in five Americans now regularly gets their news from TikTok
            </p>
            <div style={{ width: 36, height: 2, background: RED, marginBottom: 20 }} />
            <p style={{ fontSize: 15, lineHeight: 1.6, color: MOSS, margin: 0 }}>
              [Body copy from the section lives here — this is a placeholder so the module on the right shows at real half-width proportions.]
            </p>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}

// Option A — Split colour panel.
// One rounded card, split down the middle by a hairline. Left half in
// Anthem red (Influencer, cream text). Right half in cream (Creator,
// moss text). Feels like a debate/vs treatment — high contrast, big
// visual moment. Cards no longer read as separate "kinds" of thing;
// they read as opposing sides of the same argument.
function InfluencerCreatorOptionA() {
  return (
    <div>
      <OptionLabel
        n={1}
        title="Split colour panel — opposing sides"
        description="One rounded card split by a hairline; Influencer in Anthem red, Creator in cream. Reads like a debate — opposing sides of the same argument rather than two separate cards."
      />
      <CompareFrame>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderRadius: 14,
          overflow: 'hidden',
        }}>
          {/* Left — Influencer, red */}
          <div style={{
            background: RED,
            color: CREAM,
            padding: '28px 26px 32px',
          }}>
            <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 16px' }}>
              {COMPARE_LEFT.label}
            </p>
            <h3 style={{
              fontFamily: "'decoy', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 40,
              fontWeight: 700,
              lineHeight: 1,
              margin: '0 0 20px',
            }}>
              {COMPARE_LEFT.word}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, opacity: 0.9 }}>
              {COMPARE_LEFT.description}
            </p>
          </div>
          {/* Right — Creator, cream */}
          <div style={{
            background: CREAM,
            color: MOSS,
            padding: '28px 26px 32px',
            borderLeft: `1px solid rgba(33,38,26,0.1)`,
          }}>
            <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, margin: '0 0 16px', color: RED }}>
              {COMPARE_RIGHT.label}
            </p>
            <h3 style={{
              fontFamily: "'decoy', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 40,
              fontWeight: 700,
              lineHeight: 1,
              margin: '0 0 20px',
              color: MOSS,
            }}>
              {COMPARE_RIGHT.word}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, color: MOSS }}>
              {COMPARE_RIGHT.description}
            </p>
          </div>
        </div>
      </CompareFrame>
    </div>
  )
}

// Option B — Table rows.
// Traditional comparison table with two columns and multiple attribute
// rows. INFLUENCER | CREATOR header, then rows for "Role", "Method",
// "Relationship". Data-forward, scannable, feels like a spec sheet.
// The most information-dense option; least visual flourish.
function InfluencerCreatorOptionB() {
  const rows = [
    { attribute: 'Role', a: 'Sells', b: 'Collaborates' },
    { attribute: 'Method', a: 'Paid placement', b: 'Shared storytelling' },
    { attribute: 'Relationship', a: 'Transactional', b: 'Long-term' },
  ]
  return (
    <div>
      <OptionLabel
        n={2}
        title="Comparison table — data-forward"
        description="Traditional two-column table with attribute rows (Role, Method, Relationship). Most information-dense — feels like a spec sheet or comparison chart. Scannable but less editorial."
      />
      <CompareFrame>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
        }}>
          <thead>
            <tr>
              <th style={{ padding: '16px 0 12px', textAlign: 'left', width: '25%' }} />
              <th style={{
                padding: '16px 0 12px',
                fontSize: 11,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: RED,
                fontWeight: 700,
                textAlign: 'left',
                width: '37.5%',
              }}>
                {COMPARE_LEFT.label}
              </th>
              <th style={{
                padding: '16px 0 12px',
                fontSize: 11,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: RED,
                fontWeight: 700,
                textAlign: 'left',
                width: '37.5%',
              }}>
                {COMPARE_RIGHT.label}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${MOSS}22` }}>
                <td style={{ padding: '18px 0', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, color: MOSS, opacity: 0.6 }}>
                  {row.attribute}
                </td>
                <td style={{ padding: '18px 0', fontSize: 17, color: MOSS, fontWeight: 500 }}>
                  {row.a}
                </td>
                <td style={{ padding: '18px 0', fontSize: 17, color: MOSS, fontWeight: 500 }}>
                  {row.b}
                </td>
              </tr>
            ))}
            <tr style={{ borderTop: `1px solid ${MOSS}22` }}>
              <td style={{ padding: '18px 0', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, color: MOSS, opacity: 0.6 }}>
                In Short
              </td>
              <td style={{ padding: '18px 0 24px', fontSize: 14, lineHeight: 1.5, color: MOSS, opacity: 0.75 }}>
                {COMPARE_LEFT.description}
              </td>
              <td style={{ padding: '18px 0 24px', fontSize: 14, lineHeight: 1.5, color: MOSS, opacity: 0.75 }}>
                {COMPARE_RIGHT.description}
              </td>
            </tr>
          </tbody>
        </table>
      </CompareFrame>
    </div>
  )
}

// Option C — Big display type.
// No cards at all. Two huge Decoy italic words stacked with a hairline
// between; each word paired with a small caps label above and a short
// description below. Editorial-heavy, minimal chrome. The type does
// the entire visual job.
function InfluencerCreatorOptionC() {
  return (
    <div>
      <OptionLabel
        n={3}
        title="Display type stack — no cards"
        description="No card fills. Two big Decoy italic words stacked with a hairline in between. The typography carries the entire moment — closest to a magazine spread pull-quote."
      />
      <CompareFrame>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, color: RED, margin: '0 0 8px' }}>
              {COMPARE_LEFT.label}
            </p>
            <h3 style={{
              fontFamily: "'decoy', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 'clamp(3rem, 6vw, 80px)',
              fontWeight: 700,
              lineHeight: 1,
              color: MOSS,
              margin: '0 0 12px',
            }}>
              {COMPARE_LEFT.word}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: MOSS, opacity: 0.7, margin: 0, maxWidth: 420 }}>
              {COMPARE_LEFT.description}
            </p>
          </div>

          <div style={{ height: 1, background: `${MOSS}22`, margin: '8px 0' }} />

          <div>
            <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, color: RED, margin: '0 0 8px' }}>
              {COMPARE_RIGHT.label}
            </p>
            <h3 style={{
              fontFamily: "'decoy', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 'clamp(3rem, 6vw, 80px)',
              fontWeight: 700,
              lineHeight: 1,
              color: MOSS,
              margin: '0 0 12px',
            }}>
              {COMPARE_RIGHT.word}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: MOSS, opacity: 0.7, margin: 0, maxWidth: 420 }}>
              {COMPARE_RIGHT.description}
            </p>
          </div>
        </div>
      </CompareFrame>
    </div>
  )
}

/* =========================================================================
 * AUDIENCE SPLIT — Option 2 mockup for Section 2. A single card with the
 * "If You Are A Creator" content on the left and "If You Are An Impact
 * Leader" content on the right, each with body copy + an inline pull
 * quote. Rendered inside a simulated full-width slab so what you see
 * matches how it'd appear on the real report.
 * ======================================================================= */

function AudienceSplitModule() {
  return (
    <div>
      <OptionLabel
        n={4}
        title="Audience Split — dual-column card"
        description="Both audiences shown side-by-side in one card. Each half has small caps label, body paragraphs, and an inline pull quote. Beige splits (matching section) with a vertical hairline between. Compressed alternative to running two separate slabs."
      />
      <div style={{
        background: CREAM,
        color: MOSS,
        padding: '96px 40px',
        fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.15,
            color: MOSS,
            margin: '0 0 12px',
            maxWidth: 900,
          }}>
            Finding the right partner is less about audience size than alignment
          </h2>
          <div style={{ width: 36, height: 2, background: RED, marginBottom: 40 }} />
          <p style={{ fontSize: 17, lineHeight: 1.7, color: MOSS, margin: '0 0 56px', maxWidth: 780 }}>
            Creators want to protect the trust they&apos;ve built with their communities. Impact organizations should be as intentional and rigorous about who represents their mission.
          </p>

          {/* The split card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 0,
            border: `1px solid rgba(33,38,26,0.15)`,
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '40px 40px 44px' }}>
              <p style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, color: RED, margin: '0 0 20px' }}>
                If You Are A Creator
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: MOSS, margin: '0 0 18px' }}>
                Learn if an organization is transparent and effective in its community. Creators insist on nonprofits with available donor and financial data.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: MOSS, margin: '0 0 24px' }}>
                Use resources like <strong style={{ fontWeight: 700 }}>Guide Star</strong> to find Gold and Platinum-rated organizations, says <strong style={{ fontWeight: 700 }}>Mercury Stardust</strong>, a DIY home repair educator and creator partner on Point of Pride&apos;s Stream-a-Thon for Trans Health.
              </p>
              <blockquote style={{
                margin: 0,
                padding: '0 0 0 16px',
                borderLeft: `3px solid ${RED}`,
              }}>
                <p style={{ fontFamily: "'decoy', Georgia, serif", fontSize: 20, lineHeight: 1.35, color: MOSS, margin: '0 0 10px' }}>
                  Follow the money. Where does the money go?
                </p>
                <p style={{ fontSize: 13, color: MOSS, opacity: 0.65, margin: 0 }}>
                  — <strong style={{ fontWeight: 600 }}>Bryan Reisberg</strong>, Creator, Maxine the Corgi
                </p>
              </blockquote>
            </div>

            <div style={{
              padding: '40px 40px 44px',
              borderLeft: `1px solid rgba(33,38,26,0.15)`,
            }}>
              <p style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, color: RED, margin: '0 0 20px' }}>
                If You Are An Impact Leader
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: MOSS, margin: '0 0 18px' }}>
                Begin with values and voice. From there, understand how a creator shows up online for their community, what they have reposted, who their past partners are, and if they are open to long-term partnerships.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: MOSS, margin: '0 0 24px' }}>
                Every organization interviewed approaches this differently. Onyx Impact runs rigorous screenings; GLAAD invests in early conversations. PETA builds relationships proactively by offering support to creators who post animal content. Choose the approach that reflects your organization&apos;s goals.
              </p>
              <blockquote style={{
                margin: 0,
                padding: '0 0 0 16px',
                borderLeft: `3px solid ${RED}`,
              }}>
                <p style={{ fontFamily: "'decoy', Georgia, serif", fontSize: 20, lineHeight: 1.35, color: MOSS, margin: '0 0 10px' }}>
                  Every time we come across content that has a positive message for animals … we reach out, we offer support, and we start to build a relationship.
                </p>
                <p style={{ fontSize: 13, color: MOSS, opacity: 0.65, margin: 0 }}>
                  — <strong style={{ fontWeight: 600 }}>Ashley Frohnert</strong>, Sr. Director of Social Media & Influencer Marketing, PETA
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
