import { defineType } from 'sanity'

export default defineType({
  name: 'trendSection',
  title: 'Trend Section',
  type: 'object',
  fieldsets: [
    { name: 'landing', title: 'Intro Page', options: { collapsible: true, collapsed: true } },
    { name: 'data', title: 'Data Module', options: { collapsible: true, collapsed: true } },
    { name: 'hubs', title: 'Inside the Hubs (Lovie)', options: { collapsible: true, collapsed: true } },
    { name: 'tips', title: 'Tips Module', options: { collapsible: true, collapsed: true } },
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
              { title: 'Tips Module', value: 'tips' },
              { title: 'Expert Quotes', value: 'quotes' },
              { title: 'Video Module', value: 'video' },
            ]},
            validation: (r) => r.required(),
          },
        ],
        preview: {
          select: { module: 'module' },
          prepare({ module }) {
            const labels: Record<string, string> = { data: 'Data Module', tips: 'Tips Module', quotes: 'Expert Quotes', video: 'Video Module' }
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

    // Inside the Hubs (Lovie) — three-column country breakdown
    { name: 'showInsideTheHubs', title: 'Show Inside the Hubs', type: 'boolean', initialValue: false, description: 'Lovie reports only. Adds a Spain / Italy / Portugal breakdown alongside this trend.', fieldset: 'hubs' },
    { name: 'insideTheHubs', title: 'Inside the Hubs', type: 'insideTheHubs', hidden: ({ parent }) => parent?.showInsideTheHubs === false, fieldset: 'hubs' },

    // Tips Module — titled numbered list. Used for "Tips for Success"
    // beats in the Shared Influence report (and any other titled
    // short-list callout).
    { name: 'showTips', title: 'Show Tips Module', type: 'boolean', initialValue: false, description: 'Toggle a titled numbered list (e.g. "Tips for Success").', fieldset: 'tips' },
    { name: 'tipsTitle', title: 'Tips Title', type: 'string', description: 'e.g. "Tips for Success", "Best Practices", "Key Takeaways"', hidden: ({ parent }) => parent?.showTips === false, fieldset: 'tips' },
    {
      name: 'tipsItems',
      title: 'Tips Items',
      type: 'array',
      of: [{ type: 'text', rows: 2 }],
      description: 'Short bullet-length statements. Rendered as a numbered list.',
      hidden: ({ parent }) => parent?.showTips === false,
      fieldset: 'tips',
    },

    // Expert Quotes
    { name: 'showQuotes', title: 'Show Expert Quotes', type: 'boolean', initialValue: true, fieldset: 'quotes' },
    { name: 'expertQuotes', title: 'Expert Quotes', type: 'array', of: [{ type: 'expertQuote' }], hidden: ({ parent }) => parent?.showQuotes === false, fieldset: 'quotes' },

    // Video Module
    { name: 'showVideo', title: 'Show Video Module', type: 'boolean', initialValue: false, fieldset: 'video' },
    { name: 'videoFeatureLabel', title: 'Feature Label', type: 'string', description: 'Optional eyebrow above the video (e.g. "Standouts from the Mediterranean")', hidden: ({ parent }) => parent?.showVideo === false, fieldset: 'video' },
    { name: 'trendVideo', title: 'Video', type: 'trendVideo', hidden: ({ parent }) => parent?.showVideo === false, fieldset: 'video' },
    { name: 'videoType', title: 'Video Type (legacy)', type: 'string', hidden: () => true },
    { name: 'videoUrl', title: 'Video URL (legacy)', type: 'string', hidden: () => true },

    // Images
    { name: 'sectionImages', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }] }], fieldset: 'images' },

    // Content Slabs (Shared Influence — Option C repeatable-block pattern).
    // When populated, the Shared Influence renderer prefers this field
    // over the legacy body/quotes/video fields above. Editors compose
    // each slab as a 2-column layout with any combination of blocks
    // (body, header, audience, quote, video, tips).
    {
      name: 'contentSlabs',
      title: 'Content Slabs (Shared Influence)',
      type: 'array',
      of: [{ type: 'siContentSlab' }],
      description: 'Two-column slabs composed from reusable content blocks. Used by the Shared Influence report; other templates ignore this field.',
    },
  ],
  preview: {
    select: { title: 'trendTitle', enabled: 'enabled' },
    prepare({ title, enabled }) {
      return { title: `${enabled === false ? '🚫 ' : ''}${title || 'Untitled Trend'}` }
    },
  },
})
