'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { HeroSection } from './HeroSection'
import { SignupGate } from './SignupGate'
import { EntryStats } from './EntryStats'
import { IadasSection } from './IadasSection'
import { IntroLetter } from './IntroLetter'
import { TrendSection, TREND_OVERRIDES } from './TrendSection'
import { TrendContainer } from './TrendContainer'
import { ReportFooter } from './ReportFooter'
import { AnalyticsScripts } from './AnalyticsScripts'
import { ScrollReveal } from './ScrollReveal'
import { ReportScroll } from './SmoothScroll'
import { CursorArrow } from './CursorArrow'
import { AnimatedBg } from './AnimatedBg'
import { IdleArrows } from './IdleArrows'

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

  // Show goodbye only when all trends are complete
  useEffect(() => {
    function handleExit() { setShowGoodbye(true) }
    window.addEventListener('trend-next-or-exit', handleExit)
    return () => window.removeEventListener('trend-next-or-exit', handleExit)
  }, [])

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

      {/* Custom cursor arrow */}
      <CursorArrow active={entered} trendCount={report.trendSections?.length ?? 0} />

      {/* Idle navigation arrows */}
      <IdleArrows active={entered} />

      {/* Report content — snap scrolling + nav dots activate after entry */}
      {hasAccess && (
        <div ref={reportRef}>
          <ReportScroll active={entered} trendCount={report.trendSections?.length ?? 0}>
            <IntroLetter report={report} />

            <div style={{ height: 1, background: '#3d3d3d' }} />

            <EntryStats stats={report.entryStats} />

            <div style={{ height: 1, background: '#3d3d3d' }} />

            <IadasSection report={report} />

            {/* Trends — horizontal container */}
            {(() => {
              const cmsTrends = report.trendSections || []
              // Pad with virtual trend sections for overrides beyond CMS data
              const totalTrends = Math.max(cmsTrends.length, 7)
              const allTrends = Array.from({ length: totalTrends }, (_, i) =>
                cmsTrends[i] || { trendTitle: `Trend ${i + 1}` }
              )
              return allTrends.length > 0 ? (
                <TrendContainer
                  trendCount={allTrends.length}
                  trendTitles={allTrends.map((s, i) =>
                    (TREND_OVERRIDES[i]?.title || s.trendTitle).replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim()
                  )}
                >
                  {allTrends.map((section, i) => (
                    <TrendSection key={i} section={section} index={i} />
                  ))}
                </TrendContainer>
              ) : null
            })()}

            {/* Thank You section — only rendered after all trends complete */}
            {showGoodbye && (
              <section
                id="thank-you"
                data-snap
                style={{
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#191919',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '0 60px',
                }}
              >
                {/* Animated background */}
                <AnimatedBg variant={3} />

                <div style={{ maxWidth: 1000, width: '100%', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  {/* Gradient bar */}
                  <div className="gradient-bar" style={{ width: 120, height: 3, margin: '0 auto 40px' }} />

                  {/* Eyebrow */}
                  <p style={{
                    fontSize: 11,
                    letterSpacing: 4,
                    textTransform: 'uppercase',
                    color: '#8B70D1',
                    fontWeight: 500,
                    marginBottom: 24,
                  }}>
                    Thank You
                  </p>

                  {/* Heading */}
                  <h2 style={{
                    fontSize: 'clamp(36px, 4vw, 56px)',
                    fontWeight: 400,
                    color: '#fff',
                    lineHeight: 1.2,
                    letterSpacing: '-1px',
                    marginBottom: 32,
                    maxWidth: 700,
                    margin: '0 auto 32px',
                  }}>
                    You&rsquo;re Part of What Makes the Internet Worth Being On.
                  </h2>

                  {/* Divider */}
                  <div style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.14)', margin: '0 auto 32px' }} />

                  {/* Body */}
                  <div style={{ fontSize: 16, lineHeight: '28px', color: '#D4D4D4', maxWidth: 600, margin: '0 auto 40px' }}>
                    <p style={{ marginBottom: 20 }}>Your participation helps us recognize the best of the Internet each year. As an entrant in the 30th Annual Webby Awards, you are part of the Webby community &mdash; and will continue to receive benefits like this report, access to research, invitations to Webby Talks, and exclusive event invites throughout the year.</p>
                    <p>Use what you&rsquo;ve read here. The insights in this report come directly from the judges who will evaluate your next entry.</p>
                  </div>

                  {/* Judging criteria banner */}
                  <a
                    href="https://www.webbyawards.com/judging-criteria/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-custom-cursor"
                    style={{
                      maxWidth: 700,
                      margin: '0 auto 48px',
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
                        Learn More
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 400, color: '#fff', lineHeight: 1.3, marginBottom: 6 }}>
                        How We Judge the Internet's Best Work
                      </div>
                      <div style={{ fontSize: 14, color: '#888', lineHeight: 1.5 }}>
                        Explore the judging criteria behind every Webby Award.
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

                  {/* CTA-style footer text */}
                  <p style={{ fontSize: 13, color: '#999', letterSpacing: 1 }}>
                    webbyawards.com
                  </p>
                </div>
              </section>
            )}

            {showGoodbye && <ReportFooter report={report} />}
          </ReportScroll>
        </div>
      )}
    </main>
  )
}
