# Connect Report Signup Forms to Customer.io — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every report signup (Webby, Anthem, Lovie) identifies the person and fires a `report_signup` event in RM's existing Customer.io workspace, in addition to the current DynamoDB write, gated behind an explicit consent checkbox.

**Architecture:** Both `SignupGate.tsx` components build a `cioIdentity` object client-side (from a new `ciofield` mapping on each Sanity form field) and POST it alongside the existing `formData` to the `webby-report-signups` Lambda. The Lambda writes to DynamoDB exactly as before, then — if an email is present — calls Customer.io's Track API v2 (`identify` + a new `report_signup` event) using RM's existing prod Track API credentials. The Lambda's CORS allow-list is also fixed to include the Anthem/Lovie origins it was silently missing.

**Tech Stack:** Next.js 16 (static export) + Sanity (schema/content), Node 22.x Lambda (`@aws-sdk` from the runtime, no bundled deps, global `fetch`), Customer.io Track API v2, GitHub Actions.

## Global Constraints

- One shared Customer.io connection for all three properties — no per-property CIO accounts. Differentiate via a `property` attribute, matching the existing `PropertyHelper.cs` convention on the RM platform.
- Use the existing prod **Track/Event API** credentials (`CustomerIo:Event:SiteId`/`ApiKey` in `RecognitionMedia-dev/CustomerIOService/appsettings.Production.json`) — not the CIO **App API** token used by `mail-automation` for transactional email.
- DynamoDB stays as-is and keeps being the source of truth for the Sanity Studio's "Signups" tool. Customer.io sync is additive and best-effort — a CIO failure must never fail the signup or block the gate from closing.
- Fire a new, dedicated `report_signup` event — do not reuse the platform's `subscriptions` event.
- Consent checkbox is required before the form can submit, on both SignupGate components.
- Lambda source lives in this repo (`lambda/signup-handler/`) and deploys automatically via the existing GitHub Actions workflow on push to `main`.
- **Test strategy note:** this repo has zero test infrastructure today (no test runner in `package.json`). Per "follow established patterns," this plan does not introduce a new framework. The Lambda (`lambda/signup-handler/index.mjs`) is plain, dependency-free `.mjs`, so its pure payload-building functions get real automated tests via Node's zero-install built-in test runner (`node --test`). The Next.js/React/Sanity pieces have no automated test — they're verified by running the dev server and inspecting real network requests/UI behavior, consistent with how the rest of this app is tested today.

---

### Task 1: Add `ciofield` mapping to the form-field schema

**Files:**
- Modify: `src/sanity/schemas/objects/formField.ts`
- Modify: `src/sanity/types.ts:103-108` (the `FormField` interface)

**Interfaces:**
- Produces: `FormField.ciofield?: 'none' | 'email' | 'firstName' | 'lastName' | 'company' | 'jobTitle'` — consumed by Task 2's `buildCioIdentity`.

- [ ] **Step 1: Add the `ciofield` select field to the Sanity schema**

Edit `src/sanity/schemas/objects/formField.ts` — add a new field after `dropdownOptions`:

```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() },
    {
      name: 'fieldType',
      title: 'Field Type',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Email', value: 'email' },
          { title: 'URL', value: 'url' },
          { title: 'Dropdown', value: 'dropdown' },
        ],
      },
      validation: (r) => r.required(),
    },
    { name: 'required', title: 'Required', type: 'boolean', initialValue: false },
    {
      name: 'dropdownOptions',
      title: 'Dropdown Options',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ parent }: { parent: { fieldType?: string } }) => parent?.fieldType !== 'dropdown',
    },
    {
      name: 'ciofield',
      title: 'CIO Field',
      description:
        'Maps this field to a Customer.io attribute when a signup syncs. Leave as None if this field should only be stored (not synced to Customer.io).',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Email', value: 'email' },
          { title: 'First Name', value: 'firstName' },
          { title: 'Last Name', value: 'lastName' },
          { title: 'Company', value: 'company' },
          { title: 'Job Title', value: 'jobTitle' },
        ],
      },
      initialValue: 'none',
    },
  ],
})
```

- [ ] **Step 2: Add the type to `FormField`**

Edit `src/sanity/types.ts` lines 103-108:

