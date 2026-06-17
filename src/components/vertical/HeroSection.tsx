'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Report, CarouselImage } from '@/sanity/types'
import Image from 'next/image'
import { ImageCarousel } from '../ImageCarousel'
import { urlFor } from '@/sanity/image'

const LOCAL_HERO_IMAGES = [
  '/anthem/hero-1.jpg',
  '/anthem/hero-2.jpg',
  '/anthem/hero-3.jpg',
]

// Scattered around sides and bottom — avoiding center text and faces.
// Each icon has a unique float amplitude + duration so they don't bob in
// lockstep, and is drag-enabled (Framer Motion `drag`) inside DraggableIcon.
const CAUSE_ICONS = [
  // Left edge
  { src: '/anthem/CAUSE_HEALTH.svg', top: '44%', left: '3%', size: 168, rotate: -8, float: { y: [-14, 14], duration: 3.6 } },
  { src: '/anthem/CAUSE_DIVERSITY.svg', top: '67%', left: '10%', size: 149, rotate: 10, float: { y: [-10, 10], duration: 4.4 } },
  // Bottom left
  { src: '/anthem/CAUSE_EDUCATION.svg', bottom: '3%', left: '5%', size: 139, rotate: -12, float: { y: [-16, 16], duration: 4 } },
  // Bottom-center
  { src: '/anthem/CAUSE_SUSTAINABILITY.svg', bottom: '1%', left: '42%', size: 156, rotate: 6, float: { y: [-11, 11], duration: 4.8 } },
  // Right edge
  { src: '/anthem/CAUSE_HUMINATARIAN.svg', top: '42%', right: '3%', size: 163, rotate: -6, float: { y: [-13, 13], duration: 3.8 } },
  { src: '/anthem/CAUSE_HUMANRIGHTS.svg', top: '67%', right: '10%', size: 144, rotate: 14, float: { y: [-15, 15], duration: 4.6 } },
  // Bottom right
  { src: '/anthem/CAUSE_TECHNOLOGY.svg', bottom: '4%', right: '5%', size: 154, rotate: -10, float: { y: [-12, 12], duration: 4.2 } },
]

// Lovie hero stickers — static placement inspired by the report's cover art.
// Italy sits higher in the center; Portugal and Spain peek in from the
// edges. A dotted curve (rendered separately) connects them.
const LOVIE_COUNTRY_STICKERS = [
  { src: '/lovie/country-portugal.svg', label: 'portugal', top: '42%', left: '-6%', size: 240, rotate: -6 },
  { src: '/lovie/country-italy.svg', label: 'italy', top: '24%', left: '50%', translateX: '-50%', size: 260, rotate: 0 },
  { src: '/lovie/country-spain.svg', label: 'spain', top: '42%', right: '-6%', size: 240, rotate: 6 },
]

const NAV_SECTIONS = [
  { id: 'section-01', label: 'The State of Social Impact' },
  { id: 'section-02', label: 'Where the Pressure Is Landing' },
  { id: 'section-03', label: 'How the Sector Is Responding' },
  { id: 'section-04', label: 'Takeaways' },
]

interface HeroSectionProps {
  report: Report
  carouselImages?: CarouselImage[]
  onSeeReport?: (anchor?: string) => void
}

