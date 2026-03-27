import { defineType } from 'sanity'

export default defineType({
  name: 'dataStat',
  title: 'Data Stat',
  type: 'object',
  fields: [
    { name: 'value', title: 'Percentage Value', type: 'number', validation: (r) => r.required().min(0).max(100) },
    { name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() },
  ],
})
