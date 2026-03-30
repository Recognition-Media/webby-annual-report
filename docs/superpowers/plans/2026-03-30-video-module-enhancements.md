# Video Module Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add CMS-managed video support to any trend section with aspect ratio selection, context captions, and multi-format support.

**Architecture:** New Sanity `trendVideo` object type added to `trendSection`. The existing hardcoded `PhaseVideo` component is refactored to accept CMS data, render videos at the correct aspect ratio, and display a caption below the video. No changes to phase navigation logic.

**Tech Stack:** Sanity CMS (schema + GROQ), TypeScript, React (Next.js static export), Framer Motion

**Spec:** `docs/superpowers/specs/2026-03-30-video-module-enhancements-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/sanity/schemas/objects/trendVideo.ts` | Sanity schema for video object |
| Modify | `src/sanity/schemas/objects/trendSection.ts` | Add `trendVideo` field |
| Modify | `src/sanity/schemas/index.ts` | Register `trendVideo` type |
| Modify | `src/sanity/types.ts` | Add `TrendVideo` interface, update `TrendSection` |
| Modify | `src/sanity/queries.ts` | Add `trendVideo` projection to GROQ query |
| Modify | `src/components/TrendSection.tsx` | Refactor `PhaseVideo`, remove hardcoded video, add aspect ratio + caption |

---

### Task 1: Create `trendVideo` Sanity Schema

**Files:**
- Create: `src/sanity/schemas/objects/trendVideo.ts`
- Modify: `src/sanity/schemas/index.ts:1-21`
- Modify: `src/sanity/schemas/objects/trendSection.ts:1-14`

- [ ] **Step 1: Create the trendVideo schema file**

Create `src/sanity/schemas/objects/trendVideo.ts`:

```ts
import { defineType } from 'sanity'

export default defineType({
  name: 'trendVideo',
  title: 'Trend Video',
  type: 'object',
  fields: [
    {
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: { accept: 'video/*' },
      validation: (r) => r.required(),
    },
    {
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: { list: ['9:16', '16:9', '1:1'], layout: 'radio' },
      initialValue: '9:16',
      validation: (r) => r.required(),
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional — speaker title or role',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Optional — short context about the video',
    },
  ],
})
```

- [ ] **Step 2: Register trendVideo in schema index**

In `src/sanity/schemas/index.ts`, add the import and registration:

```ts
import trendVideo from './objects/trendVideo'
```

Add `trendVideo` to the `schemaTypes` array (after `expertQuote`).

- [ ] **Step 3: Add trendVideo field to trendSection schema**

In `src/sanity/schemas/objects/trendSection.ts`, add after the `sectionImages` field:

```ts
{ name: 'trendVideo', title: 'Video', type: 'trendVideo' },
```

- [ ] **Step 4: Verify Studio loads**

Run: `npm run dev` (if not already running)
Open: `http://localhost:3001/studio`
Navigate to a report → Trend Sections → any trend. Confirm the "Video" field group appears with Video File, Aspect Ratio (radio: 9:16, 16:9, 1:1), Name, Title, and Description fields.

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemas/objects/trendVideo.ts src/sanity/schemas/index.ts src/sanity/schemas/objects/trendSection.ts
git commit -m "feat: add trendVideo Sanity schema for CMS-managed trend videos"
```

---

### Task 2: Update TypeScript Types and GROQ Query

**Files:**
- Modify: `src/sanity/types.ts:46-52`
- Modify: `src/sanity/queries.ts:24-30`

- [ ] **Step 1: Add TrendVideo interface to types.ts**

In `src/sanity/types.ts`, add before the `TrendSection` interface:

```ts
export interface TrendVideo {
  videoFile: { url: string }
  aspectRatio: '9:16' | '16:9' | '1:1'
  name: string
  title?: string
  description?: string
}
```

- [ ] **Step 2: Add trendVideo to TrendSection interface**

In the `TrendSection` interface, add after `sectionImages`:

```ts
trendVideo?: TrendVideo
```

- [ ] **Step 3: Update GROQ query**

In `src/sanity/queries.ts`, update the `trendSections[]` projection inside `reportBySlugQuery` to:

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
},
```

- [ ] **Step 4: Verify build succeeds**

Run: `npm run build`
Expected: Build completes with no TypeScript errors. (The new fields are optional so existing data is fine.)

- [ ] **Step 5: Commit**

```bash
git add src/sanity/types.ts src/sanity/queries.ts
git commit -m "feat: add TrendVideo type and GROQ projection"
```

---

### Task 3: Refactor PhaseVideo Component

This is the main component change. Replace the hardcoded video with CMS-driven video, add aspect ratio support, and add the context caption.

**Files:**
- Modify: `src/components/TrendSection.tsx:21-27` (hasVideo logic)
- Modify: `src/components/TrendSection.tsx:224-239` (PhaseVideo render call)
- Modify: `src/components/TrendSection.tsx:498-642` (PhaseVideo component)

- [ ] **Step 1: Add TrendVideo import**

At the top of `TrendSection.tsx`, update the type import:

```ts
import type { TrendSection as TrendSectionType, TrendVideo } from '@/sanity/types'
```

- [ ] **Step 2: Update hasVideo logic**

In `TrendSection.tsx`, replace line 26:

```ts
// OLD:
const hasVideo = index === 0
// NEW:
const hasVideo = !!section.trendVideo
```

- [ ] **Step 3: Update PhaseVideo render call**

Replace lines 224-239 (the `{hasVideo && (...)}` block) with:

