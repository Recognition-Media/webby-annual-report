'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import type { KeyFinding, SanityImage } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { CountryItaly, CountryPortugal, CountrySpain } from '../lovie/CountryStickers'
import { SignalWaves } from './SignalWaves'
import { jumpToSection } from '@/lib/sectionJump'
import { PlayIcon } from './PlayIcon'
import { iconColorFor, IMAGE_SCRIM } from '@/lib/channelColors'

const ctaComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <>{children}</>,
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: 2, opacity: 1 }}
      >
        {children}
      </a>
    ),
  },
}

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

// Nordics has 4 trends + Ones to Watch + Takeaways (6 items). Anchor
// order matches the 6-item ToC the editor sees in the CMS so any item
// with an empty anchor field falls back to the right destination.
const NORDICS_FALLBACK_SECTIONS = [
  {
    number: '1',
    title: 'Small Populations, Outsized Infrastructure',
    description: '',
    color: '#000000',
    hoverBg: '#016BA7',
    anchor: 'trend-01',
  },
  {
    number: '2',
    title: "Capitals Don't Tell the Region's Full Story",
    description: '',
    color: '#000000',
    hoverBg: '#016BA7',
    anchor: 'trend-02',
  },
  {
    number: '3',
    title: 'Sustainability & Circularity At the Centre',
    description: '',
    color: '#000000',
    hoverBg: '#016BA7',
    anchor: 'trend-03',
  },
  {
    number: '4',
    title: 'Cross-Border Collaboration At Its Core',
    description: '',
    color: '#000000',
    hoverBg: '#016BA7',
    anchor: 'trend-04',
  },
  {
    number: '5',
    title: 'The Ones to Watch',
    description: '',
    color: '#000000',
    hoverBg: '#016BA7',
    anchor: 'ones-to-watch',
  },
  {
    number: '6',
    title: 'Takeaways',
    description: '',
    color: '#000000',
    hoverBg: '#016BA7',
    anchor: 'section-takeaways',
  },
]

