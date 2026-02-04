import { defineType } from 'sanity'

export default defineType({
  name: 'heroStat',
  title: 'Hero Stat',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() },
    { name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() },
  ],
})
