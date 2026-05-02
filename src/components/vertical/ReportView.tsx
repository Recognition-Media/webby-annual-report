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
import { KeyFindings } from './KeyFindings'
import { ReportSectionCover, TrendContent } from './ReportSection'
import { AnthemBottomNav } from './AnthemBottomNav'
import { QuoteVideoSection } from './QuoteVideoSection'
import { BubbleChart } from './BubbleChart'
import { PairedBarChart } from './PairedBarChart'
import { TabbedPriorities } from './TabbedPriorities'
import { Takeaways } from './Takeaways'
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

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

export function ReportView({ report }: { report: Report }) {
  const cookieKey = `report-access-${report.slug.current}`
  const [hasAccess, setHasAccess] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const [entered, setEntered] = useState(false)
  const [showGoodbye, setShowGoodbye] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  // Apply Anthem theme (background, fonts, palette) only while this template
  // is mounted. Webby reports stay on the default (Aktiv Grotesk + white bg).
  useEffect(() => {
    document.body.classList.add('anthem-template')
    return () => { document.body.classList.remove('anthem-template') }
  }, [])

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

  // Once access is granted, scroll to report and hide hero — but only for
  // returning visitors who already have the cookie. When the signup gate is
  // disabled in the CMS, hasAccess is also true from mount, but we want
  // those users to see the hero and click "Explore" themselves.
  useEffect(() => {
    if (!hasAccess) return
    if (report.signupGateEnabled === false) return
    // Small delay to let report content render
    setTimeout(() => {
      reportRef.current?.scrollIntoView({ behavior: 'smooth' })
      // After scroll animation completes, hide the hero
      setTimeout(() => setEntered(true), 800)
    }, 100)
  }, [hasAccess])

  function handleSeeReport() {
    if (hasAccess) {
      reportRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => setEntered(true), 800)
    } else {
      setShowGate(true)
    }
  }

  function handleSignupComplete() {
    setCookie(cookieKey, 'true', 365)
    setShowGate(false)
    setHasAccess(true)
  }

  return (
    <main>
      <AnalyticsScripts report={report} />

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

      {/* Bottom progress / section nav (Anthem template) */}
      <AnthemBottomNav active={entered} />

      {/* Mobile navigation */}
      <MobileNav
        active={entered}
        trendTitles={(report.trendSections || [])
          .filter((s) => s.enabled !== false)
          .map((s) => s.trendTitle.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim())
        }
      />

      {/* Report content — snap scrolling + nav dots activate after entry */}
      {hasAccess && (
        <div ref={reportRef}>
          <ReportScroll active={entered} trendCount={report.trendSections?.length ?? 0} snap={false}>
            <IntroLetter report={report} />

            {/* By the Numbers — hidden for Anthem redesign */}
            {/* <EntryStats stats={report.entryStats} eyebrow={report.byTheNumbersEyebrow} statement={report.byTheNumbersStatement} /> */}

            {/* IADAS — hidden for Anthem redesign */}
            {/* <IadasSection report={report} /> */}
            <KeyFindings findings={report.keyFindings} />

            {/* Old trends — hidden for Anthem redesign */}
            {/* Section 1: The State of Social Impact */}
            <ReportSectionCover
              sectionNumber={report.section01Cover?.sectionNumber || '01'}
              title={report.section01Cover?.title || 'The State of Social Impact'}
              subtitle={report.section01Cover?.subtitle || 'Rollbacks have increased across the sector, but leaders have settled into their new reality, becoming more resilient and strategic in the process.'}
              copy={report.section01Cover?.copy || 'Last year, we asked the Anthem Awards community how the shifting landscape was impacting their work. This year, we see how the community is adapting.'}
              accentColor={report.section01Cover?.accentColor || '#8C001C'}
            />

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
                { cause: 'Technology', challenge: 'Cultural/Political Shifts', percentage: 100, respondents: 4, totalRespondents: 4, color: '#21261A' },
                { cause: 'Humanitarian Action', challenge: 'Gov Funding', percentage: 89, respondents: 8, totalRespondents: 9, color: '#066DBA' },
                { cause: 'Sustainability & Climate', challenge: 'Cultural/Political Shifts', percentage: 86, respondents: 12, totalRespondents: 14, color: '#00B469' },
                { cause: 'Belonging & Inclusion', challenge: 'Gov Funding', percentage: 71, respondents: 10, totalRespondents: 14, color: '#D17DD0' },
                { cause: 'Human & Civil Rights', challenge: 'Public Perception', percentage: 65, respondents: 11, totalRespondents: 17, color: '#8C001C' },
                { cause: 'Education & Culture', challenge: 'Private & Gov Funding', percentage: 62, respondents: 13, totalRespondents: 21, color: '#8C001C' },
                { cause: 'Health', challenge: '4-way tie', percentage: 50, respondents: 4, totalRespondents: 8, color: '#21261A' },
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
                { count: 5, total: 7, priority: 'Brand Awareness & Storytelling', causes: 'Belonging & Inclusion · Education · Health · Sustainability · Technology (#2)', color: '#00B469' },
                { count: 3, total: 7, priority: 'Community Engagement & Collaboration', causes: 'Human & Civil Rights · Humanitarian · Education (#2)', color: '#066DBA' },
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
                question: '"What do you see as the top emerging opportunities in your work?" Select all that apply.',
                bars: [
                  { label: 'AI-powered workflows and tools', value: 59, displayValue: '59%', color: '#066DBA' },
                  { label: 'Cross-sector collaboration and resource pooling', value: 51, displayValue: '51%', color: '#00B469' },
                  { label: 'Short-form content and digital storytelling', value: 49, displayValue: '49%', color: '#D17DD0' },
                  { label: 'Increased community-led and grassroots organizing', value: 47, displayValue: '47%', color: '#00B469' },
                  { label: 'Renewed public engagement and advocacy', value: 34, displayValue: '34%', color: '#8C001C' },
                  { label: 'Growth in private and philanthropic funding', value: 26, displayValue: '26%', color: '#066DBA' },
                  { label: 'Refined and effective impact measurement', value: 19, displayValue: '19%', color: '#D17DD0' },
                  { label: 'Other (please specify)', value: 8, displayValue: '8%', color: '#21261A' },
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
                  question={'Where Organizations Are Investing in 2026'}
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
                    Where the for-profit / agency vs. nonprofit AI adoption gap is widest.
                  </h4>
                  {[
                    { useCase: 'Workflow automation', forProfit: 35, nonprofit: 16 },
                    { useCase: 'Audience segmentation & personalization', forProfit: 19, nonprofit: 3 },
                    { useCase: 'Accessibility tools', forProfit: 17, nonprofit: 6 },
                    { useCase: 'Data analysis', forProfit: 23, nonprofit: 16 },
                  ].map((row, i) => (
                    <div key={i} className="mb-6">
                      <span className="text-[14px] md:text-[15px] font-medium block mb-2" style={{ color: '#21261A' }}>{row.useCase}</span>

                      {/* Two floating bars sized to percentage */}
                      <div className="flex gap-1.5" style={{ height: 56 }}>
                        <div
                          className="rounded-md flex items-center justify-center px-3"
                          style={{ flex: row.forProfit, background: '#00B469', minWidth: 70 }}
                        >
                          <div className="text-center">
                            <div className="text-[9px] uppercase tracking-[1.5px] font-medium" style={{ color: '#E3DDCA', opacity: 0.85 }}>For-profit</div>
                            <div className="text-[18px] leading-none mt-[2px] md:mt-[1px]" style={{ fontFamily: 'var(--font-display)', color: '#E3DDCA', fontWeight: 700 }}>{row.forProfit}%</div>
                          </div>
                        </div>
                        <div
                          className="rounded-md flex items-center justify-center px-3"
                          style={{ flex: row.nonprofit, background: '#21261A', minWidth: 70 }}
                        >
                          <div className="text-center">
                            <div className="text-[9px] uppercase tracking-[1.5px] font-medium" style={{ color: '#E3DDCA', opacity: 0.85 }}>Nonprofit</div>
                            <div className="text-[18px] leading-none mt-[2px] md:mt-[1px]" style={{ fontFamily: 'var(--font-display)', color: '#E3DDCA', fontWeight: 700 }}>{row.nonprofit}%</div>
                          </div>
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

            <Credits report={report} />

            <AnthemFooter report={report} />
          </ReportScroll>
        </div>
      )}
    </main>
  )
}
