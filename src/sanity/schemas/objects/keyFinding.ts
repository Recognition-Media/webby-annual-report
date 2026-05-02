import { defineType } from 'sanity'

export default defineType({
  name: 'keyFinding',
  title: 'Key Finding',
  type: 'object',
  fields: [
    { name: 'number', title: 'Number', type: 'string', description: 'e.g. "01"', validation: (r) => r.required() },
    { name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() },
    { name: 'description', title: 'Description', type: 'string', description: 'Short subtitle below the title' },
    {
      name: 'hoverColor',
      title: 'Hover Background Color',
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
    { name: 'anchor', title: 'Anchor (DOM id of target section)', type: 'string', description: 'e.g. "section-01" or "thank-you"' },
  ],
  preview: {
    select: { number: 'number', title: 'title' },
    prepare({ number, title }) {
      return { title: `${number || '??'} — ${title || 'Untitled'}` }
    },
  },
})
