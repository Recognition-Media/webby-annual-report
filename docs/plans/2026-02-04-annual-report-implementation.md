# Annual Report Rebuild — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a CMS-backed, reusable annual report site where editors publish new reports each year without developer help.

**Architecture:** Next.js frontend pulls content from Sanity CMS. Signup form submissions stored in DynamoDB via API routes. Hosted on AWS Amplify with auto-deploy from GitHub.

**Tech Stack:** Next.js 14 (App Router), Sanity v3, Framer Motion, DynamoDB (AWS SDK v3), TypeScript, Tailwind CSS

**Design doc:** `docs/plans/2026-02-04-annual-report-rebuild-design.md`

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `.env.local.example`, `.gitignore`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`

**Step 1: Initialize Next.js project**

Run from `/Users/stevework/webby-annual-report`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```
Choose defaults when prompted. This scaffolds into the current directory.

**Step 2: Install dependencies**

```bash
npm install sanity @sanity/vision @sanity/image-url next-sanity framer-motion @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb uuid
npm install -D @types/uuid
```

**Step 3: Create environment variable template**

Create `.env.local.example`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=webby-report-signups
```

**Step 4: Update .gitignore**

Append to `.gitignore`:
```
.env.local
```

**Step 5: Verify it runs**

```bash
npm run dev
```
Expected: Dev server starts on http://localhost:3000

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with dependencies"
```

---

### Task 2: Sanity Project Setup

**Files:**
- Create: `src/sanity/config.ts`
- Create: `src/sanity/client.ts`
- Create: `src/sanity/image.ts`

**Step 1: Create a new Sanity project**

```bash
npx sanity init --env .env.local
```
When prompted:
- Select "Create new project"
- Project name: `webby-annual-report`
- Dataset: `production`
- Project output path: select current directory
- This writes `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` to `.env.local`

**Step 2: Create Sanity config module**

Create `src/sanity/config.ts`:
```typescript
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
```

**Step 3: Create Sanity client**

Create `src/sanity/client.ts`:
```typescript
import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from './config'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
```

**Step 4: Create image URL helper**

Create `src/sanity/image.ts`:
```typescript
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
```

**Step 5: Commit**

```bash
git add src/sanity/
git commit -m "feat: add Sanity client configuration"
```

---

### Task 3: Sanity Schemas

**Files:**
- Create: `src/sanity/schemas/index.ts`
- Create: `src/sanity/schemas/report.ts`
- Create: `src/sanity/schemas/objects/heroStat.ts`
- Create: `src/sanity/schemas/objects/letterAuthor.ts`
- Create: `src/sanity/schemas/objects/trendSection.ts`
- Create: `src/sanity/schemas/objects/featuredProject.ts`
- Create: `src/sanity/schemas/objects/expertQuote.ts`
- Create: `src/sanity/schemas/objects/carouselImage.ts`
- Create: `src/sanity/schemas/objects/formField.ts`
- Create: `src/sanity/schemas/objects/footerLink.ts`

**Step 1: Create object schemas**

Create `src/sanity/schemas/objects/heroStat.ts`:
```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'heroStat',
  title: 'Hero Stat',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() },
    { name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() },
  ],
})
```

Create `src/sanity/schemas/objects/letterAuthor.ts`:
```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'letterAuthor',
  title: 'Letter Author',
  type: 'object',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() },
    { name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() },
  ],
})
```

Create `src/sanity/schemas/objects/featuredProject.ts`:
```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'featuredProject',
  title: 'Featured Project',
  type: 'object',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() },
    { name: 'url', title: 'URL', type: 'url' },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
  ],
})
```

Create `src/sanity/schemas/objects/expertQuote.ts`:
```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'expertQuote',
  title: 'Expert Quote',
  type: 'object',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'quoteText', title: 'Quote', type: 'text', validation: (r) => r.required() },
    { name: 'linkedInUrl', title: 'LinkedIn URL', type: 'url' },
  ],
})
```

Create `src/sanity/schemas/objects/trendSection.ts`:
```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'trendSection',
  title: 'Trend Section',
  type: 'object',
  fields: [
    { name: 'trendTitle', title: 'Title', type: 'string', validation: (r) => r.required() },
    { name: 'trendBody', title: 'Body', type: 'array', of: [{ type: 'block' }] },
    { name: 'featuredProjects', title: 'Featured Projects', type: 'array', of: [{ type: 'featuredProject' }] },
    { name: 'expertQuotes', title: 'Expert Quotes', type: 'array', of: [{ type: 'expertQuote' }] },
    { name: 'sectionImages', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }] }] },
  ],
})
```

Create `src/sanity/schemas/objects/carouselImage.ts`:
```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'carouselImage',
  title: 'Carousel Image',
  type: 'object',
  fields: [
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: (r) => r.required() },
    { name: 'caption', title: 'Caption', type: 'string' },
  ],
})
```

