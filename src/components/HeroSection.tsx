'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Report } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { AnimatedCounter } from './AnimatedCounter'

export function HeroSection({ report }: { report: Report }) {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
      {report.headerImage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={urlFor(report.headerImage).width(400).url()}
            alt={report.title}
            width={400}
            height={100}
            priority
          />
        </motion.div>
      )}

      <motion.h1
        className="mt-8 text-5xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {report.title}
      </motion.h1>

      {report.heroStats && report.heroStats.length > 0 && (
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {report.heroStats.map((stat, i) => (
            <AnimatedCounter key={i} value={stat.value} label={stat.label} />
          ))}
        </motion.div>
      )}
    </section>
  )
}
