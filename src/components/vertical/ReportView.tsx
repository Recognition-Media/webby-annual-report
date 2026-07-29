'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { Report, ExpertQuote } from '@/sanity/types'
import type { PortableTextBlock } from '@portabletext/types'
import { urlFor } from '@/sanity/image'
import { HeroSection } from './HeroSection'
import { SignupGate } from './SignupGate'
import { EntryStats } from '../EntryStats'
import { IadasSection } from '../IadasSection'
import { IntroLetter } from './IntroLetter'
import { TrendSection } from '../TrendSection'
import { TrendContainer } from '../TrendContainer'
import { AnthemFooter } from './AnthemFooter'
import { LovieFooter } from './LovieFooter'
import {
  TwoColumnSlab,
  SectionHeader,
  SharedInfluenceBody,
  ComparisonCallout,
  TipsForSuccess,
  VideoModule,
  PullQuote,
  AudienceBlock,
  ContentSlabsRenderer,
  ContentBlockList,
  FullWidthSlab,
  Heading,
  ScrollingCards,
} from './SharedInfluenceModules'
import { KeyFindings } from './KeyFindings'
import { ReportSectionCover, TrendContent } from './ReportSection'
import { AnthemBottomNav } from './AnthemBottomNav'
import { SharedInfluenceTopNav, SHARED_INFLUENCE_NAV_SECTIONS } from './SharedInfluenceTopNav'
import { NordicsTopNav, NORDICS_NAV_SECTIONS } from './NordicsTopNav'
import { NordicsDataModule } from './NordicsDataModule'
import { ANTHEM_CARD_CYCLE } from './SharedInfluenceModules'
import { trackCtaClick } from '@/lib/analytics'
import { LovieTrendContent } from './LovieTrendContent'
import { NordicsOnesToWatch } from './NordicsOnesToWatch'
import { QuoteVideoSection } from './QuoteVideoSection'
import { BubbleChart } from './BubbleChart'
import { PairedBarChart } from './PairedBarChart'
import { TabbedPriorities } from './TabbedPriorities'
import { Takeaways } from './Takeaways'
import { LovieTakeaways } from './LovieTakeaways'
import { SurveyDemographics } from './SurveyDemographics'
import { Credits } from './Credits'
import { AnalyticsScripts } from '../AnalyticsScripts'
import { ScrollReveal } from '../ScrollReveal'
import { ReportScroll } from '../SmoothScroll'
import { AnimatedBg } from '../AnimatedBg'
import { IdleArrows } from '../IdleArrows'
import { TrendIntro } from '../TrendIntro'
import { MobileNav } from '../MobileNav'

type ResolvedQuote = { name: string; title: string; text: string; headshotUrl?: string; borderColor?: string }

function portableTextToPlain(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks) return ''
  return blocks
    .map((block) => {
      if (block._type !== 'block') return ''
      const children = (block as { children?: { text?: string }[] }).children || []
      return children.map((c) => c.text || '').join('')
    })
    .filter(Boolean)
    .join(' ')
}

function resolveTrendQuotes(quotes: ExpertQuote[] | undefined, fallback: ResolvedQuote[]): ResolvedQuote[] {
  if (!quotes || quotes.length === 0) return fallback
  return quotes.map((q, i) => ({
    name: q.name,
    title: q.title || '',
    text: portableTextToPlain(q.quoteText),
    headshotUrl: q.headshot ? urlFor(q.headshot).width(400).url() : fallback[i]?.headshotUrl,
  }))
}

const inlineBlockComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  },
  marks: {
    link: ({ value, children }: { value?: { href?: string }; children?: React.ReactNode }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'underline' }}
      >
        {children}
      </a>
    ),
  },
}

function portableTextToBody(blocks: PortableTextBlock[] | undefined, fallback: React.ReactNode[]): React.ReactNode[] {
  if (!blocks || blocks.length === 0) return fallback
  return blocks.map((block, i) => (
    <PortableText key={i} value={[block]} components={inlineBlockComponents} />
  ))
}

// Turn a CMS `trendVideo` object into the LovieFeatureMedia shape used
// by LovieTrendContent. Returns `undefined` when the CMS entry doesn't
// carry a usable source (so the caller can fall back to hardcoded copy).
type TrendVideoInput = {
  sourceType?: 'upload' | 'youtube' | 'image'
  videoFile?: { url?: string }
  youtubeUrl?: string
  image?: { url?: string; alt?: string }
  linkUrl?: string
  name?: string
  title?: string
  description?: string
} | null | undefined

function resolveStandout(input: TrendVideoInput, label?: string) {
  if (!input) return undefined
  const base = {
    label,
    name: input.name,
    title: input.title,
    description: input.description,
  }
  if (input.sourceType === 'image' && input.image?.url) {
    return { ...base, url: input.linkUrl || '#', imageUrl: input.image.url }
  }
  if (input.sourceType === 'youtube' && input.youtubeUrl) {
    return { ...base, url: input.youtubeUrl }
  }
  if (input.videoFile?.url) {
    return { ...base, url: input.videoFile.url }
  }
  return undefined
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

// Section 1 — The New Trusted Institutions. Slab 1 (Header + Body +
// Influencer/Creator comparison) is hardcoded because those three
// modules are custom to this section. Any additional slabs — the
// Tips + Video pairing, extra pull quotes, etc. — come from the CMS
// contentSlabs array so editors can shape the tail of Section 1 the
// same way they shape Sections 2–7.
function SharedInfluenceSection01({ report }: { report: Report }) {
  const trend = report.trendSections?.[0]
  const accentColor =
    report.sectionCovers?.[0]?.accentColor || trend?.accentColor || '#8C001C'
  return (
    <>
      {/* Slab 1 — hardcoded Header + Body + Comparison Callout */}
      <TwoColumnSlab
        left={
          <>
            <SectionHeader title="One in five Americans now regularly gets their news from TikTok" />
            <SharedInfluenceBody
              paragraphs={[
                <>
                  One in five Americans now regularly gets their news from TikTok—including more than <strong style={{ fontWeight: 700 }}>40% of adults under 30</strong>, according to <a href="https://www.pewresearch.org/short-reads/2025/09/25/1-in-5-americans-now-regularly-get-news-on-tiktok-up-sharply-from-2020/" target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: 'underline', textUnderlineOffset: 3 }}>Pew Research Center</a>. As public trust in institutions and traditional media declines, creators are increasingly filling the gap as trusted sources of information.
                </>,
                <>Legacy media and older marketing tactics (direct mail and print ads) no longer reach the scope of audience they used to, particularly among younger generations, says <strong style={{ fontWeight: 700 }}>Abby Schreiber</strong>, Special Projects Lead at Onyx Impact.</>,
                <>Organizations should treat creators as a core pillar in impact strategies to reach new communities and drive impact.</>,
                <><strong style={{ fontWeight: 700 }}>These are not influencer campaigns.</strong> The strongest creator partnerships are built on shared values, giving creators the freedom to contribute their skills to your mission.</>,
              ]}
            />
          </>
        }
        right={
          <ComparisonCallout
            left={{
              label: 'Influencer',
              word: 'Sells',
              description: 'Someone who sells you something, from a promotion to a paid placement.',
            }}
            right={{
              label: 'Creator',
              word: 'Collaborates',
              description: 'Someone you collaborate with, through storytelling or building something together.',
            }}
          />
        }
      />

      {/* Everything after the hardcoded intro is CMS-driven. Empty
          slabs are filtered so an editor accidentally leaving one
          blank doesn't render as a hollow whitespace section. */}
      {(() => {
        const populated = (trend?.contentSlabs || []).filter((s) => {
          const l = s.leftBlocks?.length || 0
          const r = s.rightBlocks?.length || 0
          return l + r > 0
        })
        if (populated.length === 0) return null
        return <ContentSlabsRenderer slabs={populated} accentColor={accentColor} />
      })()}
    </>
  )
}

// Section 2 — Finding the Right Partners. Fully CMS-driven via
// contentSlabs. The old hardcoded fallback referenced gitignored
// videos (garrison-hayes-vetting-process.mp4, jane-lynch-direct-relief.mp4)
// that 404 in production — removed.
function SharedInfluenceSection02({ report }: { report: Report }) {
  const trend = report.trendSections?.[1]
  const accentColor =
    report.sectionCovers?.[1]?.accentColor || trend?.accentColor || '#8C001C'
  const slabs = trend?.contentSlabs
  if (!slabs || slabs.length === 0) return null
  return <ContentSlabsRenderer slabs={slabs} accentColor={accentColor} />
}

// Section 3 — fully CMS-driven via contentSlabs. No hardcoded fallback;
// editors compose every slab in Studio. Accent inherits from the section
// cover so all child blocks share the same palette.
function SharedInfluenceSection03({ report }: { report: Report }) {
  const trend = report.trendSections?.[2]
  const accentColor =
    report.sectionCovers?.[2]?.accentColor || trend?.accentColor || '#8C001C'
  const slabs = trend?.contentSlabs
  if (!slabs || slabs.length === 0) return null
  return <ContentSlabsRenderer slabs={slabs} accentColor={accentColor} />
}

function SharedInfluenceSection04({ report }: { report: Report }) {
  const trend = report.trendSections?.[3]
  const accentColor =
    report.sectionCovers?.[3]?.accentColor || trend?.accentColor || '#8C001C'
  const slabs = trend?.contentSlabs
  if (!slabs || slabs.length === 0) return null
  return <ContentSlabsRenderer slabs={slabs} accentColor={accentColor} />
}

function SharedInfluenceSection05({ report }: { report: Report }) {
  const trend = report.trendSections?.[4]
  const accentColor =
    report.sectionCovers?.[4]?.accentColor || trend?.accentColor || '#8C001C'
  const slabs = trend?.contentSlabs
  if (!slabs || slabs.length === 0) return null
  return <ContentSlabsRenderer slabs={slabs} accentColor={accentColor} />
}

function SharedInfluenceSection06({ report }: { report: Report }) {
  const trend = report.trendSections?.[5]
  const accentColor =
    report.sectionCovers?.[5]?.accentColor || trend?.accentColor || '#8C001C'
  const slabs = trend?.contentSlabs
  // Only render the mock preview while the CMS is still empty of a
  // real Scrolling Cards Block; once editors add one, the preview
  // steps aside to avoid duplicated modules.
  const hasCmsScrollingCards = !!slabs?.some((slab) =>
    [...(slab.leftBlocks || []), ...(slab.rightBlocks || [])].some(
      (b) => b._type === 'siScrollingCardsBlock',
    ),
  )
  return (
    <>
      {slabs && slabs.length > 0 && (
        <ContentSlabsRenderer slabs={slabs} accentColor={accentColor} />
      )}
      {!hasCmsScrollingCards && <ScrollingCardsPreview accentColor={accentColor} />}
    </>
  )
}

// 6 takeaway cards for the Shared Influence report. Keep body copy
// tight — the hover-cards get cramped past ~4 sentences. Migrate to a
// CMS field on the report if editors need to tune these live.
const SHARED_INFLUENCE_TAKEAWAYS: { number: string; title: string; body: string }[] = [
  {
    number: '01',
    title: 'Trust has moved to creators. Build around it.',
    body: 'Audiences increasingly turn to individuals for information and connection. Organizations creating long-term creator relationships are building trust that extends beyond a single campaign.',
  },
  {
    number: '02',
    title: 'Alignment creates stronger partnerships. Vet from both sides.',
    body: 'The right creator partners bring more than an audience. Shared values, strong storytelling skills, and community engagement determine whether a partnership can grow over time.',
  },
  {
    number: '03',
    title: 'Give creators a strong data-filled brief. Trust them to do the rest.',
    body: 'Prep creators with any vital information: your mission, standard language, and cause-related data. Leave room for creators to serve as a new personality for your organization, and tell your story through their lens.',
  },
  {
    number: '04',
    title: 'Match your storytelling to the platform in ways that feel native.',
    body: 'Every platform serves a different purpose. The strongest content meets audiences where they are and reflects the creator’s own style and perspective.',
  },
  {
    number: '05',
    title: 'Measure creator impact through movement.',
    body: 'Views and likes tell a limited story. Show leadership that your creator collaborations work through sentiment analysis, audience engagement, or conversions.',
  },
  {
    number: '06',
    title: 'Build compensation models that reflect the relationship.',
    body: 'There is no one-size-fits-all approach; creator partnerships can range from volunteer collaborations to paid opportunities. For long-term impact, create in-house models that you can fundraise against.',
  },
]

function SharedInfluenceSection07({ report }: { report: Report }) {
  const trend = report.trendSections?.[6]
  const accentColor =
    report.sectionCovers?.[6]?.accentColor || trend?.accentColor || '#8C001C'
  const slabs = trend?.contentSlabs
  if (!slabs || slabs.length === 0) return null
  return <ContentSlabsRenderer slabs={slabs} accentColor={accentColor} />
}