Create `src/sanity/schemas/objects/formField.ts`:
```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() },
    {
      name: 'fieldType',
      title: 'Field Type',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Email', value: 'email' },
          { title: 'URL', value: 'url' },
          { title: 'Dropdown', value: 'dropdown' },
        ],
      },
      validation: (r) => r.required(),
    },
    { name: 'required', title: 'Required', type: 'boolean', initialValue: false },
    {
      name: 'dropdownOptions',
      title: 'Dropdown Options',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ parent }: { parent: { fieldType?: string } }) => parent?.fieldType !== 'dropdown',
    },
  ],
})
```

Create `src/sanity/schemas/objects/footerLink.ts`:
```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'footerLink',
  title: 'Footer Link',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() },
    { name: 'url', title: 'URL', type: 'url', validation: (r) => r.required() },
  ],
})
```

**Step 2: Create the Report document schema**

Create `src/sanity/schemas/report.ts`:
```typescript
import { defineType } from 'sanity'

export default defineType({
  name: 'report',
  title: 'Annual Report',
  type: 'document',
  fields: [
    // Core
    { name: 'year', title: 'Year', type: 'number', validation: (r) => r.required() },
    { name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['draft', 'live'] },
      initialValue: 'draft',
    },

    // SEO
    { name: 'metaTitle', title: 'Meta Title', type: 'string' },
    { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3 },
    { name: 'shareImage', title: 'Share Image', type: 'image' },

    // Intro
    { name: 'headerImage', title: 'Header Image / Logo', type: 'image', options: { hotspot: true } },
    { name: 'heroStats', title: 'Hero Stats', type: 'array', of: [{ type: 'heroStat' }] },

    // Letter
    { name: 'letterBody', title: 'Welcome Letter', type: 'array', of: [{ type: 'block' }] },
    { name: 'letterAuthors', title: 'Letter Authors', type: 'array', of: [{ type: 'letterAuthor' }] },

    // Carousel
    { name: 'carouselImages', title: 'Image Carousel', type: 'array', of: [{ type: 'carouselImage' }] },

    // Trends
    { name: 'trendSections', title: 'Trend Sections', type: 'array', of: [{ type: 'trendSection' }] },

    // Signup gate
    { name: 'formFields', title: 'Signup Form Fields', type: 'array', of: [{ type: 'formField' }] },
    { name: 'submitButtonText', title: 'Submit Button Text', type: 'string', initialValue: 'Access Report' },
    { name: 'successMessage', title: 'Success Message', type: 'text' },

    // Analytics
    { name: 'gaTrackingId', title: 'GA Tracking ID', type: 'string' },
    { name: 'facebookPixelId', title: 'Facebook Pixel ID', type: 'string' },
    { name: 'googleAdsId', title: 'Google Ads ID', type: 'string' },

    // Footer
    { name: 'footerLinks', title: 'Footer Links', type: 'array', of: [{ type: 'footerLink' }] },
    { name: 'sponsorLogos', title: 'Sponsor Logos', type: 'array', of: [{ type: 'image' }] },
    { name: 'ceremonyDetails', title: 'Ceremony Details', type: 'array', of: [{ type: 'block' }] },
  ],
  orderings: [
    { title: 'Year (Newest)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', year: 'year', status: 'status' },
    prepare({ title, year, status }) {
      return { title: `${title} (${year})`, subtitle: status }
    },
  },
})
```

**Step 3: Create schema index**

Create `src/sanity/schemas/index.ts`:
```typescript
import report from './report'
import heroStat from './objects/heroStat'
import letterAuthor from './objects/letterAuthor'
import trendSection from './objects/trendSection'
import featuredProject from './objects/featuredProject'
import expertQuote from './objects/expertQuote'
import carouselImage from './objects/carouselImage'
import formField from './objects/formField'
import footerLink from './objects/footerLink'

export const schemaTypes = [
  report,
  heroStat,
  letterAuthor,
  trendSection,
  featuredProject,
  expertQuote,
  carouselImage,
  formField,
  footerLink,
]
```

**Step 4: Commit**

```bash
git add src/sanity/schemas/
git commit -m "feat: add Sanity schemas for report and all content types"
```

---

### Task 4: Embed Sanity Studio

**Files:**
- Create: `src/sanity/studio.ts`
- Create: `src/app/studio/[[...tool]]/page.tsx`
- Create: `src/app/studio/[[...tool]]/layout.tsx`
- Modify: `next.config.ts`

**Step 1: Create Sanity Studio config**

Create `src/sanity/studio.ts`:
```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { projectId, dataset } from './config'

export default defineConfig({
  name: 'webby-annual-report',
  title: 'Webby Annual Report',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
```

**Step 2: Create Studio route**

