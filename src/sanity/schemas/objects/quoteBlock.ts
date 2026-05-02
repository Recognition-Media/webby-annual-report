import { defineType } from 'sanity'

export default defineType({
  name: 'quoteBlock',
  title: 'Quote Block',
  type: 'object',
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'What Our Community Is Saying',
    },
    {
      name: 'quotes',
      title: 'Quotes',
      type: 'array',
      of: [{
        type: 'object',
        name: 'quoteBlockQuote',
        title: 'Quote',
        fields: [
          { name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() },
          { name: 'title', title: 'Title / Org', type: 'string' },
          { name: 'text', title: 'Quote Text', type: 'text', rows: 4, validation: (r) => r.required() },
          { name: 'headshot', title: 'Headshot', type: 'image', options: { hotspot: true } },
        ],
        preview: {
          select: { title: 'name', subtitle: 'title' },
        },
      }],
    },
    {
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      options: {
        list: [
          { title: 'Anthem Red', value: '#8C001C' },
          { title: 'Anthem Purple', value: '#D17DD0' },
          { title: 'Anthem Blue', value: '#066DBA' },
          { title: 'Anthem Green', value: '#00B469' },
        ],
      },
    },
    {
      name: 'videoUrl',
      title: 'Video URL (optional)',
      type: 'url',
      description: 'Optional embedded video. Leave blank for no video.',
    },
    {
      name: 'videoLabel',
      title: 'Video Label',
      type: 'string',
      initialValue: 'Watch Video',
    },
    {
      name: 'videoName',
      title: 'Video — Speaker Name',
      type: 'string',
    },
    {
      name: 'videoTitle',
      title: 'Video — Speaker Title',
      type: 'string',
    },
  ],
  preview: {
    select: { eyebrow: 'eyebrow', quotes: 'quotes' },
    prepare({ eyebrow, quotes }) {
      const count = Array.isArray(quotes) ? quotes.length : 0
      return { title: eyebrow || 'Quote Block', subtitle: `${count} quote${count === 1 ? '' : 's'}` }
    },
  },
})
