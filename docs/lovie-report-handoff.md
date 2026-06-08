# Lovie Annual Report — content & graphics handoff

**For:** Jordana · **Date:** 2026-06-08 · **Status:** plumbing done, ready for content/branding

`reports.lovieawards.com` is now wired up as the third property (alongside Webby and Anthem). The URL is **live with a neutral "coming soon" placeholder**. Everything below the "What's already done" line is yours: create the Lovie report in Sanity and Lovie-ify the template branding — the same way you built out Anthem.

---

## What's already done (no action needed)

- **DNS / cert / CDN:** `reports.lovieawards.com` resolves to the existing CloudFront distribution (`E120I5KFQNYFYO`) over a new 3-domain SSL cert. Served from the same S3 bucket as Webby/Anthem.
- **Routing:** `src/app/page.tsx` maps `reports.lovieawards.com` → `/lovie`, and `src/app/lovie/page.tsx` redirects to the latest live `property: lovie` report. Until one exists, it shows the coming-soon placeholder.
- **CMS:** the Report schema already has `property: lovie` and `template: horizontal | vertical`. No schema changes needed.

## How it goes live

1. In Sanity Studio (`reports.webbyawards.com/studio`), create a new **Report**.
2. Set **Property = Lovie**, pick **Template = Horizontal or Vertical**, set **Status = live**, give it a slug.
3. Publish. The publish webhook rebuilds the static site; `/lovie` then redirects to your report automatically.

> ⚠️ **Set Template explicitly.** The fallback in `src/components/ReportView.tsx` only infers `vertical` for Anthem; any other property defaults to **horizontal**. So a Lovie report with no template set renders horizontal.

---

## Your work: Lovie-ify the template

The templates currently hardcode **Anthem** (vertical) and **Webby** (horizontal) branding. To make a Lovie report look like Lovie, swap these out. **If Lovie uses the Vertical template** (Anthem-style), these are the touch-points:

### Assets — create `/public/lovie/`
Mirror `public/anthem/` with Lovie logo, hero images, and cause/category icons. Current Anthem references to replace:
- `src/components/vertical/HeroSection.tsx` — hero images + cause-icon "sticker" array (`/anthem/hero-*.jpg`, `/anthem/CAUSE_*.svg`)
- `src/components/vertical/AnthemFooter.tsx:102-110, 283` — floating cause icons + `/anthem/anthem-logo-green.svg`
- `src/components/vertical/KeyFindings.tsx:93` — `/anthem/CAUSE_EDUCATION.svg`
- `src/components/vertical/SignupGate.tsx:92` — `/anthem/anthem-logo-green.svg`

### Copy & links — Anthem-specific text
- `src/components/vertical/AnthemFooter.tsx:14, 32, 44, 168, 283-296` — "Launched in 2021 by The Webby Awards…", partner list, `anthemawards.com` links, "© The Anthem Awards", alt text
- `src/components/vertical/HeroSection.tsx:88, 147, 192` — `anthemawards.com` CTA links + "By The Anthem Awards"
- `src/components/vertical/IntroLetter.tsx:10, 135` — default author title "General Manager, The Anthem Awards" + Anthem-specific intro copy
- `src/components/vertical/SignupGate.tsx:150` — `anthemawards.com/privacy-policy/`
- `src/components/vertical/Credits.tsx:14` — default credits
- Several of these already read from CMS fields (e.g. `report.footerCtaUrl`) — prefer wiring Lovie values through Sanity over hardcoding where the field exists.

### Theme / palette / fonts
- `src/app/globals.css` — Anthem palette is scoped under `body.anthem-template { … }`, set by `vertical/ReportView.tsx` on mount. Add a parallel `body.lovie-template { … }` block (or generalize) with Lovie's palette, and have ReportView set the class per `report.property`.
- `src/app/layout.tsx:17-20` — add Lovie's Typekit kit if Lovie uses different fonts (Webby `ona0hkt` + Anthem `ods5cgw` load today).

### If Lovie uses the Horizontal template instead
- `src/components/ReportFooter.tsx:34, 36` — footer links point to `webbyawards.com/resources/` + `/faq/`; swap for Lovie.

---

## Workflow

- Branch off `main` (e.g. `jordana/lovie-report`), edit only `src/components/vertical/`, `public/lovie/`, the `body.lovie-template` block in `globals.css`, and `ReportView.tsx` theme-class wiring.
- **Don't touch** `src/components/horizontal/` or root-level Webby components unless intentional.
- Push branch + open a PR (the repo is PR-driven; don't merge straight to main).

## Known gap (not blocking, future)
Per-page Open Graph / meta-description tags are generic across the report pages — worth addressing for social/AI sharing, but separate from this work.