Create `src/app/studio/[[...tool]]/page.tsx`:
```typescript
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

Create `src/app/studio/[[...tool]]/layout.tsx`:
```typescript
export const metadata = {
  title: 'Sanity Studio',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
```

**Step 3: Update next.config.ts for Sanity**

Add to `next.config.ts` — ensure images from Sanity CDN are allowed:
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
}

export default nextConfig
```

**Step 4: Verify Studio loads**

```bash
npm run dev
```
Visit http://localhost:3000/studio — Sanity Studio should load with the Report document type visible.

**Step 5: Commit**

```bash
git add src/sanity/studio.ts src/app/studio/ next.config.ts
git commit -m "feat: embed Sanity Studio at /studio route"
```

---

### Task 5: Sanity Queries & TypeScript Types

**Files:**
- Create: `src/sanity/queries.ts`
- Create: `src/sanity/types.ts`

**Step 1: Define TypeScript types**

Create `src/sanity/types.ts`:
```typescript
import type { PortableTextBlock, Image } from 'sanity'

export interface HeroStat {
  label: string
  value: string
}

export interface LetterAuthor {
  name: string
  title: string
}

export interface FeaturedProject {
  title: string
  url?: string
  image?: Image
}

export interface ExpertQuote {
  name: string
  title?: string
  quoteText: string
  linkedInUrl?: string
}

export interface TrendSection {
  trendTitle: string
  trendBody?: PortableTextBlock[]
  featuredProjects?: FeaturedProject[]
  expertQuotes?: ExpertQuote[]
  sectionImages?: (Image & { alt?: string })[]
}

export interface CarouselImage {
  image: Image
  caption?: string
}

export interface FormField {
  label: string
  fieldType: 'text' | 'email' | 'url' | 'dropdown'
  required: boolean
  dropdownOptions?: string[]
}

export interface FooterLink {
  label: string
  url: string
}

export interface Report {
  _id: string
  year: number
  title: string
  slug: { current: string }
  status: 'draft' | 'live'
  metaTitle?: string
  metaDescription?: string
  shareImage?: Image
  headerImage?: Image
  heroStats?: HeroStat[]
  letterBody?: PortableTextBlock[]
  letterAuthors?: LetterAuthor[]
  carouselImages?: CarouselImage[]
  trendSections?: TrendSection[]
  formFields?: FormField[]
  submitButtonText?: string
  successMessage?: string
  gaTrackingId?: string
  facebookPixelId?: string
  googleAdsId?: string
  footerLinks?: FooterLink[]
  sponsorLogos?: Image[]
  ceremonyDetails?: PortableTextBlock[]
}
```

**Step 2: Define GROQ queries**

Create `src/sanity/queries.ts`:
```typescript
import { groq } from 'next-sanity'

export const reportBySlugQuery = groq`
  *[_type == "report" && slug.current == $slug][0] {
    _id,
    year,
    title,
    slug,
    status,
    metaTitle,
    metaDescription,
    shareImage,
    headerImage,
    heroStats,
    letterBody,
    letterAuthors,
    carouselImages,
    trendSections[] {
      trendTitle,
      trendBody,
      featuredProjects,
      expertQuotes,
      sectionImages
    },
    formFields,
    submitButtonText,
    successMessage,
    gaTrackingId,
    facebookPixelId,
    googleAdsId,
    footerLinks,
    sponsorLogos,
    ceremonyDetails
  }
`

export const latestReportSlugQuery = groq`
  *[_type == "report" && status == "live"] | order(year desc)[0] {
    slug
  }
`

export const allReportSlugsQuery = groq`
  *[_type == "report" && status == "live"] {
    "slug": slug.current
  }
`
```

**Step 3: Commit**

```bash
git add src/sanity/queries.ts src/sanity/types.ts
git commit -m "feat: add Sanity GROQ queries and TypeScript types"
```

---

### Task 6: Report Page — Data Fetching & Layout Shell

**Files:**
- Create: `src/app/reports/[slug]/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create report page with data fetching**

Create `src/app/reports/[slug]/page.tsx`:
```typescript
import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { reportBySlugQuery } from '@/sanity/queries'
import type { Report } from '@/sanity/types'
import { ReportView } from '@/components/ReportView'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ReportPage({ params }: Props) {
  const { slug } = await params
  const report = await client.fetch<Report | null>(reportBySlugQuery, { slug })

  if (!report || report.status !== 'live') {
    notFound()
  }

  return <ReportView report={report} />
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const report = await client.fetch<Report | null>(reportBySlugQuery, { slug })

  return {
    title: report?.metaTitle || report?.title || 'Annual Report',
    description: report?.metaDescription || '',
  }
}
```

**Step 2: Create the ReportView client component shell**

Create `src/components/ReportView.tsx`:
```typescript
'use client'

import { useState, useEffect } from 'react'
import type { Report } from '@/sanity/types'
import { HeroSection } from './HeroSection'
import { SignupGate } from './SignupGate'
import { IntroLetter } from './IntroLetter'
import { TrendSection } from './TrendSection'
import { ImageCarousel } from './ImageCarousel'
import { ReportFooter } from './ReportFooter'
import { AnalyticsScripts } from './AnalyticsScripts'

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

export function ReportView({ report }: { report: Report }) {
  const cookieKey = `report-access-${report.slug.current}`
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    if (getCookie(cookieKey)) {
      setHasAccess(true)
    }
  }, [cookieKey])

  function handleSignupComplete() {
    setCookie(cookieKey, 'true', 365)
    setHasAccess(true)
  }

  return (
    <main>
      <AnalyticsScripts report={report} />
      <HeroSection report={report} />

      {!hasAccess ? (
        <SignupGate report={report} onComplete={handleSignupComplete} />
      ) : (
        <>
          <IntroLetter report={report} />
          {report.trendSections?.map((section, i) => (
            <TrendSection key={i} section={section} index={i} />
          ))}
          {report.carouselImages && report.carouselImages.length > 0 && (
            <ImageCarousel images={report.carouselImages} />
          )}
          <ReportFooter report={report} />
        </>
      )}
    </main>
  )
}
```

**Step 3: Create placeholder components**

Create stub files for each component that return a simple `<section>` with the component name. These will be built out in subsequent tasks.

Create `src/components/HeroSection.tsx`:
```typescript
import type { Report } from '@/sanity/types'

