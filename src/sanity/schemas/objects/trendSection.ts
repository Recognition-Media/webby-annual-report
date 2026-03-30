import { defineType } from 'sanity'

export default defineType({
  name: 'trendSection',
  title: 'Trend Section',
  type: 'object',
  fields: [
    { name: 'trendTitle', title: 'Title', type: 'string', validation: (r) => r.required() },
    { name: 'trendBody', title: 'Body', type: 'array', of: [{ type: 'block' }] },
    { name: 'featuredProjects', title: 'Featured Projects', type: 'array', of: [{ type: 'featuredProject' }] },
    { name: 'dataContext', title: 'Data Context Line', type: 'string', description: 'e.g. "Of 31 judges surveyed, here\'s how they ranked..."' },
    { name: 'dataStats', title: 'Data Stats', type: 'array', of: [{ type: 'dataStat' }], description: 'Percentage bars shown in the data module phase' },
    { name: 'expertQuotes', title: 'Expert Quotes', type: 'array', of: [{ type: 'expertQuote' }] },
    { name: 'sectionImages', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }] }] },
    { name: 'trendVideo', title: 'Video', type: 'trendVideo' },
  ],
})
