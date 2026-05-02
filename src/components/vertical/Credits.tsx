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

const ACCENT = '#D17DD0'

function fromCms(list: CreditPerson[] | undefined, fallback: Person[]): Person[] {
  if (!list || list.length === 0) return fallback
  return list.map((p) => ({
    name: p.name,
    title: p.title || '',
    url: p.url,
  }))
}

export function Credits({ report }: { report?: Report } = {}) {
  const createdBy = fromCms(report?.creditsCreatedBy, CREATED_BY)
  const contributors = fromCms(report?.creditsContributors, CONTRIBUTORS)

  return (
    <section
      id="credits"
      className="relative px-5 md:px-[60px] py-20 md:py-28"
      style={{ background: '#21261A', color: '#E3DDCA' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        {/* Section heading */}
        <motion.h2
          className="text-center text-[36px] md:text-[56px] leading-[1.1] mb-16 md:mb-20"
          style={{ fontFamily: 'var(--font-display)', color: '#E3DDCA', fontWeight: 400 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          Credits
        </motion.h2>

        {/* Editorial credits column */}
        <div className="mx-auto" style={{ maxWidth: 880 }}>
          <PeopleGroup title="Created By" people={createdBy} columns={2} delay={0.1} />

          <div className="mt-14 md:mt-16">
            <PeopleGroup title="Contributors" people={contributors} columns={3} delay={0.2} />
          </div>
        </div>
      </div>
    </section>
  )
}

function PeopleGroup({
  title,
  people,
  columns,
  delay,
}: {
  title: string
  people: Person[]
  columns: 2 | 3
  delay: number
}) {
  const gridClass =
    columns === 3
      ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4'
      : 'grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4'

  return (
    <div>
      {/* Subhead — left-aligned label, with thin underline */}
      <motion.h3
        className="text-[11px] md:text-[12px] uppercase tracking-[3px] font-semibold mb-5 pb-2 text-left"
        style={{
          color: ACCENT,
          fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
          borderBottom: `1px solid rgba(209, 125, 208, 0.25)`,
        }}
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
            <p
              className="text-[14px] md:text-[15px] font-medium leading-tight"
              style={{
                color: '#E3DDCA',
                fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
              }}
            >
              {person.url ? (
                <a
                  href={person.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:opacity-100"
                  style={{ color: '#E3DDCA', textDecoration: 'none', borderBottom: '1px solid rgba(209, 125, 208, 0.4)' }}
                >
                  {person.name}
                </a>
              ) : (
                person.name
              )}
            </p>
            <p
              className="text-[11px] md:text-[12px] leading-[1.4] mt-0.5"
              style={{
                color: '#E3DDCA',
                opacity: 0.55,
                fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
              }}
            >
              {person.title}
            </p>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
