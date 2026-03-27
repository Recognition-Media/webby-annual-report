import { defineType } from 'sanity'

export default defineType({
  name: 'trendSection',
  title: 'Trend Section',
  type: 'object',
  fields: [
    { name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true, description: 'Show or hide this entire trend' },
    { name: 'trendTitle', title: 'Title', type: 'string', validation: (r) => r.required() },
    { name: 'trendBody', title: 'Body', type: 'array', of: [{ type: 'block' }] },

    // Featured Projects
    { name: 'showFeaturedProjects', title: 'Show Featured Projects', type: 'boolean', initialValue: true },
    { name: 'featuredProjects', title: 'Featured Projects', type: 'array', of: [{ type: 'featuredProject' }], hidden: ({ parent }) => parent?.showFeaturedProjects === false },

    // Data Module
    { name: 'showData', title: 'Show Data Module', type: 'boolean', initialValue: false, description: 'Toggle the data/stats phase' },
    { name: 'dataHeadline', title: 'Data Headline', type: 'string', hidden: ({ parent }) => parent?.showData === false },
    { name: 'dataSubheadline', title: 'Data Subheadline', type: 'text', rows: 2, hidden: ({ parent }) => parent?.showData === false },
    { name: 'dataContext', title: 'Data Context Line (legacy)', type: 'string', hidden: () => true },
    { name: 'dataStats', title: 'Data Stats', type: 'array', of: [{ type: 'dataStat' }], description: 'Percentage bars shown in the data module', hidden: ({ parent }) => parent?.showData === false },

    // Expert Quotes
    { name: 'showQuotes', title: 'Show Expert Quotes', type: 'boolean', initialValue: true },
    { name: 'expertQuotes', title: 'Expert Quotes', type: 'array', of: [{ type: 'expertQuote' }], hidden: ({ parent }) => parent?.showQuotes === false },

    // Video
    { name: 'showVideo', title: 'Show Video', type: 'boolean', initialValue: false },
    { name: 'videoType', title: 'Video Type', type: 'string', options: { list: [{ title: 'Local (uploaded)', value: 'local' }, { title: 'YouTube', value: 'youtube' }] }, hidden: ({ parent }) => parent?.showVideo === false },
    { name: 'videoUrl', title: 'Video URL', type: 'string', description: 'YouTube URL or path to local video (e.g. /trend-video-test.mp4)', hidden: ({ parent }) => parent?.showVideo === false },

    // Images
    { name: 'sectionImages', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }] }] },
  ],
  preview: {
    select: { title: 'trendTitle', enabled: 'enabled' },
    prepare({ title, enabled }) {
      return { title: `${enabled === false ? '🚫 ' : ''}${title || 'Untitled Trend'}` }
    },
  },
})
