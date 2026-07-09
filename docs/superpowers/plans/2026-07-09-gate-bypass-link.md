# Gate Bypass Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let any report be reached via `?access=direct` on its normal URL, skipping the signup gate for that visit only, with no cookie set and no signup capture — while the plain URL still gates normally.

**Architecture:** Add one branch to the existing gate-check `useEffect` in both `ReportView.tsx` orchestrators (horizontal/Webby and vertical/Anthem+Lovie). The branch checks `window.location.search` for `access=direct` and calls the same `setHasAccess(true)` the cookie-present branch already uses — no new state, no new components, no new files.

**Tech Stack:** Next.js 16 (static export), React `useEffect`, plain `URLSearchParams`.

## Global Constraints

- The bypass grants access for that page load only: no `document.cookie` write, no call to `${NEXT_PUBLIC_SIGNUP_API_URL}/signup`, no `SignupGate` render.
- Exact param and value: `access=direct` (not a generated/secret token, not configurable).
- Applies globally to every report — no new Sanity field, no Studio change.
- Bypass visitors get the same UX as a returning cookie-holder (auto-scroll into the report), not the same UX as a `signupGateEnabled === false` report (hero + manual "Explore" click).
- Follow the existing convention in this codebase: the check is duplicated in both `ReportView.tsx` files, matching how `getCookie`/`setCookie`/the `?reset` shortcut are already duplicated rather than shared.

---

### Task 1: Add the bypass branch to the horizontal (Webby) ReportView

**Files:**
- Modify: `src/components/horizontal/ReportView.tsx:111-129`

**Interfaces:**
- Consumes: existing `setHasAccess` (React state setter, already in scope in this component).
- Produces: nothing new for other files — this is a self-contained behavior change within one component.

- [ ] **Step 1: Add the bypass check**

In `src/components/horizontal/ReportView.tsx`, the gate-check effect currently reads (lines 111-129):

```tsx
  useEffect(() => {
    // Dev shortcut: add ?reset to the URL to clear the signup cookie and test the gate
    if (window.location.search.includes('reset')) {
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${window.location.pathname}`
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      window.location.replace(window.location.pathname)
      return
    }
    // If the signup gate is turned off in the CMS, grant access without
    // checking the cookie — visitors enter the report directly.
    if (report.signupGateEnabled === false) {
      setHasAccess(true)
      return
    }
    if (getCookie(cookieKey)) {
      setHasAccess(true)
    }
  }, [cookieKey, report.signupGateEnabled])
