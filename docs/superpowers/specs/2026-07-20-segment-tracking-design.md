# Segment tracking for annual reports

**Date:** 2026-07-20
**Status:** Approved, ready for planning

## Context

The RM Segment tracking plan (internal Google Doc, "Segment Tracking Plan - Webby Awards") defines an org-wide event schema — `identify`, `page`, and `track` events like `lead_created`, `entry_started`, `checkout_*` — but it's written for the core platform (marketing site, entries, winners gallery, store, nominee site, vote), not for this report site. None of the entry/checkout events apply here; this app has no entry or checkout flow. What transfers is the general shape (common context fields, `identify`, `track`) and the naming convention, not the specific event catalog.

The ask: get this report site sending data to Segment, using the tracking plan as a style reference rather than a literal spec.

## Decisions made during discovery

- **One Segment source per property, not per report.** Created three Website (Analytics.js) sources in the `recognition_media` Segment workspace, matching the existing `{Property} - {Domain}` naming convention already used for other sources (`Anthem - Entries`, `Anthem - Marketing`, etc.):
  - `Webby - Reports` — write key `3DqN0Wu9DLAbm1i2bFzFHzUdJT9uG4nl`, website URL `https://reports.webbyawards.com`
  - `Anthem - Reports` — write key `mvqmorbUdDGfWEEARiq7UUjHONsN01HA`, website URL `https://reports.anthemawards.com`
  - `Lovie - Reports` — write key `zcpCdreZloq7pnyGmbV65m88wXT8FJTW`, website URL `https://reports.lovieawards.com`

  Telly has no live report yet, so no source was created for it.

- **Write key lives in the existing per-report Analytics CMS field pattern**, not a per-property lookup table in code. `gaTrackingId`, `facebookPixelId`, and `googleAdsId` are already per-report fields in the Analytics tab (`src/sanity/schemas/report.ts`) even though in practice all reports for a property share the same value — editors already re-paste the same GA ID into every new report for a property. `segmentWriteKey` follows that exact convention for consistency, rather than introducing a new property→key lookup that would be the only field of its kind.

- **Client-side Website source, not server-side.** Segment write keys are meant to be public (unlike the Customer.io API key, which had to move server-side into the Lambda specifically to avoid shipping it to the browser). This lets Segment load the same way GA/FB Pixel/Google Ads already do in `AnalyticsScripts.tsx` — no Lambda changes needed.

- **Reuse the tracking plan's own vocabulary where it fits.** The plan defines `lead_created` with a `source` property whose values include `gated_content`. The report site's signup gate is exactly that case, so v1 fires `identify()` + `track('lead_created', { source: 'gated_content' })` instead of inventing new event names.

- **v1 scope is cross-sell CTAs only, not the full interaction inventory.** A codebase scan found ~15 trackable interactions (video plays, outbound credential-card links, in-report nav arrows, footer social links, etc.). Building all of them in one pass is unnecessarily large scope for a first ship. v1 covers only the highest-value signal — the "Enter Now" / "Enter Your Work" CTAs that link out to the entry site, which is the most direct report→entry conversion measurement. Video engagement, outbound links, and in-report nav are explicitly deferred to a later pass.

## Architecture

Four independent pieces, each additive to existing patterns:

1. **Schema field** — `segmentWriteKey` string field in the `analytics` group.
2. **Snippet + page view** — one more conditional block in `AnalyticsScripts.tsx`, gated on the field being set.
3. **identify + lead_created** — added to the existing signup-gate submit handlers, alongside the existing Customer.io POST.
4. **cta_clicked** — a small tracking helper, called from the 4 existing CTA click sites.

No new routes, no Lambda changes, no new Sanity document types.

## Implementation

### 1. Schema (`src/sanity/schemas/report.ts`)

Add to the `analytics` group, next to the existing three fields (currently lines 161-163):

```ts
{ name: 'segmentWriteKey', title: 'Segment Write Key', type: 'string', group: 'analytics' },
```

Add `segmentWriteKey` to the `Report` type in `src/sanity/types.ts` and to the relevant GROQ projections in `src/sanity/queries.ts` (`reportBySlugQuery` and any other query that currently selects `gaTrackingId`/`facebookPixelId`/`googleAdsId`), following the exact pattern those three fields already use in both files.

### 2. Snippet + page view (`src/components/AnalyticsScripts.tsx`)

Add a fourth block after the existing GA/FB Pixel/Google Ads blocks (currently ending at line 58), gated on `report.segmentWriteKey`:

