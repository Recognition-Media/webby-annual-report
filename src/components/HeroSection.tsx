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
      {/* Left panel — 2/3 width, image carousel with trophy overlay */}
      <div className="w-full md:w-2/3 relative overflow-hidden">
        {carouselImages && carouselImages.length > 0 ? (
          <ImageCarousel variant="hero" images={carouselImages} />
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}

      </div>

      {/* Right panel — 1/3 width, three stacked rows */}
      <div className="w-full md:w-1/3 flex flex-col h-full">
        {/* Top row — logo on black (25%) */}
        <div className="h-1/4 bg-black flex items-center justify-center px-8">
          {report.headerImage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={urlFor(report.headerImage).width(400).url()}
                alt={report.title}
                width={160}
                height={100}
                className="w-auto h-auto max-h-[70px] brightness-0 invert"
                priority
              />
            </motion.div>
          )}
        </div>

        {/* Middle row — CTA on lime green (50%) */}
        <div className="h-1/2 bg-[#a7f076] flex flex-col items-center justify-center px-8 text-center text-black">
          <motion.h1
            className="text-xl md:text-2xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {report.title}
          </motion.h1>

          <motion.div
            className="squiggle-divider mx-auto my-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          <motion.p
            className="text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            A deeper look at the 29th Annual Webby Awards.
          </motion.p>

          <motion.a
            href="#report-content"
            className="inline-flex items-center justify-between w-full max-w-[280px] bg-black text-white uppercase font-bold py-4 px-6 mt-8 text-sm tracking-wider hover:bg-gray-900 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span>See The Report</span>
            <span className="text-lg">→</span>
          </motion.a>
        </div>

        {/* Bottom row — trophy photo (25%) */}
        <div className="h-1/4 bg-black relative overflow-hidden">
          <Image
            src="/webby-trophy.png"
            alt="Webby Award Trophy"
            fill
            className="object-cover object-center rotate-45 scale-150"
          />
        </div>
      </div>
    </section>
  )
}