```

Replace it with (adds one new block after the `?reset` shortcut, before the `signupGateEnabled` check):

```tsx
  useEffect(() => {
    // Dev shortcut: add ?reset to the URL to clear the signup cookie and test the gate
    if (window.location.search.includes('reset')) {
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${window.location.pathname}`
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      window.location.replace(window.location.pathname)
      return
    }
    // Shareable "skip the gate" link: ?access=direct grants access for this
    // page load only — no cookie, no signup capture — same as a returning
    // visitor who already has the cookie.
    if (new URLSearchParams(window.location.search).get('access') === 'direct') {
      setHasAccess(true)
      return
    }
    // If the signup gate is turned off in the CMS, grant access without
    // checking the cookie — visitors enter the report directly.
    if (report.signupGateEnabled === false) {
      setHasAccess(true)
      return
    }
    if (getCookie(cookieKey)) {
      setHasAccess(true)
    }
  }, [cookieKey, report.signupGateEnabled])
```

- [ ] **Step 2: Manual verification**

There is no test harness for this component (no `.test.tsx` files exist for `ReportView.tsx`). Verify by running the dev server and checking a live Webby report:

```bash
npm run dev
```

1. Visit a gated Webby report's URL with no query string (e.g. `http://localhost:3000/2026-awards-report`) — confirm the signup gate still appears when you click "Explore"/"See Report".
2. Visit the same URL with `?access=direct` appended — confirm the report loads and auto-scrolls into view with no gate modal.
3. Open browser devtools → Network tab, repeat step 2, and confirm no request is made to the signup API endpoint.
4. Open browser devtools → Application → Cookies, repeat step 2, and confirm no `report-access-<slug>` cookie appears.
5. Reload the same `?access=direct` URL again — confirm it still bypasses the gate (this proves the bypass reads the URL each time, not a leftover cookie from a previous test — if you've tested `?reset` or a real signup on this report before, clear that cookie first so this check is meaningful).

- [ ] **Step 3: Commit**

```bash
git add src/components/horizontal/ReportView.tsx
git commit -m "feat(report): add ?access=direct gate-bypass link for Webby template"
```

---

### Task 2: Add the bypass branch to the vertical (Anthem/Lovie) ReportView

**Files:**
- Modify: `src/components/vertical/ReportView.tsx:169-187`

**Interfaces:**
- Consumes: existing `setHasAccess` (React state setter, already in scope in this component).
- Produces: nothing new for other files — mirrors Task 1's change in the sibling template.

- [ ] **Step 1: Add the bypass check**

In `src/components/vertical/ReportView.tsx`, the gate-check effect currently reads (lines 169-187):

```tsx
  useEffect(() => {
    // Dev shortcut: add ?reset to the URL to clear the signup cookie and test the gate
    if (window.location.search.includes('reset')) {
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${window.location.pathname}`
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      window.location.replace(window.location.pathname)
      return
    }
    // If the signup gate is turned off in the CMS, grant access without
    // checking the cookie — visitors enter the report directly.
    if (report.signupGateEnabled === false) {
      setHasAccess(true)
      return
    }
    if (getCookie(cookieKey)) {
      setHasAccess(true)
    }
  }, [cookieKey, report.signupGateEnabled])
```

Replace it with:

```tsx
  useEffect(() => {
    // Dev shortcut: add ?reset to the URL to clear the signup cookie and test the gate
    if (window.location.search.includes('reset')) {
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${window.location.pathname}`
      document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      window.location.replace(window.location.pathname)
      return
    }
    // Shareable "skip the gate" link: ?access=direct grants access for this
    // page load only — no cookie, no signup capture — same as a returning
    // visitor who already has the cookie.
    if (new URLSearchParams(window.location.search).get('access') === 'direct') {
      setHasAccess(true)
      return
    }
    // If the signup gate is turned off in the CMS, grant access without
    // checking the cookie — visitors enter the report directly.
    if (report.signupGateEnabled === false) {
      setHasAccess(true)
      return
    }
    if (getCookie(cookieKey)) {
      setHasAccess(true)
    }
  }, [cookieKey, report.signupGateEnabled])
```

- [ ] **Step 2: Manual verification**

```bash
npm run dev
```

1. Visit a gated Anthem or Lovie report's URL with no query string — confirm the signup gate still appears.
2. Visit the same URL with `?access=direct` appended — confirm the report loads and auto-scrolls into view with no gate modal.
3. Devtools Network tab: confirm no request to the signup API endpoint when using `?access=direct`.
4. Devtools Application → Cookies: confirm no `report-access-<slug>` cookie appears when using `?access=direct`.
5. Reload the same `?access=direct` URL again — confirm it still bypasses the gate.

- [ ] **Step 3: Commit**

```bash
git add src/components/vertical/ReportView.tsx
git commit -m "feat(report): add ?access=direct gate-bypass link for Anthem/Lovie template"
```

---

### Task 3: Build verification and end-to-end check on a real deployed report

This task exists because the two prior tasks only cover local dev-server verification — this confirms the change survives the static export build and works with the exact same behavior on production.

**Files:** none — verification only.

- [ ] **Step 1: Verify the static build succeeds**

```bash
npm run build
```

Expected: build succeeds with no TypeScript errors (this repo has no separate typecheck script — `next build` type-checks as part of the build).

- [ ] **Step 2: After merge/deploy, spot-check on the live site**

Once this is merged to `main` and deployed (push to `main` triggers the `Build and Deploy` GitHub Actions workflow), pick one live Webby report and one live Anthem or Lovie report and repeat the same 5 checks from Task 1/2 Step 2 against their production URLs (e.g. `https://reports.webbyawards.com/<slug>?access=direct`), confirming:
- Normal URL still gates.
- `?access=direct` URL skips the gate and auto-scrolls into the report.
- No signup API request fires.
- No `report-access-<slug>` cookie is set.
- The bypass still works on reload.
