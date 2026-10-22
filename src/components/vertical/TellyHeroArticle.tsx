'use client'

import { motion } from 'framer-motion'

// Telly hero — "Option 1: Spliced Trophy w/ Icons" from the 48th Annual
// Telly Awards Figma deck (file KGIUkH0PpkaeX1S5hreOY7, node 2059:13037),
// adapted onto the site's dark #110E1F background per Ann's direction
// instead of the white card shown in the original mockup. All geometry
// below is converted from the design's absolute px coordinates to
// percentages of their containing frame so the composition scales
// responsively instead of staying pinned to the deck's 1920px frame.

// Right-panel "Frame 2147225080" is 870.069 × 646.945 in the design —
// every badge/icon/trophy-frame percentage below is relative to that
// frame's own box.
const TROPHY_FRAME = { left: 4.96, top: 8.18, width: 90.05, height: 86.44 }

// The 8 "spliced" trophy slices inside TROPHY_FRAME. left/top/width/height
// are the slice's own box (as a % of TROPHY_FRAME); imgLeft/imgTop/imgW/imgH
// are the gold-trophy image's crop window within that slice (already
// percentages in the source design — copied verbatim).
const TROPHY_SLICES = [
  { left: 46.68, top: 56.63, width: 26.15, height: 113.28, imgH: 94.94, imgLeft: -5.15, imgTop: -0.03, imgW: 100.73 },
  { left: 25.73, top: 56.67, width: 15.75, height: 113.37, imgH: 94.86, imgLeft: -8.55, imgTop: 0, imgW: 167.27 },
  { left: 12.17, top: 56.67, width: 11.37, height: 113.37, imgH: 94.86, imgLeft: -11.85, imgTop: 0, imgW: 231.72 },
  { left: 3.26, top: 56.67, width: 6.47, height: 113.37, imgH: 94.86, imgLeft: -20.83, imgTop: 0, imgW: 407.38 },
  { left: 67.47, top: 56.67, width: 15.43, height: 113.37, imgH: 94.86, imgLeft: -80.35, imgTop: 0, imgW: 170.66 },
  { left: 81.28, top: 56.67, width: 12.2, height: 113.37, imgH: 94.86, imgLeft: -126.42, imgTop: 0, imgW: 215.87 },
  { left: 91.24, top: 56.67, width: 7.72, height: 113.37, imgH: 94.86, imgLeft: -257.99, imgTop: 0, imgW: 341.31 },
  { left: 97.55, top: 56.67, width: 4.9, height: 113.37, imgH: 94.86, imgLeft: -463.89, imgTop: -0.02, imgW: 537.39 },
]

// Pop-art color badges — position/size are % of the 870.069×646.945
// right-panel frame (same basis as TROPHY_FRAME above).
const BADGES: { left: number; top: number; width: number; height: number; color: string; flip?: string }[] = [
  { left: 12.93, top: 49.07, width: 5.99, height: 8.05, color: '#005aff' },
  { left: 90.71, top: 17.98, width: 7.23, height: 5.99, color: '#f41fc9' },
  { left: 1.86, top: 56.78, width: 5.99, height: 8.05, color: '#005aff' },
  { left: 37.97, top: 88.11, width: 8.35, height: 9.25, color: '#f41fc9' },
  { left: 27.07, top: 88.05, width: 11.13, height: 9.31, color: '#f41fc9', flip: 'rotate(180deg)' },
  { left: 75.07, top: 55.29, width: 7.09, height: 5.9, color: '#2efb5e', flip: 'scaleY(-1)' },
  { left: 83.37, top: 69.38, width: 15.7, height: 11.51, color: '#2efb5e', flip: 'scaleY(-1)' },
]

// Icon glyphs — each positioned via inset (top/right/bottom/left, all %)
// relative to the same 870.069×646.945 right-panel frame as the badges
// above (not relative to their badge — the design nests them as siblings
// sharing the outer frame's coordinate space).
const ICONS: { src: string; inset: [number, number, number, number] }[] = [
  { src: '/telly/hero-v2/icon-a.svg', inset: [49.91, 81.56, 43.71, 13.68] },
  { src: '/telly/hero-v2/icon-b1.svg', inset: [17.98, 6.23, 76.03, 90.71] },
  { src: '/telly/hero-v2/icon-b2.svg', inset: [17.98, 4.14, 76.03, 92.79] },
  { src: '/telly/hero-v2/icon-b3.svg', inset: [17.98, 2.06, 76.03, 94.88] },
  { src: '/telly/hero-v2/icon-g.svg', inset: [57.13, 92.71, 35.52, 2.41] },
  { src: '/telly/hero-v2/icon-c1.svg', inset: [88.98, 54.42, 3.35, 42.01] },
  { src: '/telly/hero-v2/icon-c2.svg', inset: [88.98, 57.54, 3.35, 38.89] },
  { src: '/telly/hero-v2/icon-d1.svg', inset: [89.7, 63.73, 4.28, 29] },
  { src: '/telly/hero-v2/icon-d2.svg', inset: [91.02, 65.4, 5.61, 30.67] },
  { src: '/telly/hero-v2/icon-e.svg', inset: [65.13, 9.6, 30.35, 84.47] },
  { src: '/telly/hero-v2/icon-f.svg', inset: [71.34, 2.6, 21.04, 85.58] },
]

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

      {/* Right: "Made To Move" + spliced trophy composition */}
      <motion.div
        className="w-full md:w-[58%]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <p
          className="mb-4 uppercase text-center md:text-left"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontSize: 'clamp(1.5rem, 3.3vw, 2.75rem)', lineHeight: 1 }}
        >
          Made to <em style={{ fontStyle: 'italic', fontWeight: 700 }}>move</em>
        </p>
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '870 / 647' }}>
          {/* Duotone photo underlay */}
          <div className="absolute inset-0 opacity-15">
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative background, not an LCP candidate */}
            <img src="/telly/hero-v2/trophy-bg-photo.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(152deg, #fbcbff 6.8%, #0e634b 114.6%)', mixBlendMode: 'hue' }}
          />

          {/* Spliced trophy row */}
          <div className="absolute" style={{ left: `${TROPHY_FRAME.left}%`, top: `${TROPHY_FRAME.top}%`, width: `${TROPHY_FRAME.width}%`, height: `${TROPHY_FRAME.height}%` }}>
            {TROPHY_SLICES.map((s, i) => (
              <div
                key={i}
                className="absolute overflow-hidden"
                style={{ left: `${s.left}%`, top: `${s.top}%`, width: `${s.width}%`, height: `${s.height}%`, transform: 'translate(-50%, -50%)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- repeated decorative crop of one source image, not a next/image fit */}
                <img
                  src="/telly/hero-v2/gold-trophy.png"
                  alt=""
                  className="absolute max-w-none"
                  style={{ height: `${s.imgH}%`, width: `${s.imgW}%`, left: `${s.imgLeft}%`, top: `${s.imgTop}%` }}
                />
              </div>
            ))}
          </div>

          {/* Pop-art color badges */}
          {BADGES.map((b, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%`, background: b.color, transform: b.flip }}
            />
          ))}

          {/* Icon glyphs — siblings of the badges, same frame coordinates */}
          {ICONS.map((icon, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- small decorative glyph
            <img
              key={i}
              src={icon.src}
              alt=""
              className="absolute"
              style={{ top: `${icon.inset[0]}%`, right: `${icon.inset[1]}%`, bottom: `${icon.inset[2]}%`, left: `${icon.inset[3]}%` }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
