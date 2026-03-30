# Video Module Enhancements

## Problem

The video module in the Webby Annual Report trend sections has three limitations:

1. **No context** — viewers see a video but don't know who is speaking or why it's relevant
2. **Hardcoded to Trend 1** — only `index === 0` gets a video; other trends cannot have videos
3. **Only supports 9:16** — the component assumes portrait video; landscape (16:9) and square (1:1) content doesn't display correctly

## Solution

### CMS: New Video Object on Trend Sections

Add a `trendVideo` object field to the `trendSection` schema. Each trend can optionally have one video.

**Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `videoFile` | `file` (accept: `video/*`) | Yes | Uploaded video asset |
| `aspectRatio` | `string` (list: `9:16`, `16:9`, `1:1`) | Yes | Controls video container sizing |
| `name` | `string` | Yes | Speaker name or project/brand name |
| `title` | `string` | No | Speaker title (e.g., "Head of Digital, Acme Corp") |
| `description` | `string` | No | Short context line (e.g., "On how AI is reshaping the awards landscape") |

**Schema definition** — new Sanity object type `trendVideo` in `src/sanity/schemas/objects/trendVideo.ts`:

```ts
defineType({
  name: 'trendVideo',
  title: 'Trend Video',
  type: 'object',
  fields: [
    { name: 'videoFile', title: 'Video File', type: 'file',
      options: { accept: 'video/*' },
      validation: (r) => r.required() },
    { name: 'aspectRatio', title: 'Aspect Ratio', type: 'string',
      options: { list: ['9:16', '16:9', '1:1'], layout: 'radio' },
      initialValue: '9:16',
      validation: (r) => r.required() },
    { name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() },
    { name: 'title', title: 'Title', type: 'string', description: 'Optional — speaker title or role' },
    { name: 'description', title: 'Description', type: 'string', description: 'Optional — short context about the video' },
  ],
})
```

**Register in schema index** (`src/sanity/schemas/index.ts`):

```ts
import trendVideo from './objects/trendVideo'
// Add to schemaTypes array
```

**Add to `trendSection` schema:**

```ts
{ name: 'trendVideo', title: 'Video', type: 'trendVideo' }
```

### TypeScript Types

```ts
export interface TrendVideo {
  videoFile: { url: string }
  aspectRatio: '9:16' | '16:9' | '1:1'
  name: string
  title?: string
  description?: string
}

// Update TrendSection:
export interface TrendSection {
  trendTitle: string
  trendBody?: PortableTextBlock[]
  featuredProjects?: FeaturedProject[]
  expertQuotes?: ExpertQuote[]
  sectionImages?: (SanityImage & { alt?: string })[]
  trendVideo?: TrendVideo  // new
}
```

### GROQ Query Update

Add `trendVideo` to the `trendSections[]` projection in `reportBySlugQuery`:

```groq
trendSections[] {
  trendTitle,
  trendBody,
  featuredProjects,
  expertQuotes,
  sectionImages,
  trendVideo {
    videoFile { "url": asset->url },
    aspectRatio,
    name,
    title,
    description
  }
}
```

### Component Changes: `TrendSection.tsx`

**Remove hardcoded video logic:**
- Remove `const hasVideo = index === 0`
- Replace with `const hasVideo = !!section.trendVideo`
- Remove hardcoded `/trend-video-test.mp4` path
- Use `section.trendVideo.videoFile.url` for the video source (GROQ dereferences the asset, so `videoFile.url` is the resolved URL)

**Update `PhaseVideo` props:**

```ts
interface PhaseVideoProps {
  trendVideo: TrendVideo
  trendColor: string
  onClose: () => void
  isActive: boolean
}
```

**Aspect ratio sizing** — map CMS values (colon) to CSS (slash):
- `'9:16'` → CSS `aspect-ratio: 9/16`, constrained by `maxHeight: 70vh`
- `'16:9'` → CSS `aspect-ratio: 16/9`, constrained by `maxWidth: 80vw`
- `'1:1'` → CSS `aspect-ratio: 1/1`, constrained by `maxHeight: 60vh`

Helper: `aspectRatio.replace(':', '/')` for the CSS value.

**Context caption below the video:**
- Render below the `<video>` element, inside the same container
- Trend-colored accent line (2px) on top of the caption block
- **Name** — always shown, white, 16px, font-weight 500
- **Title** — shown if present, #999, 13px
- **Description** — shown if present, #bbb, 14px, line-height 1.5
- Spacing: 12px gap between video and caption, 8px between name/title and description

**Phase logic unchanged:**
- Video is still the last phase in a trend (after quotes)
- `totalPhases = 1 + quotes.length + (hasVideo ? 1 : 0)` — same formula, just `hasVideo` is now CMS-driven
- Close, mute, replay controls remain the same

### Video Hosting

Videos are uploaded to Sanity and served from Sanity's CDN (`cdn.sanity.io`). This works with the static export since the URLs are external — no server-side rendering needed. The video URL is baked into the HTML at build time.

### Migration Note

The current Trend 1 video (`/trend-video-test.mp4` in the public folder) will stop displaying once the hardcoded logic is removed. Before deploying, create a `trendVideo` entry in Sanity for Trend 1 with the same video uploaded as a file asset. The static mp4 file can be removed from `public/` after migration.

### What Does NOT Change

- Phase navigation logic (advance/retreat/trend-next-or-exit)
- Quote rendering and layout
- Trend subnav behavior
- Close/mute/replay button styling and behavior
- Scroll locking behavior