export function HeroSection({ report, carouselImages, onSeeReport }: HeroSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isLovie = report.property === 'lovie'

  // Branding fork — every Anthem-specific value has a Lovie counterpart so
  // the JSX below stays a single tree. Anthem path resolves to the original
  // hardcoded values; Lovie path swaps in palette, logo, and copy.
  const theme = isLovie
    ? {
        logoSrc: '/lovie/lovie-logo-lockup-orange-white.svg',
        logoAlt: 'The Lovie Awards x Creative Hubs',
        // Lovie lockup is ~3x wider than tall — keep height the same so the
        // wider mark doesn't crowd the menu button.
        logoClassName: 'h-[44px] md:h-[62px] lg:h-[75px] w-auto',
        ctaUrl: 'https://www.lovieawards.com/',
        ctaBgClass: 'bg-[#ff6000] hover:bg-[#cc4d00]',
        ctaTextColorClass: 'text-white',
        brandLabel: 'By The Lovie Awards',
        brandLabelColor: '#ff6000',
        heroImages: [
          '/lovie/portrait-mirror-italy.jpg',
          '/lovie/portrait-havas-portugal.jpg',
          '/lovie/portrait-ciaopeople-italy.jpg',
        ],
        heroCaptions: ['MIRROR. Italy', 'Havas Lisbon & Arena Media. Portugal', 'Ciaopeople. Italy'],
        heroBgColor: '#21261A',
        gradientOverlay:
          'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.25) 100%)',
        titleColor: 'var(--anthem-cream)',
        subtitleColor: '#E3DDCA',
        // Lovie's title is ~2x the character count of Anthem's, so scale the
        // font down to keep it on one visual line on common viewports.
        titleClassName: 'text-[28px] md:text-[48px] lg:text-[64px] leading-[1.05] font-normal mb-3',
        titleLine1: 'The Lovie Awards x Creative Hubs Series',
        titleLine2: 'The Mediterranean',
        subtitle: 'Mapping the cities, communities, and ideas shaping Europe’s contributions to the Internet in 2026.',
      }
    : {
        logoSrc: '/anthem/anthem-sticker.svg',
        logoAlt: '6th Annual Anthem Awards',
        logoClassName: 'w-[80px] h-[80px] md:w-[120px] md:h-[120px] lg:w-[145px] lg:h-[145px]',
        ctaUrl: 'https://www.anthemawards.com/',
        ctaBgClass: 'bg-[#8C001C] hover:bg-[#a30022]',
        ctaTextColorClass: 'text-[#E3DDCA]',
        brandLabel: 'By The Anthem Awards',
        brandLabelColor: 'var(--anthem-green)',
        heroImages: LOCAL_HERO_IMAGES,
        heroCaptions: [] as string[],
        heroBgColor: '#21261A',
        gradientOverlay:
          'linear-gradient(135deg, rgba(33,38,26,0.85) 0%, rgba(33,38,26,0.6) 40%, rgba(33,38,26,0.5) 100%)',
        titleColor: 'var(--anthem-cream)',
        subtitleColor: '#E3DDCA',
        titleClassName: 'text-[40px] md:text-[78px] lg:text-[100px] leading-[1.0] font-normal mb-3',
        titleLine1: '2026 State of',
        titleLine2: 'Social Impact Report',
        subtitle: 'A pulse check with Impact leaders on the pressures and opportunities defining their work in 2026',
      }

  function handleNavClick(anchor: string) {
    setMenuOpen(false)
    onSeeReport?.(anchor)
  }
  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* Full-bleed background carousel */}
      <div className="absolute inset-0">
        {/* CMS carousel images override the local fallback */}
        <LocalHeroCarousel
          cmsImages={carouselImages}
          localImages={theme.heroImages}
          solidFallbackColor={theme.heroBgColor}
          captions={theme.heroCaptions}
          captionEyebrow={isLovie ? 'Featured' : undefined}
        />
        {/* Gradient overlay — heavier at bottom-left for text legibility
            against dark portrait photos. */}
        {theme.gradientOverlay !== 'none' && (
          <div
            className="absolute inset-0"
            style={{ background: theme.gradientOverlay }}
          />
        )}
      </div>

      {/* Minimal top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 md:px-[60px] py-6">
        {/* Brand logo — top left */}
        <motion.img
          src={theme.logoSrc}
          alt={theme.logoAlt}
          className={theme.logoClassName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />

        {/* Circular menu button — top right */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <a
            href={theme.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:block text-[10px] tracking-[2px] uppercase rounded-full py-2.5 px-6 transition-colors ${theme.ctaBgClass} ${theme.ctaTextColorClass}`}
          >
            Enter Now
          </a>
          <div className="relative">
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
              className="w-11 h-11 rounded-full border border-[#E3DDCA]/30 flex items-center justify-center hover:border-[#E3DDCA]/60 transition-colors cursor-pointer"
            >
              {menuOpen ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <line x1="1" y1="1" x2="13" y2="13" stroke="#E3DDCA" strokeWidth="1.5" />
                  <line x1="13" y1="1" x2="1" y2="13" stroke="#E3DDCA" strokeWidth="1.5" />
                </svg>
              ) : (
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                  <line x1="0" y1="1" x2="16" y2="1" stroke="#E3DDCA" strokeWidth="1.5" />
                  <line x1="0" y1="5" x2="16" y2="5" stroke="#E3DDCA" strokeWidth="1.5" />
                  <line x1="0" y1="9" x2="16" y2="9" stroke="#E3DDCA" strokeWidth="1.5" />
                </svg>
              )}
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute top-[52px] right-0 w-[280px] rounded-lg overflow-hidden z-50"
                  style={{ background: 'rgba(33, 38, 26, 0.96)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(227, 221, 202, 0.14)' }}
                >
                  {NAV_SECTIONS.map((section, i) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => handleNavClick(section.id)}
                      className="w-full text-left px-5 py-4 transition-colors hover:bg-[#8C001C]/30 flex items-baseline gap-3"
                      style={{
                        borderBottom: '1px solid rgba(227, 221, 202, 0.1)',
                      }}
                    >
                      <span className="text-[10px] tracking-[2px] uppercase" style={{ color: 'rgba(227, 221, 202, 0.5)' }}>
                        {`0${i + 1}`}
                      </span>
                      <span className="text-[13px] tracking-[1px] uppercase" style={{ color: '#E3DDCA' }}>
                        {section.label}
                      </span>
                    </button>
                  ))}

                  {/* Mobile-only CTA — desktop has the Enter Now pill in the header */}
                  <a
                    href={theme.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`md:hidden w-full text-left px-5 py-4 flex items-center justify-between gap-3 transition-colors hover:brightness-110 ${theme.ctaBgClass}`}
                  >
                    <span className={`text-[13px] tracking-[1px] uppercase font-medium ${theme.ctaTextColorClass}`}>
                      Enter Now
                    </span>
                    <span className={`text-base ${theme.ctaTextColorClass}`}>→</span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Anthem: seven draggable cause icons scattered around the edges with
          a floating bob. Lovie: no icons in the hero (the portrait carousel
          carries the visual weight); the LovieCountryRow component is kept
          in this file because we'll redeploy it on the opening letter / "in
          the report" section later. */}
      {!isLovie && CAUSE_ICONS.map((icon, i) => (
        <DraggableIcon key={i} icon={icon} index={i} />
      ))}

      {/* Center-aligned content — shifted down 40%.
          pointer-events-none on the wrapper so the empty space lets click+drag
          pass through to the cause icons underneath; the button below opts
          back in via pointer-events-auto. */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end text-center px-6 md:px-10 pointer-events-none" style={{ paddingBottom: '10vh' }}>
        <motion.h1
          className={theme.titleClassName}
          style={{ fontFamily: 'var(--font-display)', color: theme.titleColor, letterSpacing: '-2px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {theme.titleLine1}<br />{theme.titleLine2}
        </motion.h1>

        <motion.p
          className="text-[10px] md:text-[11px] tracking-[4px] uppercase mb-6"
          style={{ color: theme.brandLabelColor }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {theme.brandLabel}
        </motion.p>

        {/* Subtitle */}
        <motion.p
          className="text-[13px] md:text-[15px] tracking-[0.5px] mb-8 max-w-[500px]"
          style={{ color: theme.subtitleColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          {theme.subtitle}
        </motion.p>

        {/* Explore button */}
        <motion.button
          onClick={() => onSeeReport?.()}
          className={`inline-flex items-center gap-3 uppercase text-[13px] md:text-[14px] tracking-[2px] py-5 px-12 rounded-full transition-colors cursor-pointer pointer-events-auto ${theme.ctaBgClass} ${theme.ctaTextColorClass}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <span>Explore The Report</span>
          <span>↓</span>
        </motion.button>
      </div>

    </section>
  )
}

function DraggableIcon({ icon, index }: { icon: typeof CAUSE_ICONS[number]; index: number }) {
  // Two-layer setup so Framer's drag system and the continuous bob don't
  // fight over the same transform:
  //   - Outer motion.div owns drag + the entrance "snowflake" fall
  //   - Inner motion.img owns the bob (kicks in after the fall settles)
  const sizeClamp = `clamp(${Math.round(icon.size * 0.45)}px, ${Math.round(icon.size / 16)}vw + 40px, ${icon.size}px)`

  // Stagger entrance so they don't all drop at once
  const fallDelay = 0.3 + index * 0.18
  // Estimate fall duration so the bob can start once the icon has settled
  const settleDelay = fallDelay + 1.2

  return (
    <motion.div
      className="absolute z-10 cursor-grab active:cursor-grabbing pointer-events-auto"
      style={{
        width: sizeClamp,
        height: sizeClamp,
        ...(icon.top ? { top: icon.top } : {}),
        ...(icon.bottom ? { bottom: icon.bottom } : {}),
        ...(icon.left ? { left: icon.left } : {}),
        ...(icon.right ? { right: icon.right } : {}),
      }}
      drag
      dragMomentum={false}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.15, zIndex: 50 }}
      // Drop in from above the viewport, with a tumbling rotation, and let
      // a spring bring them to rest. damping/stiffness picked so they bounce
      // a touch on landing rather than a hard stop.
      initial={{ y: -900, rotate: icon.rotate - 80, opacity: 0 }}
      animate={{ y: 0, rotate: icon.rotate, opacity: 1 }}
      transition={{
        y: { type: 'spring', damping: 12, stiffness: 65, mass: 1, delay: fallDelay },
        rotate: { type: 'spring', damping: 14, stiffness: 80, delay: fallDelay },
        opacity: { duration: 0.4, delay: fallDelay },
      }}
    >
      <motion.img
        src={icon.src}
        alt=""
        className="w-full h-full pointer-events-none select-none"
        draggable={false}
        animate={{ y: icon.float.y }}
        transition={{
          duration: icon.float.duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: settleDelay,
        }}
      />
    </motion.div>
  )
}

