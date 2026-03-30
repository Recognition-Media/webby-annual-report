import { defineType } from 'sanity'

export default defineType({
  name: 'expertQuote',
  title: 'Expert Quote',
  type: 'object',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'quoteText', title: 'Quote', type: 'array', of: [{ type: 'block' }], validation: (r) => r.required() },
    { name: 'linkedInUrl', title: 'LinkedIn URL', type: 'url' },
    { name: 'headshot', title: 'Headshot', type: 'image', options: { hotspot: true }, description: 'Circular headshot shown next to quote' },
    { name: 'headshotUrl', title: 'Headshot URL (legacy)', type: 'string', hidden: () => true },
  ],
  preview: {
    select: { title: 'name', subtitle: 'title' },
  },
})
