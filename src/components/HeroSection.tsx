'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Report, CarouselImage } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { ImageCarousel } from './ImageCarousel'

interface HeroSectionProps {
  report: Report
  carouselImages?: CarouselImage[]
}

export function HeroSection({ report, carouselImages }: HeroSectionProps) {
  return (
    <section className="flex flex-col md:flex-row w-full h-screen">
      {/* Left panel — 2/3 width, image carousel or black bg */}
      <div className="w-full md:w-2/3 relative overflow-hidden">
        {carouselImages && carouselImages.length > 0 ? (
          <ImageCarousel variant="hero" images={carouselImages} />
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}
      </div>

      {/* Right panel — 1/3 width, CTA */}
      <div className="w-full md:w-1/3 bg-[#85CEFF] flex flex-col items-center justify-center px-8 py-12 text-center text-black">
        {report.headerImage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={urlFor(report.headerImage).width(400).url()}
              alt={report.title}
              width={200}
              height={50}
              className="max-w-[200px] w-full h-auto"
              priority
            />
          </motion.div>
        )}

        <motion.h1
          className="text-xl md:text-2xl font-bold uppercase mt-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {report.title}
        </motion.h1>

        <motion.p
          className="text-sm mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          A deeper look at the 29th Annual Webby Awards.
        </motion.p>

        <motion.a
          href="#signup"
          className="block w-full bg-black text-white uppercase font-bold py-4 mt-8 text-sm tracking-wider hover:bg-gray-900 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Read the Report
        </motion.a>
      </div>
    </section>
  )
}
