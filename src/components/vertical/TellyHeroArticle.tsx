'use client'

import { motion } from 'framer-motion'
import type { Report } from '@/sanity/types'
import { assetPath } from '@/lib/assetPath'

// Telly hero — "Option 1: Spliced Trophy w/ Icons" from the 48th Annual
// Telly Awards Figma deck (file KGIUkH0PpkaeX1S5hreOY7, node 2059:13037),
// adapted onto the site's dark #110E1F background per Ann's direction
// instead of the white card shown in the original mockup.
//
// The right-column visual is Ann's finished animated graphic
// (hero-v2/hero-collage.gif — a three-frame collage of Social Impact,
// Shows & Series and Branded Content work) rather than a hand-coded
// recreation. It replaced an earlier "MADE TO MOVE" spliced-trophy
// GIF, which is still in the repo at hero-v2/trophy-row-final.gif if
// it's ever needed back.
//
// Single static slide — this hero used to carousel between this content
// and the report's intro letter (<TellyIntroSlide>, with "More Info"
// advancing to it and dot pagination below), but that second slide's
// copy was folded into the "Recommended for You" section's own subtitle
// instead, making the carousel redundant. Removed along with it: the
// autoplay timer, wheel/touch swipe handling, and the dot pagination —
// none of it has anything left to switch between.

interface TellyHeroArticleProps {
  report: Report
  titleLine1?: string
  titleLine2?: string
  subtitle?: string
  onEnter?: () => void
}

export function TellyHeroArticle({
  report,
  titleLine1 = 'The Telly Awards',
  titleLine2,
  subtitle = 'A curation of the winning companies and shows worth your scroll.',
  onEnter,
}: TellyHeroArticleProps) {
  // The headline is one line unless the CMS copy explicitly breaks it into
  // two (see HeroSection's `heroHeadline` split), so everything that reads
  // it has to tolerate a missing second line rather than printing
  // "undefined" after the title.
  const onNowLabel = [titleLine1, titleLine2].filter(Boolean).join(' ')

  return (
    <div className="relative w-full max-w-[1300px] mx-auto pointer-events-auto">
      {/* Background wash — same red/blue glow used at rest throughout. */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '-10% -5%',
          background:
            'radial-gradient(ellipse 900px 500px at 15% -10%, rgba(239,30,64,0.16), transparent 60%), radial-gradient(ellipse 700px 400px at 95% 0%, rgba(12,117,255,0.14), transparent 60%)',
        }}
      />

      {/* On-air ticker */}
      <div
        className="relative mx-6 md:mx-10 mb-6 flex items-center gap-2.5 flex-wrap px-3.5 py-2 rounded-lg"
        // Transparent fill, solid 2px stroke in the hero's own red — same
        // treatment as every per-section On Now bar below.
        style={{ background: 'transparent', border: '2px solid #ef1e40' }}
      >
        <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: '#ef1e40' }} />
        <span
          className="text-[10.5px] font-bold uppercase"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", letterSpacing: 1.5, color: '#ef1e40' }}
        >
          On Now
        </span>
        <span className="text-[12px] font-semibold" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff' }}>
          {onNowLabel}
        </span>
        <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>•</span>
        <span className="text-[12px]" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(255,255,255,0.6)' }}>
          Up Next: Recommended For You
        </span>
      </div>

      <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-14 px-6 md:px-10">
          {/* Left: headline, metadata, subtitle, buttons */}
          <div className="w-full md:w-[42%] flex-shrink-0 text-center md:text-left">
            <motion.h1
              className="uppercase font-bold leading-[0.95] mb-4"
              style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', letterSpacing: '0.04em', fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {titleLine1}{titleLine2 && <><br />{titleLine2}</>}
            </motion.h1>

            <motion.div
              className="flex items-center justify-center md:justify-start flex-wrap gap-2.5 mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {/* Two tags max, both styled as outlined pill buttons —
                  transparent fill, solid 2px stroke in the tag's own full
                  color, matching the On Now bar's treatment. */}
              <span
                className="text-[12px] font-bold uppercase px-4 py-1.5 rounded-full"
                style={{ fontFamily: "'Basetica', -apple-system, sans-serif", border: '2px solid #2EFB5E', color: '#2EFB5E', letterSpacing: 1 }}
              >
                2026 Edition
              </span>
              <span
                className="text-[12px] font-bold uppercase px-4 py-1.5 rounded-full"
                style={{ fontFamily: "'Basetica', -apple-system, sans-serif", border: '2px solid #ffffff', color: '#ffffff', letterSpacing: 1 }}
              >
                48th Annual
              </span>
            </motion.div>

            <motion.p
              className="mb-8 mx-auto md:mx-0"
              style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(255,255,255,0.75)', fontWeight: 700, fontSize: 'clamp(1rem, 1.6vw, 1.35rem)', lineHeight: 1.4, maxWidth: 420 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              {subtitle}
            </motion.p>

            <motion.div
              className="flex items-center justify-center md:justify-start gap-3 flex-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <button
                onClick={() => onEnter?.()}
                className="inline-flex items-center gap-3 uppercase text-[13px] md:text-[14px] tracking-[2px] py-5 px-10 rounded-full cursor-pointer transition-colors bg-[#ef1e40] hover:bg-[#c8152f] text-white"
              >
                <span>{report.heroButtonText || 'Explore The Report'}</span>
                <span>↓</span>
              </button>
            </motion.div>
          </div>

          {/* Right: the hero collage, framed as a retro CRT television —
              the "old cable guide" concept from the Figma deck carried
              through to the hero itself. */}
          <motion.div
            className="relative w-full md:w-[58%] flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: '130%',
                height: '130%',
                left: '-15%',
                top: '-15%',
                background: 'radial-gradient(circle, rgba(190,200,255,0.3), rgba(190,200,255,0.08) 45%, transparent 70%)',
                filter: 'blur(34px)',
              }}
              animate={{ opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <RetroTv />
          </motion.div>
        </div>
    </div>
  )
}

