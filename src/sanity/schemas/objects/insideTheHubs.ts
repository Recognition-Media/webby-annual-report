import { defineType } from 'sanity'

// The seven country slugs this module supports today. Adding a new
// country: extend this list AND wire its sticker path in
// LovieTrendContent's `stickerForCountry` map so the icon renders.
const COUNTRY_OPTIONS = [
  { title: 'Spain', value: 'spain' },
  { title: 'Italy', value: 'italy' },
  { title: 'Portugal', value: 'portugal' },
  { title: 'Sweden', value: 'sweden' },
  { title: 'Denmark', value: 'denmark' },
  { title: 'Finland', value: 'finland' },
  { title: 'Norway', value: 'norway' },
]

export default defineType({
  name: 'insideTheHubs',
  title: 'Inside the Hubs',
  type: 'object',
  description:
    'Column module breaking down how a trend manifests country-by-country. Add one entry per country; the country sticker/icon is picked automatically from the dropdown.',
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
      description: 'Optional — a short headline above the columns',
    },
    {
      name: 'countries',
      title: 'Countries',
      type: 'array',
      description:
        'Add one entry per country. Country stickers are picked automatically from the dropdown selection.',
      of: [
        {
          type: 'object',
          name: 'hubCountry',
          title: 'Country',
          fields: [
            {
              name: 'country',
              title: 'Country',
              type: 'string',
              options: { list: COUNTRY_OPTIONS },
              validation: (r) => r.required(),
            },
            {
              name: 'copy',
              title: 'Copy',
              type: 'array',
              of: [{ type: 'block' }],
              description: 'Rich text for this country column',
            },
          ],
          preview: {
            select: { country: 'country' },
            prepare({ country }) {
              const opt = COUNTRY_OPTIONS.find((c) => c.value === country)
              return { title: opt?.title || 'Untitled country' }
            },
          },
        },
      ],
    },
    // Legacy — kept so previously published Med content still renders
    // if it was ever populated via the Studio. New content should use
    // the `countries` array above.
    {
      name: 'spainCopy',
      title: 'Spain Copy (legacy)',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: true,
    },
    {
      name: 'italyCopy',
      title: 'Italy Copy (legacy)',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: true,
    },
    {
      name: 'portugalCopy',
      title: 'Portugal Copy (legacy)',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: true,
    },
  ],
  preview: {
    select: { eyebrow: 'eyebrow', heading: 'heading', countries: 'countries' },
    prepare({ eyebrow, heading, countries }) {
      const count = Array.isArray(countries) ? countries.length : 0
      return {
        title: heading || eyebrow || 'Inside the Hubs',
        subtitle: count > 0 ? `${count} countr${count === 1 ? 'y' : 'ies'}` : undefined,
      }
    },
  },
})
