'use client'

import { useEffect } from 'react'

// Maps hostname → per-property landing route. The landing route at /webby
// or /anthem then redirects to that property's latest live report.
// Unknown hosts (localhost, raw cloudfront domain, future subdomains) fall
// through to /anthem since it's the most recent. Update HOST_TO_PROPERTY
// if a new branded subdomain is added.
const HOST_TO_PROPERTY: Record<string, string> = {
  'reports.webbyawards.com': '/webby',
  'reports.anthemawards.com': '/anthem',
}

export default function HomePage() {
  useEffect(() => {
    const target = HOST_TO_PROPERTY[window.location.hostname] ?? '/anthem'
    window.location.replace(target)
  }, [])

  // Brief flash before the JS redirect fires.
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#21261A]">
      <p className="text-sm tracking-[0.2em] uppercase text-[#E3DDCA]/50">Loading…</p>
    </main>
  )
}
