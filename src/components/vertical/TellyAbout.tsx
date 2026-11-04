'use client'

import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { urlFor } from '@/sanity/image'

const ACCENT = '#F41FC9'
const ENTER_URL = 'https://www.tellyawards.com'

const aboutBodyComponents: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: ACCENT, textDecoration: 'underline', textUnderlineOffset: 2 }}
      >
        {children}
      </a>
    ),
  },
}

// Sits at the very bottom of the report, right after Credits — a quiet,
// small-print footer-style blurb rather than its own full title page.
export function TellyAbout({ report }: { report: Report }) {
  const logoUrl = report.aboutLogo ? urlFor(report.aboutLogo).width(240).url() : '/telly/judges/telly-logo-horizontal-white-cropped.png'
  return (
    <section
      id="about-telly"
      data-snap
      className="relative px-5 md:px-[60px] py-20 md:py-28 text-center"
      style={{ background: '#110E1F' }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <motion.img
          src={logoUrl}
          alt="The Telly Awards"
          className="mx-auto mb-8 h-[76px] md:h-[100px] w-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        />
        <motion.p
          className="text-[32px] md:text-[48px] leading-[1.1] mb-8"
          style={{ fontWeight: 700, color: '#ffffff', fontFamily: "'Basetica', -apple-system, sans-serif" }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {report.aboutHeading}
        </motion.p>
        {report.aboutBody && report.aboutBody.length > 0 && (
          <motion.div
            className="text-[15px] md:text-[17px] leading-[1.7] mb-8 [&_p]:mb-5"
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.75)' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PortableText value={report.aboutBody} components={aboutBodyComponents} />
          </motion.div>
        )}
        <motion.a
          href={ENTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center py-3 px-8 rounded-full uppercase transition-colors duration-200 bg-white text-[#F41FC9] border border-[#F41FC9] hover:bg-[#F41FC9] hover:text-white"
          style={{ fontSize: 12, letterSpacing: 2, fontWeight: 700, fontFamily: "'Basetica', -apple-system, sans-serif" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Enter Now
        </motion.a>
      </div>
    </section>
  )
}
