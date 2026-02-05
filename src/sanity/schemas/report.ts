import { defineType } from 'sanity'

export default defineType({
  name: 'report',
  title: 'Annual Report',
  type: 'document',
  groups: [
    { name: 'core', title: 'Settings', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'intro', title: 'Intro & Hero' },
    { name: 'letter', title: 'Welcome Letter' },
    { name: 'carousel', title: 'Hero Carousel' },
    { name: 'stats', title: 'Stats & Timeline' },
    { name: 'trends', title: 'Trends' },
    { name: 'signup', title: 'Signup Form' },
    { name: 'analytics', title: 'Analytics' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    // Core / Settings
    { name: 'year', title: 'Year', type: 'number', validation: (r) => r.required(), group: 'core' },
    { name: 'title', title: 'Title', type: 'string', validation: (r) => r.required(), group: 'core' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required(), group: 'core' },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['draft', 'live'] },
      initialValue: 'draft',
      group: 'core',
    },

    // SEO
    { name: 'metaTitle', title: 'Meta Title', type: 'string', group: 'seo' },
    { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3, group: 'seo' },
    { name: 'shareImage', title: 'Share Image', type: 'image', group: 'seo' },

    // Intro & Hero
    { name: 'headerImage', title: 'Header Image / Logo', type: 'image', options: { hotspot: true }, group: 'intro' },
    { name: 'heroStats', title: 'Hero Stats', type: 'array', of: [{ type: 'heroStat' }], group: 'intro' },

    // Welcome Letter
    { name: 'letterBody', title: 'Welcome Letter', type: 'array', of: [{ type: 'block' }], group: 'letter' },
    { name: 'letterAuthors', title: 'Letter Authors', type: 'array', of: [{ type: 'letterAuthor' }], group: 'letter' },

    // Carousel
    { name: 'carouselImages', title: 'Image Carousel', type: 'array', of: [{ type: 'carouselImage' }], group: 'carousel' },

    // Stats & Timeline
    { name: 'globalStats', title: 'Global Stats', type: 'array', of: [{ type: 'heroStat' }], group: 'stats', description: '4-quadrant stats: population, internet users, etc.' },
    { name: 'entryStats', title: 'Entry Stats', type: 'array', of: [{ type: 'heroStat' }], group: 'stats', description: 'Entries received, countries, states' },
    { name: 'webbyHistory', title: 'Webby History Text', type: 'text', rows: 5, group: 'stats', description: 'Shown in the blue year-info panel' },
    { name: 'iadasLogo', title: 'IADAS Logo', type: 'image', group: 'stats' },
    { name: 'iadasDescription', title: 'IADAS Description', type: 'text', rows: 8, group: 'stats' },
    { name: 'iadasStats', title: 'IADAS Stats', type: 'array', of: [{ type: 'heroStat' }], group: 'stats' },

    // Trends
    { name: 'trendSections', title: 'Trend Sections', type: 'array', of: [{ type: 'trendSection' }], group: 'trends' },

    // Signup Form
    { name: 'formFields', title: 'Signup Form Fields', type: 'array', of: [{ type: 'formField' }], group: 'signup' },
    { name: 'submitButtonText', title: 'Submit Button Text', type: 'string', initialValue: 'Access Report', group: 'signup' },
    { name: 'successMessage', title: 'Success Message', type: 'text', group: 'signup' },

    // Analytics
    { name: 'gaTrackingId', title: 'GA Tracking ID', type: 'string', group: 'analytics' },
    { name: 'facebookPixelId', title: 'Facebook Pixel ID', type: 'string', group: 'analytics' },
    { name: 'googleAdsId', title: 'Google Ads ID', type: 'string', group: 'analytics' },

    // Footer
    { name: 'footerLinks', title: 'Footer Links', type: 'array', of: [{ type: 'footerLink' }], group: 'footer' },
    { name: 'sponsorLogos', title: 'Sponsor Logos', type: 'array', of: [{ type: 'image' }], group: 'footer' },
    { name: 'ceremonyDetails', title: 'Ceremony Details', type: 'array', of: [{ type: 'block' }], group: 'footer' },
  ],
  orderings: [
    { title: 'Year (Newest)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', year: 'year', status: 'status' },
    prepare({ title, year, status }) {
      return { title: `${title} (${year})`, subtitle: status }
    },
  },
})