```tsx
{report.segmentWriteKey && (
  <Script id="segment-init" strategy="afterInteractive">
    {`
      !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="${report.segmentWriteKey}";analytics.SNIPPET_VERSION="4.16.1";
      analytics.load("${report.segmentWriteKey}");
      analytics.page();
      }}();
    `}
  </Script>
)}
```

This is Segment's standard, unmodified analytics.js snippet (the stub queues `identify`/`track`/`page` calls made before the real library finishes loading, so no race-condition handling is needed elsewhere in the app) with one added `analytics.page()` call so a page view fires automatically per report load.

### 3. identify + lead_created

In `src/components/SignupGate.tsx` (`handleSubmit`, currently lines 64-92) and `src/components/vertical/SignupGate.tsx` (same shape, `trackSignupConversion()` call at line 122), `buildCioIdentity(fields, formData)` is already computed inline as part of the POST body and returns exactly `{ email, firstName?, lastName?, company?, jobTitle? }` (see `src/lib/cioIdentity.ts`) — the same shape Segment traits need. Pull it into a local first so both the POST body and the new Segment calls reuse the one computed value:

```ts
const cioIdentity = buildCioIdentity(fields, formData)

await fetch(`${process.env.NEXT_PUBLIC_SIGNUP_API_URL}/signup`, {
  // ...existing body, using `cioIdentity` instead of the inline call...
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
```

`organizationName` (not `company`) matches the camelCase trait convention the Customer.io field-mapping realignment already established for this project (see the 2026-07-09 CIO event field-mapping memory/spec) — keep the two integrations' naming consistent.

Add `analytics?: { identify: (...args: unknown[]) => void; track: (...args: unknown[]) => void; page: (...args: unknown[]) => void }` to the `Window` interface declared in `src/lib/analytics.ts` (next to the existing `fbq`/`gtag` declarations), so both files get proper typing instead of `any`.

### 4. cta_clicked

Add to `src/lib/analytics.ts`:

```ts
export function trackCtaClick(location: string, destinationUrl: string, property?: string, reportSlug?: string) {
  if (typeof window === 'undefined') return
  window.analytics?.track('cta_clicked', {
    cta_location: location,
    destination_url: destinationUrl,
    property,
    report_slug: reportSlug,
  })
}
```

Call it via `onClick` at the 4 existing CTA sites (all currently plain `<a target="_blank">` — add `onClick` without changing markup or navigation behavior):

- `src/components/vertical/HeroSection.tsx:256` (desktop "Enter Now" pill) and `:322` (mobile menu "Enter Now") — `cta_location: 'header'`
- `src/components/vertical/AnthemFooter.tsx:251` and `src/components/vertical/LovieFooter.tsx:156` ("Enter Your Work") — `cta_location: 'footer'`
- `src/components/horizontal/ReportView.tsx:341` (Thank You "Learn More" card) — `cta_location: 'thank_you_learn_more'`
- `src/components/horizontal/ReportView.tsx:349` (Thank You "Get in Touch" card) — `cta_location: 'thank_you_get_in_touch'`

## Deferred to a later pass

Found during the codebase scan, explicitly out of scope for this spec:
- Video engagement (`QuoteVideoSection.tsx`, `TrendSection.tsx`'s video lightbox, `LovieTrendContent.tsx`) — play/pause/complete
- Outbound link clicks — IADAS/auditor credential cards (`IadasSection.tsx`), "Standout Projects" links (`TrendSection.tsx`), footer social/utility links (`ReportFooter.tsx`), quoted-expert LinkedIn links
- In-report navigation — subnav/carousel arrows (`TrendSubnav.tsx`, `IdleArrows.tsx`), anchor jumps (`KeyFindings.tsx`), the Anthem bottom-nav "Home" button

## Testing

No existing test suite covers this repo's components (matches this project's existing testing posture — verification elsewhere in this repo is manual). Verify manually per template (Webby/horizontal and one of Anthem or Lovie/vertical):

1. Set `segmentWriteKey` on a test report in Studio, rebuild/run `npm run dev`, confirm the Segment snippet loads (Network tab) and a `page` call appears in that source's **Debugger** tab in app.segment.com within a few seconds.
2. Submit the signup gate — confirm an `identify` call (with the submitted traits) and a `lead_created` track call (with `source: gated_content`) both appear in the Debugger, and confirm the existing Customer.io sync still fires unaffected (no regression).
3. Click each of the 4 CTA sites — confirm a `cta_clicked` event appears in the Debugger with the correct `cta_location` for each, and confirm the link still navigates normally (`target="_blank"`, new tab opens).
4. Confirm no Segment code loads at all on a report with `segmentWriteKey` left blank (existing GA/FB Pixel gating pattern — no regression).
