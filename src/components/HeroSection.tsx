'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Report, CarouselImage } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { ImageCarousel } from './ImageCarousel'

interface HeroSectionProps {
  report: Report
  carouselImages?: CarouselImage[]
  onSeeReport?: () => void
}

export function HeroSection({ report, carouselImages, onSeeReport }: HeroSectionProps) {
  return (
    <section id="hero" className="flex flex-col md:flex-row w-full h-screen">
      {/* Left panel — 2/3 width, image carousel with trophy overlay */}
      <div className="w-full md:w-2/3 relative overflow-hidden">
        {carouselImages && carouselImages.length > 0 ? (
          <ImageCarousel variant="hero" images={carouselImages} />
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}

        {/* Webby spiral overlay */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <img
            src="/webby-spiral.png"
            alt=""
            className="absolute object-contain opacity-10"
            style={{ top: '50%', left: '50%', width: '200%', height: '200%', transform: 'translate(-50%, -50%) rotate(-45deg)' }}
          />
        </div>
      </div>

      {/* Right panel — 1/3 width, three stacked rows */}
      <div className="w-full md:w-1/3 flex flex-col h-full">
        {/* Top row — logo on black (20%) */}
        <div className="h-[20%] bg-black flex items-center justify-center px-8">
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

        {/* Middle row — CTA on light blue (55%) */}
        <div className="h-[55%] bg-[#82D8EB] flex flex-col items-center justify-center px-8 text-center text-black">
          <motion.h1
            className="text-[28px] font-medium leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {(report.heroHeadline || 'Webby 30:\nIn Review').split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </motion.h1>

          <motion.div
            className="mx-auto mb-4 mt-4"
            style={{ width: 40, height: 1, backgroundColor: 'black' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />

          <motion.p
            className="text-[15px] font-normal"
            style={{ color: 'rgba(0,0,0,0.65)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {report.heroSubtitle || 'A deeper look into the 30th Annual Webby Awards'}
          </motion.p>

          <motion.button
            onClick={onSeeReport}
            className="inline-flex items-center justify-between w-full max-w-[300px] bg-black text-white uppercase font-medium py-[22px] px-7 mt-8 text-sm tracking-wider hover:bg-gray-900 transition-colors cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span>{report.heroButtonText || 'See The Report'}</span>
            <span className="text-lg">→</span>
          </motion.button>
        </div>

        {/* Bottom row — trophy photo (25%) */}
        <div className="h-[25%] bg-black relative overflow-hidden">
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
