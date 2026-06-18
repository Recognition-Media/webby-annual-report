'use client'

import { motion } from 'framer-motion'
import type { Report, CreditPerson } from '@/sanity/types'

interface Person {
  name: string
  title: string
  url?: string
}

const CREATED_BY: Person[] = [
  { name: 'Jordana Jarrett', title: 'Head of Brand Strategy' },
  { name: 'Patricia McLoughlin', title: 'General Manager' },
  { name: 'Jesse Feister', title: 'Executive Director' },
  { name: 'Steve Marchese', title: 'Chief Production Officer & Executive Producer' },
]

const CONTRIBUTORS: Person[] = [
  { name: 'Mifa Adejumo', title: 'Communications Lead, The Special Youth Leadership Foundation', url: 'https://www.linkedin.com/in/mifa-adejumo-86481b97/' },
  { name: 'Michael Bellavia', title: 'CEO, HelpGood', url: 'https://www.linkedin.com/in/michaelbellavia/' },
  { name: 'M M De Voe', title: 'Executive Director, Pen Parentis', url: 'https://www.linkedin.com/in/mmdevoe' },
  { name: 'William Dodge', title: 'Co-Founder, Artist & Design Principal, A Gang of Three', url: 'https://www.linkedin.com/in/williamhdodge' },
  { name: 'Brian Dusablon', title: 'Senior Consultant, Ethical Methods', url: 'https://www.linkedin.com/in/duce' },
  { name: 'Janna Guinen', title: 'Executive Director, HLTH Foundation', url: 'https://www.linkedin.com/in/janna-guinen-81146b5/' },
  { name: 'Kirill Karnovich-Valua', title: 'Founder, Creative Director, Digital Da Vincis', url: 'https://www.linkedin.com/in/karnovichvalua/' },
  { name: 'Saadia Khan', title: 'Founder, Immigrantly Media', url: 'https://www.linkedin.com/in/saadia-waqas-khan-bb7a765/' },
  { name: 'Seth Laxman', title: 'Advocacy & Activism Lead, Lush Cosmetics', url: 'https://www.linkedin.com/in/sethlaxman' },
  { name: 'Kyle Lierman', title: 'CEO, Civic Nation', url: 'https://www.linkedin.com/posts/kyle-lierman-98521a8_when-a-movement-becomes-a-brand-kyle-lierman-activity-7386100027284443136-aD_V' },
  { name: 'Cal McAllister', title: 'Founder & CEO, Paper Crane Factory', url: 'https://www.linkedin.com/in/calmcallister/' },
  { name: 'Dan McCrory', title: 'Producer, Working Voices on KPFK', url: 'https://www.linkedin.com/in/dan-mccrory-a2501b4/' },
  { name: 'Olive Mwangi', title: 'Head of Social Media, Dentsu Creative Kenya', url: 'https://ke.linkedin.com/in/olive-wangai-ab968415a' },
  { name: "Tamara Toles O'Laughlin", title: 'Founder, Climate Critical', url: 'https://www.linkedin.com/in/tamara-toles-o-laughlin-30648813' },
  { name: 'Shirley Senn', title: "Chief Community Impact Officer, New Orleans Firemen's FCU", url: 'https://www.linkedin.com/in/shirley-senn-cude-4395377/' },
  { name: 'Justin Sherwood', title: 'Senior Director of External Affairs, Firelight Media', url: 'https://www.linkedin.com/in/justinssherwood/' },
  { name: 'KoAnn Vikoren Skrzyniarz', title: 'Founder, CEO & Chairwoman, Sustainable Brands', url: 'https://www.linkedin.com/in/koann/' },
  { name: 'Andrew Walker', title: 'Executive Director, Elevate+', url: 'https://www.linkedin.com/in/andrewpwalker' },
  { name: 'Lashanna Williams', title: 'Executive Director, A Sacred Passing', url: 'https://www.linkedin.com/in/lashannawilliams/' },
]

// Lovie fallbacks — names and titles for the Lovie Mediterranean report.
// LinkedIn URLs will fill in once Jordana adds them to the CMS.
const LOVIE_CREATED_BY: Person[] = [
  { name: 'Selin Clayton', title: 'Research Lead & Strategist' },
  { name: 'Jordana Jarrett', title: 'Head of Brand Strategy' },
  { name: 'Jesse Feister', title: 'Executive Director' },
  { name: 'Nick Farnhill', title: 'Founder of FOOD' },
  { name: 'Nick Shizeng Ni', title: 'Lead Designer' },
  { name: 'Nidha Kattil Veetil', title: 'Marketing Director' },
]

const LOVIE_CONTRIBUTORS: Person[] = [
  { name: 'Christine McGinnis', title: 'Director of Design, Wave Design Consultants' },
  { name: 'Enrique Dans', title: 'Professor of Innovation, IE UNIVERSITY' },
  { name: 'Fabrizio Piccolini', title: 'Executive Creative Director, Mirror' },
  { name: 'Giacomo Scandolara', title: 'CEO, Giga Design Studio Srl' },
  { name: 'Miguel Priera', title: 'Senior Visual & Interaction Designer, Hanzo' },
  { name: 'Pepe Garcia', title: 'Executive Creative Director, Now Independent (exMcCann, exFCB, exGrey, exJellyfish)' },
  { name: 'Stefanie Palomino', title: 'Vice President Product, Marketing and Innovation, Middelhoffconsulting S.L.' },
]

function fromCms(list: CreditPerson[] | undefined, fallback: Person[]): Person[] {
  if (!list || list.length === 0) return fallback
  return list.map((p) => ({
    name: p.name,
    title: p.title || '',
    url: p.url,
  }))
}