export function HeroSection({ report }: { report: Report }) {
  return <section data-component="HeroSection">{report.title}</section>
}
```

Create `src/components/SignupGate.tsx`:
```typescript
import type { Report } from '@/sanity/types'

export function SignupGate({ report, onComplete }: { report: Report; onComplete: () => void }) {
  return <section data-component="SignupGate">Signup Gate Placeholder</section>
}
```

Create `src/components/IntroLetter.tsx`:
```typescript
import type { Report } from '@/sanity/types'

export function IntroLetter({ report }: { report: Report }) {
  return <section data-component="IntroLetter">Intro Letter Placeholder</section>
}
```

Create `src/components/TrendSection.tsx`:
```typescript
import type { TrendSection as TrendSectionType } from '@/sanity/types'

export function TrendSection({ section, index }: { section: TrendSectionType; index: number }) {
  return <section data-component="TrendSection">{section.trendTitle}</section>
}
```

Create `src/components/ImageCarousel.tsx`:
```typescript
import type { CarouselImage } from '@/sanity/types'

export function ImageCarousel({ images }: { images: CarouselImage[] }) {
  return <section data-component="ImageCarousel">Carousel Placeholder</section>
}
```

Create `src/components/ReportFooter.tsx`:
```typescript
import type { Report } from '@/sanity/types'

export function ReportFooter({ report }: { report: Report }) {
  return <footer data-component="ReportFooter">Footer Placeholder</footer>
}
```

Create `src/components/AnalyticsScripts.tsx`:
```typescript
import type { Report } from '@/sanity/types'

export function AnalyticsScripts({ report }: { report: Report }) {
  return null
}
```

**Step 4: Set up home page redirect**

Modify `src/app/page.tsx`:
```typescript
import { redirect } from 'next/navigation'
import { client } from '@/sanity/client'
import { latestReportSlugQuery } from '@/sanity/queries'

export default async function HomePage() {
  const result = await client.fetch<{ slug: { current: string } } | null>(latestReportSlugQuery)

  if (result?.slug?.current) {
    redirect(`/reports/${result.slug.current}`)
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-lg text-gray-500">No published reports yet.</p>
    </main>
  )
}
```

**Step 5: Clean up default layout**

Modify `src/app/layout.tsx` — keep it minimal:
```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Webby Awards Annual Report',
  description: 'The annual report on the state of the internet from The Webby Awards.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Step 6: Verify it builds**

