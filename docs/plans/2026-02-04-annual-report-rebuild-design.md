# Webby Awards Annual Report — Rebuild Design

## Overview

Rebuild the Webby Awards annual report (currently a static WordPress page) as a reusable, CMS-backed site. Editors can publish a new report each year without developer involvement. The site includes a configurable signup gate for lead capture, scroll-triggered animations, and analytics integration.

**Reference:** https://www.webbyawards.com/wp-content/uploads/sites/4/reports/2025-awards-report/?v11

## Tech Stack

| Layer       | Technology                  |
| ----------- | --------------------------- |
| Frontend    | Next.js + Framer Motion     |
| CMS         | Sanity (with embedded Studio) |
| Database    | DynamoDB (signup data)      |
| Hosting     | AWS Amplify                 |
| Repo        | GitHub                      |
| Analytics   | GA, Facebook Pixel, Google Ads |

## Architecture

```
[Sanity Studio] --> [Sanity API] --> [Next.js App] --> [AWS Amplify]
                                          |
                                    [DynamoDB]
                                   (signup data)
```

- Editors manage all content in Sanity Studio, hosted at `/studio`
- Next.js fetches content from Sanity's API and renders the public report
- Signup form submissions are saved to DynamoDB via a Next.js API route
- AWS Amplify builds and deploys on every push to `main`
- Content changes in Sanity are reflected via CDN or on-demand revalidation

## Content Model (Sanity Schema)

### Report (main document)

- `year` — number
- `title` — string
- `slug` — slug (e.g. `2025-awards-report`)
- `status` — string (draft / live)
- `metaTitle` — string
- `metaDescription` — text
- `shareImage` — image

### Intro Section

- `headerImage` — image (logo lockup)
- `letterBody` — rich text (block content)
- `letterAuthors` — array of { name, title }
- `heroStats` — array of { label, value } (e.g. "Entries" / "13,000")

### Trend Sections (array, ordered)

- `trendTitle` — string
- `trendBody` — rich text with inline links
- `featuredProjects` — array of { title, url, image (optional) }
- `expertQuotes` — array of { name, title, quoteText, linkedInUrl (optional) }
- `sectionImages` — array of images with alt text

### Image Carousel

- `images` — array of { image, caption }

### Signup Gate

- `formFields` — array of { label, fieldType (text/email/url/dropdown), required (boolean), dropdownOptions (optional) }
- `submitButtonText` — string
- `successMessage` — text

### Analytics

- `gaTrackingId` — string
- `facebookPixelId` — string
- `googleAdsId` — string

### Footer

- `footerLinks` — array of { label, url }
- `sponsorLogos` — array of images
- `ceremonyDetails` — rich text

## Routes

| Route              | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `/`                | Redirects to latest live report              |
| `/reports/[slug]`  | Public report page                           |
| `/studio`          | Sanity Studio (editor auth)                  |

## Report Page Flow

1. Visitor lands on `/reports/[slug]`
2. Hero section loads: logo, title, animated stat counters (visible to all)
3. Signup gate appears with CMS-configured form fields
4. On submit: data saved to DynamoDB, cookie set, conversion event fired
5. Full report revealed: intro letter, trend sections, carousel, quotes, footer
6. Returning visitors (valid cookie) skip the gate automatically
7. Each year's report requires a new signup (cookie is per-report)

## Frontend Components

| Component        | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `HeroSection`    | Logo, title, animated stat counters                   |
| `SignupGate`     | Dynamic form rendered from CMS field configuration    |
| `IntroLetter`    | Rich text with author attribution                     |
| `TrendSection`   | Body, featured projects, expert quotes, images        |
| `ImageCarousel`  | Swipeable/scrollable image gallery                    |
| `ExpertQuote`    | Styled quote card with name, title, LinkedIn link     |
| `Footer`         | Links, sponsor logos, ceremony info                   |

## Animations (Framer Motion)

- Scroll-triggered fade/slide-in for each section entering the viewport
- Number counters animate up when hero stats become visible
- Smooth transition on signup gate (form fades out, content reveals)
- Subtle hover effects on project links and quote cards

## Signup Data & Export

- **Storage:** DynamoDB table with fields: `id`, `reportSlug`, `formData` (map), `timestamp`, `ip`, `userAgent`
- **Export:** Custom Sanity Studio page at `/studio/signups` — filter by report and date, export as CSV
- **Privacy:** No passwords stored. GDPR consent can be added as a CMS form field.
- **Deduplication:** Based on email + report slug combo

## Analytics

- GA, Facebook pixel, Google Ads loaded via Next.js `<Script>` with `afterInteractive` strategy
- Tracking IDs pulled from the Sanity report document (editable without code deploy)
- Events: page view on report load, custom conversion event on gate form submission

## Deployment

- GitHub repo connected to AWS Amplify
- Push to `main` triggers automatic build and deploy
- Environment variables in Amplify: Sanity project ID, dataset, DynamoDB table name
- DynamoDB access via Amplify IAM role (no keys in code)
- Sanity Studio deploys as part of the Next.js app

## Year-to-Year Editor Workflow

1. Duplicate last year's report in Sanity Studio
2. Update all content: trends, stats, images, letter, form fields
3. Set new report status to "live"
4. Site picks it up automatically — no developer needed
