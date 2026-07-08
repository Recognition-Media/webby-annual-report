# Connect report signup forms to Customer.io

**Date:** 2026-07-08
**Status:** Approved, ready for planning

## Context

`reports.webbyawards.com`, `reports.anthemawards.com`, and `reports.lovieawards.com` each gate their annual report behind a signup form (`SignupGate.tsx` for the horizontal/Webby template, `vertical/SignupGate.tsx` for Anthem/Lovie). Both POST `{ reportSlug, formData }` to a shared Lambda (`webby-report-signups`, legacy AWS account `495412489254`) which writes to a DynamoDB table. That table is the only place signups live today — the Sanity Studio's "Signups" tool reads/exports/deletes directly against it.

Goal: get these signups into Customer.io so RM can market to report downloaders, without breaking the existing Dynamo-backed Studio tool.

## Decisions made during discovery

- **One shared Customer.io connection, not one per report/property.** RM's platform (`CustomerIOService` in `RecognitionMedia-dev`) already runs all properties through a single CIO workspace, differentiated by a `propertyName` attribute (see `PropertyHelper.cs`). This work follows that precedent rather than provisioning per-property CIO accounts.
- **Reuse existing prod Track/Event API credentials** (`CustomerIo:Event:SiteId` / `ApiKey` in `RecognitionMedia-dev/CustomerIOService/appsettings.Production.json`), which target the US Track endpoint (`track.customer.io`) — consistent with the `RegionUS` config `mail-automation` uses for its Node CIO client. This is a different credential from the CIO **App API** token (`CUSTOMER_IO_API_KEY` in `mail-automation`, used for transactional sends) — do not confuse the two.
- **Keep DynamoDB.** The Studio "Signups" tool (`src/sanity/plugins/signupExport.tsx`) reads/CSV-exports/deletes straight from Dynamo via the Lambda's `GET/DELETE /signup(s)` routes. CIO is additive, not a replacement.
- **New dedicated `report_signup` CIO event**, not a reuse of the platform's existing `subscriptions` event — keeps report downloads distinguishable from newsletter opt-ins for segmentation.
- **Add a required consent checkbox** to both SignupGate components, matching the pattern on `webbyawards.com/events-and-insights/2025-webby-awards-indexes/` (mandatory "I agree to the Privacy Policy" checkbox) — stronger compliance posture now that submissions feed a live marketing platform.
- **Version the Lambda in git** and automate its deploy. It currently has no source control (deployed as a bare zip). Bring it into this repo and extend the existing GitHub Actions deploy workflow.

## Bug found during discovery

The Lambda's CORS allow-list (`ALLOWED_ORIGINS` in `index.mjs`) only contains `reports.webbyawards.com` — `reports.anthemawards.com` and `reports.lovieawards.com` are missing. Since `SignupGate.tsx`'s fetch call is wrapped in `.catch(() => {})`, a CORS-blocked request fails silently in the UI (the gate still closes, `onComplete()` still fires) while the actual signup is dropped by the browser before it reaches the Lambda. **Anthem and Lovie report signups have likely never been recorded.** Fixing this allow-list is in scope for this change since it's required for Anthem/Lovie signups to reach either Dynamo or Customer.io going forward.

## Architecture

```
SignupGate.tsx (horizontal)  ─┐
                               ├─▶ POST /signup ─▶ Lambda (webby-report-signups) ─┬─▶ DynamoDB (unchanged)
vertical/SignupGate.tsx       ─┘                                                  └─▶ Customer.io Track API
(Anthem/Lovie)                                                                        (identify + report_signup event)
```

The Lambda remains the single integration point (all three properties already funnel through it). No client-side code talks to Customer.io directly — the report site is a static export with no server runtime, so CIO credentials cannot live in the browser.

On `POST /signup`, in addition to the existing Dynamo `PutCommand`, the Lambda:

1. **Identifies** the person — `PUT https://track.customer.io/api/v2/entity`, `type: person`, `action: identify`, `identifiers: { email }`, `attributes: { first_name, last_name, company, job_title, property, consented, consentedAt }`. Basic Auth via `base64(CUSTOMERIO_SITE_ID:CUSTOMERIO_API_KEY)`.
2. **Tracks** a `report_signup` event on that person — `action: event`, `name: report_signup`, `attributes: { reportSlug, reportTitle, property, source: "report-gate" }`.

Both calls only fire if the submission includes an email (see below). Failures are logged, not surfaced to the user, and never block the Dynamo write or the gate closing — Customer.io sync is best-effort, Dynamo stays the source of truth for the Studio tool.

## Data mapping: form fields → CIO attributes

