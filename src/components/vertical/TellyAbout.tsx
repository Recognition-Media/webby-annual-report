'use client'

import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { urlFor } from '@/sanity/image'

const aboutBodyComponents: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#ef1e40', textDecoration: 'underline', textUnderlineOffset: 2 }}
      >
        {children}
      </a>
    ),
  },
}

export function TellyAbout({ report }: { report: Report }) {
  const logoUrl = report.aboutLogo ? urlFor(report.aboutLogo).width(240).url() : '/telly/telly-logo-black.svg'
  return (
    <section
      id="about-telly"
      className="relative px-5 md:px-[60px] py-20 md:py-28 text-center"
      style={{ background: '#ffffff' }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <motion.img
          src={logoUrl}
          alt="The Telly Awards"
          className="mx-auto mb-8 h-[56px] md:h-[72px] w-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        />
        {report.aboutEyebrow && (
          <motion.p
            className="uppercase font-medium mb-4"
            style={{ fontSize: 13, letterSpacing: 3, color: '#ef1e40', fontFamily: "'Basetica', -apple-system, sans-serif" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {report.aboutEyebrow}
          </motion.p>
        )}
        <motion.h2
          className="text-[32px] md:text-[48px] leading-[1.1] mb-8"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000', fontWeight: 700 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {report.aboutHeading}
        </motion.h2>
        {report.aboutBody && report.aboutBody.length > 0 && (
          <motion.div
            className="text-[15px] md:text-[17px] leading-[1.7] mb-8 [&_p]:mb-5"
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(0,0,0,0.75)' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <PortableText value={report.aboutBody} components={aboutBodyComponents} />
          </motion.div>
        )}
      </div>
    </section>
  )
}
