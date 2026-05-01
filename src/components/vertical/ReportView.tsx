'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { HeroSection } from './HeroSection'
import { SignupGate } from './SignupGate'
import { EntryStats } from '../EntryStats'
import { IadasSection } from '../IadasSection'
import { IntroLetter } from './IntroLetter'
import { TrendSection } from '../TrendSection'
import { TrendContainer } from '../TrendContainer'
import { ReportFooter } from '../ReportFooter'
import { KeyFindings } from './KeyFindings'
import { ReportSectionCover, TrendContent } from './ReportSection'
import { QuoteVideoSection } from './QuoteVideoSection'
import { BubbleChart } from './BubbleChart'
import { PairedBarChart } from './PairedBarChart'
import { TabbedPriorities } from './TabbedPriorities'
import { AnalyticsScripts } from '../AnalyticsScripts'
import { ScrollReveal } from '../ScrollReveal'
import { ReportScroll } from '../SmoothScroll'
import { AnimatedBg } from '../AnimatedBg'
import { IdleArrows } from '../IdleArrows'
import { TrendIntro } from '../TrendIntro'
import { MobileNav } from '../MobileNav'

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
            <KeyFindings />

            {/* Old trends — hidden for Anthem redesign */}
            {/* Section 1: The State of Social Impact */}
            <ReportSectionCover
              sectionNumber="01"
              title="The State of Social Impact"
              subtitle="Rollbacks have increased across the sector, but leaders have settled into their new reality, becoming more resilient and strategic in the process."
              copy="Last year, we asked the Anthem Awards community how the shifting landscape was impacting their work. This year, we see how the community is adapting."
              accentColor="#8C001C"
            />

            <TrendContent
              trendNumber="01"
              title="Rollbacks Have Increased In Every Corner of the Sector in 2026"
              body={[
                <>In 2025, the Anthem community observed rollbacks or gaps centered primarily around Racial and Social Equity. In 2026, impact leaders report witnessing regression across every area in the sector. <strong>Racial and Social Equity remains the most-cited rollback— at 77%— but it is no longer alone.</strong></>,
                "Leaders report increased rollbacks in Human & Civil Rights by 10%, in Corporate Responsibility by 15%, and Climate Advocacy by 15%—and across mental health, reproductive health, affordable access to food, and more.",
              ]}
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
              quotes={[
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
              ]}
              videoSrc="/anthem/rollbacks-video.mp4"
              videoLabel="Watch Video"
              videoName="Jim Stengel"
              videoTitle="President & CEO, The Jim Stengel Group"
              accentColor="#8C001C"
            />

            {/* Trend 2 — still within Section 1 */}
            <TrendContent
              trendNumber="02"
              title="Despite Hardships, the Community Has Accepted Its New Reality"
              body={[
                <>Last year, 70% of respondents described the social impact landscape as negative, somewhat negative or negative. <strong>This year, the average score landed at 53.7.</strong> While some leaders feel exhausted, the community is stabilizing and not collapsing under the pressure.</>,
                <>According to multiple leaders, they are digging in with a strengthened resolve rather than giving up. Respondents described their organizations as <strong>{'"'}constantly catching up{'"'}</strong> or <strong>{'"'}reimagining{'"'}</strong> new strategies to move the work forward.</>,
              ]}
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
              quotes={[
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
              ]}
              videoSrc="/anthem/state-of-impact-video.mp4"
              videoLabel="Watch Video"
              videoName="Jim Stengel"
              videoTitle="President & CEO, The Jim Stengel Group"
              accentColor="#8C001C"
            />

            {/* Section 2: Where the Pressure Is Landing */}
            <ReportSectionCover
              sectionNumber="02"
              title="Where the Pressure Is Landing"
              subtitle={'"No one feels generous in a time of enormous stress."'}
              copy="The burden isn't shared evenly across the sector. Funding losses have put the largest strain on Health and Humanitarian Action and Services, while attacks on DE&I have impacted anyone doing this work, regardless of org size or cause area."
              accentColor="#D17DD0"
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
              title="Health & Human Services Report Facing The Harshest Funding Crisis"
              body={[
                <>Respondents <strong>described funding losses not as budget adjustments but as deliberate targeting</strong>, with Health and Humanitarian Action and Services-focused organizations facing the brunt. Following the collapse of USAID, humanitarian organizations are now competing for a shrinking pool of private funding, while immigration has become a new flashpoint.</>,
                <>The pressure isn{"'"}t coming from one direction. When we asked leaders for the top challenges they are facing right now, three answers came back in near-equal measure: <strong>cultural and political shifts (59%)</strong>, <strong>private funding (58%)</strong>, and <strong>government funding (57%)</strong>.</>,
              ]}
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
              quotes={[
                {
                  name: 'M M De Voe',
                  title: 'Executive Director, Pen Parentis',
                  text: '"The influence of politics on non-political nonprofits (by brutal funding policies) created great upheaval not just in our constituency but in the funders. No one feels generous in a time of enormous stress."',
                },
                {
                  name: 'Anonymous',
                  title: 'Mid-sized NGO',
                  text: '"With the fall of USAID, more nonprofits are battling for a smaller pool of funding from private sources. Economic uncertainty and inflation are making fundraising from individual donors more challenging as well."',
                },
              ]}
              imageSrc="/anthem/hero-3.jpg"
              imageAlt="Anthem Awards winner"
              accentColor="#D17DD0"
            />

            {/* Trend 4 — still within Section 2 */}
            <TrendContent
              trendNumber="04"
              title="Attacks Against DEI Have Caused a Trickle-Down Effect Throughout the Sector"
              body={[
                <>Targeted attacks on DEI are causing a cross-sector effect. <strong>71% of B&I-focused organizations reported experiencing challenges with public funding.</strong> Given the intersectional nature of inclusivity, the damage is spreading across cause areas.</>,
                <>When DEI is defunded, it has devastating effects on every sector. The Trump administration{"'"}s attacks have <a href="https://www.teenvogue.com/story/trump-admins-attack-on-higher-education-and-dei-are-impacting-campuses" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>impacted college admissions</a>, put a strain on <a href="https://communitycatalyst.org/posts/ignoring-dei-isnt-neutral-its-actively-harming-patient-care/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>patient healthcare services</a>, stunted progress for <a href="https://www.axios.com/2025/01/24/dei-orders-disabled-workers-telework" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>disabled workers</a>, and lessened <a href="https://www.climatepeople.com/blog/why-dei-remains-essential-in-climate-work-despite-rollbacks" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>representation in the climate space</a>. Moreover, health equity research loses its language, educational programs like ESL lose funding, and gaps in technology access widen.</>,
              ]}
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
              title="A Sector On the Brink of Burnout"
              body={[
                <>Forty percent of all respondents chose burnout as a top challenge in 2026, making it the <strong>fourth most-cited issue overall</strong>. And burnout isn{"'"}t concentrated in one cause area; the entire industry is feeling the heat.</>,
                <>The sector has spent two years absorbing hits, from funding cuts and DE&I rollbacks, to legislative hostility and the collapse of USAID. Most organizations reported responding by doing more with less — pivoting strategies, rewriting grant applications, rethinking messaging — all while keeping programs running for the communities depending on them.</>,
              ]}
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
              quotes={[
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
              ]}
              imageSrc="/anthem/hero-2.jpg"
              imageAlt="Anthem Awards winner"
              accentColor="#D17DD0"
            />

            {/* Section 3: How the Sector Is Responding */}
            <ReportSectionCover
              sectionNumber="03"
              title="How the Sector Is Responding"
              subtitle="Despite resources tightening and the cultural climate shifting, the sector isn't deterred."
              copy="Leaders are making deliberate bets to win public support: investing in storytelling that travels, building cross-sector coalitions, and using AI —when appropriate— to scale their mission."
              accentColor="#00B469"
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

            {/* Trend placeholder — ready for content */}
            <TrendContent
              trendNumber="01"
              title="[Trend Title Placeholder]"
              body={[
                "[First paragraph placeholder]",
              ]}
              accentColor="#00B469"
            />

            <QuoteVideoSection
              eyebrow="What Our Community Is Saying"
              quotes={[
                {
                  name: '[Name]',
                  title: '[Title, Organization]',
                  text: '"[Quote placeholder]"',
                },
                {
                  name: '[Name]',
                  title: '[Title, Organization]',
                  text: '"[Quote placeholder]"',
                },
              ]}
              imageSrc=""
              accentColor="#00B469"
            />

            {/* Thank You section — always visible in Anthem redesign */}
            {true && (
              <section
                id="thank-you"
                className="px-5 md:px-[60px]"
                style={{
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#191919',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Animated background */}
                <AnimatedBg variant={3} />

                <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                  {/* Eyebrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
                    <span style={{
                      fontSize: 11,
                      letterSpacing: 4,
                      textTransform: 'uppercase',
                      color: '#8B70D1',
                      fontWeight: 500,
                    }}>
                      {report.thankYouEyebrow || 'Thank You'}
                    </span>
                    <div style={{ width: 60, height: 2, background: '#8B70D1', borderRadius: 2 }} />
                  </div>

                  {/* Heading */}
                  <h2 className="text-[28px] leading-[36px] md:text-[48px] md:leading-[58px]" style={{
                    fontWeight: 400,
                    color: '#fff',
                    letterSpacing: '-2px',
                    marginBottom: 40,
                    maxWidth: 750,
                  }}>
                    {report.thankYouHeading || "You're Part of What Makes the Internet Worth Being On."}
                  </h2>

                  {/* Divider */}
                  <div style={{ width: 80, height: 1, background: 'rgba(255,255,255,0.14)', marginBottom: 32 }} />

                  {/* Body */}
                  <div data-content style={{ fontSize: 16, lineHeight: '28px', color: '#D4D4D4', maxWidth: 749, marginBottom: 40 }} className="[&_p]:mb-5">
                    {report.thankYouBody ? (
                      <PortableText value={report.thankYouBody} />
                    ) : (
                      <>
                        <p style={{ marginBottom: 20 }}>Your participation helps us recognize the best of the Internet each year. As an entrant in the 30th Annual Webby Awards, you are part of the Webby community &mdash; and will continue to receive benefits like this report, access to research, invitations to Webby Talks, and exclusive event invites throughout the year.</p>
                        <p>Use what you&rsquo;ve read here. The insights in this report come directly from the judges who will evaluate your next entry.</p>
                      </>
                    )}
                  </div>

                  {/* Judging criteria banner */}
                  <a
                    href={report.thankYouLinkUrl || 'https://www.webbyawards.com/judging-criteria/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-custom-cursor"
                    style={{
                      maxWidth: 700,
                      padding: '32px 0',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 40,
                      textAlign: 'left',
                      textDecoration: 'none',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#8B70D1', fontWeight: 500, marginBottom: 10 }}>
                        {report.thankYouLinkEyebrow || 'Learn More'}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 400, color: '#fff', lineHeight: 1.3, marginBottom: 6 }}>
                        {report.thankYouLinkTitle || "How We Judge the Internet's Best Work"}
                      </div>
                      <div style={{ fontSize: 14, color: '#888', lineHeight: 1.5 }}>
                        {report.thankYouLinkDescription || 'Explore the judging criteria behind every Webby Award.'}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B70D1" strokeWidth="1.5">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </a>

                  {/* CTA card */}
                  <a
                    href={report.thankYouCtaUrl || 'https://www.webbyawards.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-content
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 24,
                      border: '1px solid rgba(255,255,255,0.12)',
                      padding: '28px 32px',
                      textDecoration: 'none',
                      color: 'inherit',
                      marginTop: 40,
                    }}
                  >
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255,255,255,0.9)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    <div>
                      <h4 style={{ fontSize: 13, fontWeight: 500, color: '#FFFFFF', margin: 0 }}>
                        {report.thankYouCtaTitle || 'Get in Touch'}
                      </h4>
                      <p style={{ fontSize: 12, color: '#999', lineHeight: 1.6, margin: '4px 0 0' }}>
                        {report.thankYouCtaDescription || 'Please feel free to contact Producer Evey Long at evey@webbyawards.com with questions or comments.'}
                      </p>
                    </div>
                  </a>
                </div>
              </section>
            )}

            <ReportFooter report={report} />
          </ReportScroll>
        </div>
      )}
    </main>
  )
}