```ts
export interface FormField {
  label: string
  fieldType: 'text' | 'email' | 'url' | 'dropdown'
  required: boolean
  dropdownOptions?: string[]
  ciofield?: 'none' | 'email' | 'firstName' | 'lastName' | 'company' | 'jobTitle'
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemas/objects/formField.ts src/sanity/types.ts
git commit -m "feat(signup): add ciofield mapping to form-field schema"
```

---

### Task 2: `buildCioIdentity` helper

**Files:**
- Create: `src/lib/cioIdentity.ts`

**Interfaces:**
- Consumes: `FormField` from `@/sanity/types` (`ciofield` from Task 1).
- Produces: `buildCioIdentity(fields: FormField[], formData: Record<string, string>): CioIdentity | null` and `CioIdentity` type — consumed by Task 3 (horizontal gate) and Task 4 (vertical gate).

- [ ] **Step 1: Create the helper**

Create `src/lib/cioIdentity.ts`:

```ts
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/cioIdentity.ts
git commit -m "feat(signup): add buildCioIdentity helper"
```

(Behavioral correctness of this function is verified in Task 3's manual browser test, where the real network payload is inspected — see that task's Step 4.)

---

### Task 3: Wire the horizontal (Webby) SignupGate

**Files:**
- Modify: `src/components/SignupGate.tsx`

**Interfaces:**
- Consumes: `buildCioIdentity` from `@/lib/cioIdentity` (Task 2).
- Produces: the client's `POST /signup` request now includes `reportTitle`, `property`, `cioIdentity`, `consented`, `consentedAt` — consumed by Task 5 (Lambda).

- [ ] **Step 1: Add a per-property privacy map and consent state**

In `src/components/SignupGate.tsx`, add near the top (after the imports, before `FieldInput`):

```tsx
const PRIVACY_BY_PROPERTY: Record<string, { url: string; name: string }> = {
  webby: { url: 'https://www.webbyawards.com/privacy-policy/', name: 'Webby Awards' },
  anthem: { url: 'https://www.anthemawards.com/privacy-policy/', name: 'Anthem Awards' },
  lovie: { url: 'https://www.lovieawards.com/privacy-policy/', name: 'Lovie Awards' },
  telly: { url: 'https://www.tellyawards.com/privacy-policy/', name: 'Telly Awards' },
}
```

Add the import at the top of the file:

```tsx
import { buildCioIdentity } from '@/lib/cioIdentity'
```

- [ ] **Step 2: Add consent state, gate the submit button, and extend the POST body**

Inside `export function SignupGate(...)`, change:

