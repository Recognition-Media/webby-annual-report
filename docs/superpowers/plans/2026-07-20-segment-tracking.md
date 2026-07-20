# Segment Tracking for Annual Reports Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send Segment analytics from the report site — a per-report CMS-configured write key, automatic page views, an `identify` + `lead_created` event on signup gate submit, and a `cta_clicked` event on the 4 entry-site cross-sell CTAs.

**Architecture:** Four additive pieces layered onto existing patterns: a new Sanity schema field (`segmentWriteKey`), a new conditional block in the existing `AnalyticsScripts.tsx` component (same pattern as GA/FB Pixel/Google Ads), two new `window.analytics` calls added to the existing signup-gate submit handlers, and a new small tracking helper wired into 4 existing CTA `<a>` tags via `onClick`.

**Tech Stack:** Next.js 16 (static export), Sanity CMS, Segment analytics.js (client-side snippet, no new npm dependency).

## Global Constraints

- No new npm dependencies — Segment loads via the standard CDN snippet, not an installed package.
- This repo has no test framework (`package.json` has no jest/vitest/testing-library) — verification is `npm run lint`, `npm run build`, and manual browser checks against each Segment source's **Debugger** tab, not automated tests.
- Reports without `segmentWriteKey` set must load zero Segment code — same gating convention as `gaTrackingId`/`facebookPixelId`/`googleAdsId` in `src/components/AnalyticsScripts.tsx`.
- Segment traits use camelCase (`organizationName`, not `company`) to match the existing Customer.io field-mapping convention in this project.
- Existing CTA `<a>` markup, `target="_blank"`, and navigation behavior must not change — only `onClick` handlers are added.
- Write keys already exist and are public-safe to hardcode directly into CMS content (not secrets): `Webby - Reports` = `3DqN0Wu9DLAbm1i2bFzFHzUdJT9uG4nl`, `Anthem - Reports` = `mvqmorbUdDGfWEEARiq7UUjHONsN01HA`, `Lovie - Reports` = `zcpCdreZloq7pnyGmbV65m88wXT8FJTW`.

---

## Task 1: Add `segmentWriteKey` schema field, type, and query projection

**Files:**
- Modify: `src/sanity/schemas/report.ts:161-163`
- Modify: `src/sanity/types.ts:207-209`
- Modify: `src/sanity/queries.ts:102-104`

**Interfaces:**
- Produces: `Report.segmentWriteKey?: string` — consumed by Task 2 (`AnalyticsScripts.tsx`) as `report.segmentWriteKey`.

- [ ] **Step 1: Add the field to the Sanity schema**

In `src/sanity/schemas/report.ts`, find the Analytics group fields (currently lines 160-163):

```ts
    // Analytics
    { name: 'gaTrackingId', title: 'GA Tracking ID', type: 'string', group: 'analytics' },
    { name: 'facebookPixelId', title: 'Facebook Pixel ID', type: 'string', group: 'analytics' },
    { name: 'googleAdsId', title: 'Google Ads ID', type: 'string', group: 'analytics' },
```

Replace with:

```ts
    // Analytics
    { name: 'gaTrackingId', title: 'GA Tracking ID', type: 'string', group: 'analytics' },
    { name: 'facebookPixelId', title: 'Facebook Pixel ID', type: 'string', group: 'analytics' },
    { name: 'googleAdsId', title: 'Google Ads ID', type: 'string', group: 'analytics' },
    { name: 'segmentWriteKey', title: 'Segment Write Key', type: 'string', group: 'analytics', description: 'Website (Analytics.js) source write key from app.segment.com. Same key for every report under this property.' },
```

- [ ] **Step 2: Add the field to the TypeScript type**

In `src/sanity/types.ts`, find (currently lines 207-209):

```ts
  gaTrackingId?: string
  facebookPixelId?: string
  googleAdsId?: string
```

Replace with:

```ts
  gaTrackingId?: string
  facebookPixelId?: string
  googleAdsId?: string
  segmentWriteKey?: string
```

- [ ] **Step 3: Add the field to the GROQ query projection**

In `src/sanity/queries.ts`, find inside `reportBySlugQuery` (currently lines 102-104):

```
    gaTrackingId,
    facebookPixelId,
    googleAdsId,
```

Replace with:

```
    gaTrackingId,
    facebookPixelId,
    googleAdsId,
    segmentWriteKey,
```

- [ ] **Step 4: Verify types and lint pass**