function scrollToAnchor(anchor: string) {
  const raw = (anchor || '').trim()
  if (!raw) return

  // Try the exact value first, then a couple of forgiving variants so
  // small CMS inconsistencies (missing/extra `section-` prefix, etc.)
  // don't silently break the link.
  const candidates = [
    raw,
    raw.startsWith('section-') ? raw.slice('section-'.length) : `section-${raw}`,
  ]

  for (const id of candidates) {
    const el = document.getElementById(id)
    if (el) {
      jumpToSection(id, el)
      return
    }
  }

  // Help during local dev — surface mis-typed anchors instead of failing silently.
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[KeyFindings] No element found for anchor "${raw}". Check the CMS keyFinding anchor or the section id.`)
  }
}

type ResolvedSection = {
  number: string
  title: string
  description: string
  color: string
  hoverBg: string
  anchor: string
  image?: SanityImage
  subItems?: { title: string; anchor?: string }[]
}

interface KeyFindingsProps {
  findings?: KeyFinding[]
  property?: 'webby' | 'anthem' | 'telly' | 'lovie'
  slug?: string
  /** CMS-driven small label above the subtitle paragraph — Telly only. */
  eyebrow?: string
  /** CMS-driven, falls back to "Just Released" — Telly only today. */
  heading?: string
  /** CMS-driven, falls back to the default Telly subtitle copy. */
  subtitle?: string
  /** CMS-driven, optional short rich-text sentence appended after the
   * subtitle (e.g. an entry-deadline nudge with a hyperlinked word) —
   * Telly only. */
  cta?: PortableTextBlock[]
}

// Telly placeholder findings — shown only until the CMS keyFindings
// array is populated. Anchors point at the generic trend-NN ids the
// Telly ReportView branch stamps on each CMS trend section.
const TELLY_FALLBACK_SECTIONS: ResolvedSection[] = [
  { number: '01', title: 'Every Screen Is a First Screen', description: 'Makers are building for the phone, the living room, and the feed at the same time.', color: '#000000', hoverBg: '#ef1e40', anchor: 'trend-01' },
  { number: '02', title: 'Smaller Teams, Bigger Output', description: 'Lean crews and new tools are closing the gap between idea and finished work.', color: '#000000', hoverBg: '#c23799', anchor: 'trend-02' },
  { number: '03', title: 'Craft Still Wins', description: 'Audiences reward work that is made with care, no matter the runtime or platform.', color: '#000000', hoverBg: '#ef1e40', anchor: 'trend-03' },
]

export function KeyFindings({ findings, property, slug, eyebrow, heading, subtitle, cta }: KeyFindingsProps = {}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const isLovie = property === 'lovie'
  const isTelly = property === 'telly'

  // Telly's poster-wall cards (now 8: the 4 trend-level cards plus the 4
  // Channel Surfing streams tacked on after it) scroll horizontally in one
  // row — same scroll-row mechanics as PosterRowList's video carousels —
  // instead of wrapping onto a second grid row.
  const tocScrollRef = useRef<HTMLDivElement>(null)
  const [tocCanScrollLeft, setTocCanScrollLeft] = useState(false)
  const [tocCanScrollRight, setTocCanScrollRight] = useState(false)
  useEffect(() => {
    const el = tocScrollRef.current
    if (!el) return
    function update() {
      setTocCanScrollLeft(el!.scrollLeft > 2)
      setTocCanScrollRight(el!.scrollLeft < el!.scrollWidth - el!.clientWidth - 2)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  function scrollTocBy(direction: 1 | -1) {
    const el = tocScrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }
  const isNordics = isLovie && slug === 'lovie-creative-hubs-nordics'
  const isSharedInfluence =
    property === 'anthem' && slug === 'shared-influence-creator-partnerships-nonprofit'
  // Nordics swaps Lovie's orange for purple; other Lovie reports keep
  // orange. Applies to the section eyebrow, number, hover title, and
  // arrow within the mobile-list treatment.
  const lovieAccent = isNordics ? '#016BA7' : '#ff6000'

  // Color fork — Anthem uses warm cream + tan; Lovie sits on the same
  // beige body color as the rest of the reading flow so the section
  // doesn't feel like a separate "module". Cards lift slightly via a
  // lighter cream so they still register as clickable. Shared Influence
  // is an Anthem report but swaps the header sticker for the Justice
  // mark that fits its subject matter.
  const theme = isLovie
    ? {
        sectionBg: '#f2eeed',
        cardDefaultBg: '#fffaf3',
        headingIcon: '/lovie/country-italy.svg',
        headingIconRotation: '-8deg',
        subtitle: 'A look at the creative communities and ideas shaping the Mediterranean in 2026.',
      }
    : isSharedInfluence
    ? {
        sectionBg: '#E3DDCA',
        cardDefaultBg: '#d5cfbc',
        headingIcon: '/anthem/justice-sticker.svg',
        headingIconRotation: '-8deg',
        subtitle: 'A playbook for creator partnerships that drive social impact.',
      }
    : isTelly
    ? {
        sectionBg: '#110E1F',
        cardDefaultBg: 'rgba(255,255,255,0.08)',
        headingIcon: '/telly/telly-logo-horizontal-white.png',
        headingIconRotation: '0deg',
        subtitle: 'Fresh off the presses — four trends just added to the 2026 guide. Tap in to start.',
      }
    : {
        sectionBg: '#E3DDCA',
        cardDefaultBg: '#d5cfbc',
        headingIcon: '/anthem/CAUSE_EDUCATION.svg',
        headingIconRotation: '-12deg',
        subtitle: 'A look at how the social impact sector is responding in 2026.',
      }

  const fallback = isNordics
    ? NORDICS_FALLBACK_SECTIONS
    : isLovie
      ? LOVIE_FALLBACK_SECTIONS
      : isTelly
        ? TELLY_FALLBACK_SECTIONS
        : FALLBACK_SECTIONS
  // CMS-driven when keyFindings is populated; otherwise the property's
  // hardcoded fallback list ships. Default text color is brand-aware:
  // dark moss for Anthem, true black for Lovie.
  const defaultTextColor = isLovie || isTelly ? '#000000' : '#21261A'
  const sections: ResolvedSection[] =
    findings && findings.length > 0
      ? findings.map((f, i) => ({
          number: f.number,
          title: f.title,
          description: f.description || '',
          color: defaultTextColor,
          hoverBg: f.hoverColor || fallback[i % fallback.length].hoverBg,
          anchor: f.anchor || fallback[i % fallback.length].anchor,
          image: f.image,
          subItems: f.subItems,
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
        className={`relative overflow-hidden pt-4 md:pt-24 ${isNordics ? 'pb-4 md:pb-8' : 'pb-16 md:pb-24'}`}
        style={{ background: theme.sectionBg }}
      >
        {/* Cover-art banner. Nordics shows four floating country flag
            stickers (Norway, Sweden, Denmark, Finland) on a wavy dotted
            curve; the Mediterranean report shows its three-heart SVG
            recreation of the trend-report background. Both sit tight
            against the opening letter above. */}
        {isNordics ? (
          <div className="relative w-full h-[220px] md:h-[360px]">
            <svg
              viewBox="0 0 1000 360" preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden="true"
            >
              <path
                d="M 30 250 Q 190 90 350 190 Q 510 290 670 150 Q 790 70 890 240 Q 950 320 1000 260"
                fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 14"
              />
            </svg>
            {/* Sticker sizes: 20% smaller than the Mediterranean stickers
                (Med used clamp(100–220px); Nordics uses clamp(80–176px)).
                Slight rotations + gentle vertical bob = the "floating"
                feel Jordana asked for. Net position is 5% left of the
                original layout so Finland clears the ENTER NOW pill
                without cropping Norway. */}
            <motion.img src="/lovie/norway-sticker.svg" alt="" aria-hidden
              className="absolute pointer-events-none"
              style={{ top: '54%', left: '-2%', width: 'clamp(80px, 14.4vw, 176px)', height: 'auto', transform: 'rotate(-6deg)' }}
              animate={{ y: [-6, 6] }}
              transition={{ duration: 4.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
            <motion.img src="/lovie/sweden-sticker.svg" alt="" aria-hidden
              className="absolute pointer-events-none"
              style={{ top: '10%', left: '25%', width: 'clamp(90px, 16vw, 192px)', height: 'auto', transform: 'rotate(3deg)' }}
              animate={{ y: [-8, 8] }}
              transition={{ duration: 4.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.2 }}
            />
            <motion.img src="/lovie/denmark-sticker.svg" alt="" aria-hidden
              className="absolute pointer-events-none"
              style={{ top: '38%', left: '49%', width: 'clamp(80px, 14.4vw, 176px)', height: 'auto', transform: 'rotate(-4deg)' }}
              animate={{ y: [-7, 7] }}
              transition={{ duration: 4.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.4 }}
            />
            <motion.img src="/lovie/finland-sticker.svg" alt="" aria-hidden
              className="absolute pointer-events-none"
              style={{ top: '4%', right: '9%', width: 'clamp(85px, 15.2vw, 184px)', height: 'auto', transform: 'rotate(8deg)' }}
              animate={{ y: [-6, 6] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.6 }}
            />
          </div>
        ) : (
          <div className="relative w-full h-[220px] md:h-[360px]">
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
        )}

        {/* Editorial trend list */}
        <div className="px-5 md:px-[60px] mt-12 md:mt-16" style={{ maxWidth: 1100, margin: '60px auto 0' }}>
          <motion.p
            className="text-[11px] uppercase mb-3"
            style={{ letterSpacing: 4, color: lovieAccent, fontWeight: 500 }}
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
            {isNordics ? 'Trends Shaping the Nordics' : 'Five Trends Shaping the Mediterranean'}
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
                    style={{ color: lovieAccent, minWidth: 36 }}
                  >
                    {section.number}
                  </span>
                  <span
                    className="text-[16px] md:text-[22px] leading-[1.25] flex-1 transition-colors duration-200"
                    style={{ fontWeight: 500, color: isHovered ? lovieAccent : '#000000' }}
                  >
                    {section.title}
                  </span>
                  <span
                    className="text-[18px] md:text-[22px] flex-shrink-0 transition-transform duration-200"
                    style={{ color: lovieAccent, transform: isHovered ? 'translateX(6px)' : 'none' }}
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

  // Shared Influence — 6 sections in a compact 3×2 grid. Same visual
  // language as the Anthem 2×2 (rounded cream card, red display number,
  // moss text, colour-fill on hover) but sized smaller so all six items
  // read comfortably without dominating the section.
  if (isSharedInfluence) {
    return (
      <section
        id="key-findings"
        data-snap
        className="relative overflow-hidden px-5 md:px-[60px] pt-8 md:pt-28 pb-16 md:pb-24"
        style={{ background: theme.sectionBg }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          {/* Heading — h2 is inline-block so it hugs the title text; the
              Justice sticker sits absolutely positioned just past the
              title's right edge, so it doesn't push the title off the
              container's left rail. Title's left edge stays aligned
              with the subtitle below. Roc Grotesk Variable bold to
              match the section covers below. */}
          <motion.h2
            className="mb-4 md:mb-6 text-[40px] md:text-[64px] leading-[1.05] relative inline-block"
            style={{
              // Roc Grotesk Wide Medium — matches the section cover
              // titles below.
              fontFamily: "'roc-grotesk-wide', 'roc-grotesk-variable', -apple-system, sans-serif",
              color: '#21261A',
              fontWeight: 500,
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Inside The Report
            <img
              src={theme.headingIcon}
              alt=""
              aria-hidden
              className="absolute w-[48px] h-[48px] md:w-[72px] md:h-[72px]"
              style={{
                top: '8%',
                left: 'calc(100% + 16px)',
                transform: `rotate(${theme.headingIconRotation})`,
              }}
            />
          </motion.h2>

          <motion.p
            className="text-[14px] md:text-[16px] mb-10 md:mb-14"
            style={{ color: '#21261A', opacity: 0.6, fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif", maxWidth: 640 }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {theme.subtitle}
          </motion.p>

          {/* Mobile — compact list: number + title in a single row per
              section, thin divider between. Tappable. Kills the bulky
              card treatment on small screens. */}
          <ul className="md:hidden divide-y" style={{ borderColor: 'rgba(33, 38, 26, 0.12)' }}>
            {sections.map((section, i) => (
              <motion.li
                key={section.number}
                onClick={() => scrollToAnchor(section.anchor)}
                className="flex items-baseline gap-4 py-4 cursor-pointer"
                style={{ borderColor: 'rgba(33, 38, 26, 0.12)' }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.05 + i * 0.03 }}
              >
                <span
                  className="text-[22px] leading-none flex-shrink-0 w-9"
                  style={{ fontFamily: 'var(--font-display)', color: section.hoverBg, fontWeight: 700 }}
                >
                  {section.number}
                </span>
                <span
                  className="text-[16px] font-medium leading-snug flex-1"
                  style={{ color: '#21261A' }}
                >
                  {section.title}
                </span>
                <span
                  className="text-[14px] flex-shrink-0"
                  style={{ color: '#21261A', opacity: 0.4 }}
                >
                  →
                </span>
              </motion.li>
            ))}
          </ul>

          {/* Desktop — 3-column tight grid; 2 cols on tablet. Same
              hover-fill behaviour as the Anthem 2×2, sized down for
              scannability at 6 items. */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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
                  className="p-5 md:p-6 rounded-lg cursor-pointer flex flex-col gap-2 min-h-[130px] md:min-h-[150px] transition-colors duration-300"
                  style={{ background: isHovered ? section.hoverBg : theme.cardDefaultBg }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.06 }}
                >
                  <div
                    className="text-[24px] md:text-[28px] leading-none mb-1 transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-display)', color: isHovered ? '#E3DDCA' : section.hoverBg, fontWeight: 700 }}
                  >
                    {section.number}
                  </div>
                  <h3
                    className="text-[14px] md:text-[16px] font-medium leading-tight transition-colors duration-300"
                    style={{ color: isHovered ? '#E3DDCA' : '#21261A' }}
                  >
                    {section.title}
                  </h3>
                  {section.description && (
                    <p
                      className="text-[11px] md:text-[12px] leading-[1.5] transition-colors duration-300"
                      style={{ color: isHovered ? '#E3DDCA' : '#21261A', opacity: isHovered ? 0.75 : 0.55 }}
                    >
                      {section.description}
                    </p>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  // Telly — Table of Contents reads as a "Poster Wall": one full-bleed
  // card per section (image if set in the CMS, otherwise a dark-to-accent
  // gradient fallback), with the section's eyebrow/title and a numbered
  // badge. Clicking anywhere on a card scrolls to that section, same
  // scrollToAnchor mechanism as every other property's ToC.
  if (isTelly) {
    return (
      <section
        id="key-findings"
        data-snap
        className="relative overflow-hidden px-5 md:px-[60px] pt-10 md:pt-14 pb-16 md:pb-24"
        style={{ background: theme.sectionBg }}
      >
        <SignalWaves opacity={0.2} />
        <div className="relative" style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}>
          {eyebrow && (
            <motion.p
              className="uppercase mb-4"
              style={{ fontSize: 12, letterSpacing: 3, color: '#ffffff', opacity: 0.6, fontWeight: 700, fontFamily: "'Basetica', -apple-system, sans-serif" }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.p
            className="text-[16px] md:text-[19px] leading-[1.6] mb-8 md:mb-10"
            style={{ color: '#ffffff', opacity: 0.75, fontFamily: "'Basetica', -apple-system, sans-serif" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {subtitle || theme.subtitle}
            {cta && cta.length > 0 && (
              <>
                {' '}
                <PortableText value={cta} components={ctaComponents} />
              </>
            )}
          </motion.p>
          <motion.h2
            className="mb-10 md:mb-14 text-[40px] md:text-[64px] leading-[1.1]"
            style={{ fontFamily: 'var(--font-display)', color: '#ffffff', fontWeight: 700 }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {heading || 'Just Released'}
          </motion.h2>

          <div className="relative group/toc">
            {tocCanScrollLeft && (
              <button
                type="button"
                aria-label="Scroll left"
                onClick={() => scrollTocBy(-1)}
                className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-4 z-10 w-9 h-9 rounded-full items-center justify-center text-white opacity-0 group-hover/toc:opacity-100 transition-opacity duration-200 cursor-pointer"
                style={{ background: 'rgba(17,14,31,0.75)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            {tocCanScrollRight && (
              <button
                type="button"
                aria-label="Scroll right"
                onClick={() => scrollTocBy(1)}
                className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-4 z-10 w-9 h-9 rounded-full items-center justify-center text-white opacity-0 group-hover/toc:opacity-100 transition-opacity duration-200 cursor-pointer"
                style={{ background: 'rgba(17,14,31,0.75)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}
            <div ref={tocScrollRef} className="flex items-stretch gap-4 overflow-x-auto overflow-y-hidden pb-2 telly-scroll">
            {sections.map((section, i) => {
              const badgeTextColor = iconColorFor(section.hoverBg)
              // Trend-level cards (01-04) keep the plain accent gradient —
              // their CMS cover images are flattened graphics with the old
              // blocky title treatment baked in as pixels, which would
              // clash with this card style. Stream-level cards (05+,
              // Channel Surfing's own lists) use a real winner thumbnail
              // instead, same as any other video-row card.
              const bgImageUrl =
                section.image && Number(section.number) >= 5
                  ? urlFor(section.image).width(640).height(960).fit('crop').url()
                  : null
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
                  className="group relative block flex-shrink-0 cursor-pointer rounded-[10px] overflow-hidden isolate w-[220px] md:w-[260px]"
                  style={{ aspectRatio: '2 / 3', containerType: 'inline-size' }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.08 }}
                >
                  <div
                    className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundImage: bgImageUrl
                        ? `url(${bgImageUrl})`
                        : `linear-gradient(165deg, rgba(5,4,10,0.95), ${section.hoverBg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: IMAGE_SCRIM }}
                  />
                  <div className="absolute left-0 right-0 bottom-0 p-4 md:p-5">
                    <h3
                      className="leading-[1.1]"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: 'clamp(20px, 7.5cqi, 32px)',
                      }}
                    >
                      {section.title}
                    </h3>
                  </div>
                  <span
                    className="absolute flex items-center justify-center rounded-full"
                    style={{ top: 14, right: 14, width: 36, height: 36, background: section.hoverBg }}
                  >
                    <PlayIcon size={13} color={badgeTextColor} />
                  </span>
                  <span
                    className="absolute flex items-center justify-center rounded-full"
                    style={{ right: 18, bottom: 18, width: 26, height: 26, background: '#ffffff', color: '#110E1F', fontFamily: "'Basetica', -apple-system, sans-serif", fontWeight: 700, fontSize: 11 }}
                  >
                    {section.number}
                  </span>
                </motion.div>
              )
            })}
            </div>
          </div>
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
      <div className="relative" style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
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
