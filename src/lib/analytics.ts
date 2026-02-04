declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
  }
}

export function trackSignupConversion() {
  if (typeof window === 'undefined') return

  // Facebook
  window.fbq?.('track', 'Lead')

  // Google Analytics custom event
  window.gtag?.('event', 'sign_up', { method: 'report_gate' })
}
