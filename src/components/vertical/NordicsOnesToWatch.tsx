'use client'

// "Nordic Creatives to Watch" — 3×3 grid of under-the-radar picks.
// Editorial spreadsheet treatment: soft neutral rules, warm cream tint
// (matching the Trend 01 data tile), Swedish blue used only as an
// accent on the number, arrow, and hover state.

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

export function NordicsOnesToWatch() {
  return (
    <section
      id="ones-to-watch"
      style={{
        background: '#f2eeed',
        padding: '60px 20px 100px',
        fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          border: '1px solid rgba(0,0,0,0.12)',
          background: 'rgba(255, 243, 209, 0.4)',
        }}>
          {PICKS.map((p, i) => (
            <a
              key={i}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '28px 24px 24px',
                borderRight: (i % 3 !== 2) ? '1px solid rgba(0,0,0,0.12)' : 'none',
                borderBottom: (i < 6) ? '1px solid rgba(0,0,0,0.12)' : 'none',
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
                top: 14,
                left: 18,
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
                  top: 12,
                  right: 18,
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
                style={{
                  marginTop: 28,
                  fontWeight: 700,
                  fontSize: 20,
                  lineHeight: 1.2,
                  textUnderlineOffset: 4,
                  textDecorationColor: NORDIC_BLUE,
                  textDecorationThickness: 1,
                }}
              >
                {p.name}
              </div>
              <div style={{
                marginTop: 6,
                fontSize: 13,
                lineHeight: 1.4,
                color: 'rgba(0,0,0,0.6)',
              }}>
                {p.role}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
