'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { assetPath } from '@/lib/assetPath'

// Pixel-art icons from the production team's creative drop, scattered in
// the empty side gutters of a trend section and drifting slowly — the
// "add 50px icons that slowly float in the empty spaces" note from the
// review, placed the way Ann's colleague mocked it up: sparse, alternating
// sides, never over the copy.
//
// They live in the section's own horizontal padding (60px at md+, which
// is why they're hidden below lg — narrower breakpoints only have 20px of
// gutter and the icons would sit on top of the content). Purely
// decorative: aria-hidden and pointer-events-none throughout, so they
// never intercept a click meant for a card behind them.

// The section's side padding is 60px at md+ and only grows past a ~1670px
// viewport, so this is the real budget. 44px inset 8px leaves ~8px of
// clearance from the content edge; rotation is deliberately omitted
// because tilting a square inflates its bounding box enough to push the
// icon back over the cards.
const SIZE = 44
const INSET = 8

type Spot = {
  src: string
  /** Vertical position down the section. */
  top: string
  side: 'left' | 'right'
  /** Drift distance and duration, varied so they don't bob in lockstep. */
  drift: number
  duration: number
}

const ICONS = [
  'pink/Burst-Icon.png',
  'blue/Grid-Icon-3.png',
  'green/Arrow-1.png',
  'pink/Grid-Icon-3.png',
  'blue/VIdeo-Icon.png',
  'green/Burst-Icon.png',
  'pink/Arrow-2.png',
  'blue/Arrow-3.png',
  'green/Grid-Icon-3.png',
]

// Four per section, alternating sides down the page. Offsetting the icon
// list by the section index keeps neighbouring sections from repeating the
// same four shapes in the same order.
function spotsFor(sectionIndex: number): Spot[] {
  const layout: Omit<Spot, 'src'>[] = [
    { top: '14%', side: 'right', drift: 11, duration: 5.2 },
    { top: '34%', side: 'left', drift: 9, duration: 6.4 },
    { top: '61%', side: 'right', drift: 13, duration: 5.8 },
    { top: '83%', side: 'left', drift: 10, duration: 7.1 },
  ]
  return layout.map((l, i) => ({
    ...l,
    src: ICONS[(sectionIndex * 3 + i) % ICONS.length],
  }))
}

export function FloatingIcons({ sectionIndex = 0 }: { sectionIndex?: number }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="hidden lg:block absolute inset-0 pointer-events-none z-10" aria-hidden>
      {spotsFor(sectionIndex).map((s, i) => (
        <motion.img
          key={i}
          src={assetPath(`/telly/creative/icons/${s.src}`)}
          alt=""
          draggable={false}
          className="absolute select-none"
          style={{
            width: SIZE,
            height: 'auto',
            top: s.top,
            [s.side]: INSET,
          }}
          animate={reduceMotion ? undefined : { y: [-s.drift, s.drift, -s.drift] }}
          transition={reduceMotion ? undefined : { duration: s.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
