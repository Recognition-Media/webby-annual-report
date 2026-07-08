import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((line) => line.includes('='))
    .map((line) => {
      const idx = line.indexOf('=')
      return [line.slice(0, idx), line.slice(idx + 1)]
    })
)

const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset, SANITY_API_TOKEN: token } = env

const LABEL_TO_CIOFIELD = {
  'First Name': 'firstName',
  'Last Name': 'lastName',
  'Email': 'email',
  'Company': 'company',
  'Job Title': 'jobTitle',
}

const REPORT_IDS = [
  'report-2025', // The 30th Annual Webby Awards Report (webby)
  'a5f3c404-b760-4e1f-8499-4592a346835d', // The Lovie Awards Creative Hubs Series (lovie)
  '82f6f241-2d89-4df6-b168-94b3d6040c99', // The State of Social Impact Report (anthem)
]

const queryUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}`
const mutateUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`

for (const id of REPORT_IDS) {
  const queryRes = await fetch(`${queryUrl}?query=${encodeURIComponent(`*[_id == "${id}"][0]{formFields}`)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const { result: report } = await queryRes.json()

  if (!report?.formFields) {
    console.log(`Skipping ${id}: no formFields`)
    continue
  }

  const set = {}
  for (const field of report.formFields) {
    const ciofield = LABEL_TO_CIOFIELD[field.label]
    if (!ciofield) {
      console.log(`No CIO mapping for "${field.label}" on ${id}, leaving as none`)
      continue
    }
    set[`formFields[_key=="${field._key}"].ciofield`] = ciofield
  }

  if (Object.keys(set).length === 0) continue

  const mutateRes = await fetch(mutateUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations: [{ patch: { id, set } }] }),
  })

  if (!mutateRes.ok) {
    console.error(`Failed to tag ${id}:`, await mutateRes.text())
  } else {
    console.log(`Tagged ${id}`)
  }
}
