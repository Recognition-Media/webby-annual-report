import { defineType } from 'sanity'

// ─────────────────────────────────────────────────────────────────
// Shared Influence content blocks + slab wrapper.
//
// Editors compose a section by adding slabs to trendSection.contentSlabs.
// Each slab has left + right column arrays that can hold any of the
// block types below. Renderer maps block types → React components.
// ─────────────────────────────────────────────────────────────────

// Body Block — PortableText paragraph(s)
export const siBodyBlock = defineType({
  name: 'siBodyBlock',
  title: 'Body Block',
  type: 'object',
  fields: [
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text paragraphs. Bold and links supported.',
    },
  ],
  preview: {
    select: { body: 'body' },
    prepare({ body }) {
      const firstBlock = Array.isArray(body) ? body[0] : undefined
      const firstText = firstBlock?.children?.map((c: { text?: string }) => c.text).join(' ') || ''
      return {
        title: 'Body Block',
        subtitle: firstText.slice(0, 80) || '(empty)',
      }
    },
  },
})

// Section Header Block — big Roc Grotesk heading + accent divider
export const siSectionHeaderBlock = defineType({
  name: 'siSectionHeaderBlock',
  title: 'Section Header Block',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    },
    {
      name: 'level',
      title: 'Heading Level',
      type: 'number',
      options: {
        list: [
          { title: 'Heading 1 (64px)', value: 1 },
          { title: 'Heading 2 (48px)', value: 2 },
          { title: 'Heading 3 (36px) — default', value: 3 },
          { title: 'Heading 4 (28px)', value: 4 },
          { title: 'Heading 5 (22px)', value: 5 },
          { title: 'Heading 6 (18px)', value: 6 },
        ],
      },
      initialValue: 3,
    },
  ],
  preview: {
    select: { title: 'title', level: 'level' },
    prepare({ title, level }) {
      return {
        title: `Section Header (H${level ?? 3})`,
        subtitle: title || '(empty)',
      }
    },
  },
})

// Audience Block — small caps label + body + optional inline pull quote
export const siAudienceBlock = defineType({
  name: 'siAudienceBlock',
  title: 'Audience Block',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. "If You Are A Creator", "If You Are An Impact Leader"',
      validation: (r) => r.required(),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text paragraphs. Bold and links supported.',
    },
    {
      name: 'inlineQuote',
      title: 'Inline Pull Quote (optional)',
      type: 'siPullQuoteBlock',
      description: 'When set, renders below the body inside this block.',
    },
  ],
  preview: {
    select: { label: 'label' },
    prepare({ label }) {
      return { title: 'Audience Block', subtitle: label || '(empty)' }
    },
  },
})

// Pull Quote Block — quote + attribution + optional headshot
export const siPullQuoteBlock = defineType({
  name: 'siPullQuoteBlock',
  title: 'Pull Quote Block',
  type: 'object',
  fields: [
    { name: 'quote', title: 'Quote', type: 'text', rows: 3, validation: (r) => r.required() },
    { name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() },
    { name: 'role', title: 'Role / Title', type: 'string' },
    { name: 'headshot', title: 'Headshot (optional)', type: 'image', options: { hotspot: true } },
  ],
  preview: {
    select: { name: 'name', quote: 'quote', headshot: 'headshot' },
    prepare({ name, quote, headshot }) {
      return {
        title: 'Pull Quote',
        subtitle: `${name || '(no name)'} — ${quote?.slice(0, 50) || ''}...`,
        media: headshot,
      }
    },
  },
})

// Video Block — Sanity file upload + attribution
export const siVideoBlock = defineType({
  name: 'siVideoBlock',
  title: 'Video Block',
  type: 'object',
  fields: [
    {
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'Upload mp4 directly. No 100MB limit — Sanity hosts.',
    },
    { name: 'name', title: 'Name / Title', type: 'string', description: 'e.g. "Jaclynn Brennan"' },
    { name: 'title', title: 'Attribution', type: 'string', description: 'e.g. "Founder, Creative Duality"' },
    {
      name: 'orientation',
      title: 'Orientation',
      type: 'string',
      options: {
        list: [
          { title: 'Landscape 16:9 — fills column width', value: 'landscape' },
          { title: 'Portrait 9:16 — 480px tall, caption alongside', value: 'portrait' },
        ],
      },
      initialValue: 'landscape',
    },
    { name: 'eyebrow', title: 'Eyebrow (optional)', type: 'string', description: 'Small caps label above the video (e.g. "Watch"). Leave blank to omit.' },
  ],
  preview: {
    select: { name: 'name', title: 'title', orientation: 'orientation' },
    prepare({ name, title, orientation }) {
      return {
        title: `Video Block (${orientation || 'landscape'})`,
        subtitle: name ? `${name}${title ? ' — ' + title : ''}` : '(unset)',
      }
    },
  },
})

// Tips Block — titled numbered list
export const siTipsBlock = defineType({
  name: 'siTipsBlock',
  title: 'Tips Block',
  type: 'object',
  fields: [
    { name: 'title', title: 'Title', type: 'string', initialValue: 'Tips for Success' },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'text', rows: 2 }],
      description: 'Short bullet-length statements. Rendered as a numbered list.',
    },
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0
      return { title: 'Tips Block', subtitle: `${title || 'Tips'} · ${count} item${count === 1 ? '' : 's'}` }
    },
  },
})

// Content Slab — two-column wrapper containing block arrays
const BLOCK_TYPES = [
  { type: 'siSectionHeaderBlock' },
  { type: 'siBodyBlock' },
  { type: 'siAudienceBlock' },
  { type: 'siPullQuoteBlock' },
  { type: 'siVideoBlock' },
  { type: 'siTipsBlock' },
]

export const siContentSlab = defineType({
  name: 'siContentSlab',
  title: 'Content Slab',
  type: 'object',
  fields: [
    {
      name: 'leftBlocks',
      title: 'Left Column Blocks',
      type: 'array',
      of: BLOCK_TYPES,
    },
    {
      name: 'rightBlocks',
      title: 'Right Column Blocks',
      type: 'array',
      of: BLOCK_TYPES,
    },
  ],
  preview: {
    select: { left: 'leftBlocks', right: 'rightBlocks' },
    prepare({ left, right }) {
      const l = Array.isArray(left) ? left.length : 0
      const r = Array.isArray(right) ? right.length : 0
      return {
        title: 'Content Slab',
        subtitle: `${l} left block${l === 1 ? '' : 's'} · ${r} right block${r === 1 ? '' : 's'}`,
      }
    },
  },
})
