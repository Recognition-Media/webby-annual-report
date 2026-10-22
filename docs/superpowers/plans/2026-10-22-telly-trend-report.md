# Telly 2026 State of Video Report — Content Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Telly "T48 Trend Report Outline" doc renderable through Sanity Studio and the live Telly vertical template, Telly-only (no other property/template touched), then populate the actual outline content into the existing `report-telly-2026-state-of-video` Studio document.

**Architecture:** Telly's vertical template is already fully CMS-driven via `isTelly` branches in `ReportView.tsx` keyed off `report.property === 'telly'`. This plan follows that exact pattern: every new schema field is added to the shared `report`/`trendSection` schemas but gated `hidden` unless `property === 'telly'` (or, for `trendSection.winnerLists`, behind a `showWinnerLists` toggle — same pattern as the existing `showInsideTheHubs`/`contentSlabs` Lovie/Shared-Influence fields already living in that file); every new component is a new file rendered only inside the `isTelly` branch of `ReportView.tsx`. No existing Anthem/Lovie/Webby/Shared-Influence code path, field, or component is modified. The one net-new content type — a ranked "winner list" (org/creator, work title + link, optional social-proof stat + platform link) — doesn't exist anywhere in the schema today (the closest, `featuredProject`, is title/url/image-only and wired to the unrelated horizontal Webby template), so it's built from scratch as `winEntry` + `winnerList`.

**Tech Stack:** Next.js 16 / React 19, Sanity Studio v5 (schema-as-code in `src/sanity/schemas/`), `next-sanity` GROQ queries, Framer Motion, Tailwind v4. Content push uses `@sanity/client` via a one-off Node script (same pattern as `scripts/migrate-trends-to-sanity.mjs`), run locally with `SANITY_API_TOKEN` from `.env.local`.

**Spec:** T48 Trend Report Outline — Google Doc `1NL2ooYNVPuBTdWJVpUeUzOVPP4vgAQhpbl0K4gka--I` ("T48 Trend Report Outline"), fetched in full in this session. Its 10 pages map as follows (locked in during investigation, not re-derived mid-plan):

| Outline page | Destination |
|---|---|
| Pg 1 Title | existing `heroHeadline`/`heroSubtitle`/hero branding — **no change needed** |
| Pg 2 About The Telly Awards | new `tellyAbout` fields + `TellyAbout` component |
| Pg 3 What's Inside (Amanda Needham) | existing `letterBody` + `letterAuthors[0]` — **no schema change**, content only |
| Pg 4 Table of Contents | existing `keyFindings[4]` — **no schema change**, content only (replaces the current wrong Anthem-flavored 4 items) |
| Pg 5 Facts | new `tellyFacts` fields + `TellyFacts` component |
| Pg 6 Insights from the Season (8 judges) | new `tellyJudgeInsights` fields + `TellyJudgeInsights` component |
| Pg 7–10 (Shows & Series / Branded Content & Marketing / Social Impact Work / Channel Surfing) | existing `sectionCovers[4]` + `trendSections[4]` (replacing the current 3 covers / 8 placeholder Anthem trends) + new `winnerLists` field per trend + `WinnerList` component |

## Global Constraints

- Telly-only: every new field hidden via `hidden: ({ document }) => document?.property !== 'telly'` (report-level groups) or a local toggle (`showWinnerLists` on `trendSection`, same convention as `showInsideTheHubs`).
- No change to any existing field's name, type, or `hidden` predicate.
- No change to Anthem/Lovie/Webby/Shared-Influence render branches in `ReportView.tsx` — only additions inside the existing `isTelly` block and immediately-adjacent Telly-gated inserts.
- New components use Telly's established palette (`#ef1e40` / `#c23799` accents, `#000000` text, white `#ffffff` section backgrounds, `'Basetica', -apple-system, sans-serif` body font) per `IntroLetter.tsx`/`KeyFindings.tsx`'s Telly theme forks — not Anthem's `#21261A`/Roc Grotesk.
- Target document: `report-telly-2026-state-of-video` (slug `2026-state-of-video-report`, confirmed via live query), status stays `draft` — migration script must `.patch()`, not create a new document, and must not touch `formFields`, `creditsCreatedBy/Contributors`, `signupTitle/Subhead`, `metaTitle/Description`, `heroHeadline/Subtitle` (all already correct, out of scope).
- Build must stay green: `npx tsc --noEmit` and `npm run lint` after every code task.

---

### Task 1: `winEntry` + `winnerList` schema objects

**Files:**
- Create: `src/sanity/schemas/objects/winEntry.ts`
- Create: `src/sanity/schemas/objects/winnerList.ts`
- Modify: `src/sanity/schemas/index.ts`

**Interfaces:**
- Produces: schema type names `winEntry`, `winnerList`, importable by `trendSection.ts` in Task 2.

- [ ] **Step 1: Create `winEntry.ts`**