Today `Report.formFields` (`src/sanity/schemas/objects/formField.ts`) is pure CMS content: a free-text `label` and a `fieldType` (`text | email | url | dropdown`), with nothing machine-readable to key off of. Add one new optional field to the `formField` schema object:

- **`ciofield`** — select: `(none) | email | firstName | lastName | company | jobTitle`. Defaults to none. Tells the client which CIO attribute this field's answer feeds.
- Fields left unmapped still get stored in Dynamo exactly as today (keyed by label); they just don't map to a named CIO attribute.
- The two live reports (2026 Awards Report, 2026 State of Social Impact Report) get their existing fields tagged via the Sanity API as part of implementation — this is not a manual content-editor step for the initial rollout.

**The mapping happens client-side, not in the Lambda.** The Lambda only ever receives `reportSlug` and `formData` — it has no access to Sanity, so it can't itself resolve which free-text label means "email" for a given report. `SignupGate.tsx` already holds the `FormField[]` (with the new `ciofield`) at submit time, so it builds the CIO payload directly from that mapping and sends it alongside the existing raw form data:

```ts
POST /signup
{
  reportSlug: string,
  property: 'webby' | 'anthem' | 'lovie',
  formData: Record<string, string>,     // unchanged — keyed by label, feeds Dynamo/Studio export as today
  cioIdentity: {                        // new — built client-side from ciofield mapping; omitted if no field maps to email
    email: string,
    firstName?: string,
    lastName?: string,
    company?: string,
    jobTitle?: string,
  },
  consented: true,
  consentedAt: string,                  // ISO timestamp
}
```

If `cioIdentity` is absent (no field mapped to `email`) or `cioIdentity.email` is empty, the Lambda skips both Customer.io calls and logs a warning — Dynamo write still happens with `formData` as always. `property` is included so the Lambda can tag the CIO calls — currently `report.property` is available client-side (already used for the vertical gate's theming) but isn't sent to the Lambda today.

## Consent UI

Both `SignupGate.tsx` and `vertical/SignupGate.tsx` get a required checkbox above the submit button:

> "I agree to the [Privacy Policy] and consent to receive communications from [Webby / Anthem / Lovie] Awards."

- Submit button stays disabled until checked (mirrors the reference page's mandatory-checkbox pattern).
- The privacy-policy link and property name in the copy are theme-driven — the vertical gate's `GATE_THEMES` map already carries a `privacyUrl`/`privacyName` per property; the same needs adding to the horizontal (Webby) gate, which currently hardcodes its privacy link inline.
- On submit, `consented: true` and a `consentedAt` timestamp are included in both the Dynamo item and the CIO identify call, as an audit trail.

## Deployment

- **Lambda source moves into this repo** at `lambda/signup-handler/index.mjs`. The Customer.io call uses a plain `fetch()` — no new dependency — consistent with the Lambda's current zero-`node_modules` style (it already relies on the AWS SDK v3 built into the Node 22 Lambda runtime rather than bundling one).
- **New Lambda env vars**, set via `aws lambda update-function-configuration` (not committed to git, same trust model as the existing `DYNAMODB_TABLE_NAME` var): `CUSTOMERIO_SITE_ID`, `CUSTOMERIO_API_KEY` — the existing prod Track API credentials, pulled from `CustomerIOService`'s `appsettings.Production.json`. These are **not** the App API token `mail-automation` uses.
- **CI:** extend `.github/workflows/deploy.yml` with a step, triggered on changes under `lambda/**`, that zips `index.mjs` and runs `aws lambda update-function-code --function-name webby-report-signups`, reusing the AWS credentials the workflow already has for the S3/CloudFront deploy.
- **CORS fix:** add `https://reports.anthemawards.com` and `https://reports.lovieawards.com` to `ALLOWED_ORIGINS`.

## Rollout order

1. Write and locally test the Lambda change (`aws lambda invoke` with a sample payload) before wiring into CI.
2. Tag `ciofield` on the two live reports' form fields via the Sanity API.
3. Deploy the Lambda (CORS fix + CIO calls) and the site changes (consent checkbox, `property` added to the POST body).
4. Submit a real test signup on each of the three properties with a personal email; confirm the person and `report_signup` event appear correctly in Customer.io, and confirm the Studio "Signups" tool and Dynamo writes are unaffected.

## Out of scope

- Building the actual Customer.io campaigns/journeys that act on the `report_signup` event or the person attributes — this spec only gets the data into CIO.
- A per-report toggle to opt a specific report out of CIO sync. Not needed today; easy to add later as a boolean on the Report schema if a report ever needs to stay Dynamo-only.
- Migrating the App API / transactional-email side of things — unrelated to this signup-capture flow.
