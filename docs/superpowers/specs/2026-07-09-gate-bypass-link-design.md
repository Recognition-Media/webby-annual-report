# Shareable gate-bypass link for report URLs

**Date:** 2026-07-09
**Status:** Approved, ready for planning

## Context

Every report is gated by a signup form unless the report's `signupGateEnabled` field is turned off in Sanity — that's an all-or-nothing per-report toggle (see `docs/superpowers/specs/2026-07-08-cio-report-signup-design.md` and the "Signup gate is per-property themed" note in project history). The team wants a second capability on top of that: for any report, a URL they can hand out (to press, VIPs, etc.) that skips the gate for that link specifically, while the normal URL for the same report still shows the gate to everyone else.

Recipients of the bypass link should be fully anonymous — no Customer.io capture, no DynamoDB signup record, nothing persisted for that visit. This is a convenience mechanism, not an access-control mechanism (there's no sensitive content behind the gate either way), so the bypass doesn't need to be a secret/hard-to-guess token.

## Decisions made during discovery

- **Query param on the existing URL, not a separate route.** `reports.webbyawards.com/some-report?access=direct` reuses the existing page — no new Next.js route, no static-export changes. This mirrors the `?reset` dev shortcut already present in both `ReportView.tsx` files (`src/components/horizontal/ReportView.tsx`, `src/components/vertical/ReportView.tsx`), which already reads `window.location.search` client-side to affect gate behavior.
- **Fully anonymous — no cookie, no signup capture.** The bypass grants access for that page load only, via the same `hasAccess` React state the gate already uses. It does not call `setCookie`, does not show the `SignupGate` component, and does not touch the `/signup` API — so no DynamoDB write and no Customer.io sync happen for bypass visitors.
- **Behaves like a returning visitor (cookie-present), not like a gate-disabled report.** These two existing branches behave differently: `signupGateEnabled === false` shows the hero and waits for the visitor to click "Explore the report," while a cookie-present returning visitor auto-scrolls straight into the report content. The bypass link should feel like "drop me straight into the report," so it follows the cookie-present code path (auto-scroll), not the gate-disabled path.
- **Global, not per-report.** The check lives in the shared gate-check effect in both `ReportView.tsx` files, so it works for any report automatically — no new Sanity field, no Studio UI, no per-report configuration.
- **Simple flag, not a secret token.** `?access=direct` is the exact param/value the team approved — not per-recipient, not randomly generated. Anyone who notices the param in a shared URL could reuse it, which is acceptable given there's no sensitive content behind the gate.
- **Duplicated in both files, matching existing convention.** `getCookie`/`setCookie` and the `?reset` handling are already duplicated (not shared) between `horizontal/ReportView.tsx` and `vertical/ReportView.tsx`. This change follows that same convention — no new shared hook/module for a ~4-line check.

## Architecture

No new components, no new routes, no new CMS fields. Both `ReportView.tsx` orchestrators already run a `useEffect` on mount that decides whether `hasAccess` starts `true` or `false`:

```
useEffect(() => {
  if (?reset in URL) { clear cookie, reload; return }
  if (report.signupGateEnabled === false) { hasAccess = true; return }   // existing
  if (cookie present) { hasAccess = true }                                // existing
}, [...])
```

This adds one branch, checked before the `signupGateEnabled` check (order doesn't matter functionally since both lead to `hasAccess = true`, but placing it right after `?reset` groups the two "URL-driven" branches together):

```
useEffect(() => {
  if (?reset in URL) { clear cookie, reload; return }
  if (?access=direct in URL) { hasAccess = true; return }                 // new
  if (report.signupGateEnabled === false) { hasAccess = true; return }
  if (cookie present) { hasAccess = true }
}, [...])
```

Because this sets `hasAccess = true` through the same state variable the cookie-present branch uses, the existing "auto-scroll into report" effect (which already runs whenever `hasAccess` is true and `signupGateEnabled !== false`) fires for bypass visitors with no additional code — they land on the hero for a fraction of a second, then get carried into the report exactly like a returning visitor would.

## Implementation

In `src/components/horizontal/ReportView.tsx` (currently lines 111-129) and `src/components/vertical/ReportView.tsx` (currently lines ~169-187), inside the existing access-check `useEffect`, add immediately after the `?reset` block and before the `signupGateEnabled === false` check:

```ts
// Shareable "skip the gate" link: ?access=direct grants access for this
// page load only — no cookie, no signup capture — same as a returning
// visitor who already has the cookie.
if (new URLSearchParams(window.location.search).get('access') === 'direct') {
  setHasAccess(true)
  return
}
```

No other code changes. No changes to `SignupGate.tsx`, the Lambda, or Sanity schema.

## Testing

This logic runs in a `useEffect` reading `window.location.search`, the same pattern the existing `?reset` shortcut already uses — there's no existing unit-test harness for these component-level effects in this repo (no `.test.tsx` files exist for either `ReportView.tsx`). Verify manually per template:

1. Load a gated report's normal URL (no query param) — confirm the gate still shows.
2. Load the same URL with `?access=direct` appended — confirm the report loads directly, no gate modal, auto-scroll behaves like a returning visitor.
3. Confirm no request is made to `${NEXT_PUBLIC_SIGNUP_API_URL}/signup` (browser network tab) when using the bypass link.
4. Confirm no `report-access-<slug>` cookie is set after using the bypass link (browser devtools → Application → Cookies).
5. Repeat all four checks for one horizontal-template report (Webby) and one vertical-template report (Anthem or Lovie), since the logic is duplicated in two files.
