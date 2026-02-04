import { defineType } from 'sanity'

export default defineType({
  name: 'featuredProject',
  title: 'Featured Project',
  type: 'object',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() },
    { name: 'url', title: 'URL', type: 'url' },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
  ],
})
