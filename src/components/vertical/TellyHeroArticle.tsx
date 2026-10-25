'use client'

import { motion } from 'framer-motion'

// Telly hero — "Option 1: Spliced Trophy w/ Icons" from the 48th Annual
// Telly Awards Figma deck (file KGIUkH0PpkaeX1S5hreOY7, node 2059:13037),
// adapted onto the site's dark #110E1F background per Ann's direction
// instead of the white card shown in the original mockup.
//
// The right-column visual ("MADE TO MOVE" + the spliced gold-trophy row
// + pop-art icon badges) is Ann's finished flattened graphic
// (trophy-row-final.jpg) rather than a hand-coded recreation — an
// earlier pass rebuilt the composition from raw Figma layer geometry,
// but the source trophy asset it used wasn't the right one.

interface TellyHeroArticleProps {
  titleLine1?: string
  titleLine2?: string
  subtitle?: string
  onEnter?: () => void
}

export function TellyHeroArticle({
  titleLine1 = 'The Telly Awards',
  titleLine2 = "What's On Demand",
  subtitle = "This is what moves us, this is what's moving the needle, this is what's moving the market.",
  onEnter,
}: TellyHeroArticleProps) {
  return (
    <div className="w-full max-w-[1300px] mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-14 px-6 md:px-10 pointer-events-auto">
      {/* Left: headline, subtitle, button */}
      <div className="w-full md:w-[42%] flex-shrink-0 text-center md:text-left">
        <motion.h1
          className="uppercase font-bold leading-[0.95] mb-5"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', letterSpacing: '0.04em', fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {titleLine1}<br />{titleLine2}
        </motion.h1>
        <motion.p
          className="mb-8 mx-auto md:mx-0"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(255,255,255,0.75)', fontWeight: 700, fontSize: 'clamp(1rem, 1.6vw, 1.35rem)', lineHeight: 1.4, maxWidth: 420 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {subtitle}
        </motion.p>
        <motion.button
          onClick={() => onEnter?.()}
          className="inline-flex items-center gap-3 uppercase text-[13px] md:text-[14px] tracking-[2px] py-5 px-10 rounded-full cursor-pointer transition-colors bg-[#ef1e40] hover:bg-[#c8152f] text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <span>Explore The Report</span>
          <span>↓</span>
        </motion.button>
      </div>

      {/* Right: "Made To Move" + spliced trophy composition — one
          finished graphic, headline and all. */}
      <motion.div
        className="w-full md:w-[58%] rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- hero visual sized to its own container, not a next/image fit */}
        <img
          src="/telly/hero-v2/trophy-row-final.jpg"
          alt="Made to Move — The Telly Awards"
          className="w-full h-auto block"
        />
      </motion.div>
    </div>
  )
}