function LovieCountryRow() {
  return (
    <>
      {/* Dotted curve connecting the three stickers. SVG stretches edge-to-
          edge; the path was authored against a 1000x600 viewBox so the curve
          peaks where Italy sits and dips toward Portugal/Spain on the sides. */}
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 40 360 Q 280 100, 500 230 Q 720 360, 960 360"
          fill="none"
          stroke="#000"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 14"
        />
      </svg>

      {/* The three country stickers — static, absolute-positioned. */}
      {LOVIE_COUNTRY_STICKERS.map((sticker) => {
        const s = sticker as typeof sticker & { left?: string; right?: string; translateX?: string }
        const sizeClamp = `clamp(${Math.round(s.size * 0.45)}px, ${Math.round(s.size / 16)}vw + 40px, ${s.size}px)`
        const translateX = s.translateX ? `translateX(${s.translateX}) ` : ''
        return (
          <motion.img
            key={s.label}
            src={s.src}
            alt={s.label}
            draggable={false}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute z-10 select-none pointer-events-none"
            style={{
              width: sizeClamp,
              height: 'auto',
              top: s.top,
              ...(s.left ? { left: s.left } : {}),
              ...(s.right ? { right: s.right } : {}),
              transform: `${translateX}rotate(${s.rotate}deg)`,
            }}
          />
        )
      })}
    </>
  )
}

