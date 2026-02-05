'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Report, FormField } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { trackSignupConversion } from '@/lib/analytics'

function FieldInput({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  const baseClass = "w-full border-0 border-b-2 border-[#ccc] bg-transparent px-1 py-2 text-base font-[Montserrat] outline-none focus:border-black transition-colors"

  if (field.fieldType === 'dropdown') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 border-[#ccc] bg-transparent px-1 py-2 text-base font-[Montserrat] outline-none focus:border-black transition-colors"
      >
        <option value="">Select...</option>
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
      placeholder={field.label}
      required={field.required}
      className={baseClass}
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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <div className="bg-white border-[10px] border-[#75b9f2] w-full max-w-[575px] p-8 md:p-10 text-center text-black">
        {/* Logo */}
        {report.headerImage && (
          <div className="mb-6">
            <Image
              src={urlFor(report.headerImage).width(300).url()}
              alt="The Webby Awards"
              width={120}
              height={60}
              className="mx-auto w-auto h-auto max-h-[60px]"
            />
          </div>
        )}

        <h3 className="uppercase font-bold text-sm tracking-wider pb-4">
          Welcome to the Webby Awards Report
        </h3>
        <p className="text-sm mb-8 leading-relaxed">
          Please provide us with some basic info to access the report.
          <br />
          Feel free to share among your team and colleagues.
        </p>

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.label} className="flex flex-col sm:flex-row items-start sm:items-center mb-5 text-left">
              <label className="w-full sm:w-[30%] text-sm font-bold sm:text-right sm:pr-4 mb-1 sm:mb-0">
                {field.label}:
              </label>
              <div className="w-full sm:w-[70%]">
                <FieldInput
                  field={field}
                  value={formData[field.label] || ''}
                  onChange={(v) => updateField(field.label, v)}
                />
              </div>
            </div>
          ))}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <p className="text-xs text-[#999] mt-4">
            By logging in you agree to our{' '}
            <a href="https://www.webbyawards.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline text-black">
              Privacy Policy
            </a>
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-between w-full max-w-[280px] mx-auto bg-black text-white uppercase font-bold py-4 px-6 mt-6 text-sm tracking-wider hover:bg-[#333] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <span>{submitting ? 'Submitting...' : 'Login'}</span>
            <span className="text-lg">→</span>
          </button>
        </form>
      </div>
    </div>
  )
}
