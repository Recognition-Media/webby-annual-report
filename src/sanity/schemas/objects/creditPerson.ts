import { defineType } from 'sanity'

export default defineType({
  name: 'creditPerson',
  title: 'Credit Person',
  type: 'object',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() },
    { name: 'title', title: 'Title / Role', type: 'string', description: 'e.g. "CEO, Civic Nation"' },
    { name: 'url', title: 'Profile URL (optional)', type: 'url', description: 'LinkedIn or other profile — name becomes a hyperlink if set' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'title' },
  },
})
