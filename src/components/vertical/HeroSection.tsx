'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Report, CarouselImage } from '@/sanity/types'
import Image from 'next/image'
import { ImageCarousel } from './ImageCarousel'

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
  { src: '/anthem/CAUSE_HEALTH.svg', top: '68%', left: '3%', size: 168, rotate: -8, float: { y: [-14, 14], duration: 3.6 } },
  { src: '/anthem/CAUSE_DIVERSITY.svg', top: '85%', left: '12%', size: 149, rotate: 10, float: { y: [-10, 10], duration: 4.4 } },
  // Bottom left
  { src: '/anthem/CAUSE_EDUCATION.svg', bottom: '3%', left: '28%', size: 139, rotate: -12, float: { y: [-16, 16], duration: 4 } },
  // Bottom center-right
  { src: '/anthem/CAUSE_SUSTAINABILITY.svg', bottom: '2%', right: '30%', size: 156, rotate: 6, float: { y: [-11, 11], duration: 4.8 } },
  // Right edge
  { src: '/anthem/CAUSE_HUMINATARIAN.svg', top: '65%', right: '3%', size: 163, rotate: -6, float: { y: [-13, 13], duration: 3.8 } },
  { src: '/anthem/CAUSE_HUMANRIGHTS.svg', top: '82%', right: '14%', size: 144, rotate: 14, float: { y: [-15, 15], duration: 4.6 } },
  // Bottom right
  { src: '/anthem/CAUSE_TECHNOLOGY.svg', bottom: '4%', right: '5%', size: 154, rotate: -10, float: { y: [-12, 12], duration: 4.2 } },
]

interface HeroSectionProps {
  report: Report
  carouselImages?: CarouselImage[]
  onSeeReport?: () => void
}

export function HeroSection({ report, carouselImages, onSeeReport }: HeroSectionProps) {
  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* Full-bleed background carousel */}
      <div className="absolute inset-0">
        {/* Use local Anthem hero images — CMS carousel can override later */}
        <LocalHeroCarousel />
        {/* Gradient overlay — heavier at bottom-left for text, lighter elsewhere to let image show */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(33,38,26,0.85) 0%, rgba(33,38,26,0.6) 40%, rgba(33,38,26,0.5) 100%)',
          }}
        />
      </div>

      {/* Minimal top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 md:px-[60px] py-6">
        {/* Anthem sticker logo — top left */}
        <motion.img
          src="/anthem/anthem-sticker.svg"
          alt="6th Annual Anthem Awards"
          className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] lg:w-[145px] lg:h-[145px]"
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
          <span className="hidden md:block text-[10px] text-[#E3DDCA] tracking-[2px] uppercase bg-[#8C001C] rounded-full py-2.5 px-6">Explore The Report</span>
          <button
            className="w-11 h-11 rounded-full border border-[#E3DDCA]/30 flex items-center justify-center hover:border-[#E3DDCA]/60 transition-colors cursor-pointer"
          >
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <line x1="0" y1="1" x2="16" y2="1" stroke="#E3DDCA" strokeWidth="1.5" />
              <line x1="0" y1="5" x2="16" y2="5" stroke="#E3DDCA" strokeWidth="1.5" />
              <line x1="0" y1="9" x2="16" y2="9" stroke="#E3DDCA" strokeWidth="1.5" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Cause icons — draggable, scattered around sides and bottom */}
      {CAUSE_ICONS.map((icon, i) => (
        <DraggableIcon key={i} icon={icon} index={i} />
      ))}

      {/* Center-aligned content — shifted down 40%.
          pointer-events-none on the wrapper so the empty space lets click+drag
          pass through to the cause icons underneath; the button below opts
          back in via pointer-events-auto. */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end text-center px-6 md:px-10 pointer-events-none" style={{ paddingBottom: '10vh' }}>
        <motion.h1
          className="text-[40px] md:text-[78px] lg:text-[100px] leading-[1.0] font-normal mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--anthem-cream)', letterSpacing: '-2px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          2026 State of<br />Social Impact Report
        </motion.h1>

        <motion.p
          className="text-[10px] md:text-[11px] tracking-[4px] uppercase mb-6"
          style={{ color: 'var(--anthem-green)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          By The Anthem Awards
        </motion.p>

        {/* Subtitle */}
        <motion.p
          className="text-[13px] md:text-[15px] text-[#E3DDCA] tracking-[0.5px] mb-8 max-w-[500px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          A pulse check with Impact leaders on the pressures and opportunities defining their work in 2026
        </motion.p>

        {/* Explore button */}
        <motion.button
          onClick={onSeeReport}
          className="inline-flex items-center gap-3 bg-[#8C001C] text-[#E3DDCA] uppercase text-[13px] md:text-[14px] tracking-[2px] py-5 px-12 rounded-full hover:bg-[#a50022] transition-colors cursor-pointer pointer-events-auto"
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

function LocalHeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % LOCAL_HERO_IMAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0">
        <Image
          src={LOCAL_HERO_IMAGES[current]}
          alt=""
          fill
          className="object-cover object-[center_20%]"
          priority
        />
      </div>
    </div>
  )
}
