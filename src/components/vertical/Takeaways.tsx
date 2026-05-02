'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Takeaway {
  number: string
  title: string
  body: string
}

const FALLBACK_TAKEAWAYS: Takeaway[] = [
  {
    number: '01',
    title: 'Leaders are showing resolve, not optimism. This matters.',
    body: 'The impact sector is finding its footing. Leaders are meeting funding losses, political targeting, and systemic burnout with resolve — not denial. While challenges continue to mount, new opportunities and bright spots are beginning to surface.',
  },
  {
    number: '02',
    title: 'Organizations are naming regressions, not softening them.',
    body: "In 2025, the sector braced for impact. Now it's absorbing it. Cultural and political shifts ranked as the most-cited challenge this year, rippling across every cause area. Agility isn't a competitive advantage right now. It's a survival skill.",
  },
  {
    number: '03',
    title: 'The sector is moving horizontally. Build with others.',
    body: "In the midst of a funding crisis, organizations aren't retreating; they're joining forces. Cross-sector collaboration and grassroots organizing each ranked among the top opportunities for 2026. Scarcity is forcing a more resilient model.",
  },
  {
    number: '04',
    title: "Storytelling is the sector's defining priority.",
    body: "Following the disruptions of 2025, the sector isn't staying quiet. It's getting smarter about speaking up. Storytelling ranked as the #1 organizational priority in 2026. The organizations cutting through are the ones who know their audience, own their narrative, and move with intention.",
  },
  {
    number: '05',
    title: "The sector's digital choices are becoming values statements.",
    body: "From AI adoption to platform selection, organizations are making deliberate decisions about where to show up and how. Audiences are paying attention — and they can tell the difference between strategy and authenticity.",
  },
]

interface TakeawaysProps {
  takeaways?: Takeaway[]
  accentColor?: string
}

export function Takeaways({
  takeaways = FALLBACK_TAKEAWAYS,
  accentColor = '#066DBA',
}: TakeawaysProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section
      id="takeaways"
      className="relative px-5 md:px-[60px] py-16 md:py-24"
      style={{ background: '#E3DDCA' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        {/* Eyebrow + heading — mirrors TabbedPriorities/BubbleChart pattern in Section 3 */}
        <motion.p
          className="uppercase font-medium mb-3 text-center"
          style={{ fontSize: 11, letterSpacing: 4, color: accentColor }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          5 Key Takeaways
        </motion.p>
        <motion.h2
          className="text-center mb-12 text-[28px] md:text-[40px] leading-[1.15]"
          style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 400 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Where We Go From Here
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {takeaways.map((item, i) => {
            const isHovered = hoveredIndex === i
            const isOdd5th = takeaways.length === 5 && i === 4
            return (
              <motion.div
                key={i}
                className="p-6 md:p-9 rounded-lg cursor-default min-h-[200px] md:min-h-[240px] flex flex-col transition-colors duration-300"
                style={{
                  background: isHovered ? accentColor : '#d5cfbc',
                  gridColumn: isOdd5th ? '1 / -1' : 'auto',
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              >
                <div
                  className="text-[36px] md:text-[48px] leading-none mb-4 transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: isHovered ? '#E3DDCA' : accentColor,
                    fontWeight: 700,
                  }}
                >
                  {item.number}
                </div>
                <h3
                  className="text-[18px] md:text-[20px] leading-[1.3] mb-3 transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: isHovered ? '#E3DDCA' : '#21261A',
                    fontWeight: 400,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[13px] md:text-[14px] leading-[1.55] transition-colors duration-300"
                  style={{
                    fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
                    color: isHovered ? '#E3DDCA' : '#21261A',
                    opacity: isHovered ? 0.85 : 0.65,
                  }}
                >
                  {item.body}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
