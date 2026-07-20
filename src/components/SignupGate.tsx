'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Report, FormField } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { trackSignupConversion } from '@/lib/analytics'
import { buildCioIdentity } from '@/lib/cioIdentity'

const PRIVACY_BY_PROPERTY: Record<string, { url: string; name: string }> = {
  webby: { url: 'https://www.webbyawards.com/privacy-policy/', name: 'Webby Awards' },
  anthem: { url: 'https://www.anthemawards.com/privacy-policy/', name: 'Anthem Awards' },
  lovie: { url: 'https://www.lovieawards.com/privacy-policy/', name: 'Lovie Awards' },
  telly: { url: 'https://www.tellyawards.com/privacy-policy/', name: 'Telly Awards' },
}

function FieldInput({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  const baseClass = "w-full border-0 border-b-2 border-[#ccc] bg-transparent px-1 py-2 text-base outline-none focus:border-black transition-colors"
  const fontStyle = { fontFamily: "'Aktiv Grotesk', -apple-system, sans-serif" }
  const placeholder = field.label

  if (field.fieldType === 'dropdown') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 border-[#ccc] bg-transparent px-1 py-2 text-base outline-none focus:border-black transition-colors"
        style={fontStyle}
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
      className={baseClass}
      style={fontStyle}
    />
  )
}

export function SignupGate({ report, onComplete }: { report: Report; onComplete: () => void }) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [consented, setConsented] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fields = report.formFields || []
  const privacy = PRIVACY_BY_PROPERTY[report.property || 'webby'] || PRIVACY_BY_PROPERTY.webby

  function updateField(label: string, value: string) {
    setFormData((prev) => ({ ...prev, [label]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const cioIdentity = buildCioIdentity(fields, formData)

      await fetch(`${process.env.NEXT_PUBLIC_SIGNUP_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportSlug: report.slug.current,
          reportTitle: report.title,
          property: report.property || 'webby',
          formData,
          cioIdentity,
          consented,
          consentedAt: new Date().toISOString(),
          specifier: report.specifier,
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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-3 md:px-4 overflow-y-auto">
      <div
        className="w-full max-w-[575px] p-[6px] md:p-[10px] text-center text-black my-4"
        style={{
          background: 'linear-gradient(270deg, #80D064, #FFDE67, #82D8EB, #559DDF, #8B70D1, #FF67CB, #FF7F63, #FFB763, #80D064)',
          backgroundSize: '300% 300%',
          animation: 'gradientBorder 6s linear infinite',
        }}
      >
        <style>{`
          @keyframes gradientBorder {
            0% { background-position: 0% 50%; }
            100% { background-position: 300% 50%; }
          }
        `}</style>
        <div className="bg-white p-5 md:p-10" style={{ fontFamily: "'Aktiv Grotesk', -apple-system, sans-serif" }}>
        {/* Logo */}
        {report.headerImage && (
          <div className="mb-4 md:mb-6">
            <Image
              src={urlFor(report.headerImage).width(300).url()}
              alt="The Webby Awards"
              width={120}
              height={60}
              className="mx-auto w-auto h-auto max-h-[40px] md:max-h-[60px]"
            />
          </div>
        )}

        <h3 className="uppercase font-bold text-xs md:text-sm tracking-wider pb-3 md:pb-4 whitespace-pre-line">
          {report.signupTitle || 'Welcome to the Webby Awards Report'}
        </h3>
        <p className="text-xs md:text-sm mb-5 md:mb-8 leading-relaxed whitespace-pre-line">
          {report.signupSubhead || 'Please provide us with some basic info to access the report.\nFeel free to share among your team and colleagues.'}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Mobile: compact stacked inputs with placeholder labels */}
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
                <label className="w-[30%] text-sm font-bold text-right pr-4">
                  {field.label}{field.required ? <span className="text-red-500 ml-0.5">*</span> : ''}
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

          {error && <p className="text-xs md:text-sm text-red-600">{error}</p>}

          <label className="flex items-start gap-2 text-left text-[10px] md:text-xs text-[#999] mt-3 md:mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={consented}
              onChange={(e) => setConsented(e.target.checked)}
              required
              className="mt-0.5"
            />
            <span>
              I agree to the{' '}
              <a href={privacy.url} target="_blank" rel="noopener noreferrer" className="underline text-black">
                Privacy Policy
              </a>{' '}
              and consent to receive communications from {privacy.name}.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting || !consented}
            className="flex items-center justify-center gap-2 w-full max-w-[280px] mx-auto bg-black text-white uppercase font-medium py-3 md:py-4 px-5 md:px-6 mt-4 md:mt-6 text-xs md:text-sm tracking-wider hover:bg-[#333] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <span>{submitting ? 'Submitting...' : (report.submitButtonText || 'Access Report')}</span>
            <span className="text-base md:text-lg">→</span>
          </button>
        </form>
        </div>
      </div>
    </div>
  )
}