```tsx
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
      await fetch(`${process.env.NEXT_PUBLIC_SIGNUP_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportSlug: report.slug.current,
          reportTitle: report.title,
          property: report.property || 'webby',
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
```

- [ ] **Step 3: Replace the privacy paragraph with a required consent checkbox**

Find this block (currently right after `{error && ...}` and before the submit `<button>`):

```tsx
          <p className="text-[10px] md:text-xs text-[#999] mt-3 md:mt-4">
            By logging in you agree to our{' '}
            <a href="https://www.webbyawards.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline text-black">
              Privacy Policy
            </a>
          </p>
```

Replace it with:

```tsx
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
```

Then find the submit button:

```tsx
          <button
            type="submit"
            disabled={submitting}
```

Change to:

```tsx
          <button
            type="submit"
            disabled={submitting || !consented}
```

- [ ] **Step 4: Manually verify in the browser**

Run: `npm run dev`

In a browser, open `http://localhost:3000/2026-awards-report` (or whichever slug is currently live for `property: webby`), open DevTools → Network, and:
1. Confirm the submit button is disabled until the new checkbox is checked.
2. Fill in First Name / Last Name / Email / Company / Job Title, check the box, submit.
3. In the Network tab, find the `POST .../signup` request and inspect its request payload. Confirm it contains `reportTitle`, `property: "webby"`, `consented: true`, a `consentedAt` ISO timestamp, and `cioIdentity: { email: "<the email you typed>", firstName: "...", lastName: "...", company: "...", jobTitle: "..." }`.

Expected: the request fires (may still fail with a network error until Task 5's Lambda changes are deployed — that's fine at this stage; the point is verifying the **client-side payload shape**, which confirms Task 2's `buildCioIdentity` works correctly against real Sanity content).

- [ ] **Step 5: Commit**

```bash
git add src/components/SignupGate.tsx
git commit -m "feat(signup): add consent checkbox and CIO payload to horizontal gate"
```

---

### Task 4: Wire the vertical (Anthem/Lovie) SignupGate

**Files:**
- Modify: `src/components/vertical/SignupGate.tsx`

**Interfaces:**
- Consumes: `buildCioIdentity` from `@/lib/cioIdentity` (Task 2); the existing `GateTheme.privacyUrl` / `privacyName` fields (already defined per-property in `GATE_THEMES`).
- Produces: same POST body shape as Task 3.

- [ ] **Step 1: Import the helper and add consent state**

Add the import at the top of `src/components/vertical/SignupGate.tsx`:

```tsx
import { buildCioIdentity } from '@/lib/cioIdentity'
```

Inside `export function SignupGate(...)`, change:

```tsx
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
```

- [ ] **Step 2: Replace the privacy paragraph with a required consent checkbox**

Find this block:

```tsx
            <p className="text-[10px] md:text-xs mt-3 md:mt-4" style={{ color: theme.text, opacity: 0.5 }}>
              By logging in you agree to our{' '}
              <a href={theme.privacyUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: theme.text }}>
                Privacy Policy
              </a>
            </p>
```

Replace it with:

```tsx
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
```

Then find the submit button:

```tsx
            <button
              type="submit"
              disabled={submitting}
```

Change to:

```tsx
            <button
              type="submit"
              disabled={submitting || !consented}
```

- [ ] **Step 3: Manually verify in the browser**

Run: `npm run dev` (skip if already running from Task 3)

Open `http://localhost:3000/2026-state-of-social-impact-report` (Anthem, live) in the browser. Repeat the same checks as Task 3 Step 4: checkbox gates the submit button, and the `POST .../signup` request body contains `property: "anthem"`, `consented: true`, `consentedAt`, and a correct `cioIdentity`.

If you have a local Lovie report slug to test against (`lovie-creative-hubs-mediterranean`), repeat once more and confirm `property: "lovie"` and the Lovie-branded checkbox/link (orange accent, `lovieawards.com` privacy link) render correctly.

- [ ] **Step 4: Commit**

```bash
git add src/components/vertical/SignupGate.tsx
git commit -m "feat(signup): add consent checkbox and CIO payload to vertical gate"
```

---

### Task 5: Lambda — CORS fix + Customer.io sync

**Files:**
- Create: `lambda/signup-handler/index.mjs`
- Create: `lambda/signup-handler/index.test.mjs`

**Interfaces:**
- Consumes: the POST body shape produced by Task 3/4 (`reportSlug`, `reportTitle`, `property`, `formData`, `cioIdentity`, `consented`, `consentedAt`).
- Produces: `export { handler, corsHeaders, ALLOWED_ORIGINS, buildIdentifyPayload, buildEventPayload, syncToCustomerIo }` from `index.mjs` — this is the deployed Lambda code (`Handler: index.handler` in AWS stays valid since `handler` is still a named export).

- [ ] **Step 1: Write the failing tests**

Create `lambda/signup-handler/index.test.mjs`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { buildIdentifyPayload, buildEventPayload, corsHeaders, ALLOWED_ORIGINS } from './index.mjs'

test('buildIdentifyPayload maps cioIdentity fields to CIO attributes', () => {
  const payload = buildIdentifyPayload({
    cioIdentity: { email: 'jane@example.com', firstName: 'Jane', lastName: 'Doe', company: 'Acme', jobTitle: 'CTO' },
    property: 'anthem',
    consented: true,
    consentedAt: '2026-07-08T12:00:00.000Z',
  })

  assert.deepEqual(payload, {
    type: 'person',
    identifiers: { email: 'jane@example.com' },
    action: 'identify',
    attributes: {
      first_name: 'Jane',
      last_name: 'Doe',
      company: 'Acme',
      job_title: 'CTO',
      property: 'anthem',
      consented: true,
      consentedAt: '2026-07-08T12:00:00.000Z',
    },
  })
})

test('buildIdentifyPayload defaults missing optional fields to empty strings', () => {
  const payload = buildIdentifyPayload({
    cioIdentity: { email: 'jane@example.com' },
    property: 'webby',
    consented: true,
    consentedAt: '2026-07-08T12:00:00.000Z',
  })

  assert.equal(payload.attributes.first_name, '')
  assert.equal(payload.attributes.last_name, '')
  assert.equal(payload.attributes.company, '')
  assert.equal(payload.attributes.job_title, '')
})

test('buildEventPayload names the event report_signup with report attributes', () => {
  const payload = buildEventPayload({
    cioIdentity: { email: 'jane@example.com' },
    property: 'lovie',
    reportSlug: 'lovie-creative-hubs-mediterranean',
    reportTitle: 'The Lovie Awards Creative Hubs Series',
  })

  assert.deepEqual(payload, {
    type: 'person',
    identifiers: { email: 'jane@example.com' },
    action: 'event',
    name: 'report_signup',
    attributes: {
      reportSlug: 'lovie-creative-hubs-mediterranean',
      reportTitle: 'The Lovie Awards Creative Hubs Series',
      property: 'lovie',
      source: 'report-gate',
    },
  })
})

test('corsHeaders allows all three report origins', () => {
  for (const origin of [
    'https://reports.webbyawards.com',
    'https://reports.anthemawards.com',
    'https://reports.lovieawards.com',
  ]) {
    assert.equal(corsHeaders(origin)['Access-Control-Allow-Origin'], origin)
  }
})

test('corsHeaders falls back to the first allowed origin for unknown origins', () => {
  assert.equal(corsHeaders('https://evil.example.com')['Access-Control-Allow-Origin'], ALLOWED_ORIGINS[0])
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test lambda/signup-handler/`
Expected: FAIL — `index.mjs` does not exist yet (`Cannot find module './index.mjs'`).

- [ ] **Step 3: Write `index.mjs`**

Create `lambda/signup-handler/index.mjs`:

```js
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' })
const docClient = DynamoDBDocumentClient.from(ddbClient)
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'webby-report-signups'

const CIO_SITE_ID = process.env.CUSTOMERIO_SITE_ID
const CIO_API_KEY = process.env.CUSTOMERIO_API_KEY
const CIO_TRACK_URL = 'https://track.customer.io/api/v2/entity'

export const ALLOWED_ORIGINS = [
  'https://reports.webbyawards.com',
  'https://reports.anthemawards.com',
  'https://reports.lovieawards.com',
  'http://localhost:3000',
  'http://localhost:3001',
]

export function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function response(statusCode, body, origin) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    body: JSON.stringify(body),
  }
}

export function buildIdentifyPayload({ cioIdentity, property, consented, consentedAt }) {
  return {
    type: 'person',
    identifiers: { email: cioIdentity.email },
    action: 'identify',
    attributes: {
      first_name: cioIdentity.firstName || '',
      last_name: cioIdentity.lastName || '',
      company: cioIdentity.company || '',
      job_title: cioIdentity.jobTitle || '',
      property: property || '',
      consented: consented === true,
      consentedAt: consentedAt || '',
    },
  }
}

export function buildEventPayload({ cioIdentity, property, reportSlug, reportTitle }) {
  return {
    type: 'person',
    identifiers: { email: cioIdentity.email },
    action: 'event',
    name: 'report_signup',
    attributes: {
      reportSlug: reportSlug || '',
      reportTitle: reportTitle || '',
      property: property || '',
      source: 'report-gate',
    },
  }
}

export async function syncToCustomerIo({ cioIdentity, property, reportSlug, reportTitle, consented, consentedAt }) {
  if (!cioIdentity?.email) return

  if (!CIO_SITE_ID || !CIO_API_KEY) {
    console.warn('Customer.io sync skipped: CUSTOMERIO_SITE_ID/CUSTOMERIO_API_KEY not configured')
    return
  }

  const authHeader = 'Basic ' + Buffer.from(`${CIO_SITE_ID}:${CIO_API_KEY}`).toString('base64')
  const payloads = [
    buildIdentifyPayload({ cioIdentity, property, consented, consentedAt }),
    buildEventPayload({ cioIdentity, property, reportSlug, reportTitle }),
  ]

  for (const payload of payloads) {
    try {
      const res = await fetch(CIO_TRACK_URL, {
        method: 'POST',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        console.error('Customer.io sync failed', res.status, await res.text())
      }
    } catch (err) {
      console.error('Customer.io sync error', err)
    }
  }
}

export async function handler(event) {
  const origin = event.headers?.origin || ''
  const method = event.requestContext?.http?.method || event.httpMethod
  const path = event.requestContext?.http?.path || event.rawPath || ''

  if (method === 'OPTIONS') {
    return response(200, {}, origin)
  }

  try {
    if (method === 'POST' && path.endsWith('/signup')) {
      const body = JSON.parse(event.body || '{}')
      const { reportSlug, reportTitle, property, formData, cioIdentity, consented, consentedAt } = body

      if (!reportSlug || !formData) {
        return response(400, { error: 'Missing required fields' }, origin)
      }

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: randomUUID(),
          reportSlug,
          formData,
          consented: consented === true,
          consentedAt: consentedAt || null,
          timestamp: new Date().toISOString(),
          ip: event.headers?.['x-forwarded-for'] || 'unknown',
          userAgent: event.headers?.['user-agent'] || 'unknown',
        },
      }))

      await syncToCustomerIo({ cioIdentity, property, reportSlug, reportTitle, consented, consentedAt })

      return response(200, { success: true }, origin)
    }

    if (method === 'GET' && path.endsWith('/signups')) {
      const params = event.queryStringParameters || {}
      const scanParams = { TableName: TABLE_NAME }

      if (params.reportSlug) {
        scanParams.FilterExpression = 'reportSlug = :slug'
        scanParams.ExpressionAttributeValues = { ':slug': params.reportSlug }
      }

      const result = await docClient.send(new ScanCommand(scanParams))
      return response(200, { signups: result.Items || [] }, origin)
    }

    if (method === 'DELETE' && path.endsWith('/signup')) {
      const params = event.queryStringParameters || {}
      if (!params.id) {
        return response(400, { error: 'Missing id parameter' }, origin)
      }
      await docClient.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id: params.id },
      }))
      return response(200, { success: true }, origin)
    }

    return response(404, { error: 'Not found' }, origin)
  } catch (err) {
    console.error('Lambda error:', err)
    return response(500, { error: 'Internal server error' }, origin)
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test lambda/signup-handler/`
Expected: `5 passing`, `0 failing`.

- [ ] **Step 5: Commit**

```bash
git add lambda/signup-handler/index.mjs lambda/signup-handler/index.test.mjs
git commit -m "feat(signup): sync signups to Customer.io from the Lambda, fix CORS allow-list"
```

---

### Task 6: Wire the Lambda into CI deploy

**Files:**
- Modify: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `lambda/signup-handler/index.mjs` (Task 5); existing `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` GitHub Actions secrets already configured for the S3/CloudFront steps.

- [ ] **Step 1: Add a Lambda test + deploy step**

Edit `.github/workflows/deploy.yml` — add a new step after "Invalidate CloudFront cache" (end of the `deploy` job):

```yaml
      - name: Test and deploy signup Lambda
        if: github.ref_name == 'main'
        run: |
          node --test lambda/signup-handler/
          cd lambda/signup-handler
          zip -j function.zip index.mjs
          aws lambda update-function-code --function-name webby-report-signups --zip-file fileb://function.zip
```

This runs on every push to `main` — harmless (re-uploads identical code) when `lambda/` hasn't changed, and keeps the deployed Lambda in sync without needing a path-filtering GitHub Action dependency.

- [ ] **Step 2: Verify the workflow YAML is valid**

Run: `npx -y js-yaml .github/workflows/deploy.yml > /dev/null && echo "valid yaml"`
Expected: `valid yaml`

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy signup Lambda alongside the site on push to main"
```

---

### Task 7: Set the Lambda's Customer.io credentials (one-time ops)

**Files:** none (AWS configuration only — no code)

- [ ] **Step 1: Set the Lambda environment variables**

The existing prod Track/Event API credentials live in `/Users/stevework/claude-code/recognition-media/RecognitionMedia-dev/CustomerIOService/appsettings.Production.json` under `CustomerIo.Event.SiteId` / `CustomerIo.Event.ApiKey`. Read them straight from that file into environment variables so the values never get typed, echoed, or committed anywhere in this repo:

```bash
CIO_CONFIG=/Users/stevework/claude-code/recognition-media/RecognitionMedia-dev/CustomerIOService/appsettings.Production.json
SITE_ID=$(node -e "console.log(require('$CIO_CONFIG').CustomerIo.Event.SiteId)")
API_KEY=$(node -e "console.log(require('$CIO_CONFIG').CustomerIo.Event.ApiKey)")

aws lambda update-function-configuration \
  --function-name webby-report-signups \
  --region us-east-1 \
  --environment "Variables={DYNAMODB_TABLE_NAME=webby-report-signups,CUSTOMERIO_SITE_ID=$SITE_ID,CUSTOMERIO_API_KEY=$API_KEY}"

unset SITE_ID API_KEY
```

- [ ] **Step 2: Verify the env vars were set (without printing the secret value)**

Run: `aws lambda get-function-configuration --function-name webby-report-signups --region us-east-1 --query 'Environment.Variables' --output json | python3 -c "import json,sys; d=json.load(sys.stdin); print(sorted(d.keys()))"`
Expected: `['CUSTOMERIO_API_KEY', 'CUSTOMERIO_SITE_ID', 'DYNAMODB_TABLE_NAME']`

---

### Task 8: Tag `ciofield` on the three live reports

**Files:**
- Create: `scripts/tag-cio-fields.mjs`

**Interfaces:**
- Consumes: `.env.local`'s `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN` (already present in this repo).

The three live reports (confirmed via a live Sanity query during planning) all use identical field labels: **First Name, Last Name, Email, Company, Job Title**. This script tags all three in one pass.

- [ ] **Step 1: Write the migration script**

Create `scripts/tag-cio-fields.mjs`:

```js
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
```

- [ ] **Step 2: Run it**

Run: `node scripts/tag-cio-fields.mjs`
Expected: `Tagged report-2025`, `Tagged a5f3c404-b760-4e1f-8499-4592a346835d`, `Tagged 82f6f241-2d89-4df6-b168-94b3d6040c99` (no `Failed to tag` or `No CIO mapping` lines, since all three reports share the same five labels).

- [ ] **Step 3: Verify the patch landed**

Run:
```bash
node -e '
const token = require("fs").readFileSync(".env.local","utf8").match(/SANITY_API_TOKEN=(.*)/)[1].trim();
fetch("https://za6m18kc.api.sanity.io/v2024-01-01/data/query/production?query=" + encodeURIComponent(`*[_type == "report" && status == "live"]{ title, "fields": formFields[]{label, ciofield} }`), {
  headers: { Authorization: "Bearer " + token }
}).then(r => r.json()).then(d => console.log(JSON.stringify(d.result, null, 2)))
'
```
Expected: each report's `fields` array shows `ciofield` set to `firstName`/`lastName`/`email`/`company`/`jobTitle` matching each label — none left as `undefined`.

- [ ] **Step 4: Commit**

```bash
git add scripts/tag-cio-fields.mjs
git commit -m "chore(signup): tag ciofield mapping on live reports"
```

---

### Task 9: End-to-end verification across all three properties

**Files:** none (manual verification only)

- [ ] **Step 1: Confirm Task 7 (env vars) and the Task 6 CI deploy have both landed**

Run: `aws lambda get-function-configuration --function-name webby-report-signups --region us-east-1 --query 'Environment.Variables.CUSTOMERIO_SITE_ID' --output text`
Expected: prints a non-empty site ID (not `None`).

Merge this plan's branch to `main` (or run `gh workflow run "Build and Deploy" --ref main` if merged already) and confirm the "Test and deploy signup Lambda" step succeeds in the Actions run: `gh run list --workflow="Build and Deploy" --limit 3`.

- [ ] **Step 2: Submit a real test signup on each live property**

Using a personal test email address, submit the signup form on:
- `https://reports.webbyawards.com/2026-awards-report` (webby, horizontal gate)
- `https://reports.anthemawards.com/2026-state-of-social-impact-report` (anthem, vertical gate)
- `https://reports.lovieawards.com/lovie-creative-hubs-mediterranean` (lovie, vertical gate)

For each, open the browser Network tab before submitting and confirm the `POST .../signup` request returns `200 { "success": true }` — this also confirms the Task 5 CORS fix actually resolved the previously-silent Anthem/Lovie failures.

- [ ] **Step 3: Confirm the person + event landed in Customer.io**

In Customer.io, search People by the test email used above. Confirm:
- The person has `property`, `consented: true`, and (where filled in) `first_name`/`last_name`/`company`/`job_title` attributes.
- A `report_signup` event exists on that person with `reportSlug`, `reportTitle`, and `property` matching what was submitted.

Repeat for all three test emails (one per property).

- [ ] **Step 4: Confirm Dynamo and the Studio "Signups" tool are unaffected**

Open the report's Sanity Studio at `/studio` → **Signups** tool. Confirm the three new test signups appear in the list (with `reportSlug` correct) and that **Export CSV** and **Delete** still work as before.

- [ ] **Step 5: Clean up test data**

Delete the three test signups via the Studio "Signups" tool's Delete button, and delete/suppress the three test people in Customer.io if your CIO plan counts profiles toward billing.