Run: `npm run lint`
Expected: no errors (this repo has no separate `tsc --noEmit` script; `next build` in Task 4 will be the full type-check gate — lint should still pass cleanly here since no logic changed, only field additions).

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemas/report.ts src/sanity/types.ts src/sanity/queries.ts
git commit -m "feat(analytics): add Segment write key field to report schema"
```

---

## Task 2: Load Segment snippet and fire an automatic page view

**Files:**
- Modify: `src/components/AnalyticsScripts.tsx:43-58`

**Interfaces:**
- Consumes: `report.segmentWriteKey` from Task 1.
- Produces: `window.analytics` (Segment's global stub/client) — consumed by Task 3 and Task 4.

- [ ] **Step 1: Add the Segment snippet block**

In `src/components/AnalyticsScripts.tsx`, the component currently ends with the Google Ads block and closing tags (currently lines 43-61):

```tsx
      {report.googleAdsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${report.googleAdsId}`}
            strategy="afterInteractive"
          />
          <Script id="gads-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${report.googleAdsId}');
            `}
          </Script>
        </>
      )}
    </>
  )
}
```

Replace with (adds a new block before the closing `</>`):

```tsx
      {report.googleAdsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${report.googleAdsId}`}
            strategy="afterInteractive"
          />
          <Script id="gads-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${report.googleAdsId}');
            `}
          </Script>
        </>
      )}

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
    </>
  )
}
```

- [ ] **Step 2: Add the `window.analytics` type declaration**

In `src/lib/analytics.ts`, find the `Window` interface (currently lines 1-6):

```ts
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
  }
}
```

Replace with:

```ts
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
    analytics?: {
      identify: (...args: unknown[]) => void
      track: (...args: unknown[]) => void
      page: (...args: unknown[]) => void
    }
  }
}
```

- [ ] **Step 3: Build to verify no type errors**

Run: `npm run build`
Expected: build completes successfully (exit code 0), no TypeScript errors about `window.analytics`.

- [ ] **Step 4: Manually verify the snippet loads**

1. In Sanity Studio (`npm run dev`, visit `http://localhost:3000/studio`), open any test report, go to the Analytics tab, paste in the Webby write key (`3DqN0Wu9DLAbm1i2bFzFHzUdJT9uG4nl`) into "Segment Write Key", and publish.
2. Visit that report locally (`http://localhost:3000/<slug>`), open DevTools Network tab, confirm a request to `cdn.segment.com/analytics.js/v1/.../analytics.min.js` fires.
3. Go to `https://app.segment.com/recognition-media/sources/webby_reports/debugger` and confirm a `page` event appears within a few seconds of the page load.

- [ ] **Step 5: Commit**

```bash
git add src/components/AnalyticsScripts.tsx src/lib/analytics.ts
git commit -m "feat(analytics): load Segment snippet and fire automatic page views"
```

---

## Task 3: Fire `identify` + `lead_created` on signup gate submit

**Files:**
- Modify: `src/components/SignupGate.tsx:64-92`
- Modify: `src/components/vertical/SignupGate.tsx` (same `handleSubmit` shape)

**Interfaces:**
- Consumes: `window.analytics` from Task 2, `buildCioIdentity(fields, formData): CioIdentity | null` (existing, from `src/lib/cioIdentity.ts` — returns `{ email, firstName?, lastName?, company?, jobTitle? }`).

- [ ] **Step 1: Update `src/components/SignupGate.tsx`'s `handleSubmit`**

Find the current `handleSubmit` (lines 64-92):

