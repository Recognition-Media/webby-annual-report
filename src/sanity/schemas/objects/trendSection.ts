import { defineType } from 'sanity'

export default defineType({
  name: 'trendSection',
  title: 'Trend Section',
  type: 'object',
  fieldsets: [
    { name: 'landing', title: 'Intro Page', options: { collapsible: true, collapsed: true } },
    { name: 'data', title: 'Data Module', options: { collapsible: true, collapsed: true } },
    { name: 'quotes', title: 'Expert Quotes', options: { collapsible: true, collapsed: true } },
    { name: 'video', title: 'Video Module', options: { collapsible: true, collapsed: true } },
    { name: 'images', title: 'Images', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    { name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true, description: 'Show or hide this entire trend' },
    { name: 'trendTitle', title: 'Title', type: 'string', validation: (r) => r.required(), fieldset: 'landing' },
    {
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      description: 'Used in the Anthem vertical layout for accent dividers and stats',
      options: {
        list: [
          { title: 'Anthem Red', value: '#8C001C' },
          { title: 'Anthem Purple', value: '#D17DD0' },
          { title: 'Anthem Blue', value: '#066DBA' },
          { title: 'Anthem Green', value: '#00B469' },
          { title: 'Anthem Moss', value: '#21261A' },
        ],
      },
      fieldset: 'landing',
    },

    // Module order — drag to reorder how modules appear in the report
    {
      name: 'moduleOrder',
      title: 'Module Order',
      type: 'array',
      description: 'Drag to reorder how modules appear in the report.',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'module',
            title: 'Module',
            type: 'string',
            options: { list: [
              { title: 'Data Module', value: 'data' },
              { title: 'Expert Quotes', value: 'quotes' },
              { title: 'Video Module', value: 'video' },
            ]},
            validation: (r) => r.required(),
          },
        ],
        preview: {
          select: { module: 'module' },
          prepare({ module }) {
            const labels: Record<string, string> = { data: 'Data Module', quotes: 'Expert Quotes', video: 'Video Module' }
            return { title: labels[module] || module }
          },
        },
      }],
      initialValue: [
        { _type: 'object', module: 'data' },
        { _type: 'object', module: 'quotes' },
        { _type: 'object', module: 'video' },
      ],
    },

    // Landing Page
    { name: 'trendBody', title: 'Body', type: 'array', of: [{ type: 'block' }], fieldset: 'landing' },
    { name: 'showFeaturedProjects', title: 'Show Featured Projects', type: 'boolean', initialValue: true, fieldset: 'landing' },
    { name: 'featuredProjects', title: 'Featured Projects', type: 'array', of: [{ type: 'featuredProject' }], hidden: ({ parent }) => parent?.showFeaturedProjects === false, fieldset: 'landing' },

    // Data Module
    { name: 'showData', title: 'Show Data Module', type: 'boolean', initialValue: false, description: 'Toggle the data/stats phase', fieldset: 'data' },
    { name: 'dataEyebrow', title: 'Data Eyebrow', type: 'string', description: 'Small label above the headline (e.g. "What Judges Said")', hidden: ({ parent }) => parent?.showData === false, fieldset: 'data' },
    { name: 'dataHeadline', title: 'Data Headline', type: 'string', hidden: ({ parent }) => parent?.showData === false, fieldset: 'data' },
    { name: 'dataSubheadline', title: 'Data Subheadline', type: 'text', rows: 2, hidden: ({ parent }) => parent?.showData === false, fieldset: 'data' },
    { name: 'dataContext', title: 'Data Context Line (legacy)', type: 'string', hidden: () => true },
    { name: 'dataStats', title: 'Data Stats', type: 'array', of: [{ type: 'dataStat' }], description: 'Percentage bars shown in the data module', hidden: ({ parent }) => parent?.showData === false, fieldset: 'data' },

    // Expert Quotes
    { name: 'showQuotes', title: 'Show Expert Quotes', type: 'boolean', initialValue: true, fieldset: 'quotes' },
    { name: 'expertQuotes', title: 'Expert Quotes', type: 'array', of: [{ type: 'expertQuote' }], hidden: ({ parent }) => parent?.showQuotes === false, fieldset: 'quotes' },

    // Video Module
    { name: 'showVideo', title: 'Show Video Module', type: 'boolean', initialValue: false, fieldset: 'video' },
    { name: 'trendVideo', title: 'Video', type: 'trendVideo', hidden: ({ parent }) => parent?.showVideo === false, fieldset: 'video' },
    { name: 'videoType', title: 'Video Type (legacy)', type: 'string', hidden: () => true },
    { name: 'videoUrl', title: 'Video URL (legacy)', type: 'string', hidden: () => true },

    // Images
    { name: 'sectionImages', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }] }], fieldset: 'images' },
  ],
  preview: {
    select: { title: 'trendTitle', enabled: 'enabled' },
    prepare({ title, enabled }) {
      return { title: `${enabled === false ? '🚫 ' : ''}${title || 'Untitled Trend'}` }
    },
  },
})
