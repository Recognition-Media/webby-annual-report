'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Report, CarouselImage } from '@/sanity/types'
import Image from 'next/image'
import { ImageCarousel } from '../ImageCarousel'
import { urlFor } from '@/sanity/image'
import { useImageBrightness, type Tone } from '@/lib/useImageBrightness'
import { trackCtaClick } from '@/lib/analytics'

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

// Lovie nav — short keywords that mirror "Inside the Report" while
// staying readable in the menu tile. Full trend titles in KeyFindings
// run 4–7 words each, which wraps awkwardly in the 280px-wide menu.
const LOVIE_NAV_SECTIONS = [
  { id: 'trend-01', label: 'Beyond Capital Cities' },
  { id: 'trend-02', label: 'Smaller Players' },
  { id: 'trend-03', label: 'Internationalism' },
  { id: 'trend-04', label: 'Cultural Specificity' },
  { id: 'trend-05', label: 'Digital Sovereignty' },
  { id: 'section-takeaways', label: 'Takeaways' },
]

// Shared Influence nav — mirrors the section list in the draft copy PDF.
// Each id targets the section cover / content that will render as
// `section-<n>` in the Anthem vertical template. Takeaways uses its
// own anchor (added when the section is built out).
const SHARED_INFLUENCE_NAV_SECTIONS = [
  { id: 'section-01', label: 'The New Trusted Institutions' },
  { id: 'section-02', label: 'Finding the Right Partners' },
  { id: 'section-03', label: 'Making It Work' },
  { id: 'section-04', label: 'Formats That Drive Impact' },
  { id: 'section-05', label: 'The Challenges with Creator Partnerships' },
  { id: 'section-06', label: 'Navigating the Value Exchange' },
  { id: 'takeaways', label: 'Takeaways' },
]

interface HeroSectionProps {
  report: Report
  carouselImages?: CarouselImage[]
  onSeeReport?: (anchor?: string) => void
}