export function Credits({ report }: { report?: Report } = {}) {
  const isLovie = report?.property === 'lovie'

  if (isLovie) return <LovieCredits report={report} />
  return <AnthemCredits report={report} />
}

// Anthem credits — dark moss block with cream text + lilac accents.
function AnthemCredits({ report }: { report: Report | undefined }) {
  const createdBy = fromCms(report?.creditsCreatedBy, CREATED_BY)
  const contributors = fromCms(report?.creditsContributors, CONTRIBUTORS)

  return (
    <section
      id="credits"
      className="relative px-5 md:px-[60px] py-20 md:py-28"
      style={{ background: '#21261A', color: '#E3DDCA' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <motion.h2
          className="text-center text-[32px] md:text-[56px] leading-[1.1] mb-16 md:mb-20"
          style={{ fontFamily: 'var(--font-display)', color: '#E3DDCA', fontWeight: 400 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          Credits
        </motion.h2>

        <div className="mx-auto" style={{ maxWidth: 880 }}>
          <AnthemPeopleGroup title="Created By" people={createdBy} columns={2} delay={0.1} />
          <div className="mt-14 md:mt-16">
            <AnthemPeopleGroup title="Contributors" people={contributors} columns={3} delay={0.2} />
          </div>
        </div>
      </div>
    </section>
  )
}

function AnthemPeopleGroup({ title, people, columns, delay }: { title: string; people: Person[]; columns: 2 | 3; delay: number }) {
  const accent = '#D17DD0'
  const gridClass =
    columns === 3
      ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4'
      : 'grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4'
  return (
    <div>
      <motion.h3
        className="text-[11px] md:text-[12px] uppercase tracking-[3px] font-semibold mb-5 pb-2 text-left"
        style={{ color: accent, fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif", borderBottom: `1px solid rgba(209, 125, 208, 0.25)` }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
      >
        {title}
      </motion.h3>
      <ul className={gridClass} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {people.map((person, i) => (
          <motion.li
            key={person.name}
            className="text-left"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: delay + 0.05 + i * 0.025 }}
          >
            <p className="text-[14px] md:text-[15px] font-medium leading-tight" style={{ color: '#E3DDCA', fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif" }}>
              {person.url ? (
                <a href={person.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-100" style={{ color: '#E3DDCA', textDecoration: 'none', borderBottom: `1px solid rgba(209, 125, 208, 0.4)` }}>
                  {person.name}
                </a>
              ) : (
                person.name
              )}
            </p>
            <p className="text-[11px] md:text-[12px] leading-[1.4] mt-0.5" style={{ color: '#E3DDCA', opacity: 0.55, fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif" }}>
              {person.title}
            </p>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

// Lovie credits — lime ground (bookends the hero), asymmetric magazine
// layout: section label as a display-sized heading on the left rail,
// names stacked on the right. Dotted divider (strokeDasharray="2 14"
// matches the hero/key-findings curves) sits above each section label.
function LovieCredits({ report }: { report: Report | undefined }) {
  const createdBy = fromCms(report?.creditsCreatedBy, LOVIE_CREATED_BY)
  const contributors = fromCms(report?.creditsContributors, LOVIE_CONTRIBUTORS)

  return (
    <section
      id="credits"
      data-snap
      className="relative"
      style={{
        background: '#eeffbb',
        padding: '96px 24px 120px',
        fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
        color: '#000000',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Top wordmark — left aligned, big. Heart sticker tucked to the right. */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 80, gap: 24 }}>
          <motion.h2
            style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 700, color: '#000000', lineHeight: 1, letterSpacing: '-0.02em', margin: 0 }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Credits
          </motion.h2>
          <motion.img
            src="/lovie/no-1-heart.svg"
            alt=""
            aria-hidden
            style={{ width: 80, height: 'auto', marginTop: 8 }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
        </div>

        <LoviePeopleGroup label="Created By" people={createdBy} delay={0.1} />
        <div style={{ height: 64 }} />
        <LoviePeopleGroup label="Contributors" people={contributors} delay={0.2} />
      </div>
    </section>
  )
}

// Dotted divider — matches the visual rhythm of the hero / Inside the
// Report dotted curves. Those curves use strokeDasharray="2 14" on a
// path stretched non-uniformly (preserveAspectRatio="none"), so the
// dashes appear visually elongated. For a non-stretched rule we bake
// that elongation into the values: 8px dash + 14px gap, 3px stroke.
function DottedRule() {
  return (
    <svg width="140" height="8" viewBox="0 0 140 8" aria-hidden style={{ display: 'block', marginBottom: 28 }}>
      <line x1="4" y1="4" x2="136" y2="4" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 14" />
    </svg>
  )
}

function LoviePeopleGroup({ label, people, delay }: { label: string; people: Person[]; delay: number }) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-[1fr_2fr]"
      style={{ gap: 56, alignItems: 'start' }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Left rail — dotted rule + display-sized section label */}
      <div>
        <DottedRule />
        <h3 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: '#000000', lineHeight: 1.05, letterSpacing: '-0.01em', margin: 0 }}>
          {label}
        </h3>
      </div>

      {/* Right — clean stacked list */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {people.map((person, i) => (
          <motion.li
            key={person.name}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35, delay: delay + 0.05 + i * 0.04 }}
          >
            <p style={{ fontSize: 18, fontWeight: 500, color: '#000000', lineHeight: 1.3, margin: 0 }}>
              {person.url ? (
                <a
                  href={person.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#000000', textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.35)' }}
                >
                  {person.name}
                </a>
              ) : (
                person.name
              )}
            </p>
            <p style={{ fontSize: 14, color: '#000000', opacity: 0.55, lineHeight: 1.5, margin: '4px 0 0' }}>
              {person.title}
            </p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