```bash
npm run build
```
Expected: Build succeeds (report page won't render data yet since Sanity has no content, but it should compile).

**Step 7: Commit**

```bash
git add src/app/ src/components/
git commit -m "feat: add report page with data fetching and component shell"
```

---

### Task 7: HeroSection Component

**Files:**
- Modify: `src/components/HeroSection.tsx`
- Create: `src/components/AnimatedCounter.tsx`

**Step 1: Build the animated counter**

Create `src/components/AnimatedCounter.tsx`:
```typescript
'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

interface Props {
  value: string
  label: string
}

function parseNumeric(value: string): { num: number; prefix: string; suffix: string } | null {
  const match = value.match(/^([^0-9]*)([0-9,]+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  return {
    prefix: match[1],
    num: parseFloat(match[2].replace(/,/g, '')),
    suffix: match[3],
  }
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function AnimatedCounter({ value, label }: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const parsed = parseNumeric(value)

  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => formatNumber(Math.round(v)))

  useEffect(() => {
    if (isInView && parsed) {
      animate(count, parsed.num, { duration: 1.5, ease: 'easeOut' })
    }
  }, [isInView, parsed, count])

  if (!parsed) {
    return (
      <div ref={ref} className="text-center">
        <div className="text-4xl font-bold">{value}</div>
        <div className="text-sm opacity-70">{label}</div>
      </div>
    )
  }

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold">
        {parsed.prefix}
        <motion.span>{rounded}</motion.span>
        {parsed.suffix}
      </div>
      <div className="text-sm opacity-70">{label}</div>
    </div>
  )
}
```

**Step 2: Build the HeroSection**

Modify `src/components/HeroSection.tsx`:
```typescript
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Report } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { AnimatedCounter } from './AnimatedCounter'

export function HeroSection({ report }: { report: Report }) {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
      {report.headerImage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={urlFor(report.headerImage).width(400).url()}
            alt={report.title}
            width={400}
            height={100}
            priority
          />
        </motion.div>
      )}

      <motion.h1
        className="mt-8 text-5xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {report.title}
      </motion.h1>

      {report.heroStats && report.heroStats.length > 0 && (
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {report.heroStats.map((stat, i) => (
            <AnimatedCounter key={i} value={stat.value} label={stat.label} />
          ))}
        </motion.div>
      )}
    </section>
  )
}
```

**Step 3: Commit**

```bash
git add src/components/HeroSection.tsx src/components/AnimatedCounter.tsx
git commit -m "feat: build HeroSection with animated stat counters"
```

---

### Task 8: SignupGate Component & API Route

**Files:**
- Modify: `src/components/SignupGate.tsx`
- Create: `src/app/api/signup/route.ts`
- Create: `src/lib/dynamodb.ts`

**Step 1: Create DynamoDB client**

Create `src/lib/dynamodb.ts`:
```typescript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' })
export const docClient = DynamoDBDocumentClient.from(ddbClient)

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'webby-report-signups'

export async function saveSignup(data: {
  id: string
  reportSlug: string
  formData: Record<string, string>
  timestamp: string
  ip: string
  userAgent: string
}) {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: data,
    })
  )
}

export async function getSignups(reportSlug?: string) {
  const params: Record<string, unknown> = { TableName: TABLE_NAME }

  if (reportSlug) {
    Object.assign(params, {
      FilterExpression: 'reportSlug = :slug',
      ExpressionAttributeValues: { ':slug': reportSlug },
    })
  }

  const result = await docClient.send(new ScanCommand(params))
  return result.Items || []
}
```

**Step 2: Create signup API route**

Create `src/app/api/signup/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { saveSignup } from '@/lib/dynamodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reportSlug, formData } = body

    if (!reportSlug || !formData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await saveSignup({
      id: uuidv4(),
      reportSlug,
      formData,
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Failed to save signup' }, { status: 500 })
  }
}
```

**Step 3: Build the SignupGate component**

Modify `src/components/SignupGate.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Report, FormField } from '@/sanity/types'

function FieldInput({ field, value, onChange }: { field: FormField; value: string; onChange: (v: string) => void }) {
  const baseClass = "w-full rounded border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none"

  if (field.fieldType === 'dropdown') {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={baseClass}>
        <option value="">Select...</option>
        {field.dropdownOptions?.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    )
  }

  return (
    <input
      type={field.fieldType}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.label}
      required={field.required}
      className={baseClass}
    />
  )
}

export function SignupGate({ report, onComplete }: { report: Report; onComplete: () => void }) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fields = report.formFields || []

  function updateField(label: string, value: string) {
    setFormData((prev) => ({ ...prev, [label]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportSlug: report.slug.current,
          formData,
        }),
      })

      if (!res.ok) throw new Error('Signup failed')
      onComplete()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.section
        className="mx-auto max-w-md px-6 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.label}>
              <label className="mb-1 block text-sm font-medium">{field.label}{field.required && ' *'}</label>
              <FieldInput
                field={field}
                value={formData[field.label] || ''}
                onChange={(v) => updateField(field.label, v)}
              />
            </div>
          ))}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : report.submitButtonText || 'Access Report'}
          </button>
        </form>
      </motion.section>
    </AnimatePresence>
  )
}
```

**Step 4: Commit**

```bash
git add src/components/SignupGate.tsx src/app/api/signup/ src/lib/dynamodb.ts
git commit -m "feat: add signup gate with dynamic form fields and DynamoDB storage"
```

---

### Task 9: IntroLetter Component

**Files:**
- Modify: `src/components/IntroLetter.tsx`

**Step 1: Build the IntroLetter**

Modify `src/components/IntroLetter.tsx`:
```typescript
'use client'

import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { ScrollReveal } from './ScrollReveal'

export function IntroLetter({ report }: { report: Report }) {
  if (!report.letterBody) return null

  return (
    <ScrollReveal>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="prose prose-lg max-w-none">
          <PortableText value={report.letterBody} />
        </div>

        {report.letterAuthors && report.letterAuthors.length > 0 && (
          <div className="mt-8 space-y-1">
            {report.letterAuthors.map((author, i) => (
              <p key={i} className="text-base">
                <strong>{author.name}</strong>
                {author.title && <span className="text-gray-600"> — {author.title}</span>}
              </p>
            ))}
          </div>
        )}
      </section>
    </ScrollReveal>
  )
}
```

**Step 2: Create shared ScrollReveal wrapper**

This component will be reused across all sections for scroll-triggered animations.

Create `src/components/ScrollReveal.tsx`:
```typescript
'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}
```

**Step 3: Install PortableText renderer**

```bash
npm install @portabletext/react
```

**Step 4: Install Tailwind typography plugin**

```bash
npm install -D @tailwindcss/typography
```

Add to `tailwind.config.ts` plugins array:
```typescript
plugins: [require('@tailwindcss/typography')]
```

**Step 5: Commit**

```bash
git add src/components/IntroLetter.tsx src/components/ScrollReveal.tsx package.json package-lock.json tailwind.config.ts
git commit -m "feat: add IntroLetter component with scroll animations"
```

---

### Task 10: TrendSection Component

**Files:**
- Modify: `src/components/TrendSection.tsx`
- Create: `src/components/ExpertQuoteCard.tsx`

**Step 1: Build the ExpertQuoteCard**

Create `src/components/ExpertQuoteCard.tsx`:
```typescript
'use client'

import { motion } from 'framer-motion'
import type { ExpertQuote } from '@/sanity/types'

export function ExpertQuoteCard({ quote }: { quote: ExpertQuote }) {
  return (
    <motion.blockquote
      className="border-l-4 border-gray-300 pl-6 py-2"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-lg italic">&ldquo;{quote.quoteText}&rdquo;</p>
      <footer className="mt-2 text-sm text-gray-600">
        {quote.linkedInUrl ? (
          <a href={quote.linkedInUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
            <strong>{quote.name}</strong>
          </a>
        ) : (
          <strong>{quote.name}</strong>
        )}
        {quote.title && <span> — {quote.title}</span>}
      </footer>
    </motion.blockquote>
  )
}
```

**Step 2: Build the TrendSection**

Modify `src/components/TrendSection.tsx`:
```typescript
'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { TrendSection as TrendSectionType } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { ExpertQuoteCard } from './ExpertQuoteCard'
import { ScrollReveal } from './ScrollReveal'

export function TrendSection({ section, index }: { section: TrendSectionType; index: number }) {
  return (
    <ScrollReveal>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-6 text-3xl font-bold">{section.trendTitle}</h2>

        {section.trendBody && (
          <div className="prose prose-lg max-w-none">
            <PortableText value={section.trendBody} />
          </div>
        )}

        {section.featuredProjects && section.featuredProjects.length > 0 && (
          <div className="mt-8 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Featured Projects</h3>
            <ul className="space-y-2">
              {section.featuredProjects.map((project, i) => (
                <li key={i}>
                  {project.url ? (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {project.title}
                    </a>
                  ) : (
                    <span>{project.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {section.expertQuotes && section.expertQuotes.length > 0 && (
          <div className="mt-8 space-y-6">
            {section.expertQuotes.map((quote, i) => (
              <ExpertQuoteCard key={i} quote={quote} />
            ))}
          </div>
        )}

        {section.sectionImages && section.sectionImages.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {section.sectionImages.map((img, i) => (
              <Image
                key={i}
                src={urlFor(img).width(600).url()}
                alt={img.alt || ''}
                width={600}
                height={400}
                className="rounded"
              />
            ))}
          </div>
        )}
      </section>
    </ScrollReveal>
  )
}
```

**Step 3: Commit**

```bash
git add src/components/TrendSection.tsx src/components/ExpertQuoteCard.tsx
git commit -m "feat: add TrendSection and ExpertQuoteCard components"
```

---

### Task 11: ImageCarousel Component

**Files:**
- Modify: `src/components/ImageCarousel.tsx`

**Step 1: Build the carousel**

Modify `src/components/ImageCarousel.tsx`:
```typescript
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { CarouselImage } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { ScrollReveal } from './ScrollReveal'

export function ImageCarousel({ images }: { images: CarouselImage[] }) {
  const [current, setCurrent] = useState(0)

  function next() {
    setCurrent((prev) => (prev + 1) % images.length)
  }

  function prev() {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <ScrollReveal>
      <section className="relative mx-auto max-w-4xl overflow-hidden px-6 py-16">
        <div className="relative aspect-video">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={urlFor(images[current].image).width(1200).height(675).url()}
                alt={images[current].caption || ''}
                fill
                className="rounded object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {images[current].caption && (
          <p className="mt-4 text-center text-sm text-gray-500">{images[current].caption}</p>
        )}

        {images.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <button onClick={prev} className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300" aria-label="Previous image">&larr;</button>
            <span className="text-sm text-gray-500">{current + 1} / {images.length}</span>
            <button onClick={next} className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300" aria-label="Next image">&rarr;</button>
          </div>
        )}
      </section>
    </ScrollReveal>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/ImageCarousel.tsx
git commit -m "feat: add ImageCarousel with animated transitions"
```

---

### Task 12: Footer Component

**Files:**
- Modify: `src/components/ReportFooter.tsx`

**Step 1: Build the footer**

Modify `src/components/ReportFooter.tsx`:
```typescript
'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { urlFor } from '@/sanity/image'

export function ReportFooter({ report }: { report: Report }) {
  return (
    <footer className="border-t border-gray-200 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        {report.ceremonyDetails && (
          <div className="prose mb-8">
            <PortableText value={report.ceremonyDetails} />
          </div>
        )}

        {report.sponsorLogos && report.sponsorLogos.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-8">
            {report.sponsorLogos.map((logo, i) => (
              <Image
                key={i}
                src={urlFor(logo).height(40).url()}
                alt="Sponsor"
                width={120}
                height={40}
              />
            ))}
          </div>
        )}

        {report.footerLinks && report.footerLinks.length > 0 && (
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {report.footerLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/ReportFooter.tsx
git commit -m "feat: add ReportFooter component"
```

---

### Task 13: Analytics Integration

**Files:**
- Modify: `src/components/AnalyticsScripts.tsx`

**Step 1: Build analytics component**

Modify `src/components/AnalyticsScripts.tsx`:
```typescript
'use client'

import Script from 'next/script'
import type { Report } from '@/sanity/types'

export function AnalyticsScripts({ report }: { report: Report }) {
  return (
    <>
      {report.gaTrackingId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${report.gaTrackingId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${report.gaTrackingId}');
            `}
          </Script>
        </>
      )}

      {report.facebookPixelId && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${report.facebookPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

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

**Step 2: Add conversion event helper**

Create `src/lib/analytics.ts`:
```typescript
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
  }
}

export function trackSignupConversion() {
  if (typeof window === 'undefined') return

  // Facebook
  window.fbq?.('track', 'Lead')

  // Google Analytics custom event
  window.gtag?.('event', 'sign_up', { method: 'report_gate' })
}
```

**Step 3: Wire conversion event into SignupGate**

In `src/components/SignupGate.tsx`, add at top of file:
```typescript
import { trackSignupConversion } from '@/lib/analytics'
```

In the `handleSubmit` function, after the successful fetch call and before `onComplete()`:
```typescript
trackSignupConversion()
```

**Step 4: Commit**

```bash
git add src/components/AnalyticsScripts.tsx src/components/SignupGate.tsx src/lib/analytics.ts
git commit -m "feat: add analytics scripts and conversion tracking"
```

---

### Task 14: Signup Export Tool in Sanity Studio

**Files:**
- Create: `src/sanity/plugins/signupExport.tsx`
- Modify: `src/sanity/studio.ts`

**Step 1: Create the export tool plugin**

Create `src/sanity/plugins/signupExport.tsx`:
```typescript
import { definePlugin } from 'sanity'
import { UsersIcon } from '@sanity/icons'
import { useState, useEffect, useCallback } from 'react'
import { Card, Stack, Button, Select, Text, Spinner } from '@sanity/ui'

interface Signup {
  id: string
  reportSlug: string
  formData: Record<string, string>
  timestamp: string
}

function SignupExportTool() {
  const [signups, setSignups] = useState<Signup[]>([])
  const [loading, setLoading] = useState(false)
  const [slugFilter, setSlugFilter] = useState('')

  const fetchSignups = useCallback(async () => {
    setLoading(true)
    try {
      const params = slugFilter ? `?reportSlug=${encodeURIComponent(slugFilter)}` : ''
      const res = await fetch(`/api/signups${params}`)
      const data = await res.json()
      setSignups(data.signups || [])
    } catch (err) {
      console.error('Failed to fetch signups', err)
    } finally {
      setLoading(false)
    }
  }, [slugFilter])

  useEffect(() => { fetchSignups() }, [fetchSignups])

  function exportCsv() {
    if (signups.length === 0) return

    const allKeys = new Set<string>()
    signups.forEach((s) => Object.keys(s.formData).forEach((k) => allKeys.add(k)))
    const headers = ['timestamp', 'reportSlug', ...Array.from(allKeys)]

    const rows = signups.map((s) =>
      headers.map((h) => {
        if (h === 'timestamp') return s.timestamp
        if (h === 'reportSlug') return s.reportSlug
        return s.formData[h] || ''
      })
    )

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `signups-${slugFilter || 'all'}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Text size={3} weight="bold">Report Signups</Text>

        <Select value={slugFilter} onChange={(e) => setSlugFilter((e.target as HTMLSelectElement).value)}>
          <option value="">All Reports</option>
        </Select>

        <Button onClick={fetchSignups} text="Refresh" tone="primary" disabled={loading} />

        {loading ? (
          <Spinner />
        ) : (
          <>
            <Text size={1} muted>{signups.length} signups found</Text>
            <Button onClick={exportCsv} text="Export CSV" tone="positive" disabled={signups.length === 0} />
          </>
        )}
      </Stack>
    </Card>
  )
}