// A CSS-built mid-century CRT television — wood cabinet, control knobs,
// speaker grille, tapered legs — framing the trophy graphic like a
// broadcast on an old set. The screen "powers on" (collapses to a thin
// line, then expands with a bright flash) on mount, then settles into a
// slow looping scanline sweep so the set reads as live.
// The hero television. The cabinet is the production team's supplied
// photograph (public/telly/creative/retro-tv.png) rather than the CSS
// construction it replaced — that PNG has a genuinely transparent screen
// cutout, so the hero GIF is simply positioned behind it at the
// cutout's own measured rect and shows through. Those percentages come
// from flood-filling the PNG's alpha channel, so re-measure them if the
// artwork is ever swapped.
const TV_ART_ASPECT = 2374 / 1726
const TV_SCREEN = { left: '7.41%', top: '9.97%', width: '64.24%', height: '70.8%' }

function RetroTv() {
  return (
    <div className="relative w-full" style={{ aspectRatio: String(TV_ART_ASPECT) }}>
      {/* Screen content, behind the cabinet art and clipped to the cutout */}
      <div className="absolute overflow-hidden" style={{ ...TV_SCREEN, background: '#000000' }}>
        {/* The picture itself — always fully rendered, never faded, so
            nothing bleeds through the black cover below. Only its scale
            animates, for the classic tube unfold. */}
        <motion.div
          className="absolute inset-0"
          style={{ transformOrigin: 'center' }}
          initial={{ scaleY: 0.04 }}
          animate={{ scaleY: [0.04, 1.05, 0.98, 1.01, 1] }}
          transition={{ duration: 0.5, delay: 0.95, times: [0, 0.5, 0.7, 0.85, 1], ease: [0.16, 1, 0.3, 1] }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- hero visual sized to its own container, not a next/image fit */}
          <img
            src={assetPath('/telly/hero-v2/hero-collage.gif')}
            alt="Winning work across Social Impact, Shows & Series and Branded Content"
            // Cover is safe here: this artwork is 460x370 (1.243) against a
            // 1.248 screen cutout, so it fills the tube with no meaningful
            // crop. The previous hero GIF was much wider and needed
            // `contain` to avoid clipping its lockup.
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>

        {/* Opaque black cover — screen reads as fully off, then flickers
            open in a couple of uneven bright glimpses before the picture
            locks in, like an old CRT warming up. */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0.1, 1, 0.05, 0.7, 0, 0.25, 0] }}
          transition={{ duration: 1, delay: 0.65, times: [0, 0.3, 0.36, 0.44, 0.52, 0.62, 0.7, 0.8, 1] }}
        />

        {/* Power-on flash, right as the picture locks in */}
        <motion.div
          className="absolute inset-0 bg-white pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.4, delay: 1.3, times: [0, 0.3, 1] }}
        />

        {/* Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 3px)',
            opacity: 0.35,
          }}
        />
      </div>

      {/* Cabinet art on top — its transparent screen area lets the picture
          above show through, and the rest of the set occludes it. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- photographic cabinet, sized to its own container */}
      <img
        src={assetPath('/telly/creative/retro-tv.png')}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        draggable={false}
      />
    </div>
  )
}
