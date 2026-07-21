# Gate-Bypass Link Lands on Hero Cover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `?access=direct` gate-bypass link land visitors on the hero/cover page like a first-time visitor, instead of auto-scrolling them straight past it into the report content.

**Architecture:** Add one early-return branch to the existing post-access `useEffect` in both `ReportView.tsx` orchestrators (horizontal and vertical templates), right after the existing `signupGateEnabled === false` early return. No new state, no new files, no CMS/schema changes.

**Tech Stack:** Next.js 16 (App Router, static export), React `useEffect`, no test framework in this repo (verification is manual, via `npm run dev` in a browser — this matches how every prior feature in this project has been verified, see `docs/superpowers/specs/2026-07-09-gate-bypass-link-design.md` and `docs/superpowers/specs/2026-07-20-segment-tracking-design.md`).

## Global Constraints

- Only the two files below change. No changes to `SignupGate.tsx`, the signup Lambda, Sanity schema, or the access-check `useEffect` that sets `hasAccess`.
- The exact new line, copied verbatim from the approved spec (`docs/superpowers/specs/2026-07-21-gate-bypass-lands-on-hero-design.md`):
  ```ts
  if (new URLSearchParams(window.location.search).get('access') === 'direct') return
  ```
- Preserve existing behavior for: cookie-present returning visitors (still auto-scroll), `signupGateEnabled === false` reports (still skip auto-scroll, unchanged), and the gate modal itself (already correctly skipped for bypass visitors on click — do not touch `handleSeeReport`).

---

## File Structure

No new files. Two existing files modified, same shape of change in each:

- `src/components/horizontal/ReportView.tsx` — Webby's orchestrator. Modify the post-access `useEffect` (currently lines 139-152).
- `src/components/vertical/ReportView.tsx` — Anthem/Lovie's orchestrator. Modify the post-access `useEffect` (currently lines 304-317).

---

### Task 1: Horizontal template — skip auto-scroll for bypass-link visitors

**Files:**
- Modify: `src/components/horizontal/ReportView.tsx:139-152`

**Interfaces:**
- Consumes: existing `hasAccess` state (boolean, already defined in this file), existing `report.signupGateEnabled` field, existing `reportRef`, `setEntered`. No new interfaces introduced.
- Produces: nothing consumed by other tasks — Task 2 is the same change in a separate, independent file.

- [ ] **Step 1: Read the current block to confirm line numbers haven't drifted**

Run: `sed -n '139,152p' src/components/horizontal/ReportView.tsx`

Expected output (exact current content):

```ts
  // Once access is granted, scroll to report and hide hero — but only for
  // returning visitors who already have the cookie. When the signup gate is
  // disabled in the CMS, hasAccess is also true from mount, but we want
  // those users to see the hero and click "Explore" themselves.
  useEffect(() => {
    if (!hasAccess) return
    if (report.signupGateEnabled === false) return
    // Small delay to let report content render
    setTimeout(() => {
      reportRef.current?.scrollIntoView({ behavior: 'smooth' })
      // After scroll animation completes, hide the hero
      setTimeout(() => setEntered(true), 800)
    }, 100)
  }, [hasAccess])
```

If the content differs, stop and re-locate the block by searching for `if (report.signupGateEnabled === false) return` in this file before continuing.

- [ ] **Step 2: Replace the block**

Replace the exact block from Step 1 with:

```ts
  // Once access is granted, scroll to report and hide hero — but only for
  // returning visitors who already have the cookie. When the signup gate is
  // disabled in the CMS, or when access was granted via the ?access=direct
  // bypass link, hasAccess is also true from mount, but we want those
  // visitors to see the hero and click "Explore" themselves instead of
  // being auto-scrolled straight into the report.
  useEffect(() => {
    if (!hasAccess) return
    if (report.signupGateEnabled === false) return
    // Shareable "skip the gate" link: land on the hero like any first-time
    // visitor and let them click through themselves — don't auto-scroll past
    // the cover the way a returning (cookie-present) visitor does.
    if (new URLSearchParams(window.location.search).get('access') === 'direct') return
    // Small delay to let report content render
    setTimeout(() => {
      reportRef.current?.scrollIntoView({ behavior: 'smooth' })
      // After scroll animation completes, hide the hero
      setTimeout(() => setEntered(true), 800)
    }, 100)
  }, [hasAccess])
```

- [ ] **Step 3: Verify the file still type-checks**

