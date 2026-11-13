'use client'

import { useState, useEffect } from 'react'
import type { Report, FormField } from '@/sanity/types'
import { trackSignupConversion } from '@/lib/analytics'
import { buildCioIdentity } from '@/lib/cioIdentity'
import { assetPath } from '@/lib/assetPath'

// Per-property theming for the vertical-template signup gate. The vertical
// layout serves both Anthem and Lovie, so the gate must brand itself from
// report.property (mirrors the property branching used across ReportView).
// Anthem is the default/fallback so behavior is unchanged for it.
type GateTheme = {
  overlay: string
  frame: string
  card: string
  logo: string
  logoAlt: string
  font: string
  text: string
  accent: string
  buttonText: string
  privacyUrl: string
  privacyName: string
  rounded: boolean
}

const GATE_THEMES: Record<string, GateTheme> = {
  anthem: {
    overlay: 'rgba(33, 38, 26, 0.8)', // #21261A moss
    frame: '#8C001C',
    card: '#E3DDCA',
    logo: '/anthem/anthem-logo-green.svg',
    logoAlt: 'Anthem Awards',
    font: "'roc-grotesk-variable', -apple-system, sans-serif",
    text: '#21261A',
    accent: '#8C001C',
    buttonText: '#E3DDCA',
    privacyUrl: 'https://www.anthemawards.com/privacy-policy/',
    privacyName: 'Anthem Awards',
    rounded: false,
  },
  // Slug-keyed override for the Shared Influence report — same base
  // Anthem card but with a purple frame + purple pill + moss button
  // text so it mirrors the hero's palette. Everything else (logo, font,
  // privacy link) stays on the Anthem defaults.
  'shared-influence-creator-partnerships-nonprofit': {
    overlay: 'rgba(33, 38, 26, 0.8)',
    frame: '#D17DD0', // Anthem Purple
    card: '#E3DDCA',
    logo: '/anthem/anthem-logo-green.svg',
    logoAlt: 'Anthem Awards',
    font: "'roc-grotesk-variable', -apple-system, sans-serif",
    text: '#21261A',
    accent: '#D17DD0', // pill background
    buttonText: '#21261A', // moss text on the purple pill
    privacyUrl: 'https://www.anthemawards.com/privacy-policy/',
    privacyName: 'Anthem Awards',
    rounded: false,
  },
  lovie: {
    overlay: 'rgba(0, 0, 0, 0.7)',
    frame: '#ff6000', // lovie orange
    card: '#f2eeed', // lovie cream
    logo: '/lovie/lovie-logo-black.svg',
    logoAlt: 'The Lovie Awards',
    font: "'Scto Grotesk A', -apple-system, sans-serif",
    text: '#000000',
    accent: '#ff6000',
    buttonText: '#f2eeed',
    privacyUrl: 'https://www.lovieawards.com/privacy-policy/',
    privacyName: 'Lovie Awards',
    rounded: true,
  },
  // Slug-keyed override for the Nordics report — same Lovie card but
  // with the brand purple in place of orange for frame + accent pill.
  'lovie-creative-hubs-nordics': {
    overlay: 'rgba(0, 0, 0, 0.7)',
    frame: '#016BA7',
    card: '#f2eeed',
    logo: '/lovie/lovie-logo-black.svg',
    logoAlt: 'The Lovie Awards',
    font: "'Scto Grotesk A', -apple-system, sans-serif",
    text: '#000000',
    accent: '#016BA7',
    buttonText: '#f2eeed',
    privacyUrl: 'https://www.lovieawards.com/privacy-policy/',
    privacyName: 'Lovie Awards',
    rounded: true,
  },
  telly: {
    overlay: 'rgba(0, 0, 0, 0.9)',
    // Pink rather than the Telly red: the gate reads as its own moment
    // rather than a continuation of the red hero behind it.
    frame: '#F41FC9',
    card: '#110E1F',
    logo: '/telly/judges/telly-logo-horizontal-white-cropped.png',
    logoAlt: 'The Telly Awards',
    font: "'Basetica', -apple-system, sans-serif",
    text: '#ffffff',
    // Drives the submit button and the required-field asterisks — kept in
    // step with the frame so the whole gate reads pink, not pink-framed
    // with a red button inside it.
    accent: '#F41FC9',
    buttonText: '#ffffff',
    privacyUrl: 'https://www.tellyawards.com/privacy-policy/',
    privacyName: 'Telly Awards',
    rounded: false,
  },
}