```ts
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
          specifier: report.specifier,
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

Replace with:

```ts
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const cioIdentity = buildCioIdentity(fields, formData)

      await fetch(`${process.env.NEXT_PUBLIC_SIGNUP_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportSlug: report.slug.current,
          reportTitle: report.title,
          property: report.property || 'webby',
          formData,
          cioIdentity,
          consented,
          consentedAt: new Date().toISOString(),
          specifier: report.specifier,
        }),
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
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
```

- [ ] **Step 2: Apply the same change to `src/components/vertical/SignupGate.tsx`**

Find its `handleSubmit` (same shape, `property: report.property || 'anthem'` instead of `'webby'` — keep that property-specific default unchanged):

```ts
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
          specifier: report.specifier,
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

Replace with:

```ts
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const cioIdentity = buildCioIdentity(fields, formData)

      await fetch(`${process.env.NEXT_PUBLIC_SIGNUP_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportSlug: report.slug.current,
          reportTitle: report.title,
          property: report.property || 'anthem',
          formData,
          cioIdentity,
          consented,
          consentedAt: new Date().toISOString(),
          specifier: report.specifier,
        }),
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
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
```

- [ ] **Step 3: Build to verify no type errors**

Run: `npm run build`
Expected: build completes successfully.

- [ ] **Step 4: Manually verify identify + lead_created fire, and Customer.io is unaffected**

1. With the Segment write key still set on the test report (from Task 2), run `npm run dev` and load the report's normal (gated) URL.
2. Fill out and submit the signup form.
3. In DevTools Network tab, confirm the existing `POST .../signup` request still fires (Customer.io path unchanged — no regression).
4. In `https://app.segment.com/recognition-media/sources/webby_reports/debugger`, confirm both an `Identify` call (with `firstName`/`lastName`/`organizationName`/`jobTitle` traits) and a `Track` call named `lead_created` with `source: "gated_content"` appear.
5. Repeat steps 1-4 once for a vertical-template (Anthem or Lovie) report to cover the second file.

- [ ] **Step 5: Commit**

```bash
git add src/components/SignupGate.tsx src/components/vertical/SignupGate.tsx
git commit -m "feat(analytics): send identify and lead_created to Segment on signup"
```

---

## Task 4: Add `cta_clicked` tracking to the 4 entry-site CTAs

**Files:**
- Modify: `src/lib/analytics.ts`
- Modify: `src/components/vertical/HeroSection.tsx:256-263, 320-329`
- Modify: `src/components/vertical/AnthemFooter.tsx:251-268`
- Modify: `src/components/vertical/LovieFooter.tsx` (CTA `<a>` at line 156)
- Modify: `src/components/horizontal/ReportView.tsx:341, 349`

**Interfaces:**
- Consumes: `window.analytics` from Task 2.
- Produces: `trackCtaClick(location: string, destinationUrl: string, property?: string, reportSlug?: string): void`, exported from `src/lib/analytics.ts`.

- [ ] **Step 1: Add the `trackCtaClick` helper**

In `src/lib/analytics.ts`, add after the existing `trackSignupConversion` function:

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

- [ ] **Step 2: Wire the desktop and mobile "Enter Now" CTAs in `src/components/vertical/HeroSection.tsx`**

Find the desktop CTA (currently lines 256-263):

```tsx
          <a
            href={theme.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:block text-[10px] tracking-[2px] uppercase rounded-full py-2.5 px-6 transition-colors ${theme.ctaBgClass} ${theme.ctaTextColorClass}`}
          >
            Enter Now
          </a>
```

Replace with:

```tsx
          <a
            href={theme.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCtaClick('header', theme.ctaUrl, report.property, report.slug.current)}
            className={`hidden md:block text-[10px] tracking-[2px] uppercase rounded-full py-2.5 px-6 transition-colors ${theme.ctaBgClass} ${theme.ctaTextColorClass}`}
          >
            Enter Now
          </a>
```

Find the mobile CTA (currently lines 320-328, inside the mobile menu):

```tsx
                  <a
                    href={theme.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`md:hidden w-full text-left px-5 py-4 flex items-center justify-between gap-3 transition-colors hover:brightness-110 ${theme.ctaBgClass}`}
                  >
                    <span className={`text-[13px] tracking-[1px] uppercase font-medium ${theme.ctaTextColorClass}`}>
                      Enter Now
                    </span>
                    <span className={`text-base ${theme.ctaTextColorClass}`}>→</span>
                  </a>
```

Replace with:

```tsx
                  <a
                    href={theme.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCtaClick('header', theme.ctaUrl, report.property, report.slug.current)}
                    className={`md:hidden w-full text-left px-5 py-4 flex items-center justify-between gap-3 transition-colors hover:brightness-110 ${theme.ctaBgClass}`}
                  >
                    <span className={`text-[13px] tracking-[1px] uppercase font-medium ${theme.ctaTextColorClass}`}>
                      Enter Now
                    </span>
                    <span className={`text-base ${theme.ctaTextColorClass}`}>→</span>
                  </a>
```

`HeroSection` already receives `report` as a prop (`export function HeroSection({ report, carouselImages, onSeeReport }: HeroSectionProps)`), so it's in scope at both call sites.

At the top of the file, add the import:

```ts
import { trackCtaClick } from '@/lib/analytics'
```

- [ ] **Step 3: Wire the "Enter Your Work" CTA in `src/components/vertical/AnthemFooter.tsx`**

Find (currently lines 251-268):

```tsx
          <motion.a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between gap-4 uppercase font-medium py-4 px-8 text-xs md:text-sm tracking-wider rounded-full transition-transform hover:scale-[1.02] mt-6"
```

Add `onClick` immediately after `rel="noopener noreferrer"`:

```tsx
          <motion.a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCtaClick('footer', ctaUrl, report.property, report.slug.current)}
            className="inline-flex items-center justify-between gap-4 uppercase font-medium py-4 px-8 text-xs md:text-sm tracking-wider rounded-full transition-transform hover:scale-[1.02] mt-6"
