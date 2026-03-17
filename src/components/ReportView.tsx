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
  const reportRef = useRef<HTMLDivElement>(null)

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
              <TrendContainer trendCount={report.trendSections.length}>
                {report.trendSections.map((section, i) => (
                  <TrendSection key={i} section={section} index={i} />
                ))}
              </TrendContainer>
            )}

            {/* Thank You section */}
            <ScrollReveal>
              <section
                id="thank-you"
                data-snap
                className="px-6"
                style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#191919' }}
              >
                <div className="mx-auto max-w-3xl bg-white p-10 shadow-lg">
                  <p className="text-center text-4xl mb-2">🙏</p>
                  <h2 className="text-center text-2xl font-bold mb-6" style={{ color: '#75b9f2' }}>
                    Thank you
                  </h2>
                  {report.ceremonyDetails && (
                    <div className="prose max-w-none">
                      <PortableText value={report.ceremonyDetails} />
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/bye.gif" alt="Bye" className="mx-auto mt-6 w-48" />
                </div>
              </section>
            </ScrollReveal>

            <ReportFooter report={report} />
          </ReportScroll>
        </div>
      )}
    </main>
  )
}
