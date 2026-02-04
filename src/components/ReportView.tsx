'use client'

import { useState, useEffect } from 'react'
import type { Report } from '@/sanity/types'
import { HeroSection } from './HeroSection'
import { SignupGate } from './SignupGate'
import { IntroLetter } from './IntroLetter'
import { TrendSection } from './TrendSection'
import { ImageCarousel } from './ImageCarousel'
import { ReportFooter } from './ReportFooter'
import { AnalyticsScripts } from './AnalyticsScripts'

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
      <HeroSection report={report} />

      {!hasAccess ? (
        <SignupGate report={report} onComplete={handleSignupComplete} />
      ) : (
        <>
          <IntroLetter report={report} />
          {report.trendSections?.map((section, i) => (
            <TrendSection key={i} section={section} index={i} />
          ))}
          {report.carouselImages && report.carouselImages.length > 0 && (
            <ImageCarousel images={report.carouselImages} />
          )}
          <ReportFooter report={report} />
        </>
      )}
    </main>
  )
}
