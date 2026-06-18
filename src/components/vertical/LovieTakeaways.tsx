'use client'

import { motion } from 'framer-motion'
import type { LovieTakeaway } from '@/sanity/types'

const FALLBACK_TAKEAWAYS = [
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
      style={{ width: 80, height: 'auto', flexShrink: 0 }}
    />
  )
}

export function LovieTakeaways({ takeaways }: { takeaways?: LovieTakeaway[] } = {}) {
  // CMS-driven when populated, otherwise the fallback list ships.
  const items = takeaways && takeaways.length > 0 ? takeaways : FALLBACK_TAKEAWAYS

  return (
    <section
      id="section-takeaways"
      data-snap
      style={{
        // Lovie-style light grey ground — cleaner break from the beige
        // body and the lime credits below. Cards sit directly on this
        // surface with no fill of their own.
        background: '#E8E8E8',
        padding: '40px 24px 120px',
        fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: 20,
        }}
      >
        {items.map((item, i) => {
          // 5-item layout: 2 per row, with the 5th card spanning both
          // columns on its own row. Matches the Anthem Takeaways pattern.
          const isOdd5th = items.length === 5 && i === 4
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              style={{
                // No card fill — items sit directly on the grey ground.
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                gridColumn: isOdd5th ? '1 / -1' : 'auto',
              }}
            >
              <NumberedHeart n={i + 1} />
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#000',
                  marginBottom: 0,
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: '#000',
                  lineHeight: 1.6,
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                {item.body}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
