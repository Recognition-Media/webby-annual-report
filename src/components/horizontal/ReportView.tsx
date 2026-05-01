'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { HeroSection } from '../HeroSection'
import { SignupGate } from '../SignupGate'
import { EntryStats } from '../EntryStats'
import { IadasSection } from '../IadasSection'
import { IntroLetter } from '../IntroLetter'
import { TrendSection } from '../TrendSection'
import { TrendContainer } from '../TrendContainer'
import { ReportFooter } from '../ReportFooter'
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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') return window.matchMedia('(max-width: 768px)').matches
    return false
  })
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

export function ReportView({ report }: { report: Report }) {
  const isMobile = useIsMobile()
  const cookieKey = `report-access-${report.slug.current}`
  const [hasAccess, setHasAccess] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const [entered, setEntered] = useState(false)
  const [showGoodbye, setShowGoodbye] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

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
    if (getCookie(cookieKey)) {
      setHasAccess(true)
    }
  }, [cookieKey])

  // Once access is granted, scroll to report and hide hero
  useEffect(() => {
    if (!hasAccess) return
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

      {/* Navigation arrows */}
      <IdleArrows active={entered} />

      {/* Mobile navigation */}
      <MobileNav
        active={entered}
        trendTitles={(report.trendSections || [])
          .filter((s) => s.enabled !== false)
          .map((s) => s.trendTitle.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim())
        }
      />

      {/* Report content */}
      {hasAccess && (() => {
        const allTrends = (report.trendSections || []).filter((s) => s.enabled !== false)
        const trendTitles = allTrends.map((s) =>
          s.trendTitle.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim()
        )

        // Desktop: all slides in one horizontal carousel
        const desktopSlideCount = 3 + 1 + allTrends.length + 1 // letter, stats, iadas, intro, trends, thank you
        const desktopSlideTitles = [
          'Welcome Letter',
          'By the Numbers',
          'How We Judge',
          report.trendIntroEyebrow || 'Quick Summary',
          ...trendTitles.map((t, i) => `Trend ${String(i + 1).padStart(2, '0')}: ${t}`),
          'Thank You',
        ]

        return (
          <div ref={reportRef}>
            {/* ── Mobile: vertical scroll ── */}
            {isMobile && (
              <ReportScroll active={entered} trendCount={allTrends.length}>
                <IntroLetter report={report} />
                <div style={{ height: 1, background: '#3d3d3d' }} />
                <EntryStats stats={report.entryStats} eyebrow={report.byTheNumbersEyebrow} statement={report.byTheNumbersStatement} />
                <div style={{ height: 1, background: '#3d3d3d' }} />
                <IadasSection report={report} />

                <TrendIntro
                  eyebrow={report.trendIntroEyebrow}
                  headline={report.trendIntroHeadline}
                  body={report.trendIntroBody}
                  stats={report.trendIntroStats}
                  ctaText={report.trendIntroCta}
                  onCta={() => {}}
                />

                {allTrends.length > 0 && (
                  <TrendContainer trendCount={allTrends.length} trendTitles={trendTitles}>
                    {allTrends.map((section, i) => (
                      <TrendSection key={`mobile-${i}`} section={section} index={i} forceMobile />
                    ))}
                  </TrendContainer>
                )}

                {/* Mobile Thank You */}
                {showGoodbye && (
                  <section
                    id="thank-you"
                    className="px-5"
                    style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', backgroundColor: '#191919', position: 'relative', overflow: 'hidden' }}
                  >
                    <AnimatedBg variant={3} />
                    <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
                        <span style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#8B70D1', fontWeight: 500 }}>
                          {report.thankYouEyebrow || 'Thank You'}
                        </span>
                        <div style={{ width: 60, height: 2, background: '#8B70D1', borderRadius: 2 }} />
                      </div>
                      <h2 className="text-[28px] leading-[36px]" style={{ fontWeight: 400, color: '#fff', letterSpacing: '-2px', marginBottom: 40, maxWidth: 750 }}>
                        {report.thankYouHeading || "You're Part of What Makes the Internet Worth Being On."}
                      </h2>
                      <div style={{ width: 80, height: 1, background: 'rgba(255,255,255,0.14)', marginBottom: 32 }} />
                      <div data-content style={{ fontSize: 16, lineHeight: '28px', color: '#D4D4D4', maxWidth: 749, marginBottom: 40 }} className="[&_p]:mb-5">
                        {report.thankYouBody ? <PortableText value={report.thankYouBody} /> : (
                          <p>Your participation helps us recognize the best of the Internet each year.</p>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {showGoodbye && <ReportFooter report={report} />}
              </ReportScroll>
            )}

            {/* ── Desktop: fully horizontal carousel ── */}
            {!isMobile && (
              <TrendContainer trendCount={desktopSlideCount} trendTitles={desktopSlideTitles}>
                {/* Slide 1: Welcome Letter */}
                <div style={{ width: '100vw', height: '100vh', flexShrink: 0, overflow: 'auto', paddingBottom: 50 }}>
                  <IntroLetter report={report} />
                </div>

                {/* Slide 2: By the Numbers */}
                <div style={{ width: '100vw', height: '100vh', flexShrink: 0, overflow: 'auto', paddingBottom: 50 }}>
                  <EntryStats stats={report.entryStats} eyebrow={report.byTheNumbersEyebrow} statement={report.byTheNumbersStatement} />
                </div>

                {/* Slide 3: How We Judge */}
                <div style={{ width: '100vw', height: '100vh', flexShrink: 0, overflow: 'auto', paddingBottom: 50 }}>
                  <IadasSection report={report} />
                </div>

                {/* Slide 4: Trend Intro */}
                <TrendIntro
                  eyebrow={report.trendIntroEyebrow}
                  headline={report.trendIntroHeadline}
                  body={report.trendIntroBody}
                  stats={report.trendIntroStats}
                  ctaText={report.trendIntroCta}
                  onCta={() => window.dispatchEvent(new CustomEvent('trend-next-or-exit'))}
                />

                {/* Slides 5+: Trend sections */}
                {allTrends.map((section, i) => (
                  <TrendSection key={i} section={section} index={i} />
                ))}

                {/* Last slide: Thank You */}
                <div
                  id="thank-you-desktop"
                  style={{ width: '100vw', height: '100vh', flexShrink: 0, display: 'flex', alignItems: 'safe center', position: 'relative', overflowX: 'hidden', overflowY: 'auto', padding: '0 60px', paddingBottom: 50 }}
                >
                  <AnimatedBg variant={3} />
                  <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
                      <span style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#8B70D1', fontWeight: 500 }}>
                        {report.thankYouEyebrow || 'Thank You'}
                      </span>
                      <div style={{ width: 60, height: 2, background: '#8B70D1', borderRadius: 2 }} />
                    </div>
                    <h2 style={{ fontSize: 48, fontWeight: 400, color: '#fff', lineHeight: '58px', letterSpacing: '-2px', marginBottom: 40, maxWidth: 1000 }}>
                      {report.thankYouHeading || "You're Part of What Makes the Internet Worth Being On."}
                    </h2>
                    <div style={{ width: 80, height: 1, background: 'rgba(255,255,255,0.14)', marginBottom: 32 }} />
                    <div data-content style={{ fontSize: 16, lineHeight: '28px', color: '#D4D4D4', maxWidth: 1000, marginBottom: 40 }} className="[&_p]:mb-5">
                      {report.thankYouBody ? <PortableText value={report.thankYouBody} /> : (
                        <>
                          <p style={{ marginBottom: 20 }}>Your participation helps us recognize the best of the Internet each year.</p>
                          <p>Use what you&rsquo;ve read here. The insights in this report come directly from the judges who will evaluate your next entry.</p>
                        </>
                      )}
                    </div>
                    <a href={report.thankYouLinkUrl || 'https://www.webbyawards.com/judging-criteria/'} target="_blank" rel="noopener noreferrer" className="no-custom-cursor" style={{ maxWidth: 700, padding: '32px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, textAlign: 'left', textDecoration: 'none' }}>
                      <div>
                        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#8B70D1', fontWeight: 500, marginBottom: 10 }}>{report.thankYouLinkEyebrow || 'Learn More'}</div>
                        <div style={{ fontSize: 18, fontWeight: 400, color: '#fff', lineHeight: 1.3, marginBottom: 6 }}>{report.thankYouLinkTitle || "How We Judge the Internet's Best Work"}</div>
                        <div style={{ fontSize: 14, color: '#888', lineHeight: 1.5 }}>{report.thankYouLinkDescription || 'Explore the judging criteria behind every Webby Award.'}</div>
                      </div>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B70D1" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                      </div>
                    </a>
                    <a href={report.thankYouCtaUrl || 'https://www.webbyawards.com'} target="_blank" rel="noopener noreferrer" data-content style={{ display: 'inline-flex', alignItems: 'center', gap: 24, border: '1px solid rgba(255,255,255,0.12)', padding: '28px 32px', textDecoration: 'none', color: 'inherit', marginTop: 40 }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                      <div>
                        <h4 style={{ fontSize: 13, fontWeight: 500, color: '#FFFFFF', margin: 0 }}>{report.thankYouCtaTitle || 'Get in Touch'}</h4>
                        <p style={{ fontSize: 12, color: '#999', lineHeight: 1.6, margin: '4px 0 0' }}>{report.thankYouCtaDescription || 'Please feel free to contact Producer Evey Long at evey@webbyawards.com with questions or comments.'}</p>
                      </div>
                    </a>
                  </div>
                </div>
              </TrendContainer>
            )}
          </div>
        )
      })()}
    </main>
  )
}
