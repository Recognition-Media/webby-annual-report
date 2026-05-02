'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Report } from '@/sanity/types'

export function IntroLetter({ report }: { report: Report }) {
  const author = report.letterAuthors?.[0]
  const authorName = author?.name || 'Patricia McLoughlin'
  const authorTitle = author?.title || 'General Manager, The Anthem Awards'
  return (
    <section
      id="welcome-letter"
      data-snap
      className="relative overflow-hidden px-5 md:px-[60px] py-16 md:py-28"
      style={{
        background: '#21261A',
      }}
    >
      <div className="relative z-10 flex flex-col md:flex-row gap-10 md:gap-16" style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {/* Left: eyebrow + portrait + author info */}
        <div className="flex-shrink-0 flex flex-col items-center md:items-start md:sticky md:top-28 md:self-start" style={{ width: 'auto' }}>
          {/* Eyebrow above photo */}
          <p
            className="uppercase font-medium mb-5"
            style={{
              fontSize: 11,
              letterSpacing: 4,
              color: '#D17DD0',
            }}
          >
            Introduction
          </p>

          <div className="w-[200px] h-[250px] md:w-[300px] md:h-[390px] relative rounded-lg overflow-hidden mb-4">
            <Image
              src="/anthem/patricia-headshot.png"
              alt={authorName}
              fill
              className="object-cover object-[center_5%] scale-[1.2]"
            />
          </div>
          <p className="font-medium text-[15px] text-[#E3DDCA]">{authorName}</p>
          <p className="text-[13px] text-[#E3DDCA]/50">{authorTitle}</p>
        </div>

        {/* Right: letter content */}
        <div className="flex-1">
          {/* Header */}
          <motion.h2
            className="mb-6 text-[24px] md:text-[32px] leading-[1.2]"
            style={{
              fontFamily: 'var(--font-display)',
              color: '#E3DDCA',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our community is not waiting.
          </motion.h2>

          {/* Divider */}
          <div style={{ width: 40, height: 2, background: '#D17DD0', marginBottom: 24 }} />

          {/* Body */}
          <div
            data-content
            className="font-normal prose max-w-none [&_p]:mb-5 [&_p]:text-[15px] md:[&_p]:text-[16px] [&_p]:text-[#E3DDCA] [&_p]:leading-[28px] [&_strong]:text-[#E3DDCA] [&_strong]:font-medium [&_blockquote]:border-none [&_blockquote]:pl-0"
            style={{
              color: '#E3DDCA',
              fontSize: 16,
              lineHeight: '28px',
              fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Last year, the Anthem Awards launched the inaugural State of Social Impact Survey to find the source of what organizations in the United States and beyond were feeling in a time of upheaval. This year, we{"'"}re back to better understand the lasting impact of 2025{"'"}s regulatory, cultural, and funding challenges, and how we move forward together.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              If you{"'"}re reading this report, you probably aren{"'"}t surprised to hear that 2025 wasn{"'"}t a blip. The collapse of USAID, continued federal funding freezes, and the erosion of diversity initiatives have compounded into something that our community is still carrying.
            </motion.p>

            {/* Inline pull quote — breaks the text flow */}
            <motion.blockquote
              className="my-6 md:my-9 py-4 border-none"
              style={{ borderLeft: 'none' }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p
                className="!text-[20px] md:!text-[26px] !leading-[1.3] !mb-0"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: '#D17DD0',
                  fontStyle: 'italic',
                }}
              >
                We{"'"}ve seen something that no policy can easily dismantle: people showing up. From No Kings Day to the Flotilla, and the fight for our neighbors and friends in Minneapolis, collective action is alive, and it is loud.
              </p>
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              But we are also seeing renewed investment in grassroots organizing, in new tools and strategies, in cross-sector collaboration, and in the art of telling stories that change perspectives.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              The Anthem Awards sit at the intersection of nonprofits, brands, agencies, and institutions. A rare vantage point from which to take the sector{"'"}s pulse. This year, we are not just documenting the moment. We are committed to being a resource inside it, sharing openly, celebrating wins, and helping our community move from surviving to leading.
            </motion.p>
          </div>

          {/* Closing quote */}
          <motion.p
            className="mt-6 text-[15px] md:text-[16px]"
            style={{
              fontFamily: 'var(--font-display)',
              color: '#D17DD0',
              fontStyle: 'italic',
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Together, let{"'"}s set the new standard for good.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
