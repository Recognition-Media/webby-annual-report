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
import { TrendSection } from './TrendSection'
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

  // Prevent scrolling up past the goodbye page — only allow down scroll to footer
  // Listen for 'goodbye-exit' event to disable the clamp when user clicks to go back
  useEffect(() => {
    if (!showGoodbye) return
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
            {report.trendSections && report.trendSections.length > 0 && (
              <TrendContainer
                trendCount={report.trendSections.length}
                trendTitles={report.trendSections.map((s) =>
                  s.trendTitle.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim()
                )}
              >
                {report.trendSections.map((section, i) => (
                  <TrendSection key={i} section={section} index={i} />
                ))}
              </TrendContainer>
            )}

            {/* Thank You section — only rendered after all trends complete */}
            {showGoodbye && (
              <section
                id="thank-you"
                style={{
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#191919',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '0 60px',
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
                      Thank You
                    </span>
                    <div style={{ width: 60, height: 2, background: '#8B70D1', borderRadius: 2 }} />
                  </div>

                  {/* Heading */}
                  <h2 style={{
                    fontSize: 48,
                    fontWeight: 400,
                    color: '#fff',
                    lineHeight: '58px',
                    letterSpacing: '-2px',
                    marginBottom: 40,
                    maxWidth: 750,
                  }}>
                    See you at the 30th Annual Webby Awards
                  </h2>

                  {/* Divider */}
                  <div style={{ width: 80, height: 1, background: 'rgba(255,255,255,0.14)', marginBottom: 32 }} />

                  {/* Body */}
                  {report.ceremonyDetails && (
                    <div data-content style={{ fontSize: 16, lineHeight: '28px', color: '#D4D4D4', maxWidth: 749 }}>
                      <div className="report-links [&_p]:mb-4">
                        <PortableText value={report.ceremonyDetails.filter(
                          (block: any) => !block.children?.some((child: any) => typeof child.text === 'string' && child.text.includes('evey@webbyawards.com'))
                        )} />
                      </div>
                    </div>
                  )}

                  {/* CTA card */}
                  <a
                    href="https://www.webbyawards.com"
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
                        Get in Touch
                      </h4>
                      <p style={{ fontSize: 12, color: '#999', lineHeight: 1.6, margin: '4px 0 0' }}>
                        Please feel free to contact Producer Evey Long at evey@webbyawards.com with questions or comments.
                      </p>
                    </div>
                  </a>
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