```typescript
import { defineType } from 'sanity'

// One row in a Telly "winner list" (Official Win List / Wins to Watch).
// Array order is the rank — no separate rank field. `highlight` matches
// the outline's bolded/starred standout entries (e.g. "**Bilt**").
export default defineType({
  name: 'winEntry',
  title: 'Win Entry',
  type: 'object',
  fields: [
    { name: 'name', title: 'Organization / Creator', type: 'string', description: 'e.g. "Asharq Network" or "William Freund, fStop Foundation, Inc."', validation: (r) => r.required() },
    { name: 'workTitle', title: 'Work Title', type: 'string', description: 'e.g. "THE 4TH DIMENSION" — optional when the entry is a person/org ranking with no single work (e.g. Facts-style gold-count rows).' },
    { name: 'workUrl', title: 'Work URL', type: 'url', description: 'Link to the work itself (Vimeo, YouTube, tellyawards.com winner page, etc).' },
    { name: 'metricValue', title: 'Social Proof Value', type: 'string', description: 'e.g. "56k", "1.1M", "5 golds" — optional.' },
    {
      name: 'metricPlatform',
      title: 'Social Proof Platform',
      type: 'string',
      options: {
        list: [
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'Website', value: 'website' },
        ],
      },
      hidden: ({ parent }) => !(parent as { metricValue?: string })?.metricValue,
    },
    { name: 'metricUrl', title: 'Social Proof URL', type: 'url', description: 'Where the social proof value links (the LinkedIn/Instagram page, etc).', hidden: ({ parent }) => !(parent as { metricValue?: string })?.metricValue },
    { name: 'highlight', title: 'Highlight This Entry', type: 'boolean', initialValue: false, description: 'Matches the outline’s bolded/starred standout rows.' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'workTitle' },
    prepare({ title, subtitle }) {
      return { title: title || 'Untitled', subtitle: subtitle || undefined }
    },
  },
})
```

- [ ] **Step 2: Create `winnerList.ts`**

```typescript
import { defineType } from 'sanity'

// A titled, ranked list of winEntry rows — e.g. "OFFICIAL WIN LIST: Media
// and Entertainment Networks" or "WINS TO WATCH: Vertical video series".
// A trendSection can carry several of these (Channel Surfing carries 4).
export default defineType({
  name: 'winnerList',
  title: 'Winner List',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Heading', type: 'string', description: 'e.g. "Official Win List: Media and Entertainment Networks"', validation: (r) => r.required() },
    { name: 'intro', title: 'Intro Copy', type: 'text', rows: 3, description: 'Explanatory paragraph shown below the heading, above the list.' },
    { name: 'entries', title: 'Entries', type: 'array', of: [{ type: 'winEntry' }], validation: (r) => r.required().min(1) },
  ],
  preview: {
    select: { title: 'heading', entries: 'entries' },
    prepare({ title, entries }) {
      const count = Array.isArray(entries) ? entries.length : 0
      return { title: title || 'Untitled list', subtitle: `${count} ${count === 1 ? 'entry' : 'entries'}` }
    },
  },
})
```

- [ ] **Step 3: Register both in `src/sanity/schemas/index.ts`**

Add imports alongside the other object imports:

```typescript
import winEntry from './objects/winEntry'
import winnerList from './objects/winnerList'
```

