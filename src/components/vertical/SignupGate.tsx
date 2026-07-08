'use client'

import { useState } from 'react'
import type { Report, FormField } from '@/sanity/types'
import { trackSignupConversion } from '@/lib/analytics'
import { buildCioIdentity } from '@/lib/cioIdentity'

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

export function SignupGate({ report, onComplete }: { report: Report; onComplete: () => void }) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [consented, setConsented] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const theme = GATE_THEMES[report.property as string] ?? GATE_THEMES.anthem
  const fields = report.formFields || []

  function updateField(label: string, value: string) {
    setFormData((prev) => ({ ...prev, [label]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SIGNUP_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportSlug: report.slug.current,
          reportTitle: report.title,
          property: report.property || 'anthem',
          formData,
          cioIdentity: buildCioIdentity(fields, formData),
          consented,
          consentedAt: new Date().toISOString(),
        }),
      }).catch(() => {})

      trackSignupConversion()
      onComplete()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="signup-gate-scope fixed inset-0 z-50 flex items-center justify-center px-3 md:px-4 overflow-y-auto"
      style={{
        background: theme.overlay,
        // CSS vars consumed by the .signup-gate-scope rules in globals.css
        // for input border / focus / placeholder colors + font.
        ['--gate-text' as string]: theme.text,
        ['--gate-accent' as string]: theme.accent,
        ['--gate-font' as string]: theme.font,
      }}
    >
      <div
        className={`w-full max-w-[575px] p-[3px] md:p-[4px] text-center my-4 ${theme.rounded ? 'rounded-3xl' : ''}`}
        style={{ background: theme.frame }}
      >
        <div
          className={`p-5 md:p-10 ${theme.rounded ? 'rounded-[21px]' : ''}`}
          style={{
            background: theme.card,
            fontFamily: theme.font,
          }}
        >
          <div className="mb-4 md:mb-6">
            <img
              src={theme.logo}
              alt={theme.logoAlt}
              className="mx-auto h-[50px] md:h-[70px] w-auto"
            />
          </div>

          <h3
            className="uppercase font-bold text-xs md:text-sm tracking-wider pb-3 md:pb-4 whitespace-pre-line"
            style={{ color: theme.text }}
          >
            {report.signupTitle || '2026 State of Social Impact Report'}
          </h3>
          <p
            className="text-xs md:text-sm mb-5 md:mb-8 leading-relaxed whitespace-pre-line"
            style={{ color: theme.text, opacity: 0.7 }}
          >
            {report.signupSubhead || "Hear directly from impact leaders on what's shaping the work in 2026. Sign up to explore the report."}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Mobile: compact stacked inputs */}
            <div className="md:hidden flex flex-col gap-3 text-left">
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
                <div key={field.label} className="flex flex-row items-center mb-5 text-left">
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

            {error && <p className="text-xs md:text-sm" style={{ color: theme.accent }}>{error}</p>}

            <label
              className="flex items-start gap-2 text-left text-[10px] md:text-xs mt-3 md:mt-4 cursor-pointer"
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
              className="flex items-center justify-between w-full max-w-[280px] mx-auto uppercase font-medium py-3 md:py-4 px-5 md:px-6 mt-4 md:mt-6 text-xs md:text-sm tracking-wider transition-colors disabled:opacity-50 cursor-pointer rounded-full"
              style={{ background: theme.accent, color: theme.buttonText }}
            >
              <span>{submitting ? 'Submitting...' : (report.submitButtonText || 'Explore The Report')}</span>
              <span className="text-base md:text-lg">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
