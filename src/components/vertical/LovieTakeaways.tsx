'use client'

import { motion } from 'framer-motion'

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

// Numbered heart token — the official Lovie brand asset for each
// takeaway. PNGs live in /public/lovie/takeaway-{1..5}.png and already
// have the numeral baked in with the correct brand typography.
function NumberedHeart({ n }: { n: number }) {
  return (
    <img
      src={`/lovie/takeaway-${n}.png`}
      alt={`Takeaway ${n}`}
      style={{ width: 110, height: 'auto', flexShrink: 0 }}
    />
  )
}

export function LovieTakeaways() {
  return (
    <section
      data-snap
      style={{
        background: '#f2eeed',
        // No top padding — the cover above (compact mode) already
        // contributes ~60px of bottom padding, which lands the first
        // takeaway in the 48–64px target gap from the cover copy.
        padding: '0 24px 120px',
        fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {TAKEAWAYS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            style={{
              display: 'flex',
              gap: 32,
              alignItems: 'flex-start',
              marginBottom: i === TAKEAWAYS.length - 1 ? 0 : 56,
            }}
          >
            <NumberedHeart n={i + 1} />
            <div style={{ flex: 1, paddingTop: 8 }}>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#000',
                  marginBottom: 12,
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: 16,
                  color: '#000',
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                {item.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
