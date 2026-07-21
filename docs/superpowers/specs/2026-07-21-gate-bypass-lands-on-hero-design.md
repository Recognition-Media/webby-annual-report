# Gate-bypass link lands on the hero cover instead of auto-scrolling into content

**Date:** 2026-07-21
**Status:** Approved, ready for planning

## Context

The `?access=direct` gate-bypass link (see `docs/superpowers/specs/2026-07-09-gate-bypass-link-design.md`) was deliberately built to behave like a returning, cookie-present visitor: it sets `hasAccess = true` through the same state the cookie-present branch uses, so the existing "auto-scroll into report, hide hero" effect fires automatically with no extra code.

In practice this reads as a strange UX. Someone opening a shared bypass link is a first-time visitor to the page, not a returning one — landing them mid-scroll straight into the Welcome Letter, with no cover/hero moment at all, feels broken rather than convenient.

There's already a second, different behavior in the same file for a different trigger: when a report's `signupGateEnabled` field is turned off in the CMS, the hero stays visible and the auto-scroll is skipped entirely — the visitor sees the cover and clicks "Explore the Report" (or a hero nav item) themselves, same as any other first-time visitor, they just never see the signup gate. That's the exact UX wanted for bypass-link visitors too.

## Decision

`?access=direct` now follows the same "skip auto-scroll" behavior as `signupGateEnabled === false`, instead of the cookie-present auto-scroll behavior. Bypass-link visitors will see the hero/cover page like any first-time visitor and click through themselves — they just never see the signup gate modal when they do.

This supersedes the "Behaves like a returning visitor" decision in the 2026-07-09 spec for this one aspect (auto-scroll timing); everything else from that spec (fully anonymous, no cookie, no signup capture, query param not a route, duplicated per-file) is unchanged.

No other behavior changes:
- Cookie-present returning visitors still auto-scroll exactly as before (they don't have `access=direct` in the URL).
- `signupGateEnabled === false` reports behave exactly as before.
- The signup gate modal was already correctly skipped for bypass visitors on click (`handleSeeReport` checks `hasAccess` before showing the gate) — no change needed there.

## Architecture

Both `ReportView.tsx` orchestrators have a second `useEffect` that runs once `hasAccess` becomes `true`, and already has one early-return branch for the gate-disabled case:

```
useEffect(() => {
  if (!hasAccess) return
  if (report.signupGateEnabled === false) return   // existing: skip auto-scroll
  // ...auto-scroll into report, then hide hero
}, [hasAccess])
```

This adds one more early-return branch, checked the same way the access-check effect already reads the URL param (`new URLSearchParams(window.location.search).get('access') === 'direct'`) — no new state variable, no coupling between the two effects beyond the shared `hasAccess` boolean they already share:

```
useEffect(() => {
  if (!hasAccess) return
  if (report.signupGateEnabled === false) return
  if (new URLSearchParams(window.location.search).get('access') === 'direct') return   // new
  // ...auto-scroll into report, then hide hero
}, [hasAccess])
```

## Implementation

In `src/components/horizontal/ReportView.tsx` (currently lines 143-152) and `src/components/vertical/ReportView.tsx` (currently lines 308-317), inside the existing post-access `useEffect`, add immediately after the `signupGateEnabled === false` check:

```ts
// Shareable "skip the gate" link: land on the hero like any first-time
// visitor and let them click through themselves — don't auto-scroll past
// the cover the way a returning (cookie-present) visitor does.
if (new URLSearchParams(window.location.search).get('access') === 'direct') return
```

No changes to the access-check effect (the one that sets `hasAccess`), `SignupGate.tsx`, the Lambda, or Sanity schema. No new tests beyond manual verification: load a report with `?access=direct`, confirm the hero is visible and the gate never appears, click "Explore the Report," confirm normal scroll-into-report behavior.