function ScrollingCardsPreview({ accentColor }: { accentColor: string }) {
  const mockCards: { title: string; body: PortableTextBlock[] }[] = [
    { title: 'Volunteer (Gifting & Events)', body: mockPT('**Best when:** the creator has the capacity to give their time, and gifting can meaningfully substitute payment.') },
    { title: 'In-Kind', body: mockPT('**Best when:** budget isn’t available, but you can offer real expertise, data, or creative strategy.') },
    { title: 'Project Fee', body: mockPT('**Best when:** there is a specific deliverable with a defined scope.') },
    { title: 'Retainer', body: mockPT('**Best when:** the partnership is ongoing and needs consistent output over a period of time.') },
    { title: 'Creator-in-Residence', body: mockPT('**Best when:** you want to build a new media infrastructure that permanently embeds a creator in your organization.') },
    { title: 'Revenue Share', body: mockPT('**Best when:** the campaign drives measurable donations, sales, or subscriptions.') },
  ]
  return (
    <FullWidthSlab>
      <Heading level={3} style={{ textAlign: 'center' }}>Pick the Model That Fits</Heading>
      <ScrollingCards
        eyebrow="Six ways organizations and creators structure the exchange."
        cards={mockCards}
        accentColor={accentColor}
        variant="inverted"
        cardColors={ANTHEM_CARD_CYCLE}
      />
    </FullWidthSlab>
  )
}

// Minimal PortableText mock so demo cards render bold ("**Best when:**")
// through the same rich-text path the CMS uses.
function mockPT(text: string): PortableTextBlock[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  return [{
    _type: 'block',
    _key: 'k',
    style: 'normal',
    markDefs: [],
    children: parts.map((p, i) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return { _type: 'span', _key: `s${i}`, text: p.slice(2, -2), marks: ['strong'] }
      }
      return { _type: 'span', _key: `s${i}`, text: p, marks: [] }
    }),
  }] as unknown as PortableTextBlock[]
}