Add both to the `schemaTypes` array (anywhere after `lovieTakeaway`, before the Shared Influence block is fine — order doesn't matter to Sanity, but keep new Telly types grouped together for readability):

```typescript
  lovieTakeaway,
  winEntry,
  winnerList,
```

- [ ] **Step 4: Verify — typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors (pre-existing errors, if any, are out of scope — confirm the error count/set is unchanged from a baseline run before this task).

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemas/objects/winEntry.ts src/sanity/schemas/objects/winnerList.ts src/sanity/schemas/index.ts
git commit -m "feat(telly): add winEntry/winnerList schema objects for ranked winner lists"
```

---

### Task 2: Wire `winnerLists` into `trendSection`

**Files:**
- Modify: `src/sanity/schemas/objects/trendSection.ts`

**Interfaces:**
- Consumes: `winnerList` (Task 1).
- Produces: `trendSection.showWinnerLists: boolean`, `trendSection.winnerLists: winnerList[]` — consumed by the GROQ query (Task 4) and `ReportView.tsx` (Task 6).

- [ ] **Step 1: Add a `winners` fieldset**

In the `fieldsets` array (near the top of the file, alongside `landing`/`data`/`hubs`/`tips`/`quotes`/`video`/`images`), add:

```typescript
    { name: 'winners', title: 'Winner Lists (Telly)', options: { collapsible: true, collapsed: true } },
```

- [ ] **Step 2: Add the two fields**

After the existing `sectionImages` field (end of the `fields` array, before `contentSlabs`), add:

```typescript
    // Winner Lists (Telly) — ranked lists of winning organizations/
    // creators with an optional social-proof stat. Other properties
    // leave showWinnerLists off, so this never appears in their render
    // path; Telly's ReportView branch reads it per trendSection.
    { name: 'showWinnerLists', title: 'Show Winner Lists', type: 'boolean', initialValue: false, description: 'Telly only — toggle one or more ranked winner lists for this trend/section.', fieldset: 'winners' },
    { name: 'winnerLists', title: 'Winner Lists', type: 'array', of: [{ type: 'winnerList' }], hidden: ({ parent }) => parent?.showWinnerLists === false, fieldset: 'winners' },
```

- [ ] **Step 3: Verify — typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemas/objects/trendSection.ts
git commit -m "feat(telly): add winnerLists field to trendSection"
```

---

### Task 3: Telly-only report fields — About, Facts, Judge Insights

**Files:**
- Modify: `src/sanity/schemas/report.ts`

**Interfaces:**
- Consumes: `expertQuote` (existing type, reused for `judgeQuotes`).
- Produces: field names consumed by the GROQ query (Task 4), components (Task 5), `ReportView.tsx` (Task 6), and the migration script (Task 7):
  `aboutEyebrow, aboutHeading, aboutBody, aboutLogo, aboutCtaText, aboutCtaUrl`;
  `factsEntryCount, factsEntryLabel, factsJudgeCount, factsJudgeLabel, factsTopTitlesHeading, factsTopTitles, factsTopCitiesNationalHeading, factsTopCitiesNational, factsTopCitiesInternationalHeading, factsTopCitiesInternational`;
  `judgeInsightsEyebrow, judgeInsightsHeading, judgeQuotes`.

- [ ] **Step 1: Add three groups**

In the `groups` array, add after the existing `footer` group entry:

```typescript
    { name: 'tellyAbout', title: 'About Page (Telly)', hidden: ({ document }) => document?.property !== 'telly' },
    { name: 'tellyFacts', title: 'Facts Page (Telly)', hidden: ({ document }) => document?.property !== 'telly' },
    { name: 'tellyJudgeInsights', title: 'Judge Insights (Telly)', hidden: ({ document }) => document?.property !== 'telly' },
```

- [ ] **Step 2: Add the fields**

At the end of the `fields` array (after `creditsContributors`), add:

```typescript
    // About Page (Telly only) — the "About The Telly Awards" page that
    // follows the hero, before the Welcome Letter.
    { name: 'aboutEyebrow', title: 'Eyebrow', type: 'string', initialValue: 'About', group: 'tellyAbout' },
    { name: 'aboutHeading', title: 'Heading', type: 'string', initialValue: 'About The Telly Awards', group: 'tellyAbout' },
    { name: 'aboutBody', title: 'Body', type: 'array', of: [{ type: 'block' }], group: 'tellyAbout' },
    { name: 'aboutLogo', title: 'Logo', type: 'image', group: 'tellyAbout', description: 'Optional — falls back to the Telly wordmark already shipped in /public/telly.' },
    { name: 'aboutCtaText', title: 'CTA Button Text', type: 'string', initialValue: 'Enter Now', group: 'tellyAbout' },
    { name: 'aboutCtaUrl', title: 'CTA Button URL', type: 'url', group: 'tellyAbout' },

    // Facts Page (Telly only)
    { name: 'factsEntryCount', title: 'Entry Count', type: 'string', description: 'e.g. "13,876"', group: 'tellyFacts' },
    { name: 'factsEntryLabel', title: 'Entry Count Label', type: 'string', initialValue: 'Entries This Season', group: 'tellyFacts' },
    { name: 'factsJudgeCount', title: 'Judge Count', type: 'string', description: 'e.g. "575"', group: 'tellyFacts' },
    { name: 'factsJudgeLabel', title: 'Judge Count Label', type: 'string', initialValue: 'Judging Council Members', group: 'tellyFacts' },
    { name: 'factsTopTitlesHeading', title: 'Top Titles Heading', type: 'string', group: 'tellyFacts' },
    { name: 'factsTopTitles', title: 'Top Titles', type: 'array', of: [{ type: 'string' }], description: 'Ranked list, e.g. the top job titles of winning entrants.', group: 'tellyFacts' },
    { name: 'factsTopCitiesNationalHeading', title: 'Top National Cities Heading', type: 'string', group: 'tellyFacts' },
    { name: 'factsTopCitiesNational', title: 'Top National Cities', type: 'array', of: [{ type: 'string' }], group: 'tellyFacts' },
    { name: 'factsTopCitiesInternationalHeading', title: 'Top International Cities Heading', type: 'string', group: 'tellyFacts' },
    { name: 'factsTopCitiesInternational', title: 'Top International Cities', type: 'array', of: [{ type: 'string' }], group: 'tellyFacts' },

    // Judge Insights (Telly only) — standalone "Insights from the Season"
    // page, independent of any single trend.
    { name: 'judgeInsightsEyebrow', title: 'Eyebrow', type: 'string', initialValue: 'Insights From The Season', group: 'tellyJudgeInsights' },
    { name: 'judgeInsightsHeading', title: 'Heading', type: 'string', group: 'tellyJudgeInsights' },
    { name: 'judgeQuotes', title: 'Judge Quotes', type: 'array', of: [{ type: 'expertQuote' }], group: 'tellyJudgeInsights' },
```

- [ ] **Step 3: Verify — typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemas/report.ts
git commit -m "feat(telly): add About/Facts/Judge Insights fields, Telly-only"
```

---

### Task 4: GROQ query + hand-written types

**Files:**
- Modify: `src/sanity/queries.ts`
- Modify: `src/sanity/types.ts`

**Interfaces:**
- Consumes: field names from Tasks 1–3.
- Produces: `Report.aboutEyebrow` etc., `Report.factsEntryCount` etc., `Report.judgeInsightsEyebrow`/`judgeQuotes`, `TrendSection.showWinnerLists`/`winnerLists`, `WinEntry`, `WinnerList` TypeScript types — consumed by components (Task 5) and `ReportView.tsx` (Task 6).

- [ ] **Step 1: Extend `reportBySlugQuery` in `queries.ts`**

Add after `sectionCovers[] { ... }` / before `section01Cover`:

```groq
    aboutEyebrow,
    aboutHeading,
    aboutBody,
    aboutLogo,
    aboutCtaText,
    aboutCtaUrl,
    factsEntryCount,
    factsEntryLabel,
    factsJudgeCount,
    factsJudgeLabel,
    factsTopTitlesHeading,
    factsTopTitles,
    factsTopCitiesNationalHeading,
    factsTopCitiesNational,
    factsTopCitiesInternationalHeading,
    factsTopCitiesInternational,
    judgeInsightsEyebrow,
    judgeInsightsHeading,
    judgeQuotes[] {
      name,
      title,
      quoteText,
      linkedInUrl,
      headshot,
      headshotUrl,
    },
```

Inside `trendSections[] { ... }`, add right after `showInsideTheHubs, insideTheHubs { ... },` and before the `contentSlabs[]` block:

```groq
      showWinnerLists,
      winnerLists[] {
        heading,
        intro,
        entries[] {
          name,
          workTitle,
          workUrl,
          metricValue,
          metricPlatform,
          metricUrl,
          highlight,
        },
      },
```

- [ ] **Step 2: Extend `types.ts`**

Add two new interfaces (near `FeaturedProject`):

```typescript
export interface WinEntry {
  name: string
  workTitle?: string
  workUrl?: string
  metricValue?: string
  metricPlatform?: 'linkedin' | 'instagram' | 'vimeo' | 'youtube' | 'tiktok' | 'website'
  metricUrl?: string
  highlight?: boolean
}

export interface WinnerList {
  heading: string
  intro?: string
  entries: WinEntry[]
}
```

Find the `TrendSection` interface and add, alongside the other optional module fields:

```typescript
  showWinnerLists?: boolean
  winnerLists?: WinnerList[]
```

Find the `Report` interface and add, alongside the other optional fields:

```typescript
  aboutEyebrow?: string
  aboutHeading?: string
  aboutBody?: PortableTextBlock[]
  aboutLogo?: SanityImage
  aboutCtaText?: string
  aboutCtaUrl?: string
  factsEntryCount?: string
  factsEntryLabel?: string
  factsJudgeCount?: string
  factsJudgeLabel?: string
  factsTopTitlesHeading?: string
  factsTopTitles?: string[]
  factsTopCitiesNationalHeading?: string
  factsTopCitiesNational?: string[]
  factsTopCitiesInternationalHeading?: string
  factsTopCitiesInternational?: string[]
  judgeInsightsEyebrow?: string
  judgeInsightsHeading?: string
  judgeQuotes?: ExpertQuote[]
```

(Read the actual current `TrendSection`/`Report` interface bodies in `types.ts` before editing — insert alongside their existing optional fields using the same style; don't restate the whole interface here since the exact surrounding fields must match the file as it stands.)

- [ ] **Step 3: Verify — typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/queries.ts src/sanity/types.ts
git commit -m "feat(telly): fetch and type the new About/Facts/Judge Insights/winnerLists fields"
```

---

### Task 5: Four new Telly components

**Files:**
- Create: `src/components/vertical/WinnerList.tsx`
- Create: `src/components/vertical/TellyFacts.tsx`
- Create: `src/components/vertical/TellyJudgeInsights.tsx`
- Create: `src/components/vertical/TellyAbout.tsx`

**Interfaces:**
- Consumes: `WinnerList`, `WinEntry`, `Report`, `ExpertQuote` types (Task 4). Follows the established Telly visual language from `IntroLetter.tsx`/`KeyFindings.tsx`/`TrendContent` (white `#ffffff` background, `#000000` text, `'Basetica', -apple-system, sans-serif` body font, `#ef1e40`/`#c23799` accents, Framer Motion `whileInView` fade-ups matching the rest of the template).
- Produces: `WinnerList({ heading, intro, entries, accentColor }: { heading: string; intro?: string; entries: WinEntry[]; accentColor?: string })`; `TellyFacts({ report }: { report: Report })`; `TellyJudgeInsights({ eyebrow, heading, quotes }: { eyebrow?: string; heading?: string; quotes: ExpertQuote[] })`; `TellyAbout({ report }: { report: Report })` — all consumed by `ReportView.tsx` in Task 6.

- [ ] **Step 1: Write `WinnerList.tsx`**

```typescript
'use client'

import { motion } from 'framer-motion'
import type { WinEntry } from '@/sanity/types'

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  vimeo: 'Vimeo',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  website: 'Website',
}

interface WinnerListProps {
  heading: string
  intro?: string
  entries: WinEntry[]
  accentColor?: string
}

export function WinnerList({ heading, intro, entries, accentColor = '#ef1e40' }: WinnerListProps) {
  if (!entries || entries.length === 0) return null
  return (
    <section
      className="relative px-5 md:px-[60px] py-16 md:py-20"
      style={{ background: '#ffffff' }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        <motion.h3
          className="text-[22px] md:text-[28px] leading-[1.2] mb-4"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000', fontWeight: 700 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {heading}
        </motion.h3>
        {intro && (
          <motion.p
            className="text-[14px] md:text-[16px] leading-[1.6] mb-8 max-w-[760px]"
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(0,0,0,0.65)' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {intro}
          </motion.p>
        )}
        <ol className="list-none p-0 m-0 flex flex-col">
          {entries.map((entry, i) => (
            <motion.li
              key={i}
              className="flex items-baseline gap-4 md:gap-6 py-4 border-t"
              style={{ borderColor: 'rgba(0,0,0,0.1)' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.04 }}
            >
              <span
                className="text-[14px] md:text-[16px] font-bold flex-shrink-0"
                style={{ color: accentColor, minWidth: 28 }}
              >
                {i + 1}
              </span>
              <span className="flex-1 min-w-0">
                <span
                  className="text-[14px] md:text-[16px]"
                  style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000', fontWeight: entry.highlight ? 700 : 500 }}
                >
                  {entry.name}
                </span>
                {entry.workTitle && (
                  <>
                    {' — '}
                    {entry.workUrl ? (
                      <a
                        href={entry.workUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000', textUnderlineOffset: 2, fontStyle: 'italic' }}
                      >
                        {entry.workTitle}
                      </a>
                    ) : (
                      <span style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000', fontStyle: 'italic' }}>
                        {entry.workTitle}
                      </span>
                    )}
                  </>
                )}
              </span>
              {entry.metricValue && (
                <a
                  href={entry.metricUrl || entry.workUrl || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-[11px] md:text-[12px] py-1.5 px-3 rounded-full whitespace-nowrap"
                  style={{ background: 'rgba(0,0,0,0.06)', color: '#000000', fontFamily: "'Basetica', -apple-system, sans-serif" }}
                >
                  {entry.metricValue}
                  {entry.metricPlatform && ` · ${PLATFORM_LABELS[entry.metricPlatform] || entry.metricPlatform}`}
                </a>
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Write `TellyFacts.tsx`**

```typescript
'use client'

import { motion } from 'framer-motion'
import type { Report } from '@/sanity/types'

function RankedList({ heading, items, accentColor }: { heading?: string; items?: string[]; accentColor: string }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      {heading && (
        <p
          className="text-[13px] md:text-[14px] uppercase font-medium mb-4"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: accentColor, letterSpacing: 2 }}
        >
          {heading}
        </p>
      )}
      <ol className="list-none p-0 m-0 flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 items-baseline">
            <span className="text-[14px] font-bold" style={{ color: accentColor, minWidth: 20 }}>{i + 1}</span>
            <span className="text-[15px] md:text-[16px]" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000' }}>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function TellyFacts({ report }: { report: Report }) {
  return (
    <section
      id="telly-facts"
      className="relative px-5 md:px-[60px] py-20 md:py-28"
      style={{ background: '#ffffff' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <motion.h2
          className="text-[40px] md:text-[64px] leading-[1.05] mb-14 md:mb-20 text-center"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000', fontWeight: 700 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          The Facts
        </motion.h2>

        {/* Two headline stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 md:mb-24">
          {report.factsEntryCount && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-[56px] md:text-[88px] leading-none" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ef1e40', fontWeight: 700 }}>
                {report.factsEntryCount}
              </div>
              <p className="text-[14px] md:text-[16px] mt-2" style={{ color: 'rgba(0,0,0,0.6)' }}>{report.factsEntryLabel}</p>
            </motion.div>
          )}
          {report.factsJudgeCount && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-[56px] md:text-[88px] leading-none" style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#c23799', fontWeight: 700 }}>
                {report.factsJudgeCount}
              </div>
              <p className="text-[14px] md:text-[16px] mt-2" style={{ color: 'rgba(0,0,0,0.6)' }}>{report.factsJudgeLabel}</p>
            </motion.div>
          )}
        </div>

        {/* Ranked lists */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          <RankedList heading={report.factsTopTitlesHeading} items={report.factsTopTitles} accentColor="#ef1e40" />
          <RankedList heading={report.factsTopCitiesNationalHeading} items={report.factsTopCitiesNational} accentColor="#c23799" />
          <RankedList heading={report.factsTopCitiesInternationalHeading} items={report.factsTopCitiesInternational} accentColor="#ef1e40" />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Write `TellyJudgeInsights.tsx`**

```typescript
'use client'

import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { ExpertQuote } from '@/sanity/types'

const quoteComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-2">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
  },
}

export function TellyJudgeInsights({
  eyebrow = 'Insights From The Season',
  heading,
  quotes,
}: {
  eyebrow?: string
  heading?: string
  quotes: ExpertQuote[]
}) {
  if (!quotes || quotes.length === 0) return null
  return (
    <section
      id="judge-insights"
      className="relative px-5 md:px-[60px] py-20 md:py-28"
      style={{ background: '#f3f3f3' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <motion.p
          className="uppercase font-medium mb-4 text-center"
          style={{ fontSize: 13, letterSpacing: 3, color: '#ef1e40', fontFamily: "'Basetica', -apple-system, sans-serif" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {eyebrow}
        </motion.p>
        {heading && (
          <motion.h2
            className="text-[32px] md:text-[48px] leading-[1.1] mb-14 md:mb-20 text-center"
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000', fontWeight: 700 }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            {heading}
          </motion.h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              className="pl-5"
              style={{ borderLeft: `3px solid ${i % 2 === 0 ? '#ef1e40' : '#c23799'}` }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.06 }}
            >
              <div
                className="text-[15px] md:text-[17px] leading-[1.6] mb-3"
                style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000', fontStyle: 'italic' }}
              >
                <PortableText value={q.quoteText} components={quoteComponents} />
              </div>
              <p className="text-[13px]" style={{ color: 'rgba(0,0,0,0.55)' }}>
                — <strong style={{ fontWeight: 600 }}>{q.name}</strong>{q.title ? `, ${q.title}` : ''}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write `TellyAbout.tsx`**

```typescript
'use client'

import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { urlFor } from '@/sanity/image'

export function TellyAbout({ report }: { report: Report }) {
  const logoUrl = report.aboutLogo ? urlFor(report.aboutLogo).width(240).url() : '/telly/telly-logo-black.svg'
  return (
    <section
      id="about-telly"
      className="relative px-5 md:px-[60px] py-20 md:py-28 text-center"
      style={{ background: '#ffffff' }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <motion.img
          src={logoUrl}
          alt="The Telly Awards"
          className="mx-auto mb-8 h-[56px] md:h-[72px] w-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        />
        {report.aboutEyebrow && (
          <motion.p
            className="uppercase font-medium mb-4"
            style={{ fontSize: 13, letterSpacing: 3, color: '#ef1e40', fontFamily: "'Basetica', -apple-system, sans-serif" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {report.aboutEyebrow}
          </motion.p>
        )}
        <motion.h2
          className="text-[32px] md:text-[48px] leading-[1.1] mb-8"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#000000', fontWeight: 700 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {report.aboutHeading}
        </motion.h2>
        {report.aboutBody && report.aboutBody.length > 0 && (
          <motion.div
            className="text-[15px] md:text-[17px] leading-[1.7] mb-8 [&_p]:mb-5"
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(0,0,0,0.75)' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <PortableText value={report.aboutBody} />
          </motion.div>
        )}
        {report.aboutCtaText && report.aboutCtaUrl && (
          <motion.a
            href={report.aboutCtaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[2px] py-3 px-7 rounded-full"
            style={{ background: '#ef1e40', color: '#ffffff', fontFamily: "'Basetica', -apple-system, sans-serif" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {report.aboutCtaText}
          </motion.a>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Verify — typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors/warnings.

- [ ] **Step 6: Commit**

```bash
git add src/components/vertical/WinnerList.tsx src/components/vertical/TellyFacts.tsx src/components/vertical/TellyJudgeInsights.tsx src/components/vertical/TellyAbout.tsx
git commit -m "feat(telly): add WinnerList, TellyFacts, TellyJudgeInsights, TellyAbout components"
```

---

### Task 6: Wire the four components into `ReportView.tsx`, Telly-only

**Files:**
- Modify: `src/components/vertical/ReportView.tsx`

**Interfaces:**
- Consumes: `WinnerList`, `TellyFacts`, `TellyJudgeInsights`, `TellyAbout` (Task 5).

- [ ] **Step 1: Import the four components**

Near the top, alongside the other vertical imports (after `import { TellyFooter } from './TellyFooter'`):

```typescript
import { TellyAbout } from './TellyAbout'
import { TellyFacts } from './TellyFacts'
import { TellyJudgeInsights } from './TellyJudgeInsights'
import { WinnerList } from './WinnerList'
```

- [ ] **Step 2: Render `TellyAbout` before `IntroLetter`**

Find:

```tsx
            <IntroLetter report={report} />
```

Replace with:

```tsx
            {isTelly && <TellyAbout report={report} />}
            <IntroLetter report={report} />
```

- [ ] **Step 3: Render `TellyFacts` + `TellyJudgeInsights` right after `KeyFindings`, before the section-cover/trend loop**

Find:

```tsx
            <KeyFindings findings={report.keyFindings} property={report.property} slug={report.slug?.current} />
```

Replace with:

```tsx
            <KeyFindings findings={report.keyFindings} property={report.property} slug={report.slug?.current} />

            {isTelly && <TellyFacts report={report} />}
            {isTelly && (
              <TellyJudgeInsights
                eyebrow={report.judgeInsightsEyebrow}
                heading={report.judgeInsightsHeading}
                quotes={report.judgeQuotes ?? []}
              />
            )}
```

- [ ] **Step 4: Render `winnerLists` inside the Telly trend loop**

Find (inside the `isTelly ? (...)` branch, the per-trend `<div key={i} id={\`trend-${num}\`}>` block):

```tsx
                        {quotes.length > 0 && (
                          <QuoteVideoSection
                            eyebrow="What Our Community Is Saying"
                            quotes={quotes}
                            accentColor={accent}
                            background="#ffffff"
                          />
                        )}
                      </div>
                    )
                  })}
```

Replace with:

```tsx
                        {quotes.length > 0 && (
                          <QuoteVideoSection
                            eyebrow="What Our Community Is Saying"
                            quotes={quotes}
                            accentColor={accent}
                            background="#ffffff"
                          />
                        )}
                        {trend.showWinnerLists !== false &&
                          (trend.winnerLists ?? []).map((list, j) => (
                            <WinnerList
                              key={j}
                              heading={list.heading}
                              intro={list.intro}
                              entries={list.entries}
                              accentColor={accent}
                            />
                          ))}
                      </div>
                    )
                  })}
```

- [ ] **Step 5: Verify — typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors/warnings.

- [ ] **Step 6: Verify — dev server renders**

Run: `npm run dev`, open `http://localhost:3000/2026-state-of-video-report/`, confirm the page still loads with no new console errors (content will still be the old placeholder copy until Task 7 — this step only confirms nothing broke structurally). Stop the dev server after checking.

- [ ] **Step 7: Commit**

```bash
git add src/components/vertical/ReportView.tsx
git commit -m "feat(telly): wire About/Facts/Judge Insights/WinnerList into the Telly render branch"
```

---

### Task 7: Populate the real outline content

**Files:**
- Create: `scripts/migrate-telly-outline-2026.mjs`

**Interfaces:**
- Consumes: all field names from Tasks 1–4. Patches document id `report-telly-2026-state-of-video` only.

- [ ] **Step 1: Write the migration script**

Follow the exact pattern of `scripts/migrate-trends-to-sanity.mjs` (same `createClient` setup reading `SANITY_API_TOKEN` from the environment, project `za6m18kc` / dataset `production`, same `textBlock()` portable-text helper). Transcribe the full T48 Trend Report Outline content (Google Doc `1NL2ooYNVPuBTdWJVpUeUzOVPP4vgAQhpbl0K4gka--I`) into the shapes below, then `client.patch('report-telly-2026-state-of-video').set({ ...fields }).commit()`.

Fields to `.set()` (do **not** touch `formFields`, `creditsCreatedBy`, `creditsContributors`, `signupTitle`, `signupSubhead`, `metaTitle`, `metaDescription`, `heroHeadline`, `heroSubtitle`, `heroButtonText`, `status` — all out of scope per Global Constraints):

- `aboutEyebrow`, `aboutHeading`, `aboutBody` (portable text), `aboutCtaText`, `aboutCtaUrl` — from outline Page 2 ("About the Telly Awards": founded 1979, 13,000+ entries/50 states/5 continents, categories accepted, Dec 11 2026 early deadline, enter at tellyawards.com). Leave `aboutLogo` unset — no CMS image upload path available from this script; note to Ann that it falls back to the static `/telly/telly-logo-black.svg` until someone uploads a logo image in Studio.
- `letterBody` (portable text) + `letterAuthors` — from outline Page 3 ("What's Inside This Report?", Amanda Needham). **Read the current `letterAuthors[0]` and `letterBody` on the live document first** (already fetched once this session — name/title/photo may already be partially set from the Sept placeholder pass) and merge rather than blindly overwrite; set `name: "Amanda Needham"` and flag in the script's console output that her title and headshot still need confirming/uploading in Studio (the outline doesn't supply either).
- `keyFindings` (4 items) — replace the current wrong Anthem-flavored list with: 01 Shows & Series (anchor `trend-01`), 02 Branded Content & Marketing (anchor `trend-02`), 03 Social Impact Work (anchor `trend-03`), 04 Channel Surfing (anchor `trend-04`), alternating `hoverColor` `#ef1e40`/`#c23799`.
- `factsEntryCount: "13,876"`, `factsEntryLabel`, `factsJudgeCount: "575"`, `factsJudgeLabel`, `factsTopTitlesHeading` + `factsTopTitles` (10 titles from outline Page 5), `factsTopCitiesNationalHeading` + `factsTopCitiesNational` (New York, Los Angeles, Washington D.C., Atlanta, Chicago), `factsTopCitiesInternationalHeading` + `factsTopCitiesInternational` (Dubai, London, Beijing, Doha, Toronto).
- `judgeInsightsEyebrow`, `judgeInsightsHeading`, `judgeQuotes` (8 judges from outline Page 6: Janet Graham Borba/HBO, Lauren Moraski/PepsiCo, Marielle Bobo/Transform, Michael Sternoff/Amazon Leo, David E. Cid/Remezcla, Christina Richardson, Enrique Montalvo, Prerna Suri — each `quoteText` a portable-text array of that judge's full quote(s) from the outline, `linkedInUrl` omitted where the outline doesn't supply one).
- `sectionCovers` (4, replacing the current 3) + `trendSections` (4, replacing the current 8 Anthem-placeholder trends) — one pair per outline section:
  1. **Shows & Series** (`#ef1e40`) — `trendBody` from the outline's intro paragraph; `dataStats: [{value: 85, label: "believe microseries are changing how TV and online shows & series will be developed and distributed"}]`; `expertQuotes: [Michael Sternoff's "two ways to deal with it" quote]`; `winnerLists`: "Official Win List: Media and Entertainment Networks" (7 entries: Asharq Network, CGTN, National Geographic, Al Jazeera English, Korean Broadcasting Services, Hearst Media Production Group, Fortune Media (USA) Corp) + "Wins to Watch: Vertical Video Series" (6 entries: dan rodo productions, sesame workshop, mad realities, Reelshort, Bilt [`highlight: true`], american picture company).
  2. **Branded Content & Marketing** (`#c23799`) — `trendBody` from outline intro; `winnerLists`: "Branded Content (Official Win List)" (7 entries: Gibson, Qatar Museums, Black Tent, Mad Arte Digitales, Warner Bros Discovery, Marriott International, Disney Experiences) + "Online Commercials That Made Waves This Year" (6 entries: Gravity Global, Sixtwentysix, DuskHouse, Alter Ego, Amazon Leo, Demonstrate X DDW).
  3. **Social Impact Work** (`#ef1e40`) — `trendBody` from outline intro + the "Our Partners Work" closing line (NonFiction Hotlist, Film Fatales, Fwd Doc, Seed & Spark, Video Consortium, Reel Abilities, NYWIFT) appended as its own paragraph; `expertQuotes: [Marielle Bobo's "democratization of storytelling" line]`; `winnerLists`: "Official Win List: Top Nonprofits By Gold" (6 entries, `metricValue` holding the gold count — William Freund/fStop Foundation, Delaney Bishop/Operation Smile, Danielle Broza/The WNET Group, Gary Dixon/The Foundation for a Better Life, John Phelps/ALSAC St. Jude, Tom Costanza/World Vision — **use the "BY GOLD" list**, not the struck-through "FORMER LIST" above it in the doc) + "Wins to Watch: Top 5 Documentaries" (5 entries: Olympic Channel & IOC, Segal Family Foundation, Traveling Picture Show Company, Good Studios, Lucky Day [`highlight: true`]).
  4. **Channel Surfing** (`#c23799`) — `trendBody` from outline intro; `dataStats: [{value: 89, label: "agree that AI is changing the way we make and consume video forever"}]`; `expertQuotes: [Maggie Luo's AI quote]`; `winnerLists` (4): "Wins to Watch: Top 5 Music Videos" (5: Modern Post, Slick Rick Music Corps, Elastic People, Partizan Entertainment, Action Factory), "Top 5 Animation" (7: Paramount TV Media, BUCK, bento box, Laundry, Epipheo, Abema, Bodega Virtual), "Top 5 Sports" (6: Melbourne Cricket Club, Green Bay Packers, Blue Ox, Portland Trailblazers, Olympic Channel, ESPN), "Wins to Watch: Top 5 AI" (5: Cisco, ISLA, UNSHOT, Melt Pictures, Fourth Crown Studios LLC).

  For every `winEntry`: `workUrl` is the link directly attached to the work title in the outline; `metricValue`/`metricPlatform`/`metricUrl` come from the trailing "56k linkedin" / "1.1M insta" style annotations (map `insta` → `metricPlatform: 'instagram'`); omit `metricValue`/`metricPlatform`/`metricUrl` entirely where the outline gives none (e.g. CGTN, Korean Broadcasting Services, Qatar Museums).

  `sectionCover.subtitle`/`.copy` come from each section's outline intro paragraph (split the paragraph's hook sentence into `subtitle`, the rest into `copy`); `sectionNumber` `"01"`–`"04"`.

- [ ] **Step 2: Dry-run against a local JSON dump first**

Before hitting the real dataset, have the script log the full patch payload (`console.log(JSON.stringify(patchFields, null, 2))`) and `process.exit(0)` when run with `--dry-run`. Run: `node scripts/migrate-telly-outline-2026.mjs --dry-run` and read the output — confirm all 4 trend sections, all winner-list entry counts, and the facts/judge-insights content look right before writing.

- [ ] **Step 3: Run it for real**

Run: `SANITY_API_TOKEN=$(grep SANITY_API_TOKEN .env.local | cut -d= -f2-) node scripts/migrate-telly-outline-2026.mjs`
Expected: script logs a successful patch (new `_rev`).

- [ ] **Step 4: Verify in Studio + on the live dev server**

Run: `npm run dev`, open `http://localhost:3000/studio/structure/report;report-telly-2026-state-of-video` and confirm the new groups (About Page, Facts Page, Judge Insights) show populated content and the Section Covers/Trends show the 4 real sections. Then open `http://localhost:3000/2026-state-of-video-report/` and scroll the full report, confirming: About page renders, Facts page renders with both stats + 3 ranked lists, Judge Insights renders 8 quotes, each of the 4 sections renders its cover + body + winner list(s) with working links. Stop the dev server after checking.

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-telly-outline-2026.mjs
git commit -m "feat(telly): populate T48 trend report outline content into Sanity"
```

---

### Task 8: Open the PR

- [ ] **Step 1: Push the branch and open a PR against `main`**

```bash
git push -u origin ann/telly-t48-trend-report
gh pr create --title "feat(telly): T48 trend report content" --body "$(cat <<'EOF'
Builds out the Telly 2026 State of Video Report from the T48 Trend Report Outline doc.

Telly-only changes (no other property/template touched):
- New `winEntry`/`winnerList` schema objects + `trendSection.winnerLists` for ranked winner lists (Official Win List / Wins to Watch), rendered by the new `WinnerList` component.
- New Telly-only report fields + components for the About page (`TellyAbout`), Facts page (`TellyFacts`), and standalone Judge Insights page (`TellyJudgeInsights`).
- Populated `report-telly-2026-state-of-video` with the outline's real content: About copy, Welcome Letter, Table of Contents, Facts, 8 judge quotes, and the 4 real sections (Shows & Series / Branded Content & Marketing / Social Impact Work / Channel Surfing) with their winner lists — replacing the Sept placeholder content (8 Anthem-flavored trend sections, 3 generic section covers, wrong ToC).

Still needs a human: Amanda Needham's title + headshot (outline doesn't supply either), and a real Telly logo image upload for the About page (falls back to the existing `/telly/telly-logo-black.svg` until then).

Report stays in `draft` status — flip to Live in Studio once reviewed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: Report back to Ann**

Summarize: branch name, PR URL, what's live vs. still needs a human (Amanda's title/photo, Telly logo upload), and that `status` is still `draft` so nothing is publicly visible yet.
