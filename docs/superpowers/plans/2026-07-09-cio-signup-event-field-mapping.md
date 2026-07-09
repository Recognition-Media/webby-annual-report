# CIO Signup Event Field Mapping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename/add fields on the `report_signup` Customer.io event so it matches an existing CIO automation's field schema, per `docs/superpowers/specs/2026-07-09-cio-signup-event-field-mapping-design.md`.

**Architecture:** No new components. All Lambda-side changes are in `lambda/signup-handler/index.mjs` (pure functions `buildIdentifyPayload`/`buildEventPayload`, already unit-tested). One new Sanity field (`specifier`) is added to the `report` schema and threaded through `types.ts` → `queries.ts` → both `SignupGate.tsx` components → the Lambda's POST body.

**Tech Stack:** Node.js 22 Lambda (`node:test` for unit tests), Next.js 16 + TypeScript, Sanity schema (GROQ queries).

## Global Constraints

- Event name changes from `report_signup` to `form_submitted` — confirmed safe (nothing in Customer.io currently triggers off the old name).
- `zb_status` (ZeroBounce) is explicitly out of scope — do not add it in any form, not even as a placeholder.
- `propertyName` is a hardcoded lookup (`webby`→`"Webby Awards"`, `anthem`→`"Anthem Awards"`, `lovie`→`"Lovie Awards"`, `telly`→`"Telly Awards"`), not a new CMS field.
- `source` becomes the report's `reportTitle` value — no new field.
- `specifier` is genuinely new and must be a manually-editable Sanity field (cannot be derived).

---

### Task 1: Rename identify attribute keys to camelCase

**Files:**
- Modify: `lambda/signup-handler/index.mjs:38-53` (`buildIdentifyPayload`)
- Modify: `lambda/signup-handler/index.test.mjs:5-41` (two existing tests)

**Interfaces:**
- Consumes: nothing new — `cioIdentity.firstName`/`.lastName`/`.company` already exist (see `src/lib/cioIdentity.ts`).
- Produces: `buildIdentifyPayload(...)` now returns `attributes.firstName`/`.lastName`/`.organizationName` instead of `.first_name`/`.last_name`/`.company`. `job_title` and `property` keys are unchanged (out of scope for this rename).

- [ ] **Step 1: Update the existing tests to expect the new camelCase keys**

Edit `lambda/signup-handler/index.test.mjs` — replace the first two tests:

```js
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
      firstName: 'Jane',
      lastName: 'Doe',
      organizationName: 'Acme',
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

  assert.equal(payload.attributes.firstName, '')
  assert.equal(payload.attributes.lastName, '')
  assert.equal(payload.attributes.organizationName, '')
  assert.equal(payload.attributes.job_title, '')
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test lambda/signup-handler/`
Expected: The two edited tests FAIL (actual payload still has `first_name`/`last_name`/`company`, not the new keys). The other 3 tests in the file still pass.

- [ ] **Step 3: Rename the keys in `buildIdentifyPayload`**

In `lambda/signup-handler/index.mjs`, replace lines 38-53:

```js
export function buildIdentifyPayload({ cioIdentity, property, consented, consentedAt }) {
  return {
    type: 'person',
    identifiers: { email: cioIdentity.email },
    action: 'identify',
    attributes: {
      firstName: cioIdentity.firstName || '',
      lastName: cioIdentity.lastName || '',
      organizationName: cioIdentity.company || '',
      job_title: cioIdentity.jobTitle || '',
      property: property || '',
      consented: consented === true,
      consentedAt: consentedAt || '',
    },
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test lambda/signup-handler/`
Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lambda/signup-handler/index.mjs lambda/signup-handler/index.test.mjs
git commit -m "feat(signup): rename CIO identify attributes to camelCase"
```

---

### Task 2: Event rename, propertyName lookup, source/specifier passthrough

**Files:**
- Modify: `lambda/signup-handler/index.mjs:13-19` (add `PROPERTY_DISPLAY_NAMES` near `ALLOWED_ORIGINS`)
- Modify: `lambda/signup-handler/index.mjs:55-68` (`buildEventPayload`)
- Modify: `lambda/signup-handler/index.mjs:70-98` (`syncToCustomerIo`)
- Modify: `lambda/signup-handler/index.mjs:110-116` (`handler`'s POST branch)
- Modify: `lambda/signup-handler/index.test.mjs:43-63` (existing event test) + add 2 new tests

**Interfaces:**
- Consumes: `PROPERTY_DISPLAY_NAMES` (new const, this task) as a plain `Record<string,string>` lookup.
- Produces: `buildEventPayload({ cioIdentity, property, reportSlug, reportTitle, specifier })` — note the new `specifier` param. Returns `name: 'form_submitted'` and `attributes: { reportSlug, reportTitle, propertyName, source, specifier }` (no more bare `property` or hardcoded `source`). `syncToCustomerIo` and the `handler` both gain a `specifier` passthrough parameter.

- [ ] **Step 1: Update the existing event test and add two new tests**

Edit `lambda/signup-handler/index.test.mjs` — replace the `buildEventPayload` test (lines 43-63) with:

```js
test('buildEventPayload names the event form_submitted with propertyName, source, and specifier', () => {
  const payload = buildEventPayload({
    cioIdentity: { email: 'jane@example.com' },
    property: 'lovie',
    reportSlug: 'lovie-creative-hubs-mediterranean',
    reportTitle: 'The Lovie Awards Creative Hubs Series',
    specifier: 'Trend Report 2026',
  })

  assert.deepEqual(payload, {
    type: 'person',
    identifiers: { email: 'jane@example.com' },
    action: 'event',
    name: 'form_submitted',
    attributes: {
      reportSlug: 'lovie-creative-hubs-mediterranean',
      reportTitle: 'The Lovie Awards Creative Hubs Series',
      propertyName: 'Lovie Awards',
      source: 'The Lovie Awards Creative Hubs Series',
      specifier: 'Trend Report 2026',
    },
  })
})

