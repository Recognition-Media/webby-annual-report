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
