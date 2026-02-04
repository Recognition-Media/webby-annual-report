import { defineType } from 'sanity'

export default defineType({
  name: 'letterAuthor',
  title: 'Letter Author',
  type: 'object',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() },
    { name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() },
  ],
})
