import { defineType } from 'sanity'

export default defineType({
  name: 'lovieTakeaway',
  title: 'Takeaway',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Short headline for this takeaway (e.g. "Creative innovation is decentralising towards the margins")',
      validation: (r) => r.required(),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      description: 'Supporting paragraph (1–3 sentences)',
      validation: (r) => r.required(),
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title || 'Untitled takeaway' }
    },
  },
})