export const signupExportPlugin = definePlugin({
  name: 'signup-export',
  tools: [
    {
      name: 'signups',
      title: 'Signups',
      icon: UsersIcon,
      component: SignupExportTool,
    },
  ],
})
```

**Step 2: Create the signups API route**

Create `src/app/api/signups/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getSignups } from '@/lib/dynamodb'

export async function GET(request: NextRequest) {
  try {
    const reportSlug = request.nextUrl.searchParams.get('reportSlug') || undefined
    const signups = await getSignups(reportSlug)
    return NextResponse.json({ signups })
  } catch (error) {
    console.error('Failed to fetch signups:', error)
    return NextResponse.json({ error: 'Failed to fetch signups' }, { status: 500 })
  }
}
```

**Step 3: Register the plugin**

Modify `src/sanity/studio.ts` — add to imports and plugins array:
```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { projectId, dataset } from './config'
import { signupExportPlugin } from './plugins/signupExport'

export default defineConfig({
  name: 'webby-annual-report',
  title: 'Webby Annual Report',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool(), signupExportPlugin()],
  schema: { types: schemaTypes },
})
```

**Step 4: Commit**

```bash
git add src/sanity/plugins/ src/sanity/studio.ts src/app/api/signups/
git commit -m "feat: add signup export tool to Sanity Studio"
```

---

### Task 15: DynamoDB Table Provisioning

**Files:**
- Create: `infra/dynamodb-table.json`

**Step 1: Create CloudFormation template**

Create `infra/dynamodb-table.json`:
```json
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Description": "DynamoDB table for report signups",
  "Resources": {
    "SignupsTable": {
      "Type": "AWS::DynamoDB::Table",
      "Properties": {
        "TableName": "webby-report-signups",
        "AttributeDefinitions": [
          { "AttributeName": "id", "AttributeType": "S" }
        ],
        "KeySchema": [
          { "AttributeName": "id", "KeyType": "HASH" }
        ],
        "BillingMode": "PAY_PER_REQUEST"
      }
    }
  }
}
```

**Step 2: Deploy the table**

```bash
aws cloudformation deploy \
  --template-file infra/dynamodb-table.json \
  --stack-name webby-report-signups \
  --region us-east-1
