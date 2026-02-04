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