function FieldInput({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  const placeholder = field.label

  if (field.fieldType === 'dropdown') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 bg-transparent px-1 py-2 text-base outline-none transition-colors"
      >
        <option value="">{placeholder}</option>
        {field.dropdownOptions?.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    )
  }

  return (
    <input
      type={field.fieldType}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={field.required}
      className="w-full border-0 border-b-2 bg-transparent px-1 py-2 text-base outline-none transition-colors"
    />
  )
}

export function SignupGate({ report, onComplete, onClose }: { report: Report; onComplete: () => void; onClose?: () => void }) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [consented, setConsented] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Prefer a slug-specific gate theme (e.g. Shared Influence's purple
  // pill) before falling back to the property-level default (Anthem /
  // Lovie).
  const slug = report.slug?.current
  const theme =
    (slug && GATE_THEMES[slug]) ||
    GATE_THEMES[report.property as string] ||
    GATE_THEMES.anthem
  const fields = report.formFields || []
  const isSharedInfluence = slug === 'shared-influence-creator-partnerships-nonprofit'
  // Slug-scoped fallback copy so the gate reads correctly before the
  // CMS signupTitle/signupSubhead fields are populated for this report.
  const isTelly = report.property === 'telly'
  const defaultTitle = isSharedInfluence
    ? 'Shared Influence Report'
    : isTelly
      ? '2026 State of Video Report'
      : '2026 State of Social Impact Report'
  const defaultSubhead = isSharedInfluence
    ? "A playbook for creator partnerships that drive social impact, with real advice from experts. Sign up to explore the report."
    : isTelly
      ? 'Hear directly from the makers shaping video and television across every screen. Sign up to explore the report.'
      : "Hear directly from impact leaders on what's shaping the work in 2026. Sign up to explore the report."

  function updateField(label: string, value: string) {
    setFormData((prev) => ({ ...prev, [label]: value }))
  }

  useEffect(() => {
    if (!onClose) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const cioIdentity = buildCioIdentity(fields, formData)

      // Links for Customer.io's triggered emails, built from where the
      // visitor actually signed up so the domain is right (these reports are
      // served from several). shareLink is the plain URL, so anyone it's
      // forwarded to still meets the gate and becomes a new lead;
      // privateLink carries the ?access=direct bypass so the recipient lands
      // straight in without filling the form again.
      const reportUrl = `${window.location.origin}${window.location.pathname}`
      const shareLink = reportUrl
      const privateLink = `${reportUrl}?access=direct`

      await fetch(`${process.env.NEXT_PUBLIC_SIGNUP_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportSlug: report.slug.current,
          reportTitle: report.title,
          property: report.property || 'anthem',
          formData,
          cioIdentity,
          consented,
          consentedAt: new Date().toISOString(),
          specifier: report.specifier,
          privateLink,
          shareLink,
        }),
      }).catch(() => {})

      trackSignupConversion()
      if (cioIdentity) {
        window.analytics?.identify(cioIdentity.email, {
          firstName: cioIdentity.firstName,
          lastName: cioIdentity.lastName,
          organizationName: cioIdentity.company,
          jobTitle: cioIdentity.jobTitle,
        })
        window.analytics?.track('lead_created', { source: 'gated_content' })
      }
      onComplete()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="signup-gate-scope fixed inset-0 z-50 flex items-center justify-center px-3 md:px-4 py-4"
      style={{
        // Pin to the *dynamic* viewport height. 100vh ignores mobile browser
        // chrome (the collapsing URL bar), which is what pushed the submit
        // button below the fold on phones; 100dvh tracks the usable area.
        height: '100dvh',
        background: theme.overlay,
        // Telly's hero is a bright looping TV collage that still read through
        // the scrim and pulled focus from the form. Blurring the backdrop
        // settles it into a soft wash behind the card.
        backdropFilter: isTelly ? 'blur(8px)' : undefined,
        WebkitBackdropFilter: isTelly ? 'blur(8px)' : undefined,
        // CSS vars consumed by the .signup-gate-scope rules in globals.css
        // for input border / focus / placeholder colors + font.
        ['--gate-text' as string]: theme.text,
        ['--gate-accent' as string]: theme.accent,
        ['--gate-font' as string]: theme.font,
      }}
    >
      <div
        className={`w-full max-w-[575px] p-[3px] md:p-[4px] text-center flex flex-col max-h-full ${theme.rounded ? 'rounded-3xl' : ''}`}
        style={{ background: theme.frame }}
      >
        {/* The card is a flex column capped at the viewport height: the header
            and fields scroll internally while the consent line and submit
            button stay pinned to the bottom, so the CTA is reachable at any
            screen size instead of bleeding past the fold. */}
        <div
          className={`relative flex flex-col min-h-0 overflow-hidden ${theme.rounded ? 'rounded-[21px]' : ''}`}
          style={{
            background: theme.card,
            fontFamily: theme.font,
          }}
        >
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-2 right-2 md:top-3 md:right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none transition-opacity cursor-pointer opacity-60 hover:opacity-100"
              style={{ color: theme.text }}
            >
              &#215;
            </button>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
            <div className="gate-scroll min-h-0 overflow-y-auto px-5 md:px-10 pt-4 md:pt-6">
              <div className="mb-2 md:mb-4">
                <img
                  src={assetPath(theme.logo)}
                  alt={theme.logoAlt}
                  // Telly uses the tightly-cropped wordmark (712x140). The
                  // uncropped PNG was a 792x612 canvas holding a 692x120 mark,
                  // so ~80% of its height was transparent padding: it ate
                  // vertical space and still looked tiny. Cropped, a much
                  // smaller height renders a visibly larger logo.
                  className={`mx-auto w-auto ${isTelly ? 'h-[34px] md:h-[42px]' : 'h-[50px] md:h-[70px]'}`}
                />
              </div>

              <h3
                className="uppercase font-bold text-xs md:text-sm tracking-wider pb-2 whitespace-pre-line"
                style={{ color: theme.text }}
              >
                {report.signupTitle || defaultTitle}
              </h3>
              <p
                className="text-xs md:text-sm mb-4 leading-relaxed whitespace-pre-line"
                style={{ color: theme.text, opacity: 0.7 }}
              >
                {report.signupSubhead || defaultSubhead}
              </p>

              {/* Mobile: compact stacked inputs */}
              <div className="md:hidden flex flex-col gap-2.5 text-left">
                {fields.map((field) => (
                  <div key={field.label} className="w-full">
                    <FieldInput
                      field={field}
                      value={formData[field.label] || ''}
                      onChange={(v) => updateField(field.label, v)}
                    />
                  </div>
                ))}
              </div>

              {/* Desktop: side-by-side label + input */}
              <div className="hidden md:block">
                {fields.map((field) => (
                  <div key={field.label} className="flex flex-row items-center mb-3 text-left">
                    <label
                      className="w-[30%] text-sm font-bold text-right pr-4"
                      style={{ color: theme.text }}
                    >
                      {field.label}{field.required ? <span className="ml-0.5" style={{ color: theme.accent }}>*</span> : ''}
                    </label>
                    <div className="w-[70%]">
                      <FieldInput
                        field={field}
                        value={formData[field.label] || ''}
                        onChange={(v) => updateField(field.label, v)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="shrink-0 px-5 md:px-10 pb-4 md:pb-6 pt-2">
              {error && <p className="text-xs md:text-sm" style={{ color: theme.accent }}>{error}</p>}

              <label
                className="flex items-start gap-2 text-left text-[10px] md:text-xs mt-2 md:mt-3 cursor-pointer"
                style={{ color: theme.text, opacity: 0.7 }}
              >
                <input
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => setConsented(e.target.checked)}
                  required
                  className="mt-0.5"
                />
                <span>
                  I agree to the{' '}
                  <a href={theme.privacyUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: theme.text }}>
                    Privacy Policy
                  </a>{' '}
                  and consent to receive communications from {theme.privacyName}.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting || !consented}
                className="flex items-center justify-between w-full max-w-[280px] mx-auto uppercase font-medium py-3 md:py-[14px] px-5 md:px-6 mt-3 md:mt-4 text-xs md:text-sm tracking-wider transition-colors disabled:opacity-50 cursor-pointer rounded-full"
                style={{ background: theme.accent, color: theme.buttonText }}
              >
                <span>{submitting ? 'Submitting...' : (report.submitButtonText || 'Explore The Report')}</span>
                <span className="text-base md:text-lg">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