```
Expected: Stack creates successfully.

**Step 3: Commit**

```bash
git add infra/
git commit -m "infra: add CloudFormation template for DynamoDB signups table"
```

---

### Task 16: AWS Amplify Deployment Config

**Files:**
- Create: `amplify.yml`

**Step 1: Create Amplify build spec**

Create `amplify.yml`:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

**Step 2: Document Amplify setup steps**

These are manual steps in the AWS Console:
1. Go to AWS Amplify > Create new app > GitHub
2. Select the repo and `main` branch
3. Amplify detects Next.js and uses the `amplify.yml` config
4. Add environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `AWS_REGION`, `DYNAMODB_TABLE_NAME`
5. Attach an IAM service role with DynamoDB read/write access to the signups table
6. Deploy

**Step 3: Commit**

```bash
git add amplify.yml
git commit -m "infra: add AWS Amplify build configuration"
```

---

### Task 17: End-to-End Smoke Test

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Create test report in Sanity Studio**

1. Go to http://localhost:3000/studio
2. Create a new Report document
3. Fill in: year, title, slug, status = "live"
4. Add a few hero stats, a welcome letter, one trend section, form fields
5. Publish

**Step 3: Test the report page**

1. Go to http://localhost:3000 — should redirect to the report
2. Verify hero section renders with animated counters
3. Fill out the signup form — should save and reveal full report
4. Refresh — should skip the gate (cookie check)
5. Check DynamoDB table for the signup record

**Step 4: Verify build**

```bash
npm run build
```
Expected: Build succeeds with no errors.

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: address issues found during smoke test"
```