```tsx
{hasVideo && section.trendVideo && (
  <motion.div
    animate={{
      opacity: phase === totalPhases - 1 ? 1 : 0,
    }}
    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: phase === totalPhases - 1 ? 'auto' : 'none',
      zIndex: 20,
    }}
  >
    <PhaseVideo
      trendVideo={section.trendVideo}
      trendColor={trendColor}
      onClose={() => { setVideoClosed(true); setPhase(totalPhases - 2) }}
      isActive={isActive && phase === totalPhases - 1}
    />
  </motion.div>
)}
```

- [ ] **Step 4: Rewrite PhaseVideo component**

Replace the entire `PhaseVideo` function (lines 498-642) with:

```tsx
function PhaseVideo({
  trendVideo,
  trendColor,
  onClose,
  isActive,
}: {
  trendVideo: TrendVideo
  trendColor: string
  onClose: () => void
  isActive: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isActive) {
      video.currentTime = 0
      video.muted = false
      video.play().catch(() => {
        video.muted = true
        setMuted(true)
        video.play()
      })
      setMuted(false)
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isActive])

  function toggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setMuted(videoRef.current.muted)
    }
  }

  function replay() {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }

  // Map CMS aspect ratio to CSS and constraints
  const cssAspectRatio = trendVideo.aspectRatio.replace(':', '/')
  const videoConstraints: React.CSSProperties =
    trendVideo.aspectRatio === '16:9'
      ? { maxWidth: '80vw', maxHeight: '70vh' }
      : trendVideo.aspectRatio === '1:1'
        ? { maxHeight: '60vh', maxWidth: '60vh' }
        : { maxHeight: '70vh', maxWidth: '40vh' } // 9:16

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="no-custom-cursor"
        style={{
          position: 'absolute',
          top: -40,
          right: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30,
          pointerEvents: 'auto',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5">
          <line x1="2" y1="2" x2="12" y2="12" />
          <line x1="12" y1="2" x2="2" y2="12" />
        </svg>
      </button>

      {/* Video */}
      <video
        ref={videoRef}
        src={trendVideo.videoFile.url}
        playsInline
        style={{
          aspectRatio: cssAspectRatio,
          width: 'auto',
          height: 'auto',
          ...videoConstraints,
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      />

      {/* Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: trendVideo.name ? 80 : 12,
          right: 12,
          display: 'flex',
          gap: 8,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={toggleMute}
          className="no-custom-cursor"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
          }}
        >
          {muted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
        <button
          onClick={replay}
          className="no-custom-cursor"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
      </div>

      {/* Context caption below video */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 10,
          borderTop: `2px solid ${trendColor}`,
          width: '100%',
          maxWidth: trendVideo.aspectRatio === '16:9' ? '80vw' : trendVideo.aspectRatio === '1:1' ? '60vh' : '40vh',
        }}
      >
        <p style={{ fontSize: 16, fontWeight: 500, color: '#fff', margin: 0 }}>
          {trendVideo.name}
        </p>
        {trendVideo.title && (
          <p style={{ fontSize: 13, color: '#999', margin: '2px 0 0' }}>
            {trendVideo.title}
          </p>
        )}
        {trendVideo.description && (
          <p style={{ fontSize: 14, color: '#bbb', lineHeight: 1.5, margin: '8px 0 0' }}>
            {trendVideo.description}
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Remove basePath constant**

Remove line 11 (`const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''`) — it was only used for the hardcoded video path and is no longer needed.

- [ ] **Step 6: Verify dev server renders correctly**


Open: `http://localhost:3001/2026-awards-report`
Expected: Trends without a `trendVideo` in CMS behave as before (no video phase). Trend 1 will temporarily lose its video — this is expected until CMS migration in Task 4.

- [ ] **Step 7: Commit**

```bash
git add src/components/TrendSection.tsx
git commit -m "feat: refactor PhaseVideo for CMS-driven video with aspect ratio and captions"
```


---

### Task 4: CMS Migration and Cleanup

**Files:**
- Delete: `public/trend-video-test.mp4` (after uploading to Sanity)

- [ ] **Step 1: Upload existing video to Sanity**

Open: `http://localhost:3001/studio` (or production studio)
Navigate to: Report → 2026 Awards Report → Trend Sections → Trend 1
Fill in the Video field:
- **Video File:** Upload `public/trend-video-test.mp4`
- **Aspect Ratio:** Select `9:16`
- **Name:** (appropriate name for the current video content)
- **Title:** (if applicable)
- **Description:** (if applicable)

Publish the document.

- [ ] **Step 2: Verify video renders from CMS**

Trigger a rebuild or check dev server.
Open: `http://localhost:3001/2026-awards-report`
Navigate to Trend 1, advance through quotes to the video phase.
Expected: Video plays from Sanity CDN, caption appears below with the accent line.

- [ ] **Step 3: Test different aspect ratios**

In the Studio, change Trend 1's aspect ratio to `16:9`, publish, reload.
Expected: Video container switches to landscape layout, constrained by `maxWidth: 80vw`.

Change to `1:1`, publish, reload.
Expected: Square layout, constrained by `maxHeight: 60vh`.

Revert to correct aspect ratio when done.

- [ ] **Step 4: Delete the static video file**

```bash
rm public/trend-video-test.mp4
```

- [ ] **Step 5: Verify build succeeds**

Run: `npm run build`
Expected: Build completes successfully.

- [ ] **Step 6: Commit**

```bash
git rm public/trend-video-test.mp4
git commit -m "chore: remove hardcoded video file, migrated to Sanity CMS"
```
