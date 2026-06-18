'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { KeyFinding } from '@/sanity/types'
import { CountryItaly, CountryPortugal, CountrySpain } from '../lovie/CountryStickers'

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

// Lovie's five Mediterranean trends + Takeaways. Used when CMS
// keyFindings is empty. Anchor ids match the live DOM:
// LovieTrendContent renders id={`trend-${trendNumber}`}, and the
// Takeaways cover (ReportSectionCover with sectionNumber="takeaways")
// renders id="section-takeaways".
const LOVIE_FALLBACK_SECTIONS = [
  {
    number: '01',
    title: 'A Creative Scene Building Beyond Capital Cities',
    description: '',
    color: '#000000',
    hoverBg: '#ff6000',
    anchor: 'trend-01',
  },
  {
    number: '02',
    title: 'Smaller Players Are Setting the Standard',
    description: '',
    color: '#000000',
    hoverBg: '#ff6000',
    anchor: 'trend-02',
  },
  {
    number: '03',
    title: 'Internationalism & Collaboration by Necessity',
    description: '',
    color: '#000000',
    hoverBg: '#ff6000',
    anchor: 'trend-03',
  },
  {
    number: '04',
    title: 'Rooted in Local Culture for Global Reach',
    description: '',
    color: '#000000',
    hoverBg: '#ff6000',
    anchor: 'trend-04',
  },
  {
    number: '05',
    title: 'Building Digital Sovereignty & AI Infrastructure',
    description: '',
    color: '#000000',
    hoverBg: '#ff6000',
    anchor: 'trend-05',
  },
  {
    number: '06',
    title: 'Takeaways',
    description: '',
    color: '#000000',
    hoverBg: '#ff6000',
    anchor: 'section-takeaways',
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
  property?: 'webby' | 'anthem' | 'telly' | 'lovie'
}

export function KeyFindings({ findings, property }: KeyFindingsProps = {}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const isLovie = property === 'lovie'

  // Color fork — Anthem uses warm cream + tan; Lovie sits on the same
  // beige body color as the rest of the reading flow so the section
  // doesn't feel like a separate "module". Cards lift slightly via a
  // lighter cream so they still register as clickable.
  const theme = isLovie
    ? {
        sectionBg: '#f2eeed',
        cardDefaultBg: '#fffaf3',
        headingIcon: '/lovie/country-italy.svg',
        headingIconRotation: '-8deg',
        subtitle: 'A look at the creative communities and ideas shaping the Mediterranean in 2026.',
      }
    : {
        sectionBg: '#E3DDCA',
        cardDefaultBg: '#d5cfbc',
        headingIcon: '/anthem/CAUSE_EDUCATION.svg',
        headingIconRotation: '-12deg',
        subtitle: 'A look at how the social impact sector is responding in 2026.',
      }

  const fallback = isLovie ? LOVIE_FALLBACK_SECTIONS : FALLBACK_SECTIONS
  // CMS-driven when keyFindings is populated; otherwise the property's
  // hardcoded fallback list ships. Default text color is brand-aware:
  // dark moss for Anthem, true black for Lovie.
  const defaultTextColor = isLovie ? '#000000' : '#21261A'
  const sections: ResolvedSection[] =
    findings && findings.length > 0
      ? findings.map((f, i) => ({
          number: f.number,
          title: f.title,
          description: f.description || '',
          color: defaultTextColor,
          hoverBg: f.hoverColor || fallback[i % fallback.length].hoverBg,
          anchor: f.anchor || fallback[i % fallback.length].anchor,
        }))
      : fallback

  // Lovie uses Option 1: cover-art banner on top + editorial numbered list
  // below. Distinct layout from Anthem's card grid, so it gets its own
  // render path rather than being squeezed into the same JSX tree.
  if (isLovie) {
    return (
      <section
        id="key-findings"
        data-snap
        className="relative overflow-hidden pt-20 md:pt-24 pb-16 md:pb-24"
        style={{ background: theme.sectionBg }}
      >
        {/* Cover-art banner: 3 country stickers with a short dotted curve
            connecting Italy (center) to Portugal/Spain (left/right). SVG
            recreation rather than the static PNG so the curve/stickers
            scale and respond independently. */}
        <div className="relative w-full" style={{ height: 360 }}>
          <svg
            viewBox="0 0 1000 360" preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <path
              d="M 100 230 Q 360 100 500 210 Q 640 320 900 230"
              fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 14"
            />
          </svg>
          <CountryPortugal
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{ top: '38%', left: '2%', width: 'clamp(100px, 18vw, 220px)', height: 'auto', transform: 'rotate(-6deg)' }}
          />
          <CountryItaly
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{ top: '12%', left: '50%', width: 'clamp(110px, 20vw, 240px)', height: 'auto', transform: 'translateX(-50%)' }}
          />
          <CountrySpain
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{ top: '38%', right: '2%', width: 'clamp(100px, 18vw, 220px)', height: 'auto', transform: 'rotate(6deg)' }}
          />
        </div>

        {/* Editorial trend list */}
        <div className="px-5 md:px-[60px] mt-12 md:mt-16" style={{ maxWidth: 1100, margin: '60px auto 0' }}>
          <motion.p
            className="text-[11px] uppercase mb-3"
            style={{ letterSpacing: 4, color: '#ff6000', fontWeight: 500 }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Inside The Report
          </motion.p>
          <motion.h2
            className="mb-10 md:mb-12 text-[32px] md:text-[48px] lg:text-[56px] leading-[1.1] font-bold"
            style={{ color: '#000000' }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Five Trends Shaping the Mediterranean
          </motion.h2>

          <ol className="list-none p-0 m-0">
            {sections.map((section, i) => {
              const isHovered = hoveredIndex === i
              return (
                <motion.li
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
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex items-baseline gap-5 md:gap-8 py-5 md:py-6 cursor-pointer transition-colors duration-200"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                >
                  <span
                    className="text-[18px] md:text-[22px] font-bold flex-shrink-0"
                    style={{ color: '#ff6000', minWidth: 36 }}
                  >
                    {section.number}
                  </span>
                  <span
                    className="text-[16px] md:text-[22px] leading-[1.25] flex-1 transition-colors duration-200"
                    style={{ fontWeight: 500, color: isHovered ? '#ff6000' : '#000000' }}
                  >
                    {section.title}
                  </span>
                  <span
                    className="text-[18px] md:text-[22px] flex-shrink-0 transition-transform duration-200"
                    style={{ color: '#ff6000', transform: isHovered ? 'translateX(6px)' : 'none' }}
                  >
                    →
                  </span>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </section>
    )
  }

  return (
    <section
      id="key-findings"
      data-snap
      className="relative overflow-hidden px-5 md:px-[60px] pt-20 md:pt-28 pb-10 md:pb-14"
      style={{ background: theme.sectionBg }}
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
            src={theme.headingIcon}
            alt=""
            className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] absolute left-[8%] md:left-[calc(50%_-_5.2em_+_10px)]"
            style={{ transform: `rotate(${theme.headingIconRotation})`, top: '-0.15em' }}
          />
          Inside The Report
        </motion.h2>

        <motion.p
          className="text-center text-[14px] md:text-[16px] -mt-6 md:-mt-8 mb-10 md:mb-14"
          style={{ color: '#21261A', opacity: 0.6, fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {theme.subtitle}
        </motion.p>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-[800px] mx-auto">
          {sections.map((section, i) => {
            const isHovered = hoveredIndex === i
            return (
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
                className="p-5 md:p-10 rounded-lg cursor-pointer min-h-[140px] md:min-h-[210px] flex flex-col justify-center transition-colors duration-300"
                style={{ background: isHovered ? section.hoverBg : theme.cardDefaultBg }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              >
                <div
                  className="text-[32px] md:text-[48px] leading-none mb-2 md:mb-3 transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-display)', color: isHovered ? '#E3DDCA' : section.hoverBg, fontWeight: 700 }}
                >
                  {section.number}
                </div>
                <h3
                  className="text-[15px] md:text-[18px] font-medium mb-2 leading-tight transition-colors duration-300"
                  style={{ color: isHovered ? '#E3DDCA' : '#21261A' }}
                >
                  {section.title}
                </h3>
                <p
                  className="text-[12px] md:text-[13px] transition-colors duration-300"
                  style={{ color: isHovered ? '#E3DDCA' : '#21261A', opacity: isHovered ? 0.7 : 0.55 }}
                >
                  {section.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
