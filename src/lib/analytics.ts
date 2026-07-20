declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
    analytics?: {
      identify: (...args: unknown[]) => void
      track: (...args: unknown[]) => void
      page: (...args: unknown[]) => void
    }
  }
}

export function trackSignupConversion() {
  if (typeof window === 'undefined') return

  // Facebook
  window.fbq?.('track', 'Lead')

  // Google Analytics custom event
  window.gtag?.('event', 'sign_up', { method: 'report_gate' })
}

export function trackCtaClick(location: string, destinationUrl: string, property?: string, reportSlug?: string) {
  if (typeof window === 'undefined') return
  window.analytics?.track('cta_clicked', {
    cta_location: location,
    destination_url: destinationUrl,
    property,
    report_slug: reportSlug,
  })
}
