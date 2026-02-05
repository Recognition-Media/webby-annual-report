'use client'

import Image from 'next/image'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import type { Report } from '@/sanity/types'
import { urlFor } from '@/sanity/image'

const FALLBACK_TEXT =
  'The Webby Awards has been celebrating the best of the Internet for 29 years\u2014over half the life of the Internet itself. From a professional and academic tool to a ubiquitous communications platform, the Internet has evolved into the universal medium for the most significant breakthroughs in consumer technology and culture at large. It has prevailed as a place where creativity is celebrated, profitable industries are born, and communities have a voice. We are humbled to celebrate another year of Internet excellence with the Webby community, those responsible for creating the awesome, safe, accessible, and inspiring Internet we want.'

export function WebbyIntro({ report, progress }: { report: Report; progress: MotionValue<number> }) {
  const text = report.webbyHistory || FALLBACK_TEXT
  const x = useTransform(progress, [0, 0.2], ['-100%', '0%'])

  return (
    <motion.section
      className="bg-[#a7f076] text-black px-8 md:px-16 h-full flex flex-col justify-center"
      style={{ x }}
    >
      {/* Logo centered */}
      <div className="flex flex-col items-center mb-2">
        {report.headerImage && (
          <Image
            src={urlFor(report.headerImage).width(300).url()}
            alt="The Webby Awards"
            width={120}
            height={75}
            className="w-auto h-auto max-h-[55px] mb-2"
          />
        )}
        <div className="squiggle-divider" />
      </div>

      {/* History text — left aligned */}
      <p className="text-base leading-[1.8] max-w-[900px] mt-4">
        {text}
      </p>
    </motion.section>
  )
}
