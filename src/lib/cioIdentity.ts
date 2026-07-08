import type { FormField } from '@/sanity/types'

export interface CioIdentity {
  email: string
  firstName?: string
  lastName?: string
  company?: string
  jobTitle?: string
}

const CIOFIELD_TO_IDENTITY_KEY: Record<string, keyof CioIdentity> = {
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  company: 'company',
  jobTitle: 'jobTitle',
}

export function buildCioIdentity(fields: FormField[], formData: Record<string, string>): CioIdentity | null {
  const identity: Partial<CioIdentity> = {}

  for (const field of fields) {
    const key = field.ciofield ? CIOFIELD_TO_IDENTITY_KEY[field.ciofield] : undefined
    if (!key) continue

    const value = formData[field.label]
    if (value) identity[key] = value
  }

  if (!identity.email) return null

  return identity as CioIdentity
}
