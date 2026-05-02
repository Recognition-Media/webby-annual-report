'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { KeyFinding } from '@/sanity/types'

const FALLBACK_SECTIONS = [
  {
    number: '01',
    title: 'The State of Social Impact',
    description: 'Year-Over-Year Data Comparison',
    color: '#21261A',
    hoverBg: '#8C001C',
    anchor: 'section-01',
  },
  {
    number: '02',
    title: 'Where the Pressure Is Landing',
    description: 'Funding Challenges And Cultural Shifts',
    color: '#21261A',
    hoverBg: '#D17DD0',
    anchor: 'section-02',
  },
  {
    number: '03',
    title: 'How the Sector Is Responding',
    description: 'Three Emerging Themes',
    color: '#21261A',
    hoverBg: '#00B469',
    anchor: 'section-03',
  },
  {
    number: '04',
    title: 'Takeaways',
    description: 'How We Can Keep Going',
    color: '#21261A',
    hoverBg: '#066DBA',
    // No section-04 yet — anchor to thank-you (Takeaways content) for now.
    anchor: 'thank-you',
  },
]

function scrollToAnchor(anchor: string) {
  const el = document.getElementById(anchor)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

type ResolvedSection = {
  number: string
  title: string
  description: string
  color: string
  hoverBg: string
  anchor: string
}

interface KeyFindingsProps {
  findings?: KeyFinding[]
}

export function KeyFindings({ findings }: KeyFindingsProps = {}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const sections: ResolvedSection[] = findings && findings.length > 0
    ? findings.map((f, i) => ({
        number: f.number,
        title: f.title,
        description: f.description || '',
        color: '#21261A',
        hoverBg: f.hoverColor || FALLBACK_SECTIONS[i % FALLBACK_SECTIONS.length].hoverBg,
        anchor: f.anchor || FALLBACK_SECTIONS[i % FALLBACK_SECTIONS.length].anchor,
      }))
    : FALLBACK_SECTIONS

  return (
    <section
      id="key-findings"
      data-snap
      className="relative overflow-hidden px-5 md:px-[60px] pt-20 md:pt-28 pb-10 md:pb-14"
      style={{ background: '#E3DDCA' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {/* Heading */}
        <motion.h2
          className="mb-10 md:mb-14 text-[48px] md:text-[80px] leading-[1.1] text-center relative inline-flex items-start justify-center w-full"
          style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 400 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <img
            src="/anthem/CAUSE_EDUCATION.svg"
            alt=""
            className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] absolute"
            style={{ transform: 'rotate(-12deg)', top: '-0.15em', left: 'calc(50% - 4.2em + 10px)' }}
          />
          Key Findings
        </motion.h2>

        <motion.p
          className="text-center text-[14px] md:text-[16px] -mt-6 md:-mt-8 mb-10 md:mb-14"
          style={{ color: '#21261A', opacity: 0.6, fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          What the numbers say about where social impact stands in 2026.
        </motion.p>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-[800px] mx-auto">
          {sections.map((section, i) => (
            <motion.div
              key={section.number}
              role="button"
              tabIndex={0}
              onClick={() => scrollToAnchor(section.anchor)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  scrollToAnchor(section.anchor)
                }
              }}
              className="p-6 md:p-10 rounded-lg cursor-pointer min-h-[180px] md:min-h-[210px] flex flex-col justify-center transition-colors duration-300"
              style={{ background: hoveredIndex === i ? section.hoverBg : '#d5cfbc' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
            >
              <div
                className="text-[36px] md:text-[48px] leading-none mb-3 transition-colors duration-300"
                style={{ fontFamily: 'var(--font-display)', color: hoveredIndex === i ? '#E3DDCA' : section.color, fontWeight: 700 }}
              >
                {section.number}
              </div>
              <h3
                className="text-[16px] md:text-[18px] font-medium mb-2 leading-tight transition-colors duration-300"
                style={{ color: hoveredIndex === i ? '#E3DDCA' : '#21261A' }}
              >
                {section.title}
              </h3>
              <p
                className="text-[12px] md:text-[13px] transition-colors duration-300"
                style={{ color: hoveredIndex === i ? '#E3DDCA' : '#21261A', opacity: hoveredIndex === i ? 0.7 : 0.55 }}
              >
                {section.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
