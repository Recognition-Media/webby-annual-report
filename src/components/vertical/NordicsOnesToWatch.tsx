'use client'

// "Nordic Creatives to Watch" — under-the-radar picks laid out in a
// responsive card grid. 2 columns on mobile (so studio names have
// room to breathe), 3 columns on desktop. Cards use the same
// editorial-spreadsheet treatment as before: soft neutral rules,
// warm cream tile background, Swedish blue accent on the number,
// arrow, and hover state.

const NORDIC_BLUE = '#016BA7'

type Pick = { name: string; role: string; url: string }

const PICKS: Pick[] = [
  { name: 'Try New Things', role: 'Creative tech studio', url: 'https://trynewthings.fail/' },
  { name: 'Lundgren+Lindqvist', role: 'Design and development studio', url: 'https://www.lundgrenlindqvist.se/' },
  { name: 'Ferdinando Verderi', role: 'Creative director', url: 'https://www.artpartner.com/ferdinando-verderi' },
  { name: 'Johan Pihl', role: 'Product designer and visual artist', url: 'https://johanpihl.se/' },
  { name: 'Interesting Times Gang', role: 'Independent design studio', url: 'https://itg.studio/' },
  { name: 'Bazooka', role: 'Digital agency', url: 'https://www.bazooka.se/' },
  { name: 'Bold Scandinavia', role: 'Consultancy and design agency', url: 'https://boldscandinavia.com/' },
  { name: 'Hello Monday', role: 'Creative studio', url: 'https://www.hellomonday.com/' },
  { name: 'Annika Backstrom', role: 'Art Director', url: 'https://www.annikabackstrom.se/' },
]

// Scoped CSS handles the responsive border rules — 2-col rules on
// mobile, 3-col rules on desktop. Cleaner than juggling className
// conditionals per card.
const BORDER_STYLES = `
  .otw-card {
    border-right: 1px solid rgba(0,0,0,0.12);
    border-bottom: 1px solid rgba(0,0,0,0.12);
  }
  @media (max-width: 767px) {
    .otw-card:nth-child(2n) { border-right: none; }
    .otw-card:last-child { border-right: none; border-bottom: none; }
  }
  @media (min-width: 768px) {
    .otw-card:nth-child(3n) { border-right: none; }
    .otw-card:nth-child(n+7) { border-bottom: none; }
  }
`

export function NordicsOnesToWatch() {
  return (
    <section
      id="ones-to-watch"
      className="pt-4 pb-16 md:pt-[60px] md:pb-[100px] px-5"
      style={{
        background: '#f2eeed',
        fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
      }}
    >
      <style>{BORDER_STYLES}</style>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div
          className="grid grid-cols-2 md:grid-cols-3"
          style={{
            border: '1px solid rgba(0,0,0,0.12)',
            background: 'rgba(255, 243, 209, 0.4)',
          }}
        >
          {PICKS.map((p, i) => (
            <a
              key={i}
              className="otw-card"
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '28px 20px 22px',
                color: '#000',
                textDecoration: 'none',
                minHeight: 130,
                position: 'relative',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFF3D1'
                const name = e.currentTarget.querySelector('[data-name]') as HTMLElement | null
                const arrow = e.currentTarget.querySelector('[data-arrow]') as HTMLElement | null
                if (name) name.style.textDecoration = 'underline'
                if (arrow) arrow.style.transform = 'translate(3px, -3px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                const name = e.currentTarget.querySelector('[data-name]') as HTMLElement | null
                const arrow = e.currentTarget.querySelector('[data-arrow]') as HTMLElement | null
                if (name) name.style.textDecoration = 'none'
                if (arrow) arrow.style.transform = 'translate(0, 0)'
              }}
            >
              <span style={{
                position: 'absolute',
                top: 12,
                left: 14,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                color: NORDIC_BLUE,
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                data-arrow
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 14,
                  fontSize: 16,
                  color: NORDIC_BLUE,
                  transition: 'transform 0.2s ease',
                  display: 'inline-block',
                }}
              >
                ↗
              </span>
              <div
                data-name
                className="text-[17px] md:text-[20px]"
                style={{
                  marginTop: 28,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textUnderlineOffset: 4,
                  textDecorationColor: NORDIC_BLUE,
                  textDecorationThickness: 1,
                }}
              >
                {p.name}
              </div>
              <div
                className="text-[12px] md:text-[13px]"
                style={{
                  marginTop: 6,
                  lineHeight: 1.4,
                  color: 'rgba(0,0,0,0.6)',
                }}
              >
                {p.role}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