Run: `npx tsc --noEmit`
Expected: no new errors referencing `ReportView.tsx` (pre-existing unrelated errors elsewhere, if any, are not this task's concern — but there should be none in this repo).

- [ ] **Step 4: Commit**

```bash
git add src/components/horizontal/ReportView.tsx
git commit -m "fix: gate-bypass link lands on hero cover (horizontal template)"
```

---

### Task 2: Vertical template — skip auto-scroll for bypass-link visitors

**Files:**
- Modify: `src/components/vertical/ReportView.tsx:304-317`

**Interfaces:**
- Consumes: existing `hasAccess` state, `report.signupGateEnabled`, `scrollToTargetOrReport()` (already defined earlier in this file), `setEntered`. No new interfaces.
- Produces: nothing consumed elsewhere — independent of Task 1.

- [ ] **Step 1: Read the current block to confirm line numbers haven't drifted**

Run: `sed -n '304,317p' src/components/vertical/ReportView.tsx`

Expected output (exact current content):

```ts
  // Once access is granted, scroll to report and hide hero — but only for
  // returning visitors who already have the cookie. When the signup gate is
  // disabled in the CMS, hasAccess is also true from mount, but we want
  // those users to see the hero and click "Explore" themselves.
  useEffect(() => {
    if (!hasAccess) return
    if (report.signupGateEnabled === false) return
    // Small delay to let report content render
    setTimeout(() => {
      scrollToTargetOrReport()
      // After scroll animation completes, hide the hero
      setTimeout(() => setEntered(true), 800)
    }, 100)
  }, [hasAccess])
```

If the content differs, stop and re-locate the block by searching for `if (report.signupGateEnabled === false) return` in this file before continuing.

- [ ] **Step 2: Replace the block**

Replace the exact block from Step 1 with:

```ts
  // Once access is granted, scroll to report and hide hero — but only for
  // returning visitors who already have the cookie. When the signup gate is
  // disabled in the CMS, or when access was granted via the ?access=direct
  // bypass link, hasAccess is also true from mount, but we want those
  // visitors to see the hero and click "Explore" themselves instead of
  // being auto-scrolled straight into the report.
  useEffect(() => {
    if (!hasAccess) return
    if (report.signupGateEnabled === false) return
    // Shareable "skip the gate" link: land on the hero like any first-time
    // visitor and let them click through themselves — don't auto-scroll past
    // the cover the way a returning (cookie-present) visitor does.
    if (new URLSearchParams(window.location.search).get('access') === 'direct') return
    // Small delay to let report content render
    setTimeout(() => {
      scrollToTargetOrReport()
      // After scroll animation completes, hide the hero
      setTimeout(() => setEntered(true), 800)
    }, 100)
  }, [hasAccess])
```

- [ ] **Step 3: Verify the file still type-checks**

Run: `npx tsc --noEmit`
Expected: no new errors referencing `ReportView.tsx`.

- [ ] **Step 4: Commit**

```bash
git add src/components/vertical/ReportView.tsx
git commit -m "fix: gate-bypass link lands on hero cover (vertical template)"
```

---

### Task 3: Manual verification in the browser

**Files:** none (no code changes — verification only)

**Interfaces:** N/A

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: `Ready in <1s`, server listening on `http://localhost:3000`.

- [ ] **Step 2: Verify bypass link on the horizontal (Webby) template**

Open `http://localhost:3000/2026-awards-report?access=direct` in a browser with no existing signup cookie for this report (use a private/incognito window, or first visit `http://localhost:3000/2026-awards-report?reset` once to clear any existing cookie, then navigate to the bypass URL).

Expected:
- The hero/cover section is visible on load — no auto-scroll into the report.
- The signup gate modal never appears.
- Clicking "Explore the Report" (or equivalent hero CTA) scrolls smoothly into the report and hides the hero, same as a normal first-time visitor who clicked through — but without ever seeing the gate.

- [ ] **Step 3: Verify bypass link on the vertical (Lovie) template**

Open `http://localhost:3000/lovie-creative-hubs-mediterranean?access=direct` (private/incognito window, or `?reset` first).

Expected: same as Step 2 — hero visible on load, no gate, clicking through scrolls into the report normally.

- [ ] **Step 4: Verify existing behaviors are unaffected**

a. **Cookie-present returning visitor still auto-scrolls:** Visit `http://localhost:3000/lovie-creative-hubs-mediterranean` (no query params) in a browser profile that already completed the signup gate for this report previously (or complete it now, then reload the same URL). Expected: auto-scrolls straight into the report, hero hides automatically — unchanged from before this change.

b. **`signupGateEnabled === false` reports still show hero and wait for a click:** Find or temporarily set a report's `Signup Form` → gate-enabled field to off in Studio, load its bare URL (no query params) in a fresh incognito window. Expected: hero visible, no auto-scroll, no gate; clicking "Explore" scrolls in manually. (Skip this check if no such report exists and setting one up is disproportionate — the code path is untouched by this change either way, so Task 1/2's diff review is sufficient evidence.)

- [ ] **Step 5: Stop the dev server**

Run: `pkill -f "next dev"` (or `Ctrl+C` in the terminal running it).

- [ ] **Step 6: No commit for this task** — verification only, nothing to stage.
