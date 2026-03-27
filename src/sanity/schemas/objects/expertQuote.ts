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
    { name: 'headshotUrl', title: 'Headshot URL', type: 'string', description: 'Path to headshot image (e.g. /judges/tom_hale_720.jpg)' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'title' },
  },
})
