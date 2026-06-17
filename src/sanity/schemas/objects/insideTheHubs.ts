import { defineType } from 'sanity'

export default defineType({
  name: 'insideTheHubs',
  title: 'Inside the Hubs',
  type: 'object',
  description:
    'Three-column module breaking down how a trend manifests in Spain, Italy, and Portugal',
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow Label',
      type: 'string',
      initialValue: 'Inside the Hubs',
      description: 'Small uppercase label above the columns',
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Optional — a short headline above the three columns',
    },
    {
      name: 'spainCopy',
      title: 'Spain Copy',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text for the Spain column',
    },
    {
      name: 'italyCopy',
      title: 'Italy Copy',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text for the Italy column',
    },
    {
      name: 'portugalCopy',
      title: 'Portugal Copy',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text for the Portugal column',
    },
  ],
  preview: {
    select: { eyebrow: 'eyebrow', heading: 'heading' },
    prepare({ eyebrow, heading }) {
      return { title: heading || eyebrow || 'Inside the Hubs' }
    },
  },
})
