# Align report-signup Customer.io event with existing CIO schema

**Date:** 2026-07-09
**Status:** Approved, ready for planning

## Context

The report-signup → Customer.io integration shipped 2026-07-08 (PR #18, #19) and was confirmed working end-to-end for all three properties on 2026-07-09 after a same-day CORS fix (API Gateway `ay30bonstf`'s `CorsConfiguration` was missing `reports.anthemawards.com`/`reports.lovieawards.com`, so real browser submissions from those domains never reached the Lambda — fixed via `aws apigatewayv2 update-api`).

A colleague reviewing the new `report_signup` CIO event asked for changes so it lines up with the field names/shape used by another, already-running CIO automation, to minimize the rework needed on his side:

- `first_name` / `last_name` / `company` (snake_case, `identify` attributes) → colleague's reference uses `firstName` / `lastName` / `organizationName` (camelCase)
- No `propertyName` attribute exists today — only the raw `property` slug (`webby`/`anthem`/`lovie`/`telly`). His trigger logic keys off a display name like `"Anthem Awards"`.
- `source` is currently hardcoded to the literal `'report-gate'` for every submission. He wants it to carry the report's name instead.
- `specifier` doesn't exist today. It's a free-text label (e.g. `"Trend Report 2026"`) that can't be derived — needs to be a new manually-set field per report.
- Event name `report_signup` should become `form_submitted` (his existing automation's expected event name). Confirmed safe: nothing in Customer.io currently triggers off `report_signup`.
- `zb_status` (a ZeroBounce email-validation status field also present in his reference schema) is explicitly **out of scope** for this change — a future integration, not a rename/passthrough.

## Decisions made during discovery

- **`propertyName` is a hardcoded lookup, not a new CMS field.** `property` is already a closed 4-value enum (`webby`/`anthem`/`telly`/`lovie`) that rarely changes. A static map avoids editors typing inconsistent variants ("Lovie Award" vs "Lovie Awards") and keeps the mapping in one place, next to the Lambda's existing `ALLOWED_ORIGINS` const.
- **`source` reuses the existing `reportTitle` value.** No new field, no new client wiring — `reportTitle` already flows into the Lambda's payload today; only the value assigned to `source` changes.
- **`specifier` is a new Sanity field**, since it genuinely can't be derived from anything that exists. It lives in the report schema's existing `signup` field group (alongside `signupTitle`, `formFields`, etc.) since it's set at signup-config time and only used by the signup → CIO flow.
- **All of the renames (`firstName`/`lastName`/`organizationName`) are Lambda-only.** `src/lib/cioIdentity.ts` already builds `{ email, firstName, lastName, company, jobTitle }` client-side in camelCase — only the *output* attribute keys in `buildIdentifyPayload` change; no client change needed for those three fields.
- **Event rename (`report_signup` → `form_submitted`) proceeds** — confirmed with the user that no existing Customer.io campaign/segment/journey depends on the old name.
- **`zb_status` is not added in any form** (not even as an empty placeholder) — deferred to a future change that actually integrates a validation provider.

## Architecture

No architecture change — this is a data-shape change inside the existing pipeline:

```
SignupGate.tsx (horizontal)  ─┐
                               ├─▶ POST /signup ─▶ Lambda (webby-report-signups) ─┬─▶ DynamoDB (unchanged)
vertical/SignupGate.tsx       ─┘         ▲                                        └─▶ Customer.io Track API
(Anthem/Lovie)                           │                                            (identify + form_submitted event)
                                          │
                              report.specifier (new CMS field, threaded through the POST body)
```

## Changes

### 1. Lambda (`lambda/signup-handler/index.mjs`)

- Add a `PROPERTY_DISPLAY_NAMES` const colocated with `ALLOWED_ORIGINS`:
  ```js
  const PROPERTY_DISPLAY_NAMES = {
    webby: 'Webby Awards',
    anthem: 'Anthem Awards',
    lovie: 'Lovie Awards',
    telly: 'Telly Awards',
  }
  ```
- `buildIdentifyPayload`: rename output attribute keys — `first_name`→`firstName`, `last_name`→`lastName`, `company`→`organizationName`. Values unchanged (`cioIdentity.firstName`, `cioIdentity.lastName`, `cioIdentity.company` already exist in that shape).
- `buildEventPayload`:
  - `name: 'report_signup'` → `name: 'form_submitted'`
  - add `propertyName: PROPERTY_DISPLAY_NAMES[property] || ''`
  - `source: 'report-gate'` → `source: reportTitle || ''`
  - add `specifier: specifier || ''` (new parameter)
- `handler`: destructure `specifier` from the parsed POST body (alongside `reportSlug`, `reportTitle`, `property`, `formData`, `cioIdentity`, `consented`, `consentedAt`) and pass it into `syncToCustomerIo` → `buildEventPayload`. Not required for the Dynamo `PutCommand` — `specifier` is CIO-only, not stored in Dynamo.

### 2. Sanity schema (`src/sanity/schemas/report.ts`)

- Add to the `signup` field group:
  ```js
  { name: 'specifier', title: 'CIO Specifier', type: 'string', group: 'signup',
    description: 'e.g. "Trend Report 2026" — sent to Customer.io on signup as the `specifier` event attribute. Set manually per report.' }
  ```

### 3. Types + query (`src/sanity/types.ts`, `src/sanity/queries.ts`)

- Add `specifier?: string` to the `Report` type, next to `successMessage`.
- Add `specifier` to the field list in `reportBySlugQuery`, next to `successMessage`.

### 4. Client (`src/components/vertical/SignupGate.tsx`, `src/components/SignupGate.tsx`)

- Add `specifier: report.specifier` to the existing `fetch` POST body, alongside `reportSlug`/`reportTitle`/`property`/`formData`/`cioIdentity`/`consented`/`consentedAt`. No other client change.

## Testing

- Extend `lambda/signup-handler/index.test.mjs` (runs in CI via `node --test`, gates the deploy) to cover:
  - `buildEventPayload` emits `name: 'form_submitted'`
  - `propertyName` resolves correctly for all four known properties, and falls back to `''` for an unrecognized property value
  - `source` equals the passed-in `reportTitle`, not a hardcoded string
  - `specifier` passes through unchanged; defaults to `''` when omitted
  - `buildIdentifyPayload` emits `firstName`/`lastName`/`organizationName` keys, not the old snake_case ones
- Manual end-to-end (same method used to verify the CORS fix): POST a real submission per property with a test `specifier` value, confirm the Dynamo item still writes correctly (unaffected — `specifier` isn't stored there), and check CloudWatch logs for no Customer.io sync errors. Clean up test records from Dynamo afterward.
- One real browser submission per property (webby/anthem/lovie) post-deploy, same as the CORS-fix verification, to confirm the new event shows up correctly in Customer.io's activity feed with the new field names.