---

## Summary of Tasks

| # | Task | Key Files |
|---|------|-----------|
| 1 | Project scaffolding | `package.json`, Next.js setup |
| 2 | Sanity project setup | `src/sanity/client.ts`, `config.ts` |
| 3 | Sanity schemas | `src/sanity/schemas/**` |
| 4 | Embed Sanity Studio | `src/app/studio/**` |
| 5 | Queries & types | `src/sanity/queries.ts`, `types.ts` |
| 6 | Report page shell | `src/app/reports/[slug]/page.tsx`, components |
| 7 | HeroSection | `AnimatedCounter.tsx`, `HeroSection.tsx` |
| 8 | SignupGate + API | `SignupGate.tsx`, `api/signup/route.ts` |
| 9 | IntroLetter | `IntroLetter.tsx`, `ScrollReveal.tsx` |
| 10 | TrendSection | `TrendSection.tsx`, `ExpertQuoteCard.tsx` |
| 11 | ImageCarousel | `ImageCarousel.tsx` |
| 12 | Footer | `ReportFooter.tsx` |
| 13 | Analytics | `AnalyticsScripts.tsx`, `analytics.ts` |
| 14 | Signup export | `plugins/signupExport.tsx`, `api/signups/` |
| 15 | DynamoDB table | `infra/dynamodb-table.json` |
| 16 | Amplify config | `amplify.yml` |
| 17 | Smoke test | Manual verification |
