'use client'

import { useState, useEffect } from 'react'
import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { HeroSection } from './HeroSection'
import { SignupGate } from './SignupGate'
import { IntroLetter } from './IntroLetter'
import { TrendSection } from './TrendSection'
import { ReportFooter } from './ReportFooter'
import { AnalyticsScripts } from './AnalyticsScripts'
import { ScrollReveal } from './ScrollReveal'

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

  useEffect(() => {
    if (getCookie(cookieKey)) {
      setHasAccess(true)
    }
  }, [cookieKey])

  function handleSignupComplete() {
    setCookie(cookieKey, 'true', 365)
    setHasAccess(true)
  }

  return (
    <main>
      <AnalyticsScripts report={report} />
      <HeroSection report={report} carouselImages={report.carouselImages} />

      {!hasAccess ? (
        <SignupGate report={report} onComplete={handleSignupComplete} />
      ) : (
        <>
          <IntroLetter report={report} />
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
              </div>
            </section>
          </ScrollReveal>

          <ReportFooter report={report} />
        </>
      )}
    </main>
  )
}
