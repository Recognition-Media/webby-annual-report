'use client'

import { useState } from 'react'
import type { Report, FormField } from '@/sanity/types'
import { trackSignupConversion } from '@/lib/analytics'

function FieldInput({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  const baseClass = "w-full border-0 border-b-2 border-[#21261A]/30 bg-transparent px-1 py-2 text-base text-[#21261A] outline-none focus:border-[#8C001C] transition-colors placeholder:text-[#21261A]/40"
  const fontStyle = { fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif" }
  const placeholder = field.label

  if (field.fieldType === 'dropdown') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 border-[#21261A]/30 bg-transparent px-1 py-2 text-base text-[#21261A] outline-none focus:border-[#8C001C] transition-colors"
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
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          formData,
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
    <div className="fixed inset-0 bg-[#21261A]/80 z-50 flex items-center justify-center px-3 md:px-4 overflow-y-auto">
      <div
        className="w-full max-w-[575px] p-[3px] md:p-[4px] text-center my-4"
        style={{ background: '#8C001C' }}
      >
        <div
          className="p-5 md:p-10"
          style={{
            background: '#E3DDCA',
            fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
          }}
        >
          {/* Anthem Awards logo — moss green */}
          <div className="mb-4 md:mb-6">
            <img
              src="/anthem/anthem-logo-green.svg"
              alt="6th Annual Anthem Awards"
              className="mx-auto h-[50px] md:h-[70px] w-auto"
            />
          </div>

          <h3
            className="uppercase font-bold text-xs md:text-sm tracking-wider pb-3 md:pb-4 whitespace-pre-line"
            style={{ color: '#21261A' }}
          >
            {report.signupTitle || '2026 State of Social Impact Report'}
          </h3>
          <p
            className="text-xs md:text-sm mb-5 md:mb-8 leading-relaxed whitespace-pre-line"
            style={{ color: '#21261A', opacity: 0.7 }}
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
                    style={{ color: '#21261A' }}
                  >
                    {field.label}{(field.required || field.label.toLowerCase() === 'company') ? <span className="text-[#8C001C] ml-0.5">*</span> : ''}
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

            {error && <p className="text-xs md:text-sm text-[#8C001C]">{error}</p>}

            <p className="text-[10px] md:text-xs mt-3 md:mt-4" style={{ color: '#21261A', opacity: 0.5 }}>
              By logging in you agree to our{' '}
              <a href="https://www.anthemawards.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#21261A' }}>
                Privacy Policy
              </a>
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-between w-full max-w-[280px] mx-auto uppercase font-medium py-3 md:py-4 px-5 md:px-6 mt-4 md:mt-6 text-xs md:text-sm tracking-wider transition-colors disabled:opacity-50 cursor-pointer rounded-full"
              style={{ background: '#8C001C', color: '#E3DDCA' }}
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