```

`AnthemFooter` already receives `report` as a prop (`export function AnthemFooter({ report }: { report: Report })`). Add the import at the top of the file:

```ts
import { trackCtaClick } from '@/lib/analytics'
```

- [ ] **Step 4: Wire the "Enter Your Work" CTA in `src/components/vertical/LovieFooter.tsx`**

Find the CTA `<a>` (currently lines 155-158, using the file's existing `ctaUrl` local variable):

```tsx
        <motion.a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
```

Replace with:

```tsx
        <motion.a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCtaClick('footer', ctaUrl, report.property, report.slug.current)}
```

`LovieFooter` already receives `report` as a prop (`export function LovieFooter({ report }: { report: Report })`). Add the same `import { trackCtaClick } from '@/lib/analytics'` at the top of the file.

- [ ] **Step 5: Wire the two Thank You CTAs in `src/components/horizontal/ReportView.tsx`**

Find the "Learn More" card (currently line 341):

```tsx
                    <a href={report.thankYouLinkUrl || 'https://www.webbyawards.com/judging-criteria/'} target="_blank" rel="noopener noreferrer" className="no-custom-cursor" style={{ maxWidth: 700, padding: '32px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, textAlign: 'left', textDecoration: 'none' }}>
```

Replace with:

```tsx
                    <a href={report.thankYouLinkUrl || 'https://www.webbyawards.com/judging-criteria/'} target="_blank" rel="noopener noreferrer" onClick={() => trackCtaClick('thank_you_learn_more', report.thankYouLinkUrl || 'https://www.webbyawards.com/judging-criteria/', report.property, report.slug.current)} className="no-custom-cursor" style={{ maxWidth: 700, padding: '32px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, textAlign: 'left', textDecoration: 'none' }}>
```

Find the "Get in Touch" card (currently line 349):

```tsx
                    <a href={report.thankYouCtaUrl || 'https://www.webbyawards.com'} target="_blank" rel="noopener noreferrer" data-content style={{ display: 'inline-flex', alignItems: 'center', gap: 24, border: '1px solid rgba(255,255,255,0.12)', padding: '28px 32px', textDecoration: 'none', color: 'inherit', marginTop: 40 }}>
```

Replace with:

```tsx
                    <a href={report.thankYouCtaUrl || 'https://www.webbyawards.com'} target="_blank" rel="noopener noreferrer" onClick={() => trackCtaClick('thank_you_get_in_touch', report.thankYouCtaUrl || 'https://www.webbyawards.com', report.property, report.slug.current)} data-content style={{ display: 'inline-flex', alignItems: 'center', gap: 24, border: '1px solid rgba(255,255,255,0.12)', padding: '28px 32px', textDecoration: 'none', color: 'inherit', marginTop: 40 }}>
```

Add the import at the top of the file (if not already present from other work):

```ts
import { trackCtaClick } from '@/lib/analytics'
```

- [ ] **Step 6: Build to verify no type errors**

Run: `npm run build`
Expected: build completes successfully, no errors about missing imports or unknown props.

- [ ] **Step 7: Manually verify each CTA fires and still navigates correctly**

With the Segment write key still set from Task 2, run `npm run dev` and for each of the 4 CTAs:
1. Click it, confirm it still opens the destination URL in a new tab (`target="_blank"` unaffected).
2. In `https://app.segment.com/recognition-media/sources/webby_reports/debugger` (or the Anthem/Lovie source, matching whichever test report you're using), confirm a `Track` call named `cta_clicked` appears with the expected `cta_location` (`header`, `footer`, `thank_you_learn_more`, or `thank_you_get_in_touch`) and correct `destination_url`.

- [ ] **Step 8: Commit**

```bash
git add src/lib/analytics.ts src/components/vertical/HeroSection.tsx src/components/vertical/AnthemFooter.tsx src/components/vertical/LovieFooter.tsx src/components/horizontal/ReportView.tsx
git commit -m "feat(analytics): track cta_clicked on entry-site cross-sell CTAs"
```

---

## Final verification (whole feature, both templates)

- [ ] Run `npm run build` one more time end-to-end — confirm the full static export succeeds.
- [ ] On a report with `segmentWriteKey` **blank**, confirm no request to `cdn.segment.com` fires at all (existing gating pattern still holds — no regression for reports that haven't opted in).
- [ ] Push the branch and open a PR (this repo's workflow — see CLAUDE.md/memory: don't merge straight to `main` without review, matching how prior features here shipped via PR).
