'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Report, FormField } from '@/sanity/types'

function FieldInput({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  const baseClass = "w-full rounded border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none"

  if (field.fieldType === 'dropdown') {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={baseClass}>
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
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportSlug: report.slug.current,
          formData,
        }),
      })

      if (!res.ok) throw new Error('Signup failed')
      onComplete()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.section
        className="mx-auto max-w-md px-6 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.label}>
              <label className="mb-1 block text-sm font-medium">{field.label}{field.required && ' *'}</label>
              <FieldInput
                field={field}
                value={formData[field.label] || ''}
                onChange={(v) => updateField(field.label, v)}
              />
            </div>
          ))}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : report.submitButtonText || 'Access Report'}
          </button>
        </form>
      </motion.section>
    </AnimatePresence>
  )
}