function LocalHeroCarousel({
  cmsImages,
  localImages,
  solidFallbackColor,
  captions,
  captionEyebrow,
}: {
  cmsImages?: CarouselImage[]
  localImages?: string[]
  solidFallbackColor?: string
  captions?: string[]
  captionEyebrow?: string
}) {
  const [current, setCurrent] = useState(0)

  const images: string[] = cmsImages && cmsImages.length > 0
    ? cmsImages.map((c) => urlFor(c.image).width(2400).url())
    : localImages ?? []

  useEffect(() => {
    if (images.length === 0) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length])

  // When there are no images, render a flat color block so the gradient
  // overlay has something to sit on.
  if (images.length === 0) {
    return (
      <div className="absolute inset-0" style={{ background: solidFallbackColor ?? '#21261A' }} />
    )
  }

  const currentCaption = captions && captions[current]

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0">
        <Image
          src={images[current]}
          alt=""
          fill
          className="object-cover object-[center_20%]"
          priority
          unoptimized
        />
      </div>

      {/* Photo credit overlay — fades in/out as the carousel cycles. Lives
          above the gradient overlay (z-20) so it's always readable. */}
      {currentCaption && (
        <div className="absolute left-5 md:left-10 bottom-10 md:bottom-12 z-20 pointer-events-none">
          {captionEyebrow && (
            <p className="text-[10px] uppercase tracking-[3px] text-[#E3DDCA]/70 mb-1.5">
              {captionEyebrow}
            </p>
          )}
          <AnimatePresence mode="wait">
            <motion.p
              key={current}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="text-[14px] md:text-[18px] text-[#E3DDCA] font-medium"
            >
              {currentCaption}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
