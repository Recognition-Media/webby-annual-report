import { defineType } from 'sanity'

export default defineType({
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() },
    {
      name: 'fieldType',
      title: 'Field Type',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Email', value: 'email' },
          { title: 'URL', value: 'url' },
          { title: 'Dropdown', value: 'dropdown' },
        ],
      },
      validation: (r) => r.required(),
    },
    { name: 'required', title: 'Required', type: 'boolean', initialValue: false },
    {
      name: 'dropdownOptions',
      title: 'Dropdown Options',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ parent }: { parent: { fieldType?: string } }) => parent?.fieldType !== 'dropdown',
    },
  ],
})
