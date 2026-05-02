import { defineType } from 'sanity'

export default defineType({
  name: 'sectionCover',
  title: 'Section Cover',
  type: 'object',
  fields: [
    {
      name: 'sectionNumber',
      title: 'Section Number',
      type: 'string',
      description: 'e.g. "01", "02", "03", "04"',
      validation: (r) => r.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "The State of Social Impact"',
      validation: (r) => r.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle / Pull Quote',
      type: 'text',
      rows: 2,
      description: 'Italic line under the title — often a quote from the data',
    },
    {
      name: 'copy',
      title: 'Body Copy',
      type: 'text',
      rows: 4,
      description: 'Paragraph below the divider summarizing the section',
    },
    {
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      description: 'Hex color used for the section number and divider',
      options: {
        list: [
          { title: 'Anthem Red', value: '#8C001C' },
          { title: 'Anthem Purple', value: '#D17DD0' },
          { title: 'Anthem Blue', value: '#066DBA' },
          { title: 'Anthem Green', value: '#00B469' },
          { title: 'Anthem Moss', value: '#21261A' },
        ],
      },
    },
  ],
  preview: {
    select: { number: 'sectionNumber', title: 'title' },
    prepare({ number, title }) {
      return { title: `${number || '??'} — ${title || 'Untitled'}` }
    },
  },
})
