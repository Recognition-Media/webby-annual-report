'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { HeroSection } from './HeroSection'
import { SignupGate } from './SignupGate'
import { TimelineSection } from './TimelineSection'
import { EntryStats } from './EntryStats'
import { IadasSection } from './IadasSection'
import { IntroLetter } from './IntroLetter'
import { TrendSection } from './TrendSection'
import { ReportFooter } from './ReportFooter'
import { AnalyticsScripts } from './AnalyticsScripts'
import { ScrollReveal } from './ScrollReveal'
import { StickyNav } from './StickyNav'

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

  useEffect(() => {
    if (getCookie(cookieKey)) {
      setHasAccess(true)
    }
  }, [cookieKey])

  function handleSeeReport() {
    if (hasAccess) {
      // Already has access, scroll to content
      document.getElementById('report-content')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      setShowGate(true)
    }
  }

  function handleSignupComplete() {
    setCookie(cookieKey, 'true', 365)
    setShowGate(false)
    setHasAccess(true)
    // Scroll to welcome letter after a brief delay for content to render
    setTimeout(() => {
      document.getElementById('report-content')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <main>
      <AnalyticsScripts report={report} />
      <HeroSection report={report} carouselImages={report.carouselImages} onSeeReport={handleSeeReport} />

      {/* Signup gate modal — only shown when triggered */}
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

      {/* Report content — revealed after access */}
      {hasAccess && (
        <motion.div
          id="report-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <StickyNav report={report} />

          {/* Welcome letter */}
          <IntroLetter report={report} />

          {/* Webby intro + Stats + Year slider */}
          <TimelineSection report={report} />

          {/* Entry stats (entries received, countries, flags) */}
          <EntryStats stats={report.entryStats} />

          {/* IADAS section */}
          <IadasSection report={report} />

          {/* Trend sections */}
          {report.trendSections?.map((section, i) => (
            <TrendSection key={i} section={section} index={i} />
          ))}

          {/* Thank You section */}
          <ScrollReveal>
            <section className="px-6 py-[60px]" style={{ backgroundColor: '#333' }}>
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
        </motion.div>
      )}
    </main>
  )
}