test('buildEventPayload falls back to an empty propertyName for an unrecognized property', () => {
  const payload = buildEventPayload({
    cioIdentity: { email: 'jane@example.com' },
    property: 'not-a-real-property',
    reportSlug: 'some-slug',
    reportTitle: 'Some Report',
  })

  assert.equal(payload.attributes.propertyName, '')
})

test('buildEventPayload defaults specifier to an empty string when omitted', () => {
  const payload = buildEventPayload({
    cioIdentity: { email: 'jane@example.com' },
    property: 'webby',
    reportSlug: 'some-slug',
    reportTitle: 'Some Report',
  })

  assert.equal(payload.attributes.specifier, '')
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test lambda/signup-handler/`
Expected: The 3 event-related tests FAIL (`buildEventPayload` doesn't accept/emit `propertyName`, `specifier`, or `form_submitted` yet). The 4 identify/CORS tests from Task 1 still pass.

- [ ] **Step 3: Implement the changes**

In `lambda/signup-handler/index.mjs`, add after line 19 (`ALLOWED_ORIGINS` closing bracket):

```js

const PROPERTY_DISPLAY_NAMES = {
  webby: 'Webby Awards',
  anthem: 'Anthem Awards',
  lovie: 'Lovie Awards',
  telly: 'Telly Awards',
}
```

Replace `buildEventPayload` (lines 55-68):

```js
export function buildEventPayload({ cioIdentity, property, reportSlug, reportTitle, specifier }) {
  return {
    type: 'person',
    identifiers: { email: cioIdentity.email },
    action: 'event',
    name: 'form_submitted',
    attributes: {
      reportSlug: reportSlug || '',
      reportTitle: reportTitle || '',
      propertyName: PROPERTY_DISPLAY_NAMES[property] || '',
      source: reportTitle || '',
      specifier: specifier || '',
    },
  }
}
```

Replace `syncToCustomerIo`'s signature and its `buildEventPayload` call (lines 70 and 81):

```js
export async function syncToCustomerIo({ cioIdentity, property, reportSlug, reportTitle, consented, consentedAt, specifier }) {
```

```js
    buildEventPayload({ cioIdentity, property, reportSlug, reportTitle, specifier }),
```

In the `handler`'s POST branch, update the destructure (line 112) and the `syncToCustomerIo` call (line 132):

```js
      const { reportSlug, reportTitle, property, formData, cioIdentity, consented, consentedAt, specifier } = body
```

```js
      await syncToCustomerIo({ cioIdentity, property, reportSlug, reportTitle, consented, consentedAt, specifier })
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test lambda/signup-handler/`
Expected: All 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lambda/signup-handler/index.mjs lambda/signup-handler/index.test.mjs
git commit -m "feat(signup): rename CIO event to form_submitted, add propertyName/specifier"
```

---

### Task 3: Add the `specifier` CMS field (schema, type, query)

**Files:**
- Modify: `src/sanity/schemas/report.ts:157` (after the `successMessage` field)
- Modify: `src/sanity/types.ts:205` (after `successMessage?: string`)
- Modify: `src/sanity/queries.ts:100` (after `successMessage,`)

**Interfaces:**
- Produces: `Report.specifier?: string`, fetched by `reportBySlugQuery`, editable in Studio under the "Signup Form" tab group. Consumed by Task 4.

- [ ] **Step 1: Add the field to the Sanity schema**

In `src/sanity/schemas/report.ts`, after line 157 (`{ name: 'successMessage', ... }`), add:

```js
    { name: 'specifier', title: 'CIO Specifier', type: 'string', group: 'signup', description: 'e.g. "Trend Report 2026" — sent to Customer.io on signup as the `specifier` event attribute. Set manually per report.' },
```

- [ ] **Step 2: Add the field to the TypeScript type**

In `src/sanity/types.ts`, after line 205 (`successMessage?: string`), add:

```ts
  specifier?: string
```

- [ ] **Step 3: Add the field to the GROQ query**

In `src/sanity/queries.ts`, after line 100 (`successMessage,`), add:

```
    specifier,
```

- [ ] **Step 4: Verify with a build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors (there's no separate typecheck script in this repo — `next build` type-checks as part of the build).

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemas/report.ts src/sanity/types.ts src/sanity/queries.ts
git commit -m "feat(signup): add specifier field to report schema"
```

---

### Task 4: Thread `specifier` through both SignupGate components

**Files:**
- Modify: `src/components/SignupGate.tsx:73-81`
- Modify: `src/components/vertical/SignupGate.tsx:110-118`

**Interfaces:**
- Consumes: `Report.specifier` (from Task 3).
- Produces: both components' POST body now includes `specifier`, matching the Lambda's `handler` destructure from Task 2.

- [ ] **Step 1: Update the root SignupGate's POST body**

In `src/components/SignupGate.tsx`, replace lines 73-81:

```tsx
        body: JSON.stringify({
          reportSlug: report.slug.current,
          reportTitle: report.title,
          property: report.property || 'webby',
          formData,
          cioIdentity: buildCioIdentity(fields, formData),
          consented,
          consentedAt: new Date().toISOString(),
          specifier: report.specifier,
        }),
```

- [ ] **Step 2: Update the vertical SignupGate's POST body**

In `src/components/vertical/SignupGate.tsx`, replace lines 110-118:

```tsx
        body: JSON.stringify({
          reportSlug: report.slug.current,
          reportTitle: report.title,
          property: report.property || 'anthem',
          formData,
          cioIdentity: buildCioIdentity(fields, formData),
          consented,
          consentedAt: new Date().toISOString(),
          specifier: report.specifier,
        }),
```

- [ ] **Step 3: Verify with a build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/SignupGate.tsx src/components/vertical/SignupGate.tsx
git commit -m "feat(signup): send specifier to the signup API"
```

---

### Task 5: End-to-end verification after merge/deploy

This task runs after the branch is merged to `main` and the `Build and Deploy` workflow has redeployed the Lambda (same deploy step used in Task 2's precursor — pushing to `main` runs `node --test lambda/signup-handler/` then `aws lambda update-function-code`).

**Files:** none — verification only, mirrors the method used to confirm the 2026-07-09 CORS fix.

- [ ] **Step 1: Confirm the deploy ran and redeployed the Lambda**

Run: `gh run list --limit 3`
Expected: A `Build and Deploy` run on `main` with `conclusion: success`, timestamped after the merge.

- [ ] **Step 2: Set a specifier value on one live report in Studio**

At `https://reports.webbyawards.com/studio`, open a live report (e.g. the Lovie report used in prior testing), set the new "CIO Specifier" field to a test value (e.g. `"Trend Report 2026"`), and publish. Confirm the Sanity publish webhook triggers a rebuild (`gh run list --limit 3` shows a new `repository_dispatch` / `sanity-publish` run).

- [ ] **Step 3: Submit a real signup on that report's live URL**

Manually submit the signup form on the report's live page (same as the CORS-fix verification in this conversation).

- [ ] **Step 4: Confirm the Dynamo write still happens**

```bash
export AWS_REGION=us-east-1
aws dynamodb scan --table-name webby-report-signups --filter-expression "begins_with(#ts, :today)" --expression-attribute-names '{"#ts":"timestamp"}' --expression-attribute-values '{":today":{"S":"<TODAYS-DATE>"}}' --output json
```
Expected: A new item, with the same shape as before (`specifier` is CIO-only, not stored in Dynamo — its absence from the Dynamo item is correct, not a bug).

- [ ] **Step 5: Confirm no Customer.io sync errors**

```bash
aws logs filter-log-events --log-group-name /aws/lambda/webby-report-signups --start-time <MS-EPOCH-OF-SUBMISSION> --filter-pattern "Customer.io"
```
Expected: No matching log lines (the Lambda only logs on CIO sync failure).

- [ ] **Step 6: Confirm the event shows up correctly in Customer.io**

In the Customer.io UI, find the test contact's activity feed and confirm a `form_submitted` event exists with `propertyName`, `source`, and `specifier` attributes matching what was submitted.

- [ ] **Step 7: Clean up test data**

Delete the test Dynamo item (`aws dynamodb delete-item ...`, same pattern used for the CORS-fix test cleanup) and note the test contact created in Customer.io (can't be deleted via this CLI — same caveat as the CORS-fix test).