export function HeroSection({ report, carouselImages, onSeeReport }: HeroSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  // Tone of the current hero bg image — drives text-light vs text-dark on
  // the section. Defaults to 'light' (white text) which matches the prior
  // hardcoded behavior; LocalHeroCarousel updates this as images cycle.
  const [textTone, setTextTone] = useState<Tone>('light')
  const isLovie = report.property === 'lovie'
  // Shared Influence: an Anthem-property report but with its own hero
  // treatment (purple ground, illustrated icons baked into the artwork,
  // fluid Roc/Decoy title stack). Detected by slug so the existing
  // State of Social Impact hero is untouched.
  const isSharedInfluence =
    report.property === 'anthem' &&
    report.slug?.current === 'shared-influence-creator-partnerships-nonprofit'
  // Hover state for the Shared Influence pills. We track this in React
  // and apply the base + hover colours via inline style so nothing in
  // the Tailwind cascade can override it (CSS-only approach lost the
  // specificity race with something in the utility pipeline).
  const [hoverEnter, setHoverEnter] = useState(false)
  const [hoverExplore, setHoverExplore] = useState(false)
  const siCtaStyle = (hovered: boolean): React.CSSProperties => ({
    background: hovered ? '#066DBA' : '#E3DDCA',
    color: hovered ? '#E3DDCA' : '#21261A',
    fontFamily: "'roc-grotesk-wide', 'roc-grotesk-variable', -apple-system, sans-serif",
    fontWeight: 700,
    fontVariationSettings: '"wght" 700, "wdth" 125',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  })

  // Branding fork — every Anthem-specific value has a Lovie counterpart so
  // the JSX below stays a single tree. Anthem path resolves to the original
  // hardcoded values; Lovie path swaps in palette, logo, and copy.
  const theme = isLovie
    ? {
        logoSrc: '/lovie/lovie-logo-lockup.svg',
        logoAlt: 'The Lovie Awards x Creative Hubs',
        // Lovie lockup is ~3x wider than tall — keep height the same so the
        // wider mark doesn't crowd the menu button.
        logoClassName: 'h-[44px] md:h-[62px] lg:h-[75px] w-auto',
        ctaUrl: 'https://www.lovieawards.com/',
        ctaBgClass: 'bg-[#ff6000] hover:bg-[#cc4d00]',
        ctaTextColorClass: 'text-white',
        brandLabel: '',
        brandLabelColor: '#ff6000',
        // TEST: use the trend-report background PNG as a static hero image
        // (single-frame "carousel"). Designer wants to evaluate the lime
        // composition before deciding whether to keep portraits.
        // v4 — designer's latest: three stickers staggered at top with a
        // dotted curve, leaving the bottom 60–70% open for title + CTA.
        heroImages: ['/lovie/trend-report-background-v4.png'],
        // Portrait-orientation variant used when the viewport is mobile-
        // sized; the desktop image's three-hearts-with-curve composition
        // doesn't crop well below ~768px wide.
        heroImagesMobile: ['/lovie/trend-report-background-mobile.png'],
        heroCaptions: [] as string[],
        heroBgColor: '#eeffbb',
        gradientOverlay: 'none',
        titleColor: '#000000',
        subtitleColor: '#000000',
        // Lovie title — three-line editorial stack, Scto Grotesk A Medium.
        // Lines 1 & 2 are uppercase brand mark; line 3 (location) is title
        // case + italic for an editorial accent.
        titleClassName: 'mb-3',
        titleStyle: {
          fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
          // Black against the lime trend-background. If we switch the hero
          // back to dark portraits, this becomes lime (#eeffbb) again.
          color: '#000000',
          fontWeight: 500,
          fontSize: 'clamp(2.25rem, 6.5vw, 5.5rem)',
          lineHeight: 1.05,
          margin: 0,
          maxWidth: '100%',
          wordBreak: 'break-word' as const,
        },
        // titleLine1/2 unused for Lovie (a custom 3-span structure is rendered
        // via theme.titleNode instead). Kept blank to preserve the type.
        titleLine1: '',
        titleLine2: '',
        titleNode: (
          <>
            <span
              style={{
                display: 'block',
                fontSize: 'clamp(2.25rem, 6.5vw, 5.5rem)',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                lineHeight: 1.05,
                fontWeight: 500,
              }}
            >
              The Lovie Awards
            </span>
            <span
              style={{
                display: 'block',
                fontSize: 'clamp(2.25rem, 6.5vw, 5.5rem)',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                lineHeight: 1.05,
                fontWeight: 500,
                marginTop: 4,
              }}
            >
              Creative Hubs Series
            </span>
            <span
              style={{
                display: 'block',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontStyle: 'italic',
                lineHeight: 1.2,
                marginTop: 18,
                fontWeight: 500,
              }}
            >
              The Mediterranean
            </span>
          </>
        ),
        subtitle: 'Mapping the cities, communities, and ideas shaping Europe’s contributions to the Internet in 2026.',
      }
    : isSharedInfluence
    ? {
        // Anthem-property report with its own hero treatment. Purple
        // ground, cause icons baked into the artwork (so we skip the
        // floating draggable icons), Roc Grotesk display title in cream
        // over the purple, Decoy tagline in moss below. Everything else
        // (footer, credits, section covers) still uses the default
        // Anthem theme via report.property === 'anthem'.
        logoSrc: '/anthem/anthem-sticker.svg',
        logoAlt: 'Anthem Awards',
        logoClassName: 'w-[80px] h-[80px] md:w-[120px] md:h-[120px] lg:w-[145px] lg:h-[145px]',
        ctaUrl: 'https://www.anthemawards.com/',
        // Beige pill + moss text against the purple hero — swaps the
        // default red CTA styling used by the State of Social Impact
        // report. Applies to both the top-right "Enter Now" pill and
        // the "Explore The Report" button below the title.
        ctaBgClass: 'bg-[#E3DDCA] hover:bg-[#d5cfbc]',
        ctaTextColorClass: 'text-[#21261A]',
        brandLabel: '',
        brandLabelColor: 'var(--anthem-green)',
        heroImages: ['/anthem/shared-influence-hero-bg.png'],
        heroImagesMobile: ['/anthem/shared-influence-hero-bg-mobile.png'] as string[] | undefined,
        heroCaptions: [] as string[],
        heroBgColor: '#D17DD0',
        // No gradient overlay — purple ground should read as-is.
        gradientOverlay: 'none',
        titleColor: '#E3DDCA',
        subtitleColor: '#21261A',
        titleClassName: '',
        titleStyle: {
          margin: 0,
        },
        titleLine1: '',
        titleLine2: '',
        // titleNode owns all the fluid sizing so title and subtitle
        // scale in proportion (title uses 9.5vw slope, subtitle 2.8vw
        // — same 3.38:1 ratio at every viewport in the fluid range).
        titleNode: (
          <span
            // Mobile size fixed at 70px per design; desktop keeps the
            // fluid clamp so it scales from ~48px → 125px across the
            // md+ viewport range.
            className="block text-[70px] md:text-[clamp(3rem,9.5vw,125px)]"
            style={{
              fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
              color: '#E3DDCA',
              fontWeight: 500,
              textTransform: 'uppercase',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
            }}
          >
            Shared Influence
          </span>
        ),
        subtitle: 'A playbook for creator partnerships that drive social impact',
        subtitleStyle: {
          fontFamily: "'decoy', Georgia, serif",
          // 37px at ≥1320px; scales down proportionally with the title
          // via matching vw slope. min 1.125rem keeps it legible below
          // the fluid range.
          fontSize: 'clamp(1.125rem, 2.8vw, 37px)',
          fontWeight: 700,
          color: '#21261A',
          lineHeight: 1.2,
          // Allow the subtitle to wrap on narrow viewports so it doesn't
          // overflow horizontally. Desktop keeps one-line rhythm via
          // `md:whitespace-nowrap` on the subtitle element itself.
          // Section is bottom-anchored (justify-end), so adding extra
          // bottom margin here nudges the title+subtitle pair up while
          // keeping the CTA in place. Dial up/down to taste.
          marginBottom: 'calc(2rem + 75px)',
        },
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
        heroImagesMobile: undefined as string[] | undefined,
        heroCaptions: [] as string[],
        heroBgColor: '#21261A',
        gradientOverlay:
          'linear-gradient(135deg, rgba(33,38,26,0.85) 0%, rgba(33,38,26,0.6) 40%, rgba(33,38,26,0.5) 100%)',
        titleColor: 'var(--anthem-cream)',
        subtitleColor: '#E3DDCA',
        titleClassName: 'text-[40px] md:text-[78px] lg:text-[100px] leading-[1.0] font-normal mb-3',
        titleStyle: {
          fontFamily: 'var(--font-display)',
          color: 'var(--anthem-cream)',
          letterSpacing: '-2px',
        },
        titleLine1: '2026 State of',
        titleLine2: 'Social Impact Report',
        titleNode: undefined as React.ReactNode,
        subtitle: 'A pulse check with Impact leaders on the pressures and opportunities defining their work in 2026',
      }

  function handleNavClick(anchor: string) {
    setMenuOpen(false)
    onSeeReport?.(anchor)
  }
  return (
    <section
      id="hero"
      className={`relative w-full h-screen overflow-hidden ${textTone === 'light' ? 'text-light' : 'text-dark'}`}
      style={{ background: theme.heroBgColor }}
    >
      {/* Full-bleed background carousel */}
      <div className="absolute inset-0">
        {/* CMS carousel images override the local fallback */}
        <LocalHeroCarousel
          // While testing the lime trend-background hero, ignore CMS
          // carouselImages for Lovie so the local PNG fallback wins.
          // Revert to `carouselImages` for both when test is over.
          cmsImages={isLovie || isSharedInfluence ? undefined : carouselImages}
          localImages={theme.heroImages}
          localImagesMobile={theme.heroImagesMobile}
          solidFallbackColor={theme.heroBgColor}
          captions={theme.heroCaptions}
          captionEyebrow={isLovie ? 'Featured' : undefined}
          onToneChange={setTextTone}
          // Shared Influence's mobile bg is a full-bleed illustration
          // with stickers pre-composed at the top — no top gap and
          // anchor the image to the top of the frame so nothing gets
          // cropped off. Other reports keep the existing defaults.
          mobileTopOffsetPx={isSharedInfluence ? 0 : 100}
          objectPosition={isSharedInfluence ? 'top center' : 'center 20%'}
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

      {/* Minimal top bar. Hidden for Shared Influence — that report uses
          a dedicated sticky <SharedInfluenceTopNav> mounted in ReportView
          so the nav follows the scroll cleanly without any stacking or
          overflow concerns. */}
      {!isSharedInfluence && (
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center md:justify-between px-5 md:px-[60px] py-6">
        {/* Brand logo */}
        <motion.img
          src={theme.logoSrc}
          alt={theme.logoAlt}
          className={theme.logoClassName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />

        {/* Menu cluster — absolute on mobile so the logo stays centered. */}
        <motion.div
          className="absolute right-5 top-1/2 -translate-y-1/2 md:static md:translate-y-0 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <a
            href={theme.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCtaClick('header', theme.ctaUrl, report.property, report.slug.current)}
            onMouseEnter={isSharedInfluence ? () => setHoverEnter(true) : undefined}
            onMouseLeave={isSharedInfluence ? () => setHoverEnter(false) : undefined}
            onFocus={isSharedInfluence ? () => setHoverEnter(true) : undefined}
            onBlur={isSharedInfluence ? () => setHoverEnter(false) : undefined}
            className={`hidden md:block text-[10px] tracking-[2px] uppercase rounded-full py-2.5 px-6 ${isSharedInfluence ? '' : 'transition-colors ' + theme.ctaBgClass + ' ' + theme.ctaTextColorClass}`}
            style={isSharedInfluence ? siCtaStyle(hoverEnter) : undefined}
          >
            Enter Now
          </a>
          <div className="relative">
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              style={{
                border: isLovie ? '2px solid #ff6000' : '1px solid rgba(227,221,202,0.3)',
              }}
            >
              {menuOpen ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <line x1="1" y1="1" x2="13" y2="13" stroke={isLovie ? '#ff6000' : '#E3DDCA'} strokeWidth="1.5" />
                  <line x1="13" y1="1" x2="1" y2="13" stroke={isLovie ? '#ff6000' : '#E3DDCA'} strokeWidth="1.5" />
                </svg>
              ) : (
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                  <line x1="0" y1="1" x2="16" y2="1" stroke={isLovie ? '#ff6000' : '#E3DDCA'} strokeWidth="1.5" />
                  <line x1="0" y1="5" x2="16" y2="5" stroke={isLovie ? '#ff6000' : '#E3DDCA'} strokeWidth="1.5" />
                  <line x1="0" y1="9" x2="16" y2="9" stroke={isLovie ? '#ff6000' : '#E3DDCA'} strokeWidth="1.5" />
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
                  {(isLovie
                    ? LOVIE_NAV_SECTIONS
                    : isSharedInfluence
                      ? SHARED_INFLUENCE_NAV_SECTIONS
                      : NAV_SECTIONS
                  ).map((section, i) => (
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
                        {String(i + 1).padStart(2, '0')}
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
                    onClick={() => trackCtaClick('header', theme.ctaUrl, report.property, report.slug.current)}
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
      )}

      {/* Anthem: seven draggable cause icons scattered around the edges with
          a floating bob. Lovie: no icons in the hero (the portrait carousel
          carries the visual weight). Shared Influence: icons are baked
          into the purple background artwork, so we skip the interactive
          set to avoid a doubled-up composition. */}
      {!isLovie && !isSharedInfluence && CAUSE_ICONS.map((icon, i) => (
        <DraggableIcon key={i} icon={icon} index={i} />
      ))}

      {/* Center-aligned content — shifted down 40%.
          pointer-events-none on the wrapper so the empty space lets click+drag
          pass through to the cause icons underneath; the button below opts
          back in via pointer-events-auto. */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end text-center px-6 md:px-10 pointer-events-none pb-[23vh] md:pb-[10vh]">
        <motion.h1
          className={theme.titleClassName}
          style={theme.titleStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {theme.titleNode ?? <>{theme.titleLine1}<br />{theme.titleLine2}</>}
        </motion.h1>

        {/* Brand label (e.g. "By The Anthem Awards"). Skipped when the
            label is empty — Lovie's title already names the brand, so a
            label here would be redundant. */}
        {theme.brandLabel && (
          <motion.p
            className="text-[10px] md:text-[11px] tracking-[4px] uppercase mb-6"
            style={{ color: theme.brandLabelColor }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {theme.brandLabel}
          </motion.p>
        )}

        {/* Subtitle — inherits color from the section's text-light/text-dark
            tone class so it adapts to whatever's behind it. When theme
            supplies its own subtitleStyle (Shared Influence), those
            values win; otherwise fall back to the shared Anthem/Lovie
            defaults. */}
        <motion.p
          className={`tracking-[0.5px] mb-8 ${isSharedInfluence ? 'md:whitespace-nowrap' : ''}`}
          style={
            'subtitleStyle' in theme && theme.subtitleStyle
              ? theme.subtitleStyle
              : {
                  fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                  maxWidth: 600,
                  lineHeight: 1.45,
                }
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          {theme.subtitle}
        </motion.p>

        {/* Explore button */}
        <motion.button
          onClick={() => onSeeReport?.()}
          onMouseEnter={isSharedInfluence ? () => setHoverExplore(true) : undefined}
          onMouseLeave={isSharedInfluence ? () => setHoverExplore(false) : undefined}
          onFocus={isSharedInfluence ? () => setHoverExplore(true) : undefined}
          onBlur={isSharedInfluence ? () => setHoverExplore(false) : undefined}
          className={`inline-flex items-center gap-3 uppercase text-[13px] md:text-[14px] tracking-[2px] py-5 px-12 rounded-full cursor-pointer pointer-events-auto mt-6 md:mt-0 ${isSharedInfluence ? '' : 'transition-colors ' + theme.ctaBgClass + ' ' + theme.ctaTextColorClass}`}
          style={isSharedInfluence ? siCtaStyle(hoverExplore) : undefined}
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
  localImagesMobile,
  solidFallbackColor,
  captions,
  captionEyebrow,
  onToneChange,
  mobileTopOffsetPx = 100,
  objectPosition = 'center 20%',
}: {
  cmsImages?: CarouselImage[]
  localImages?: string[]
  /** Portrait-orientation variant rendered when the viewport is ≤ 768px. */
  localImagesMobile?: string[]
  solidFallbackColor?: string
  captions?: string[]
  captionEyebrow?: string
  /** Fired whenever the current image's average brightness changes the
   * recommended text tone. Parent uses it to swap text-light / text-dark
   * on the hero section. */
  onToneChange?: (tone: Tone) => void
  /** Top padding on mobile so the background starts below the header
   * bar (Lovie logo). Defaults to 100px; pass 0 for full-bleed. */
  mobileTopOffsetPx?: number
  /** CSS object-position applied to the hero image. Defaults to
   * `center 20%` (biases toward the top-third for landscape crops).
   * Pass `top` to anchor the top of the image to the top of the frame. */
  objectPosition?: string
}) {
  const [current, setCurrent] = useState(0)

  // Track whether we're on a mobile viewport so we can pick the
  // portrait-cropped artwork over the landscape one when available.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const localToUse = isMobile && localImagesMobile && localImagesMobile.length > 0
    ? localImagesMobile
    : localImages

  const images: string[] = cmsImages && cmsImages.length > 0
    ? cmsImages.map((c) => urlFor(c.image).width(2400).url())
    : localToUse ?? []

  // Compute the tone of the currently visible image and let the parent
  // section know so it can apply text-light / text-dark.
  const currentSrc = images[current]
  const tone = useImageBrightness(currentSrc)
  useEffect(() => {
    onToneChange?.(tone)
  }, [tone, onToneChange])

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
      {/* Inner wrapper holds the actual image. Mobile can add a top
          offset so the section's ground colour shows through at the
          top (used by Lovie for logo negative space). Desktop is
          always full-bleed. */}
      <div
        className="absolute inset-x-0 bottom-0 md:top-0"
        style={{ top: mobileTopOffsetPx }}
      >
        <Image
          src={images[current]}
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition }}
          priority
          unoptimized
        />
      </div>

      {/* Photo credit overlay — fades in/out as the carousel cycles. Color
          inherits from the section's text-light / text-dark tone class so
          it adapts to whatever's behind it. */}
      {currentCaption && (
        <div className="absolute left-5 md:left-10 bottom-10 md:bottom-12 z-20 pointer-events-none" style={{ opacity: 0.85 }}>
          {captionEyebrow && (
            <p className="text-[10px] uppercase tracking-[3px] mb-1.5" style={{ opacity: 0.8 }}>
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
              className="text-[14px] md:text-[18px] font-medium"
            >
              {currentCaption}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