export function ReportView({ report }: { report: Report }) {
  const cookieKey = `report-access-${report.slug.current}`
  const [hasAccess, setHasAccess] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const [entered, setEntered] = useState(false)
  const [showGoodbye, setShowGoodbye] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  // Shared Influence is an Anthem-property report but with its own
  // structure (6 sections driven by the new `sectionCovers` array,
  // custom hero, custom opening letter). Detected by slug so the
  // existing State of Social Impact hardcoded content isn't touched.
  const isSharedInfluence =
    report.property === 'anthem' &&
    report.slug?.current === 'shared-influence-creator-partnerships-nonprofit'

  // Nordics is a Lovie-property report but ports the Shared Influence
  // UX (sticky top nav, no opening letter, no bottom nav). Detected
  // by slug so the Mediterranean report is untouched.
  const isNordics =
    report.property === 'lovie' &&
    report.slug?.current === 'lovie-creative-hubs-nordics'

  // Apply vertical-template theme (background, fonts, palette) only while this
  // template is mounted. Lovie reports get `lovie-template`; everything else
  // using the vertical layout (Anthem) keeps `anthem-template`. Webby reports
  // use the horizontal template and stay on the default styling.
  //
  // Additionally we tag body with a per-report `report-<slug>` class so any
  // report-specific overrides (fluid hero sizing, custom section colours,
  // etc.) can be scoped without leaking into other reports on the same
  // template.
  useEffect(() => {
    const themeClass = report.property === 'lovie' ? 'lovie-template' : 'anthem-template'
    const slugClass = report.slug?.current ? `report-${report.slug.current}` : null
    const classes = [themeClass, slugClass].filter(Boolean) as string[]
    document.body.classList.add(...classes)
    return () => { document.body.classList.remove(...classes) }
  }, [report.property, report.slug?.current])

  // Show goodbye only when all trends are complete (desktop)
  // On mobile, always show it since trends are just vertical scroll
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) {
      setShowGoodbye(true)
      return
    }
    function handleExit() { setShowGoodbye(true) }
    window.addEventListener('trend-next-or-exit', handleExit)
    return () => window.removeEventListener('trend-next-or-exit', handleExit)
  }, [])

  // Prevent scrolling up past the goodbye page (desktop only)
  // Listen for 'goodbye-exit' event to disable the clamp when user clicks to go back
  useEffect(() => {
    if (!showGoodbye) return
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) return
    let goodbyeTop: number | null = null
    let clampEnabled = true

    function clampScroll() {
      if (!clampEnabled) return
      const thankYou = document.getElementById('thank-you')
      if (!thankYou) return
      if (goodbyeTop === null) {
        goodbyeTop = thankYou.offsetTop
      }
      if (window.scrollY < goodbyeTop) {
        window.scrollTo(0, goodbyeTop)
      }
    }

    function disableClamp() {
      clampEnabled = false
    }

    function reEnableClamp() {
      goodbyeTop = null
      clampEnabled = true
    }

    window.addEventListener('scroll', clampScroll)
    window.addEventListener('goodbye-exit', disableClamp)
    window.addEventListener('trend-next-or-exit', reEnableClamp)
    return () => {
      window.removeEventListener('scroll', clampScroll)
      window.removeEventListener('goodbye-exit', disableClamp)
      window.removeEventListener('trend-next-or-exit', reEnableClamp)
    }
  }, [showGoodbye])

  useEffect(() => {
    // Dev shortcut: add ?reset to the URL to clear the signup cookie and test the gate
    if (window.location.search.includes('reset')) {
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${window.location.pathname}`
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      window.location.replace(window.location.pathname)
      return
    }
    // Shareable "skip the gate" link: ?access=direct grants access for this
    // page load only — no cookie, no signup capture — same as a returning
    // visitor who already has the cookie.
    if (new URLSearchParams(window.location.search).get('access') === 'direct') {
      setHasAccess(true)
      return
    }
    // If the signup gate is turned off in the CMS, grant access without
    // checking the cookie — visitors enter the report directly.
    if (report.signupGateEnabled === false) {
      setHasAccess(true)
      return
    }
    if (getCookie(cookieKey)) {
      setHasAccess(true)
    }
  }, [cookieKey, report.signupGateEnabled])

  // Optional target anchor (e.g. "section-02") set when the user picks an item
  // from the hero nav menu — after the signup gate completes we scroll there
  // instead of the report top.
  const [scrollTarget, setScrollTarget] = useState<string | null>(null)

  function scrollToTargetOrReport() {
    if (scrollTarget) {
      const el = document.getElementById(scrollTarget)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setScrollTarget(null)
        return
      }
    }
    reportRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Once access is granted, scroll to report and hide hero — but only for
  // returning visitors who already have the cookie. When the signup gate is
  // disabled in the CMS, or when access was granted via the ?access=direct
  // bypass link, hasAccess is also true from mount, but we want those
  // visitors to see the hero and click "Explore" themselves instead of
  // being auto-scrolled straight into the report.
  useEffect(() => {
    if (!hasAccess) return
    if (report.signupGateEnabled === false) return
    // Shareable "skip the gate" link: land on the hero like any first-time
    // visitor and let them click through themselves — don't auto-scroll past
    // the cover the way a returning (cookie-present) visitor does.
    if (new URLSearchParams(window.location.search).get('access') === 'direct') return
    // Small delay to let report content render
    setTimeout(() => {
      scrollToTargetOrReport()
      // After scroll animation completes, hide the hero
      setTimeout(() => setEntered(true), 800)
    }, 100)
  }, [hasAccess])

  function handleSeeReport(anchor?: string) {
    if (anchor) setScrollTarget(anchor)
    if (!hasAccess) {
      setShowGate(true)
      return
    }

    // Hide the hero FIRST so ReportScroll's "active" effect can fire
    // its window.scrollTo(0, 0) before any smooth scroll begins. If
    // we scrolled first, that scrollTo would stomp the page back to
    // the top of the report ~800ms later — the bug we hit for trend-*
    // anchors before.
    setEntered(true)

    // No anchor → user just clicked "Explore the Report". ReportScroll's
    // own scrollTo(0, 0) effect already lands them at the top of the
    // report (= the Opening Letter). Don't fire an additional smooth
    // scroll on top of that: the ~700ms retry loop + smooth animation
    // would fight any scrolling the user does in the meantime and
    // make it feel like the page is locked at the Opening Letter
    // (reported by Chrome users).
    if (!anchor) return

    // Anchor specified → poll briefly in case the target hasn't
    // hydrated yet (framer-motion wrappers around trend sections can
    // delay the id landing in the DOM by a frame or two).
    function tryScroll(remainingTries: number) {
      const el = document.getElementById(anchor!)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setScrollTarget(null)
        return
      }
      if (remainingTries > 0) {
        setTimeout(() => tryScroll(remainingTries - 1), 100)
        return
      }
      // Target never appeared — fall back to top-of-report.
      reportRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    setTimeout(() => tryScroll(7), 200)
  }

  function handleSignupComplete() {
    setCookie(cookieKey, 'true', 365)
    setShowGate(false)
    setHasAccess(true)
  }

  return (
    <main>
      <AnalyticsScripts report={report} />

      {/* Shared Influence — dedicated sticky top nav mounted at the
          ReportView level so `fixed` positioning survives no matter what
          section (hero, letter, sections, footer) is on screen. */}
      {isSharedInfluence && (
        <SharedInfluenceTopNav
          ctaUrl={report.footerCtaUrl || 'https://www.anthemawards.com/'}
          sections={SHARED_INFLUENCE_NAV_SECTIONS}
          onNavClick={(anchor) => handleSeeReport(anchor)}
          onCtaClick={() => trackCtaClick('header', report.footerCtaUrl || 'https://www.anthemawards.com/', report.property, report.slug.current)}
        />
      )}

      {/* Nordics — same sticky-top-nav treatment as Shared Influence,
          styled for the Lovie palette. */}
      {isNordics && (
        <NordicsTopNav
          ctaUrl={report.footerCtaUrl || 'https://www.lovieawards.com/'}
          sections={NORDICS_NAV_SECTIONS}
          onNavClick={(anchor) => handleSeeReport(anchor)}
          onCtaClick={() => trackCtaClick('header', report.footerCtaUrl || 'https://www.lovieawards.com/', report.property, report.slug.current)}
        />
      )}

      {/* Hero — hidden once you've entered the report */}
      {!entered && (
        <HeroSection report={report} carouselImages={report.carouselImages} onSeeReport={handleSeeReport} />
      )}

      {/* Signup gate modal */}
      <AnimatePresence>
        {showGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SignupGate report={report} onComplete={handleSignupComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom cursor arrow — disabled for Anthem redesign */}
      {/* <CursorArrow active={entered} trendCount={report.trendSections?.length ?? 0} /> */}

      {/* Idle navigation arrows — disabled for Anthem redesign */}
      {/* <IdleArrows active={entered} /> */}

      {/* Bottom progress / section nav (Anthem template) — hidden for
          Shared Influence and Nordics, which use a sticky top nav
          instead. */}
      {!isSharedInfluence && !isNordics && (
        <AnthemBottomNav active={entered} property={report.property} />
      )}

      {/* Mobile navigation — hidden for Shared Influence and Nordics,
          which use the same sticky top nav on mobile as on desktop. */}
      {!isSharedInfluence && !isNordics && (
        <MobileNav
          active={entered}
          property={report.property}
          trendTitles={(report.trendSections || [])
            .filter((s) => s.enabled !== false)
            .map((s) => s.trendTitle.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim())
          }
        />
      )}

      {/* Report content — snap scrolling + nav dots activate after entry */}
      {hasAccess && (
        <div ref={reportRef}>
          <ReportScroll active={entered} trendCount={report.trendSections?.length ?? 0} snap={false}>
            <IntroLetter report={report} />

            {/* By the Numbers — hidden for Anthem redesign */}
            {/* <EntryStats stats={report.entryStats} eyebrow={report.byTheNumbersEyebrow} statement={report.byTheNumbersStatement} /> */}

            {/* IADAS — hidden for Anthem redesign */}
            {/* <IadasSection report={report} /> */}
            <KeyFindings findings={report.keyFindings} property={report.property} slug={report.slug?.current} />

            {/* Section 1 cover. CMS-driven; Lovie reports get the heart-token
                SVG and Lovie-aware theming through the `property` prop.
                Shared Influence skips this render and loops through its
                own `sectionCovers` array below instead. */}
            {!isSharedInfluence && (
              <ReportSectionCover
                sectionNumber={report.section01Cover?.sectionNumber || '01'}
                title={
                  report.section01Cover?.title ||
                  (report.property === 'lovie'
                    ? 'Across the Mediterranean'
                    : 'The State of Social Impact')
                }
                subtitle={
                  report.section01Cover?.subtitle ||
                  (report.property === 'lovie'
                    ? 'Work prioritises depth over volume, and cultural specificity over global reach.'
                    : 'Rollbacks have increased across the sector, but leaders have settled into their new reality, becoming more resilient and strategic in the process.')
                }
                copy={
                  report.section01Cover?.copy ||
                  (report.property === 'lovie'
                    ? 'Spain, Portugal, and Italy are producing digital work shaped by place, heritage, and a focus on digital infrastructure for both local and global innovation.'
                    : 'Last year, we asked the Anthem Awards community how the shifting landscape was impacting their work. This year, we see how the community is adapting.')
                }
                accentColor={
                  isNordics
                    ? '#016BA7'
                    : report.section01Cover?.accentColor ||
                      (report.property === 'lovie' ? '#ff6000' : '#8C001C')
                }
                property={report.property}
                sectionNumberSvg={
                  isNordics
                    ? '/lovie/lovie-heart-black.svg'
                    : report.property === 'lovie'
                      ? '/lovie/no-1.svg'
                      : undefined
                }
                // Nordics uses a compact cover so the data module
                // below can sit close to the section header; other
                // reports keep the full viewport-height magazine cover.
                compact={isNordics}
              />
            )}

            {/* Nordics — Section 1 opener data module: sentiment
                scale (4-segment stacked bar with aligned legend). */}
            {isNordics && <NordicsDataModule />}

            {isSharedInfluence ? (
              <>
                {/* Shared Influence — every section cover is driven by
                    the CMS `sectionCovers` array. Order-preserving, and
                    the number defaults to the position in the array if
                    the editor didn't set one explicitly. Section content
                    modules will slot in between covers as they get
                    built out. */}
                {/* Render only the first seven sectionCovers as the trend
                    sections; the eighth (if present) is treated as the
                    Takeaways transition cover below. */}
                {(report.sectionCovers ?? []).slice(0, 7).map((cover, i) => (
                  <div key={i}>
                    <ReportSectionCover
                      sectionNumber={cover.sectionNumber || String(i + 1).padStart(2, '0')}
                      title={cover.title || ''}
                      subtitle={cover.subtitle || ''}
                      copy={cover.copy || ''}
                      accentColor={cover.accentColor || '#8C001C'}
                      property={report.property}
                      minHeightPx={530}
                      titleFontFamily="'roc-grotesk-wide', 'roc-grotesk-variable', -apple-system, sans-serif"
                      titleFontWeight={500}
                      subtitleFontFamily="'decoy', Georgia, serif"
                    />

                    {/* Section content, keyed by index. Hardcoded for now
                        while we nail down the layout; will move to CMS
                        once the module shapes stabilise. */}
                    {i === 0 && <SharedInfluenceSection01 report={report} />}
                    {i === 1 && <SharedInfluenceSection02 report={report} />}
                    {i === 2 && <SharedInfluenceSection03 report={report} />}
                    {i === 3 && <SharedInfluenceSection04 report={report} />}
                    {i === 4 && <SharedInfluenceSection05 report={report} />}
                    {i === 5 && <SharedInfluenceSection06 report={report} />}
                    {i === 6 && <SharedInfluenceSection07 report={report} />}
                  </div>
                ))}

                {/* Takeaways transition cover — pulls from
                    sectionCovers[7] when present so editors can tune the
                    title/subtitle/copy in the CMS; falls back to a
                    sensible hardcoded default otherwise. */}
                <ReportSectionCover
                  sectionNumber={report.sectionCovers?.[7]?.sectionNumber || '08'}
                  title={report.sectionCovers?.[7]?.title || 'Takeaways'}
                  subtitle={report.sectionCovers?.[7]?.subtitle || 'The Future of Philanthropy Includes Creators'}
                  copy={report.sectionCovers?.[7]?.copy || 'Six practices for impact organizations and creators building trust, sharing stories, and driving measurable movement — together.'}
                  accentColor={report.sectionCovers?.[7]?.accentColor || '#00B469'}
                  property={report.property}
                  minHeightPx={530}
                  titleFontFamily="'roc-grotesk-wide', 'roc-grotesk-variable', -apple-system, sans-serif"
                  titleFontWeight={500}
                  subtitleFontFamily="'decoy', Georgia, serif"
                  compact
                />

                <Takeaways
                  eyebrow=""
                  heading=""
                  accentColor="#00B469"
                  takeaways={SHARED_INFLUENCE_TAKEAWAYS}
                />
              </>
            ) : report.property === 'lovie' ? (
              <>
                {/* Nordics Trend 01 — hardcoded for now (until CMS
                    fields carry the Nordics body + data). Uses the
                    same LovieTrendContent 2-column layout as
                    Mediterranean; accent flips to Swedish blue. */}
                {isNordics && (() => {
                  const NORDIC_ACCENT = '#016BA7'
                  const cmsQuotes = report.trendSections?.[0]?.expertQuotes ?? []
                  // Normalise CMS quotes into a common shape so both the
                  // inline (body) slot and the leftover (below-video)
                  // slot share the same rendering data.
                  const normalisedQuotes = cmsQuotes.map((q) => ({
                    text: portableTextToPlain(q.quoteText),
                    attribution: q.name,
                    role: q.title || '',
                    linkedInUrl: q.linkedInUrl,
                    headshotUrl: q.headshot ? urlFor(q.headshot).width(240).height(240).fit('crop').url() : q.headshotUrl,
                  }))
                  const [inlineQuote, ...restQuotes] = normalisedQuotes

                  // CMS `trendVideo` overrides the hardcoded fallback
                  // once populated. Falls back to the YouTube URL from
                  // the draft until the editor picks a source.
                  const cmsVideo = report.trendSections?.[0]?.trendVideo
                  const cmsVideoUrl =
                    cmsVideo?.sourceType === 'youtube'
                      ? cmsVideo.youtubeUrl
                      : cmsVideo?.videoFile?.url
                  const featureMedia = {
                    url: cmsVideoUrl || 'https://www.youtube.com/watch?v=D4rar2bmCAM',
                    label: 'Standouts from the Nordics',
                    name: cmsVideo?.name || 'Inside Opera Neon, the first “fully-agentic” browser',
                    title: cmsVideo?.title || '2025 Lovie Silver Winner, AI Apps — Experimental & Innovation',
                    description: cmsVideo?.description,
                  }

                  return (
                  <LovieTrendContent
                    trendNumber="01"
                    title="Small Populations, Outsized Infrastructure"
                    accentColor={NORDIC_ACCENT}
                    body={[
                      <>The Nordic population is significantly smaller than that of France (69 million to 28 million, respectively), yet the region produces an outsized share of Europe&rsquo;s most influential tech companies. <strong style={{ fontWeight: 700 }}>Spotify, Klarna, and Wolt, to name a few</strong>.</>,
                      <>Across Sweden, Denmark, Finland, and Norway, innovation is increasingly being driven by B2B software, emerging technologies, industrial technology, and consumer apps. What makes the Nordics strong is the infrastructure it has built to create and sustain digital innovation.</>,
                      // Inline pull quote — first CMS expertQuote if
                      // populated, else the hardcoded David quote from
                      // the draft.
                      inlineQuote ? (
                        <div key="quote" style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 12, paddingLeft: 20, borderLeft: `3px solid ${NORDIC_ACCENT}` }}>
                          {inlineQuote.headshotUrl && (
                            <img
                              src={inlineQuote.headshotUrl}
                              alt={inlineQuote.attribution}
                              width={80}
                              height={80}
                              style={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                flexShrink: 0,
                                border: `2px solid ${NORDIC_ACCENT}`,
                              }}
                            />
                          )}
                          <div>
                            <p style={{
                              fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                              fontSize: 17,
                              lineHeight: 1.5,
                              color: '#000000',
                              margin: '0 0 12px',
                            }}>
                              {inlineQuote.text}
                            </p>
                            <p style={{
                              fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                              fontSize: 14,
                              lineHeight: 1.4,
                              color: '#000000',
                              margin: 0,
                            }}>
                              <strong style={{ fontWeight: 700 }}>{inlineQuote.attribution}</strong>
                              {inlineQuote.role ? `, ${inlineQuote.role}` : ''}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div key="quote" style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 12, paddingLeft: 20, borderLeft: `3px solid ${NORDIC_ACCENT}` }}>
                          <img
                            src="/lovie/david-juul-ledstrup-headshot.webp"
                            alt="David Juul Ledstrup"
                            width={80}
                            height={80}
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              flexShrink: 0,
                              border: `2px solid ${NORDIC_ACCENT}`,
                            }}
                          />
                          <div>
                            <p style={{
                              fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                              fontSize: 17,
                              lineHeight: 1.5,
                              color: '#000000',
                              margin: '0 0 12px',
                            }}>
                              “The amount of talent that Scandinavia attracts. The industry here is a global melting pot of culture, ideas, and diversity from all corners of the world.”
                            </p>
                            <p style={{
                              fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                              fontSize: 14,
                              lineHeight: 1.4,
                              color: '#000000',
                              margin: 0,
                            }}>
                              <strong style={{ fontWeight: 700 }}>David Juul Ledstrup</strong>, Executive Strategy Director, Kubbco
                            </p>
                          </div>
                        </div>
                      ),
                    ]}
                    dataModule={{
                      eyebrow: 'What Is Powering Innovation',
                      question: 'When you think about what’s actually driving tech innovation in your market right now, which comes closest to what you’re seeing?',
                      bars: [
                        { label: 'Digital infrastructure and platforms', value: 44, displayValue: '44%' },
                        { label: 'Consumer-facing products and platforms', value: 22, displayValue: '22%' },
                        { label: 'A mix — genuinely hard to separate', value: 22, displayValue: '22%' },
                        { label: 'Cultural and creative output', value: 11, displayValue: '11%' },
                      ],
                      footnote: 'Regulation and governance, Deep tech and R&D, and None of the above each received 0% and are omitted.',
                      tileBackground: '#FFF3D1',
                    }}
                    insideTheHubs={{
                      eyebrow: 'Inside the Hubs',
                      swedenCopy: (
                        <p>Stockholm remains the region&rsquo;s technology powerhouse. <strong>Spotify</strong> transformed the global music industry, while <strong>Klarna</strong>&rsquo;s 2025 New York Stock Exchange debut marked the city&rsquo;s biggest public listing since Spotify. A new generation of AI companies, including <strong>Lovable</strong>, <strong>Neko Health</strong>, and <strong>Einride</strong>, is keeping Sweden at the forefront of Europe&rsquo;s next tech wave.</p>
                      ),
                      denmarkCopy: (
                        <p>Copenhagen has become one of Europe&rsquo;s densest AI startup hubs. More than a dozen AI-native SaaS companies have launched since 2023, nurturing a strong fintech and software ecosystem. Standouts include <strong>Trustpilot</strong> and <strong>Pleo</strong>, alongside Lovie Award-winning <strong>Corti ApS</strong> and <strong>Novo Nordisk</strong>&rsquo;s influence on life sciences.</p>
                      ),
                      finlandCopy: (
                        <p>Finland&rsquo;s reputation for gaming has evolved into something much broader. <strong>Supercell</strong> and delivery service <strong>Wolt</strong> remain defining success stories, while <strong>Aalto University</strong> is helping turn Espoo into a centre for quantum computing through companies including <strong>IQM</strong> and <strong>SemiQon</strong>.</p>
                      ),
                      norwayCopy: (
                        <p>Norway has built a diverse cohort of global technology companies. <strong>Kahoot!</strong> brought Norwegian edtech to millions, while <strong>Cognite</strong> and <strong>Ardoq</strong> have established Oslo as a leader in AI-led software. Oslo-founded and Lovie-recognised <strong>Opera</strong> is pushing further with <strong>Opera Neon</strong>, its fully agentic browser.</p>
                      ),
                    }}
                    featureMedia={featureMedia}
                    // Remaining CMS quotes (after the inline one) drop
                    // into the right column beneath the video via
                    // LovieTrendContent's leftoverQuotes fallback path.
                    quotes={restQuotes.length > 0 ? restQuotes.map((q) => ({
                      text: q.text,
                      attribution: q.attribution,
                      role: q.role,
                      linkedInUrl: q.linkedInUrl,
                      headshotUrl: q.headshotUrl,
                      borderColor: NORDIC_ACCENT,
                    })) : undefined}
                  />
                  )
                })()}

                {/* Nordics Trend 02 — Capitals Don't Tell the Region's
                    Full Story. Row 1: body + callout data.
                    Row 2: Inside the Hubs (4 countries) + Standouts image
                    that links out to the IKEA Catalogue project page. */}
                {isNordics && (
                  <LovieTrendContent
                    trendNumber="02"
                    title="Capitals Don’t Tell the Region’s Full Story"
                    accentColor="#016BA7"
                    body={[
                      <>The Nordic creative economy is far more distributed than its reputation suggests. Across Sweden, Denmark, Finland, and Norway, many of the region&rsquo;s most influential companies are headquartered well beyond the capital cities.</>,
                      <>Yet when judges were asked where the country&rsquo;s most exciting creative work is happening, nearly nine in ten still pointed to Stockholm, Copenhagen, Oslo, and Helsinki. <strong style={{ fontWeight: 700 }}>While companies have spread across the region, the creative spotlight falls on capital cities.</strong></>,
                    ]}
                    dataModule={{
                      eyebrow: 'Creative Spotlight on the Capitals',
                      question: 'When you think about the most exciting creative work coming out of your country right now, where is it being produced?',
                      chartType: 'callout',
                      bars: [
                        { label: 'Predominantly from the major cities (Copenhagen, Stockholm, Oslo, Helsinki)', value: 89, displayValue: '89%' },
                        { label: 'The work travels, but the origin is hard to track', value: 11, displayValue: '11%' },
                        { label: 'Increasingly from secondary cities (Gothenburg, Aarhus, Oulu)', value: 0, displayValue: '0%' },
                        { label: 'It’s genuinely distributed. No single geography dominates', value: 0, displayValue: '0%' },
                      ],
                      tileBackground: '#F2EEED',
                    }}
                    insideTheHubs={{
                      eyebrow: 'Inside the Hubs',
                      swedenCopy: (
                        <p>Sweden&rsquo;s biggest global brands extend well beyond Stockholm. <strong>IKEA</strong> was founded in &Auml;lmhult, <strong>Oatly</strong> is based in Malm&ouml;, and <strong>Volvo</strong> and <strong>Forsman &amp; Bodenfors</strong> have helped make Gothenburg a global centre for design and creativity. In the country&rsquo;s far north, <strong>Stegra</strong> is building one of Europe&rsquo;s most ambitious green steel plants in Boden.</p>
                      ),
                      denmarkCopy: (
                        <p>Denmark&rsquo;s most recognisable brands are rooted outside of Copenhagen. <strong>LEGO</strong> calls Billund home, Lovie-recognised <strong>Bang &amp; Olufsen</strong> was founded in Struer, <strong>&Oslash;rsted</strong> has its roots in Fredericia, and digital bank <strong>Lunar</strong> is based in Aarhus.</p>
                      ),
                      finlandCopy: (
                        <p>Finland&rsquo;s innovation story stretches beyond Helsinki. <strong>Oura</strong>, one of the world&rsquo;s leading wearable technology companies, is headquartered in Oulu.</p>
                      ),
                      norwayCopy: (
                        <p>Norway&rsquo;s biggest success stories are increasingly spread across the country. <strong>AutoStore</strong>, the nation&rsquo;s first unicorn, was founded in Nedre Vats, while Trondheim&rsquo;s research ecosystem is helping grow a new generation of AI and climate technology companies, including <strong>Vespa AI</strong> and <strong>Ocean GeoLoop</strong>.</p>
                      ),
                    }}
                    featureMedia={resolveStandout(report.trendSections?.[1]?.trendVideo, 'Standouts from the Nordics') || {
                      url: 'https://dazed.studio/our-work/ikea-catalogue/',
                      imageUrl: '/lovie/ikea-catalogue-standout.jpg',
                      label: 'Standouts from the Nordics',
                      name: 'Inside IKEA Catalogue!!!',
                      title: 'A one-off publishing project bringing the Danish retailer’s iconic archives to life during Milan Design Week.',
                    }}
                  />
                )}

                {/* Nordics Trend 03 — Sustainability & Circularity At the
                    Centre. First part: body + inline pull quote (Martin
                    Cedergren) + Norlys standout image. Data module and
                    Inside the Hubs slot in as they arrive. */}
                {isNordics && (
                  <LovieTrendContent
                    trendNumber="03"
                    title="Sustainability & Circularity At the Centre"
                    accentColor="#016BA7"
                    body={[
                      <>Across the Nordics, sustainability is less a brand message than a business principle. Rather than treating environmental responsibility as a marketing campaign, many of the region&rsquo;s best-known companies have built it into their products, operations, and long-term strategy. That confidence often carries through to their communications, too.</>,
                      <>Brands are comfortable being self-aware, irreverent, and transparent&mdash;using honesty in place of polished corporate messaging. Together, those qualities have become one of the region&rsquo;s most distinctive creative signatures.</>,
                      <div key="quote" style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 12, paddingLeft: 20, borderLeft: `3px solid #016BA7` }}>
                        <div style={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: '2px solid #016BA7',
                        }}>
                          <img
                            src="/lovie/martin-cedergren-headshot.jpg"
                            alt="Martin Cedergren"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: '48% 30%',
                              transform: 'translateX(3px) scale(1.8)',
                              transformOrigin: '48% 30%',
                            }}
                          />
                        </div>
                        <div>
                          <p style={{
                            fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                            fontSize: 17,
                            lineHeight: 1.5,
                            color: '#000000',
                            margin: '0 0 12px',
                          }}>
                            “The tension between rigid ESG compliance and creative risk-taking. With strict EU directives (like CSRD/ESRS), sustainability is no longer a marketing choice; it is a legal data matrix… The real, unappreciated challenge is figuring out how to aggressively defend raw, emotional storytelling while operating flawlessly within these legal handcuffs.”
                          </p>
                          <p style={{
                            fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                            fontSize: 14,
                            lineHeight: 1.4,
                            color: '#000000',
                            margin: 0,
                          }}>
                            <strong style={{ fontWeight: 700 }}>Martin Cedergren</strong>, Creative Director &amp; Brand Advisor
                          </p>
                        </div>
                      </div>,
                    ]}
                    featureMedia={resolveStandout(report.trendSections?.[2]?.trendVideo, 'Standouts from the Nordics') || {
                      url: 'https://framna.com/cases/norlys',
                      imageUrl: '/lovie/norlys-standout.webp',
                      label: 'Standouts from the Nordics',
                      name: 'Norlys Efficient Energy Usage',
                      title: 'Norlys owns Denmark’s largest electricity grid, half of Eurowind Energy, and the Greenlab green industrial park. The Lovie-winning app lets customers track real-time electricity pricing and shift consumption to greener, cheaper windows.',
                    }}
                    insideTheHubs={{
                      eyebrow: 'Inside the Hubs',
                      swedenCopy: (
                        <p><strong>Oatly</strong> built its brand by rejecting the conventions of corporate marketing. Its irreverent voice and campaigns like &ldquo;Wow No Cow!&rdquo; helped redefine how purpose-driven brands could communicate.</p>
                      ),
                      denmarkCopy: (
                        <p><strong>Carlsberg</strong>&rsquo;s &ldquo;Probably Not the Best Beer in the World&rdquo; campaign playfully reworked its century-old slogan, while <strong>&Oslash;rsted</strong> transformed from fossil fuel giant DONG Energy into one of the world&rsquo;s leading renewable energy companies.</p>
                      ),
                      norwayCopy: (
                        <p>Norway&rsquo;s <strong>Equinor</strong> has reshaped its identity around the energy transition, with projects like <strong>Hywind</strong>&mdash;the world&rsquo;s first floating offshore wind farm&mdash;symbolising the country&rsquo;s shift from oil to renewables.</p>
                      ),
                    }}
                    secondaryStandout={resolveStandout(report.trendSections?.[2]?.secondaryStandout, 'Standouts from the Nordics') || {
                      url: 'https://framna.com/cases/ok',
                      imageUrl: '/lovie/ok-app-standout.webp',
                      label: 'Standouts from the Nordics',
                      name: 'OK App',
                      title: 'OK started in 1978 as Denmark’s largest fuel cooperative, but its app now frames EV charging, heat pumps, solar advice, and green electricity as core functions, not a campaign layered on top of a fuel business.',
                    }}
                  />
                )}

                {/* Nordics Trend 04 — Cross-Border Collaboration At Its
                    Core. Body + inline pull quotes in row 1 left; enlarged
                    donut in row 1 right. Row 2 stays open for future
                    Inside the Hubs / standouts. */}
                {isNordics && (() => {
                  const NORDIC_ACCENT_T4 = '#016BA7'
                  function InlineQuote({ text, name, role, headshotUrl }: { text: string; name: string; role: string; headshotUrl?: string }) {
                    return (
                      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 12, paddingLeft: 20, borderLeft: `3px solid ${NORDIC_ACCENT_T4}` }}>
                        {headshotUrl && (
                          <img
                            src={headshotUrl}
                            alt={name}
                            width={80}
                            height={80}
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              flexShrink: 0,
                              border: `2px solid ${NORDIC_ACCENT_T4}`,
                            }}
                          />
                        )}
                        <div>
                          <p style={{
                            fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                            fontSize: 17,
                            lineHeight: 1.5,
                            color: '#000000',
                            margin: '0 0 12px',
                          }}>
                            {text}
                          </p>
                          <p style={{
                            fontFamily: "'Scto Grotesk A', -apple-system, sans-serif",
                            fontSize: 14,
                            lineHeight: 1.4,
                            color: '#000000',
                            margin: 0,
                          }}>
                            <strong style={{ fontWeight: 700 }}>{name}</strong>, {role}
                          </p>
                        </div>
                      </div>
                    )
                  }
                  return (
                  <LovieTrendContent
                    trendNumber="04"
                    title="Cross-Border Collaboration At Its Core"
                    accentColor={NORDIC_ACCENT_T4}
                    body={[
                      <>Scandinavia and Finland&rsquo;s creative industries punch above their weight by thinking beyond national markets. Rather than competing as four separate creative scenes, agencies have built networks that share talent, clients, and expertise across the region.</>,
                      <>The <strong>North Alliance</strong> is the clearest example: an independent agency collective that gives smaller markets the scale to compete internationally while maintaining strong local identities. It&rsquo;s a model that reflects the region itself: <strong style={{ fontWeight: 700 }}>collaborative and designed to embrace collaboration as a competitive advantage</strong>.</>,
                      <InlineQuote
                        key="q-claus"
                        text="“People underestimate that creatives from a smaller country are more diverse in their craft. They are not as specialized as in bigger countries. They can also do more for less money since budgets are not high here.”"
                        name="Claus Collstrup"
                        role="Creative Director & Partner, NoA / &Co"
                        headshotUrl="/lovie/claus-collstrup-headshot.jpeg"
                      />,
                      <InlineQuote
                        key="q-david"
                        text="“It’s incredibly important to lean on Scandinavian culture and standards, but improve on selling ideas and approaches globally.”"
                        name="David Juul Ledstrup"
                        role="Executive Strategy Director, Kubbco"
                        headshotUrl="/lovie/david-juul-ledstrup-headshot.webp"
                      />,
                    ]}
                    dataModule={{
                      eyebrow: 'Culturally Specific or International',
                      question: 'Is the region’s most exciting work better served by staying culturally specific or scaling internationally?',
                      chartType: 'donut',
                      donutSize: 380,
                      bars: [
                        { label: 'Both / a mix', value: 50, displayValue: '50%', color: '#003D66' },
                        { label: 'Culturally specific only', value: 25, displayValue: '25%', color: '#016BA7' },
                        { label: 'Internationally only', value: 12, displayValue: '12%', color: '#4C9BC7' },
                        { label: 'No answer', value: 13, displayValue: '13%', color: '#A8D5F0' },
                      ],
                    }}
                  />
                  )
                })()}

                {/* Nordics Section 02 — "The Ones to Watch". Section
                    cover uses the same compact treatment as the Trend
                    covers, then the 3×3 grid of picks follows. */}
                {isNordics && (
                  <>
                    <ReportSectionCover
                      sectionNumber="02"
                      title="The Ones to Watch"
                      subtitle="We asked our community to share who is flying under the radar. Which creatives or companies are creating standout work, but haven’t received enough recognition?"
                      accentColor="#016BA7"
                      property={report.property}
                      sectionNumberSvg="/lovie/lovie-heart-black.svg"
                      compact
                    />
                    <NordicsOnesToWatch />
                  </>
                )}

                {/* Nordics Section 03 — Takeaways. Cover + 4-card grid
                    (via LovieTakeaways with variant='nordics' so the
                    numbered heart renders in black over the Swedish
                    blue accent). */}
                {isNordics && (
                  <>
                    <ReportSectionCover
                      sectionNumber="03"
                      title="Takeaways"
                      subtitle="Four conclusions on the Nordic creative economy."
                      copy="How Sweden, Denmark, Finland, and Norway are shaping the next chapter of European digital and creative work — from distributed hubs to cross-border collaboration."
                      accentColor="#016BA7"
                      property={report.property}
                      sectionNumberSvg="/lovie/lovie-heart-black.svg"
                      compact
                    />
                    <LovieTakeaways
                      variant="nordics"
                      takeaways={[
                        {
                          title: 'Creative infrastructure outlasts breakout success',
                          body: "Spotify, Klarna, and Wolt may grab the headlines, but they're products of something bigger. Judges pointed to digital infrastructure and platforms — not consumer apps — as the region's greatest engine of innovation.",
                        },
                        {
                          title: 'The creative map extends beyond the capitals',
                          body: "Many of the Nordics' most influential companies are based outside Stockholm, Copenhagen, Oslo, and Helsinki. Yet the capitals still dominate perceptions of where the region's best creative work happens.",
                        },
                        {
                          title: 'Purpose is built into the business',
                          body: "The Nordics treat sustainability as a business principle, not a marketing strategy. From Ørsted to Oatly, the region's strongest brands build trust through their decisions and transparency.",
                        },
                        {
                          title: 'Cross-border collaboration at scale',
                          body: "Creatives and companies across the Nordics have built a connected creative ecosystem. Networks like The North Alliance (NoA) give independent agencies the reach to compete well beyond their borders.",
                        },
                      ]}
                    />
                  </>
                )}


                {/* Lovie Mediterranean Trend 01 — title + body are
                    CMS-driven through trendSections[0]. Data module,
                    Inside the Hubs, and feature video are hardcoded. */}
                {!isNordics && (
                <LovieTrendContent
                  trendNumber="01"
                  title={report.trendSections?.[0]?.trendTitle?.trim() || 'A Creative Scene Building Beyond Capital Cities'}
                  accentColor="#ff6000"
                  body={portableTextToBody(report.trendSections?.[0]?.trendBody, [
                    <>The Mediterranean&rsquo;s significant tech and creative work is now being produced in its surrounding cities. Economic pressure, including rising housing costs, stagnant salaries, and youth unemployment, is <strong style={{ fontWeight: 700 }}>redistributing talent outside of Spain, Portugal, and Italy&rsquo;s primary business hubs</strong>.</>,
                    <>As the creative scene decentralises into secondary cities, such as Bilbao, M&aacute;laga, Porto, and Coimbra, it is producing more distinctive work that merges local traditions with craft and emerging technologies.</>,
                    <>Decentralisation is still in its early stages; <strong style={{ fontWeight: 700 }}>half of creative leaders in the Mediterranean believe the region&rsquo;s most exciting work is still concentrated in major cities, while others believe it is on the move</strong>.</>,
                  ])}
                  dataModule={{
                    question: 'Where in your country is the most exciting creative work being produced?',
                    bars: [
                      { label: 'Predominantly in major cities (Madrid, Lisbon, Milan)', value: 50, displayValue: '50%' },
                      { label: 'Increasingly from secondary cities and regional hubs', value: 30, displayValue: '30%' },
                      { label: 'Hard to say', value: 20, displayValue: '20%' },
                      { label: "It's distributed", value: 0, displayValue: '0%' },
                    ],
                  }}
                  insideTheHubs={{
                    eyebrow: 'Inside the Hubs',
                    heading: 'Where the New Creative Hubs Are Emerging',
                    spainCopy: (
                      <p>While Barcelona and Madrid remain dominant creative centres, secondary cities are emerging as new ecosystems. Valencia has cultivated a thriving startup scene, with privacy-first cloud software company <strong>Internxt</strong> and <strong>Voicemod</strong>, which scales AI audio tools for creators. A Coru&ntilde;a, Spain&rsquo;s northern port city, houses film production and brand marketing powerhouses <strong>Portocabo</strong> and <strong>Estrella Galicia</strong>, respectively. Bilbao is an art centre, home to the Lovie Award-winning <strong>Fundaci&oacute;n del Museo Guggenheim Bilbao</strong>.</p>
                    ),
                    italyCopy: (
                      <p>This trend is less strong in Italy, yet there are a few signals that Italian innovation is no longer confined to Milan or Rome. <strong>Cubbit</strong>, a Bologna-based encrypted cloud storage provider, is a leader in Italy&rsquo;s tech sector. Lovie Award-winning studios <strong>Mirror</strong> and <strong>Monogrid</strong> are pioneering branded immersive experiences in Florence. Lovie-recognised creative technology and design leader <strong>Sidewave</strong> is crafting new experiences in Northern Italy&rsquo;s Verona.</p>
                    ),
                    portugalCopy: (
                      <p>In the small nation, most creative opportunities remain concentrated in Lisbon. However, its central cities have emerged as new sites. Lovie Award Winner and internationally recognised design studio <strong>B&uuml;rocratik</strong> operates from Porto and Coimbra.</p>
                    ),
                  }}
                  featureMedia={{
                    url: '/lovie/genesis.mp4',
                    label: 'Standouts from the Mediterranean',
                    name: "Inside Mirror's 'Genesis of a Terroir' for Masseto",
                    title: '2025 Lovie Gold Winner, Craft — Best Installation or Experience',
                  }}
                />
                )}

                {/* Lovie Mediterranean Trends 02–05, Takeaways transition,
                    and Trend 05 media are all Med-only for now — hide
                    from the Nordics report until Nordics content is
                    ready. */}
                {!isNordics && <>

                {/* Lovie Trend 02 — Smaller Players Are Setting the Standard.
                    Body + quotes pulled from CMS so editor link/strong marks
                    render; hardcoded values are fallbacks for when CMS is
                    unpopulated. insideTheHubs is still hardcoded — that field
                    isn't populated in Sanity yet for this trend. */}
                <LovieTrendContent
                  trendNumber="02"
                  title={report.trendSections?.[1]?.trendTitle?.trim() || 'Smaller Players Are Setting the Standard'}
                  accentColor="#ff6000"
                  body={portableTextToBody(report.trendSections?.[1]?.trendBody, [
                    <>Some of the most awarded work in the region is coming from smaller, independent structures: leaner agencies, tech startups, and small design studios.</>,
                    <>In Spain, <strong>Elkanodata</strong> is a small, Lovie Award-winning agency that is implementing social change through digital design. In Italy, Lovie-recognised design leader <strong>Sidewave</strong> is crafting new branded experiences.</>,
                    <><>Although smaller to mid-sized companies produce work that benchmarks globally, </>{' '}<strong style={{ fontWeight: 700 }}>they are struggling to keep pace with the technological changes being set by larger, more resourced organisations</strong>, according to creative leaders.</>,
                  ])}
                  quotes={(() => {
                    const lovieBorders = ['#eeffbb', '#ff6000']
                    const cms = report.trendSections?.[1]?.expertQuotes ?? []
                    if (cms.length > 0) {
                      return cms.map((q, i) => ({
                        text: portableTextToPlain(q.quoteText),
                        attribution: q.name,
                        role: q.title || '',
                        linkedInUrl: q.linkedInUrl,
                        headshotUrl: q.headshot ? urlFor(q.headshot).width(240).height(240).fit('crop').url() : undefined,
                        borderColor: lovieBorders[i % lovieBorders.length],
                      }))
                    }
                    return [
                      {
                        text: '“The tension between cultural relevance and commercial sustainability is, in my view, the most underestimated structural challenge for independent creative studios in Europe right now — and nobody talks about it honestly.”',
                        attribution: 'Giacomo Scando',
                        role: 'CEO, Giga Design Studio Srl',
                        headshotUrl: '/lovie/quote-giacomo.jpg',
                        borderColor: lovieBorders[0],
                      },
                      {
                        text: '“We live in a moment where mid-sized companies face the challenge of building the digital solidity needed to compete at the level of the great ones — while large companies must spend less time focused on the day-to-day and instead set the direction for their sector. Not simply shipping features in rapid sprints, but deliberately prioritizing transformative, high-impact change.”',
                        attribution: 'Miguel Priera',
                        role: 'Senior Visual & Interaction Designer, Hanzo',
                        headshotUrl: '/lovie/quote-miguel.jpg',
                        borderColor: lovieBorders[1],
                      },
                    ]
                  })()}
                  insideTheHubs={{
                    eyebrow: 'Inside the Hubs',
                    heading: 'Where Independents Are Winning',
                    spainCopy: (
                      <p>Independent agencies <strong>DAVID Madrid</strong>, <strong>LOLA MullenLowe</strong>, and <strong>&amp;Ros&agrave;s</strong> have placed in Spain&rsquo;s national Top 20 creative rankings every year from 2021&ndash;2025.</p>
                    ),
                    italyCopy: (
                      <p>Two agencies, <strong>Small</strong> and <strong>LePub</strong>, are leaders in Italian creativity, while <strong>Mirror</strong>, a Lovie Award-winning studio, is producing some of Italy&rsquo;s most ambitious brand experiences from outside the network model.</p>
                    ),
                    portugalCopy: (
                      <p>In Portugal, <strong>B&uuml;rocratik</strong> holds five consecutive years in European digital design rankings. The country&rsquo;s most internationally recognised creative output is consistently coming from outside its largest institutions.</p>
                    ),
                  }}
                  featureMedia={{
                    url: '/lovie/monogrid.mp4',
                    label: 'Standouts from the Mediterranean',
                    name: 'Fiorucci — Loveclub WebAR',
                    title: 'by MONOGRID Srl',
                  }}
                />

                {/* Lovie Trend 03 — Internationalism & Collaboration by
                    Necessity. Data module uses ranked scores from the PDF
                    survey (1–10 scale displayed as raw values, scaled to
                    percentage for bar width). Final chart treatment TBD. */}
                <LovieTrendContent
                  trendNumber="03"
                  title={report.trendSections?.[2]?.trendTitle?.trim() || 'Internationalism & Collaboration by Necessity'}
                  accentColor="#ff6000"
                  body={portableTextToBody(report.trendSections?.[2]?.trendBody, [
                    <>The domestic markets across the Mediterranean aren&rsquo;t big enough to sustain commercial ambition at scale. As a reaction, organisations have embraced internationalism as a necessity. Creative leaders agree; <strong style={{ fontWeight: 700 }}>&ldquo;difficulty scaling beyond local markets&rdquo; was named the third challenge shaping work in their respective countries</strong>.</>,
                    <>This is most evident in Portugal, which has become a global startup hub for AI and digital infrastructure. From the Web Summit conference to startups like <strong>Unbabel</strong> and <strong>Feedzai</strong>, they are building client and revenue systems outside of Portugal.</>,
                    <>In the video and film industries, companies have embraced &ldquo;co-production&rdquo; to scale. Spain&rsquo;s most visible model is <strong>Funicular Films&rsquo; This Is Not Sweden</strong> series, a five-broadcaster European co-production spanning RTVE, 3Cat, SVT, NDR, and YLE, funded via ICEC Catalan grants and Creative Europe Media.</>,
                  ])}
                  dataModule={{
                    question: 'In ranked order, what are the top challenges currently shaping your career in your country?',
                    // Lollipop chart — better fit for ranked / score data
                    // than horizontal bars. Module sits inside a lime tile
                    // as an editorial color block.
                    chartType: 'lollipop',
                    footnote: 'Average score out of 10',
                    bars: [
                      { label: 'AI and automation', value: 53, displayValue: '5.3' },
                      { label: 'Concentration of opportunity in major hubs', value: 45, displayValue: '4.5' },
                      { label: 'Difficulty scaling beyond local markets', value: 44, displayValue: '4.4' },
                      { label: 'Competition and market saturation', value: 42, displayValue: '4.2' },
                      { label: 'Economic instability or funding gaps', value: 40, displayValue: '4.0' },
                      { label: 'Regulatory complexity', value: 29, displayValue: '2.9' },
                      { label: 'Talent scarcity and/or brain drain', value: 27, displayValue: '2.7' },
                    ],
                  }}
                  insideTheHubs={{
                    eyebrow: 'Inside the Hubs',
                    heading: 'Reaching Beyond Their Borders',
                    spainCopy: (
                      <p>Companies here are straightforward in their approach: <strong>leveraging the Spanish language</strong>. With five hundred million Spanish speakers across the Americas, Spanish companies have a built-in audience and access to scale that no other European market contains. This, in part, fuels Spain&rsquo;s success in the creator economy. <strong>La Ruina</strong>, a comedy podcast built on personal stories, added live video formats and recorded a 190%+ increase in viewing hours after adding video. Spanish SVOD original commissions grew from 43 to 75 between 2023 and 2024.</p>
                    ),
                    italyCopy: (
                      <p>The nation&rsquo;s most visible companies across tech operate at a global scale, from <strong>LePub</strong>, with ten offices across New York, Latin America, and EMEA, to <strong>Bending Spoons</strong>, which acquired Vimeo, AOL, and Eventbrite on its way to an $11B valuation.</p>
                    ),
                    portugalCopy: (
                      <p>Portugal has intentionally become the international startup hub in the EU by investing in infrastructure. Tech companies <strong>Feedzai</strong>, <strong>Unbabel</strong>, and <strong>Talkdesk</strong> built their primary client relationships outside of Portugal while maintaining Portuguese headquarters.</p>
                    ),
                  }}
                  quotes={(() => {
                    const lovieBorders = ['#eeffbb', '#ff6000']
                    const cms = report.trendSections?.[2]?.expertQuotes ?? []
                    if (cms.length > 0) {
                      return cms.map((q, i) => ({
                        text: portableTextToPlain(q.quoteText),
                        attribution: q.name,
                        role: q.title || '',
                        linkedInUrl: q.linkedInUrl,
                        headshotUrl: q.headshot ? urlFor(q.headshot).width(240).height(240).fit('crop').url() : undefined,
                        borderColor: lovieBorders[i % lovieBorders.length],
                      }))
                    }
                    return [
                      {
                        text: '“Europe should grow closer together, and it should be much easier to do business together. We have the talent but often not the confidence and trust.”',
                        attribution: 'Stefanie Palomino',
                        role: 'VP Product, Marketing & Innovation, Middelhoff Consulting',
                        borderColor: lovieBorders[0],
                      },
                      {
                        text: '“We need to move from exporting creatives to importing briefs. We need to stop positioning our talent as a low-cost resource and start attracting global business, leading it from here — just as happens in Amsterdam.”',
                        attribution: 'Pepe Garcia',
                        role: 'Executive Creative Director, Now Independent',
                        borderColor: lovieBorders[1],
                      },
                    ]
                  })()}
                />

                {/* Lovie Trend 04 — Rooted in Local Culture for Global Reach.
                    Data module = "select up to 3" percentages (bar chart, since
                    these are share-of-respondents, not ranked scores). Two
                    quotes spill into row 3 because both data + media slots
                    are full above. */}
                <LovieTrendContent
                  trendNumber="04"
                  title={report.trendSections?.[3]?.trendTitle?.trim() || 'Rooted in Local Culture for Global Reach'}
                  accentColor="#ff6000"
                  body={portableTextToBody(report.trendSections?.[3]?.trendBody, [
                    <>As hyperoptimisation and AI increasingly homogenise the global creative industry, the Mediterranean&rsquo;s most internationally recognised work resists this flattening. Here, cultural specificity is a competitive advantage, from weaving concepts like Portugal&rsquo;s <em>&ldquo;Saudade&rdquo;</em> into digital storytelling to blending Italy&rsquo;s deep craft traditions with creative technologies.</>,
                    <>Creative leaders across Spain, Portugal, and Italy agree; <strong style={{ fontWeight: 700 }}>about 60% of jurors in Southern Europe cited &ldquo;cultural specificity&rdquo; as defining the creative identity of digital work in their countries</strong>. Nurturing local stories is helping digital work find a larger audience.</>,
                  ])}
                  dataModule={{
                    question: 'What do you think most defines the creative identity of digital work coming out of your country right now? Select up to 3.',
                    chartType: 'verticalBar',
                    bars: [
                      { label: 'Strong aesthetic sensibility', shortLabel: 'Aesthetic Sensibility', value: 60, displayValue: '60%' },
                      { label: 'Cultural specificity', shortLabel: 'Cultural Specificity', value: 60, displayValue: '60%' },
                      { label: 'Personality-led storytelling', shortLabel: 'Personality-led', value: 40, displayValue: '40%' },
                      { label: 'Technical innovation', shortLabel: 'Tech Innovation', value: 40, displayValue: '40%' },
                      { label: 'Internationalism and cross-cultural reach', shortLabel: "Int'l Reach", value: 20, displayValue: '20%' },
                      { label: 'Collaborative structures', shortLabel: 'Collab.', value: 20, displayValue: '20%' },
                      { label: 'Social purpose', shortLabel: 'Social Purpose', value: 10, displayValue: '10%' },
                      { label: "I don't think a single creative identity defines us", shortLabel: 'No Single Identity', value: 10, displayValue: '10%' },
                    ],
                  }}
                  insideTheHubs={{
                    eyebrow: 'Inside the Hubs',
                    heading: 'Speaking to Each Unique Internet Culture',
                    spainCopy: (
                      <p>Cultural embeddedness drives successful work in Spain. <strong>Estrella Galicia</strong> has grown into one of Spain&rsquo;s most valuable brands while remaining explicitly Galician. A mature creator economy is also deeply embedded in Spanish culture, driven by high youth unemployment and the need for creator-led careers. Burger brand <strong>Vicio</strong>, co-founded by MasterChef Espa&ntilde;a winner Alex Puig, plugs its marketing into Spanish Internet culture: influencer-generated hype and drop-model strategies.</p>
                    ),
                    italyCopy: (
                      <p>As the home of deep craft traditions across architecture, fashion, cinema, and design, Italy&rsquo;s approach to the Internet blends this heritage with sharp storytelling — a digital culture that prioritises strong visual language and narrative-led content. <strong>Bottega Veneta&rsquo;s Bottega for Bottegas</strong> campaign, which celebrated local workshops, increased the brand&rsquo;s visibility by 94%. <strong>Giga Design Studio&rsquo;s Loewe Craft Foundation Prize</strong> exemplified the merging of strong digital design with craft.</p>
                    ),
                    portugalCopy: (
                      <p><em>&ldquo;Saudade,&rdquo;</em> Portugal&rsquo;s concept of deep longing, translates into creative work that is slower, visually minimalistic, and prioritises emotional depth. Beer brand <strong>Super Bock&rsquo;s</strong> breakthrough spot &ldquo;Pelas amizades que n&atilde;o querem ser outra coisa&rdquo; exemplifies this with its ode to friendship. Its connection to Lusophone-speaking nations like Brazil, Angola, and Mozambique creates a digital economy that inherently has global reach.</p>
                    ),
                  }}
                  quotes={(() => {
                    // Trend 4 features ONE quote (Pepe Garcia) under the
                    // video — Rosalía / "local is global" lands directly on
                    // the thesis. Pulls from CMS by name so we keep Pepe's
                    // entry even if the CMS quote order changes.
                    const cms = report.trendSections?.[3]?.expertQuotes ?? []
                    const pepeCms = cms.find((q) => q.name?.toLowerCase().includes('pepe'))
                    if (pepeCms) {
                      return [{
                        text: portableTextToPlain(pepeCms.quoteText),
                        attribution: pepeCms.name,
                        role: pepeCms.title || '',
                        linkedInUrl: pepeCms.linkedInUrl,
                        headshotUrl: pepeCms.headshot ? urlFor(pepeCms.headshot).width(240).height(240).fit('crop').url() : undefined,
                        borderColor: '#ff6000',
                      }]
                    }
                    return [
                      {
                        text: '“Spanish creative and cultural authenticity is what makes us global. Do you know Rosalía? Does she move you? Is she local or global? I think she’s simply authentic, and that’s something human beings can recognise, no matter where in the world it comes from.”',
                        attribution: 'Pepe Garcia',
                        role: 'Executive Creative Director (formerly JellyFish)',
                        borderColor: '#ff6000',
                      },
                    ]
                  })()}
                  featureMedia={{
                    url: '/lovie/super-bock.mp4',
                    label: 'Standouts from the Mediterranean',
                    name: "Super Bock — 'Pelas Amizades Que Não Querem Ser Outra Coisa'",
                    title: 'Advert',
                  }}
                />

                {/* Lovie Trend 05 — Building Digital Sovereignty & AI
                    Infrastructure. Data module = single-choice sentiment
                    question (5 responses, sums ≈ 100%). Using horizontal
                    bar as placeholder until the viz design is picked from
                    the /lovie-mockups options. Only Spain + Portugal in
                    Inside the Hubs — Italy is covered in the body. */}
                <LovieTrendContent
                  trendNumber="05"
                  title={report.trendSections?.[4]?.trendTitle?.trim() || 'Building Digital Sovereignty & AI Infrastructure'}
                  accentColor="#ff6000"
                  body={portableTextToBody(report.trendSections?.[4]?.trendBody, [
                    <>Beyond consumer AI products, Mediterranean companies are investing in building sovereign, ethical digital infrastructure.</>,
                    <>Italy became the first EU member state to pass a comprehensive AI framework with <strong>Law No. 132/2025</strong> in October 2025. Spain is focusing on AI compliance, passing <strong>AESIA</strong>, its dedicated AI supervisory agency. Portugal already touts a robust startup scene, with more credible role models and international visibility through Web Summit. Now, it is focusing on ethical AI.</>,
                    <>However, <strong style={{ fontWeight: 700 }}>for nearly half of creative leaders living and working in Mediterranean countries, it is still too early to see a real effect of AI guardrails</strong>.</>,
                  ])}
                  dataModule={{
                    question: 'How are European regulations around AI and digital platforms affecting creative work in your market?',
                    chartType: 'donut',
                    bars: [
                      { label: 'Creating useful guardrails', shortLabel: 'Useful guardrails', value: 0, displayValue: '0%', color: '#000000' },
                      { label: 'Adding compliance burdens that affect small players', shortLabel: 'Compliance burdens', value: 11.11, displayValue: '11%', color: '#ffb986' },
                      { label: 'Doing both, depending on the organisation', shortLabel: 'Both, depending', value: 33.33, displayValue: '33%', color: '#ca86ff' },
                      { label: 'Too early to see a real effect', shortLabel: 'Too early', value: 44.44, displayValue: '44%', color: '#ff6000' },
                      { label: 'No direct effect on the work I do', shortLabel: 'No direct effect', value: 11.11, displayValue: '11%', color: '#6D48FF' },
                    ],
                  }}
                  insideTheHubs={{
                    eyebrow: 'Inside the Hubs',
                    heading: 'Two Approaches to Sovereign AI',
                    spainCopy: (
                      <p>Spain is experiencing a tension between its booming creator economy and dependency on foreign platforms to fuel it. Spain&rsquo;s most successful creators — <strong>Ibai Llanos</strong>, <strong>AuronPlay</strong>, <strong>IlloJuan</strong>, and beyond — have built large audiences on Twitch and YouTube. However, it is investing in sovereign deep-tech infrastructure through companies like <strong>Multiverse Computing</strong>, a quantum and AI software provider known for compressing large language models while maintaining performance.</p>
                    ),
                    portugalCopy: (
                      <p>Portugal has embedded responsible AI as a national strategy. The cluster around <strong>Feedzai</strong> is building AI fraud detection tools for financial institutions. <strong>YData</strong> applies AI to profiling synthetic data quality for machine learning teams navigating EU AI Act compliance. <strong>Talkdesk</strong> and <strong>DefinedCrowd</strong> represent an AI ecosystem built around real-world infrastructure: fraud detection and language translation.</p>
                    ),
                  }}
                  quotes={(() => {
                    const lovieBorders = ['#eeffbb', '#ff6000']
                    const cms = report.trendSections?.[4]?.expertQuotes ?? []
                    if (cms.length > 0) {
                      return cms.map((q, i) => ({
                        text: portableTextToPlain(q.quoteText),
                        attribution: q.name,
                        role: q.title || '',
                        linkedInUrl: q.linkedInUrl,
                        headshotUrl: q.headshot ? urlFor(q.headshot).width(240).height(240).fit('crop').url() : undefined,
                        borderColor: lovieBorders[i % lovieBorders.length],
                      }))
                    }
                    return [
                      {
                        text: '“The real tension is that clients risk reducing Gen AI to a mere ‘faster and cheaper’ shortcut. The true evolutionary leap requires deep care for the social and cultural relevance of projects, solving real human tensions. Technology must stop being a gimmick to impress and become an executive tool to make meaningful messages resonate.”',
                        attribution: 'Fabrizio Piccolini',
                        role: 'Executive Creative Director, Mirror',
                        borderColor: lovieBorders[0],
                      },
                      {
                        text: '“[European regulations on AI are] adding a compliance burden that affects smaller players.”',
                        attribution: 'Stefanie Palomino',
                        role: 'VP Product, Marketing and Innovation, Middelhoff Consulting S.L.',
                        borderColor: lovieBorders[1],
                      },
                    ]
                  })()}
                />

                {/* Takeaways transition — mirrors the Section 1 cover so
                    the section break visually rhymes with the trend
                    sections we just finished. Heart token + title + orange
                    divider + italic standfirst + body copy. */}
                {/* sectionNumber drives the DOM id (`section-${n}`). Use
                    `takeaways-cover` here so the cover's id doesn't
                    collide with the LovieTakeaways content below, which
                    owns `section-takeaways` for anchor links. */}
                <ReportSectionCover
                  sectionNumber="takeaways-cover"
                  title="Takeaways"
                  subtitle="Five conclusions on the Mediterranean's creative hubs."
                  copy="How Spain, Portugal, and Italy are reshaping Europe's contribution to the internet — from decentralised creative scenes to AI infrastructure."
                  accentColor="#ff6000"
                  property="lovie"
                  sectionNumberSvg="/lovie/no-1.svg"
                  compact
                />

                <LovieTakeaways takeaways={report.lovieTakeaways} />
                </>}
              </>
            ) : (
            <>
            <TrendContent
              trendNumber="01"
              title={report.trendSections?.[0]?.trendTitle || 'Rollbacks Have Increased In Every Corner of the Sector in 2026'}
              body={portableTextToBody(report.trendSections?.[0]?.trendBody, [
                <>In 2025, the Anthem community observed rollbacks or gaps centered primarily around Racial and Social Equity. In 2026, impact leaders report witnessing regression across every area in the sector. <strong>Racial and Social Equity remains the most-cited rollback— at 77%— but it is no longer alone.</strong></>,
                "Leaders report increased rollbacks in Human & Civil Rights by 10%, in Corporate Responsibility by 15%, and Climate Advocacy by 15%—and across mental health, reproductive health, affordable access to food, and more.",
              ])}
              accentColor="#8C001C"
              dataModule={{
                eyebrow: '',
                question: 'In the last year, what areas have you observed rollbacks or increasing gaps in?',
                bars: [
                  { label: 'Human & Civil Rights', value: 72, displayValue: '72%', change: '↑ +10.5 from 2025', color: '#8C001C' },
                  { label: 'Racial & Social Equity', value: 69, displayValue: '69%', change: '↓ -5.6 from 2025', color: '#21261A' },
                  { label: 'Corporate Responsibility', value: 67, displayValue: '67%', change: '↑ +14.7 from 2025', color: '#066DBA' },
                  { label: 'Freedom of Press & Democracy', value: 65, displayValue: '65%', change: 'New in 2026', color: '#D17DD0' },
                  { label: 'Immigration', value: 58, displayValue: '58%', change: 'New in 2026', color: '#00B469' },
                  { label: 'Climate Advocacy', value: 59, displayValue: '59%', change: '↑ +15.4 from 2025', color: '#8C001C' },
                ],
              }}
            />

            <QuoteVideoSection
              eyebrow="What Our Community Is Saying"
              quotes={resolveTrendQuotes(report.trendSections?.[0]?.expertQuotes, [
                {
                  name: 'Anonymous',
                  title: 'Survey respondent',
                  text: '"I think it\'s kind of clear that just within the last couple of years how dramatically everything has changed, and turned upside down and new narratives are entering and what\'s up is down. It just feels very disorienting."',
                },
                {
                  name: 'Dan McCrory',
                  title: 'Producer, Working Voices on KPFK',
                  text: '"We witnessed the dismantling of public cultural institutions and feel threatened but breathe a sigh of relief that we had not been reliant on funds from the Corporation for Public Broadcasting."',
                },
              ])}
              videoSrc="/anthem/rollbacks-video.mp4"
              videoLabel="Watch Video"
              videoName="Michael Bellavia"
              videoTitle="CEO, HelpGood"
              accentColor={report.trendSections?.[0]?.accentColor || '#8C001C'}
            />

            {/* Trend 2 — still within Section 1 */}
            <TrendContent
              trendNumber="02"
              title={report.trendSections?.[1]?.trendTitle || 'Despite Hardships, the Community Has Accepted Its New Reality'}
              body={portableTextToBody(report.trendSections?.[1]?.trendBody, [
                <>Last year, 70% of respondents described the social impact landscape as negative, somewhat negative or negative. <strong>This year, the average score landed at 53.7.</strong> While some leaders feel exhausted, the community is stabilizing and not collapsing under the pressure.</>,
                <>According to multiple leaders, they are digging in with a strengthened resolve rather than giving up. Respondents described their organizations as <strong>{'"'}constantly catching up{'"'}</strong> or <strong>{'"'}reimagining{'"'}</strong> new strategies to move the work forward.</>,
              ])}
              accentColor="#8C001C"
              sentimentGauge={{
                score: 53.9,
                label: 'average sentiment\nscore out of 100',
                contextLeft: '2025: 70% felt negative',
                contextRight: '2026: Moving toward neutral',
              }}
            />

            <QuoteVideoSection
              eyebrow="What Our Community Is Saying"
              quotes={resolveTrendQuotes(report.trendSections?.[1]?.expertQuotes, [
                {
                  name: 'Olive Mwangi',
                  title: 'Head of Social Media, Dentsu Creative Kenya',
                  headshotUrl: '/anthem/headshots/olive-mwangi.jpg',
                  text: '"2025 reinforced that neutrality is no longer neutral. There is an opportunity, and arguably a responsibility, for brands to show up with greater clarity, consistency, and courage."',
                },
                {
                  name: 'Cal McAllister',
                  title: 'Founder, CEO, Paper Crane Factory',
                  text: '"We are all doing the heavy lifting. The current administration is devastating both the planet and the morale of those trying to save it. But it\'s a battle. The war is there to win. And it will take all of us."',
                },
              ])}
              videoSrc="/anthem/state-of-impact-video.mp4"
              videoLabel="Watch Video"
              videoName="Kyle Lierman"
              videoTitle="CEO, Civic Nation"
              accentColor={report.trendSections?.[1]?.accentColor || '#8C001C'}
            />

            {/* Section 2: Where the Pressure Is Landing */}
            <ReportSectionCover
              sectionNumber={report.section02Cover?.sectionNumber || '02'}
              title={report.section02Cover?.title || 'Where the Pressure Is Landing'}
              subtitle={report.section02Cover?.subtitle || '"No one feels generous in a time of enormous stress."'}
              copy={report.section02Cover?.copy || "The burden isn't shared evenly across the sector. Funding losses have put the largest strain on Health and Humanitarian Action and Services, while attacks on DE&I have impacted anyone doing this work, regardless of org size or cause area."}
              accentColor={report.section02Cover?.accentColor || '#D17DD0'}
            />

            <BubbleChart
              eyebrow="Top Challenge By Cause Area"
              title="Where the Pressure Hits Hardest"
              data={[
                { cause: 'Technology', challenge: 'Cultural Shifts', percentage: 100, respondents: 4, totalRespondents: 4, color: '#21261A' },
                { cause: 'Humanitarian Action', challenge: 'Gov Funding', percentage: 89, respondents: 8, totalRespondents: 9, color: '#066DBA' },
                { cause: 'Sustainability & Climate', challenge: 'Cultural Shifts', percentage: 86, respondents: 12, totalRespondents: 14, color: '#00B469' },
                { cause: 'Belonging & Inclusion', challenge: 'Gov Funding & Cultural Shifts', percentage: 71, respondents: 10, totalRespondents: 14, color: '#D17DD0' },
                { cause: 'Human & Civil Rights', challenge: 'Public Perception', percentage: 65, respondents: 11, totalRespondents: 17, color: '#8C001C' },
                { cause: 'Education & Culture', challenge: 'Private & Gov Funding', percentage: 62, respondents: 13, totalRespondents: 21, color: '#8C001C' },
                { cause: 'Health', challenge: 'Gov Funding & Cultural Shifts', percentage: 50, respondents: 4, totalRespondents: 8, color: '#21261A' },
              ]}
            />

            <TrendContent
              trendNumber="03"
              title={report.trendSections?.[2]?.trendTitle || 'Health & Human Services Report Facing The Harshest Funding Crisis'}
              body={portableTextToBody(report.trendSections?.[2]?.trendBody, [
                <>Respondents <strong>described funding losses not as budget adjustments but as deliberate targeting</strong>, with Health and Humanitarian Action and Services-focused organizations facing the brunt. Following the collapse of USAID, humanitarian organizations are now competing for a shrinking pool of private funding, while immigration has become a new flashpoint.</>,
                <>The pressure isn{"'"}t coming from one direction. When we asked leaders for the top challenges they are facing right now, three answers came back in near-equal measure: <strong>cultural and political shifts (59%)</strong>, <strong>private funding (58%)</strong>, and <strong>government funding (57%)</strong>.</>,
              ])}
              accentColor="#D17DD0"
              customRightColumn={
                <PairedBarChart
                  title=""
                  question={'"What are the top challenges you\'re currently facing in your work?" Select all that apply.'}
                  accentColor="#D17DD0"
                  data={[
                    { label: 'Cultural or political shifts', shortLabel: 'Cultural Shifts', value2025: 50, value2026: 59 },
                    { label: 'Private funding', shortLabel: 'Private Funding', value2025: 55, value2026: 57 },
                    { label: 'Government funding', shortLabel: 'Public Funding', value2025: 34, value2026: 56 },
                    { label: 'Public perception', shortLabel: 'Public Perception', value2025: null, value2026: 40 },
                    { label: 'Talent, capacity, or burnout', shortLabel: 'Burnout', value2025: null, value2026: 38 },
                    { label: 'Legislative or policy barriers', shortLabel: 'Policy Barriers', value2025: 14, value2026: 32 },
                    { label: 'Community engagement', shortLabel: 'Community Engagement', value2025: 19, value2026: 22 },
                  ]}
                />
              }
            />

            <QuoteVideoSection
              eyebrow="What Our Community Is Saying"
              quotes={resolveTrendQuotes(report.trendSections?.[2]?.expertQuotes, [
                {
                  name: 'M M De Voe',
                  title: 'Executive Director, Pen Parentis',
                  text: '"The influence of politics on non-political nonprofits (by brutal funding policies) created great upheaval not just in our constituency but in the funders. No one feels generous in a time of enormous stress."',
                },
                {
                  name: 'Anonymous',
                  title: 'Mid-sized NGO',
                  headshotUrl: '/anthem/CAUSE_HUMINATARIAN.svg',
                  text: '"With the fall of USAID, more nonprofits are battling for a smaller pool of funding from private sources. Economic uncertainty and inflation are making fundraising from individual donors more challenging as well."',
                },
              ])}
              imageSrc="/anthem/hero-3.jpg"
              imageAlt="Anthem Awards winner"
              accentColor={report.trendSections?.[2]?.accentColor || '#D17DD0'}
            />

            {/* Trend 4 — still within Section 2 */}
            <TrendContent
              trendNumber="04"
              title={report.trendSections?.[3]?.trendTitle || 'Attacks Against DEI Have Caused a Trickle-Down Effect Throughout the Sector'}
              body={portableTextToBody(report.trendSections?.[3]?.trendBody, [
                <>Targeted attacks on DEI are causing a cross-sector effect. <strong>71% of B&I-focused organizations reported experiencing challenges with public funding.</strong> Given the intersectional nature of inclusivity, the damage is spreading across cause areas.</>,
                <>When DEI is defunded, it has devastating effects on every sector. The Trump administration{"'"}s attacks have <a href="https://www.teenvogue.com/story/trump-admins-attack-on-higher-education-and-dei-are-impacting-campuses" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>impacted college admissions</a>, put a strain on <a href="https://communitycatalyst.org/posts/ignoring-dei-isnt-neutral-its-actively-harming-patient-care/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>patient healthcare services</a>, stunted progress for <a href="https://www.axios.com/2025/01/24/dei-orders-disabled-workers-telework" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>disabled workers</a>, and lessened <a href="https://www.climatepeople.com/blog/why-dei-remains-essential-in-climate-work-despite-rollbacks" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>representation in the climate space</a>. Moreover, health equity research loses its language, educational programs like ESL lose funding, and gaps in technology access widen.</>,
              ])}
              accentColor="#D17DD0"
              customRightColumn={
                <motion.div
                  className="md:pt-[38px]"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex gap-4 items-center">
                    <div
                      className="w-[132px] h-[132px] rounded-full overflow-hidden flex-shrink-0"
                      style={{ border: '2px solid #D17DD0' }}
                    >
                      <img
                        src="/anthem/headshots/andrew-walker.jpg"
                        alt="Andrew Walker"
                        className="w-full h-full object-cover scale-[1.4]"
                      />
                    </div>
                  <div className="pl-4" style={{ borderLeft: '3px solid #D17DD0' }}>
                    <p
                      className="text-[16px] md:text-[18px] leading-[1.6] mb-3"
                      style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontStyle: 'italic' }}
                    >
                      {'"'}Funding opportunities, grant success, and individual donors shrank in 2025. Further, the targeting of DEI meant it was more difficult for our network partners to promote our services, resulting in fewer clients reaching us. We have approached 2026 planning far more conservatively. The result, of course, is reduced social impact.{'"'}
                    </p>
                    <p className="text-[13px]" style={{ color: '#21261A', opacity: 0.5 }}>
                      — <strong style={{ fontWeight: 600 }}>Andrew Walker</strong>, Executive Director, Elevate+
                    </p>
                  </div>
                  </div>

                  {/* Second quote */}
                  <div className="flex gap-4 items-center mt-10">
                    <div
                      className="w-[132px] h-[132px] rounded-full overflow-hidden flex-shrink-0"
                      style={{ border: '2px solid #066DBA' }}
                    >
                      <img
                        src="/anthem/headshots/lashanna-williams.jpg"
                        alt="Lashanna Williams"
                        className="w-full h-full object-cover scale-[1.2]"
                      />
                    </div>
                    <div className="pl-4" style={{ borderLeft: '3px solid #066DBA' }}>
                      <p
                        className="text-[16px] md:text-[18px] leading-[1.6] mb-3"
                        style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontStyle: 'italic' }}
                      >
                        {'"'}We needed to keep our nose down. We are a queer BIPOC run organization that cares about all humans, our safety, and health.{'"'}
                      </p>
                      <p className="text-[13px]" style={{ color: '#21261A', opacity: 0.5 }}>
                        — <strong style={{ fontWeight: 600 }}>Lashanna Williams</strong>, Executive Director, A Sacred Passing
                      </p>
                    </div>
                  </div>
                </motion.div>
              }
            />

            {/* Trend 5 — still within Section 2 */}
            <TrendContent
              trendNumber="05"
              title={report.trendSections?.[4]?.trendTitle || 'A Sector On the Brink of Burnout'}
              body={portableTextToBody(report.trendSections?.[4]?.trendBody, [
                <>Forty percent of all respondents chose burnout as a top challenge in 2026, making it the <strong>fourth most-cited issue overall</strong>. And burnout isn{"'"}t concentrated in one cause area; the entire industry is feeling the heat.</>,
                <>The sector has spent two years absorbing hits, from funding cuts and DE&I rollbacks, to legislative hostility and the collapse of USAID. Most organizations reported responding by doing more with less — pivoting strategies, rewriting grant applications, rethinking messaging — all while keeping programs running for the communities depending on them.</>,
              ])}
              accentColor="#D17DD0"
              dataModule={{
                eyebrow: '',
                question: 'Who Named Burnout As a Top Challenge?',
                bars: [
                  { label: 'Belonging & Inclusion', value: 43, displayValue: '43%', color: '#D17DD0' },
                  { label: 'Sustainability & Climate', value: 43, displayValue: '43%', color: '#00B469' },
                  { label: 'Human & Civil Rights', value: 37, displayValue: '37%', color: '#8C001C' },
                  { label: 'Education, Art & Culture', value: 35, displayValue: '35%', color: '#066DBA' },
                  { label: 'Humanitarian Action', value: 33, displayValue: '33%', color: '#21261A' },
                ],
              }}
            />

            <QuoteVideoSection
              eyebrow="What Our Community Is Saying"
              quotes={resolveTrendQuotes(report.trendSections?.[4]?.expertQuotes, [
                {
                  name: 'M M De Voe',
                  title: 'Executive Director, Pen Parentis',
                  text: '"Our work developing writers has become exponentially important, but funding lands us in a state of constant \'catching up\' or rethinking and reimagining. This is draining on staff and leadership alike."',
                },
                {
                  name: 'William Dodge',
                  title: 'Co-Founder, Artist & Design Principal, A Gang of Three',
                  text: '"We\'re a very small (2-person) company. Keeping up with ever-changing things is rapidly leading to burnout."',
                },
              ])}
              videoSrc="/anthem/touch-grass-video.mp4"
              videoLabel="Watch Video"
              videoName="KoAnn Vikoren Skrzyniarz"
              videoTitle="Founder, CEO and Chairwoman, Sustainable Brands"
              accentColor={report.trendSections?.[4]?.accentColor || '#D17DD0'}
            />

            {/* Section 3: How the Sector Is Responding */}
            <ReportSectionCover
              sectionNumber={report.section03Cover?.sectionNumber || '03'}
              title={report.section03Cover?.title || 'How the Sector Is Responding'}
              subtitle={report.section03Cover?.subtitle || "Despite resources tightening and the cultural climate shifting, the sector isn't deterred."}
              copy={report.section03Cover?.copy || 'Leaders are making deliberate bets to win public support: investing in storytelling that travels, building cross-sector coalitions, and using AI —when appropriate— to scale their mission.'}
              accentColor={report.section03Cover?.accentColor || '#00B469'}
            />

            <TabbedPriorities
              eyebrow="Top Priority By Cause Area"
              title="What Each Cause Is Prioritizing"
              accentColor="#00B469"
              data={[
                { count: 4, total: 7, priority: 'Brand Awareness & Storytelling', causes: 'Belonging & Inclusion · Education · Health · Sustainability', color: '#00B469' },
                { count: 2, total: 7, priority: 'Community Engagement & Collaboration', causes: 'Human & Civil Rights · Humanitarian', color: '#066DBA' },
                { count: 1, total: 7, priority: 'Technology Adoption & Innovation', causes: 'Technology', color: '#8C001C' },
              ]}
            />

            {/* Trend 06 */}
            <TrendContent
              trendNumber="06"
              title={report.trendSections?.[5]?.trendTitle || 'The Path Forward is Collaborative and Community-Led'}
              body={portableTextToBody(report.trendSections?.[5]?.trendBody, [
                "[First paragraph placeholder]",
              ])}
              accentColor="#00B469"
              dataModule={{
                eyebrow: '',
                question: '"What Do You See as the Top Emerging Opportunities in Your Work?" Select All That Apply.',
                bars: [
                  { label: 'AI-Powered Workflows and Tools', value: 59, displayValue: '59%', color: '#066DBA' },
                  { label: 'Cross-Sector Collaboration and Resource Pooling', value: 51, displayValue: '51%', color: '#00B469' },
                  { label: 'Short-Form Content and Digital Storytelling', value: 49, displayValue: '49%', color: '#D17DD0' },
                  { label: 'Increased Community-Led and Grassroots Organizing', value: 47, displayValue: '47%', color: '#00B469' },
                  { label: 'Renewed Public Engagement and Advocacy', value: 34, displayValue: '34%', color: '#8C001C' },
                  { label: 'Growth in Private and Philanthropic Funding', value: 26, displayValue: '26%', color: '#066DBA' },
                  { label: 'Refined and Effective Impact Measurement', value: 19, displayValue: '19%', color: '#D17DD0' },
                  { label: 'Other', value: 8, displayValue: '8%', color: '#21261A' },
                ],
              }}
            />

            <QuoteVideoSection
              eyebrow="What Our Community Is Saying"
              quotes={resolveTrendQuotes(report.trendSections?.[5]?.expertQuotes, [
                {
                  name: 'Shirley Senn',
                  title: "Chief Community Impact Officer, New Orleans Firemen's FCU",
                  text: '"One of our biggest takeaways was the importance of listening—engaging more deeply with members and local partners helped us better understand where we could make the greatest impact, particularly in financial wellness and community resilience."',
                },
                {
                  name: 'Mifa Adejumo',
                  title: 'Communications Lead, The Special Youth Leadership Foundation',
                  text: '"2025 forced us to move beyond short-term interventions and think more intentionally about continuity and scale. We saw that access alone isn\'t enough; what matters is sustained support, quality delivery, and measurable outcomes over time. As a result, we\'re approaching this year with a stronger focus on deepening impact within existing communities, strengthening our program structure, and being more deliberate about partnerships that enable long-term growth."',
                },
              ])}
              videoSrc="/anthem/community-led-video.mp4"
              videoLabel="Watch Video"
              videoName="Kyle Lierman"
              videoTitle="CEO, Civic Nation"
              accentColor={report.trendSections?.[5]?.accentColor || '#00B469'}
            />

            {/* Trend 07 */}
            <TrendContent
              trendNumber="07"
              title={report.trendSections?.[6]?.trendTitle || 'Organizations are fighting a narrative battle. To win, they are prioritizing video.'}
              body={portableTextToBody(report.trendSections?.[6]?.trendBody, [
                "[First paragraph placeholder]",
              ])}
              accentColor="#00B469"
              customRightColumn={
                <PairedBarChart
                  title=""
                  question={'Where Organizations Make Their Stories Heard'}
                  accentColor="#00B469"
                  data={[
                    { label: 'Written content and editorial', shortLabel: 'Written', value2025: null, value2026: 77 },
                    { label: 'Short-form video (Reels, TikTok, Shorts)', shortLabel: 'Short-form Video', value2025: null, value2026: 71 },
                    { label: 'Long-form video or documentary', shortLabel: 'Long-form Video', value2025: null, value2026: 47 },
                    { label: 'Creator or brand collaborations', shortLabel: 'Creator/\nBrand', value2025: null, value2026: 47 },
                    { label: 'Podcast or audio content', shortLabel: 'Podcast', value2025: null, value2026: 45 },
                    { label: 'Live events or live streaming', shortLabel: 'Live Events', value2025: null, value2026: 43 },
                    { label: 'User-generated or community storytelling', shortLabel: 'UGC', value2025: null, value2026: 37 },
                    { label: 'Data visualization or interactive reports', shortLabel: 'Data Viz', value2025: null, value2026: 28 },
                  ]}
                />
              }
            />

            <QuoteVideoSection
              eyebrow="What Our Community Is Saying"
              quotes={resolveTrendQuotes(report.trendSections?.[6]?.expertQuotes, [
                {
                  name: 'Saadia Khan',
                  title: 'Founder, Immigrantly Media',
                  headshotUrl: '/anthem/headshots/saadia-khan.jpg',
                  text: '"We\'ve found the most success in audio — in podcasting specifically. There\'s something about the intimacy of the medium that creates the conditions for real learning. People can engage on their own terms, in their own time, and that\'s where unlearning happens, quietly, without pressure. And the data backs it up. 63% of Gen Z is getting their information from podcasts and that number is still climbing. That\'s a cultural shift."',
                },
                {
                  name: 'Kirill Karnovich-Valua',
                  title: 'Founder, Creative Director, AI Content Creator, Digital Da Vincis',
                  headshotUrl: '/anthem/headshots/kirill-karnovich-valua.jpg',
                  text: '"As a content-creating agency, I see this as my mission — to bring more positive and social stories into the world especially in such a tense time. So we tried to do just that — focus on mission-driven storytelling and social good stories."',
                },
              ])}
              videoSrc="/anthem/storytelling-video.mp4"
              videoLabel="Watch Video"
              videoName="Michael Bellavia"
              videoTitle="CEO, HelpGood"
              accentColor={report.trendSections?.[6]?.accentColor || '#00B469'}
            />

            {/* Trend 08 */}
            <TrendContent
              trendNumber="08"
              title={report.trendSections?.[7]?.trendTitle || 'The sector is adopting AI cautiously, and pushing back when needed.'}
              body={portableTextToBody(report.trendSections?.[7]?.trendBody, [
                <>About <strong>58% of respondents named AI-powered workflows as their top emerging opportunity in 2026.</strong> But the full picture is murky, with a clear divide in how for-profit and nonprofit leaders{"'"} ethical views of AI tools. Nonprofits are adopting AI more slowly than for-profits and agencies, not because they are behind, but because they are viewing AI through their values.</>,
                "Organizations' top barriers to AI adoption include concerns around data privacy and ethical concerns, followed by environmental impact. At the root of sector-wide AI conversations is a split in values. For-profit and agency respondents are adopting AI faster than their nonprofit peers, who are more cautious of its environmental and ethical impact.",
              ])}
              accentColor="#00B469"
              customRightColumn={
                <div>
                  <h4 className="leading-[1.4] mb-8 w-full" style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 400 }}>
                    Where The For-Profit / Agency Vs. Nonprofit AI Adoption Gap Is Widest
                  </h4>
                  {[
                    { useCase: 'Workflow Automation', forProfit: 35, nonprofit: 16 },
                    { useCase: 'Audience Segmentation & Personalization', forProfit: 19, nonprofit: 3 },
                    { useCase: 'Accessibility Tools', forProfit: 17, nonprofit: 6 },
                    { useCase: 'Data Analysis', forProfit: 23, nonprofit: 16 },
                  ].map((row, i) => (
                    <div key={i} className="mb-6">
                      <span className="text-[14px] md:text-[15px] font-medium block mb-2" style={{ color: '#21261A' }}>{row.useCase}</span>

                      {/* Two floating bars sized to percentage */}
                      <div className="flex gap-1.5" style={{ height: 56 }}>
                        <div
                          className="rounded-md flex items-center justify-center px-3 relative"
                          style={{ flex: row.forProfit, background: '#00B469', minWidth: 70 }}
                        >
                          <div className="text-[9px] uppercase tracking-[1.5px] font-medium absolute top-1 left-0 right-0 text-center" style={{ color: '#E3DDCA', opacity: 0.85 }}>For-profit</div>
                          <div className="text-[18px] leading-none" style={{ fontFamily: 'var(--font-display)', color: '#E3DDCA', fontWeight: 700, marginTop: 4 }}>{row.forProfit}%</div>
                        </div>
                        <div
                          className="rounded-md flex items-center justify-center px-3 relative"
                          style={{ flex: row.nonprofit, background: '#21261A', minWidth: 70 }}
                        >
                          <div className="text-[9px] uppercase tracking-[1.5px] font-medium absolute top-1 left-0 right-0 text-center" style={{ color: '#E3DDCA', opacity: 0.85 }}>Nonprofit</div>
                          <div className="text-[18px] leading-none" style={{ fontFamily: 'var(--font-display)', color: '#E3DDCA', fontWeight: 700, marginTop: 4 }}>{row.nonprofit}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            />

            <QuoteVideoSection
              eyebrow="What Our Community Is Saying"
              quotes={resolveTrendQuotes(report.trendSections?.[7]?.expertQuotes, [
                {
                  name: "Tamara Toles O'Laughlin",
                  title: 'Founder, Climate Critical',
                  text: '"AI is not a social good for marginalized people, environmentalists or farmers. Please stop assuming it is. For folks whose work is building relationships there is no automation that can do that better than a person."',
                },
                {
                  name: 'Dana Litwin, CVA',
                  title: 'Consultant, Dana Litwin Consulting',
                  text: '"It is increasingly a BAD thing by policy and PR to incorporate \'AI\' into any NPO operations. I understand the harms vs. the help that, especially, GenAI creates in the world that undermines the message of \'social good\' most nonprofits want to project."',
                },
              ])}
              videoSrc="/anthem/innovation-video.mp4"
              videoLabel="Watch Video"
              videoName="KoAnn Vikoren Skrzyniarz"
              videoTitle="Founder, CEO and Chairwoman, Sustainable Brands"
              accentColor={report.trendSections?.[7]?.accentColor || '#00B469'}
            />

            {/* Section 4: Takeaways */}
            <ReportSectionCover
              sectionNumber={report.section04Cover?.sectionNumber || '04'}
              title={report.section04Cover?.title || 'Takeaways'}
              subtitle={report.section04Cover?.subtitle || 'How We Can Keep Going'}
              copy={report.section04Cover?.copy || ''}
              accentColor={report.section04Cover?.accentColor || '#066DBA'}
              compact
            />

            {/* 5 Takeaways — KeyFindings-style hover cards */}
            <Takeaways accentColor={report.section04Cover?.accentColor || '#066DBA'} />

            <SurveyDemographics />
            </>
            )}

            <Credits report={report} />

            {report.property === 'lovie' ? (
              <LovieFooter report={report} />
            ) : (
              <AnthemFooter report={report} />
            )}
          </ReportScroll>
        </div>
      )}
    </main>
  )
}
