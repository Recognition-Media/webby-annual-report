import { defineType } from 'sanity'

export default defineType({
  name: 'footerLink',
  title: 'Footer Link',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() },
    { name: 'url', title: 'URL', type: 'url', validation: (r) => r.required() },
  ],
})
