import { defineType } from 'sanity'

export default defineType({
  name: 'report',
  title: 'Annual Report',
  type: 'document',
  fields: [
    // Core
    { name: 'year', title: 'Year', type: 'number', validation: (r) => r.required() },
    { name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['draft', 'live'] },
      initialValue: 'draft',
    },

    // SEO
    { name: 'metaTitle', title: 'Meta Title', type: 'string' },
    { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3 },
    { name: 'shareImage', title: 'Share Image', type: 'image' },

    // Intro
    { name: 'headerImage', title: 'Header Image / Logo', type: 'image', options: { hotspot: true } },
    { name: 'heroStats', title: 'Hero Stats', type: 'array', of: [{ type: 'heroStat' }] },

    // Letter
    { name: 'letterBody', title: 'Welcome Letter', type: 'array', of: [{ type: 'block' }] },
    { name: 'letterAuthors', title: 'Letter Authors', type: 'array', of: [{ type: 'letterAuthor' }] },

    // Carousel
    { name: 'carouselImages', title: 'Image Carousel', type: 'array', of: [{ type: 'carouselImage' }] },

    // Global stats (4-quadrant: population, internet users, etc.)
    { name: 'globalStats', title: 'Global Stats', type: 'array', of: [{ type: 'heroStat' }] },
    // Entry stats (entries received, countries, states)
    { name: 'entryStats', title: 'Entry Stats', type: 'array', of: [{ type: 'heroStat' }] },
    // Webby history blurb (shown in blue year-info panel)
    { name: 'webbyHistory', title: 'Webby History Text', type: 'text', rows: 5 },
    // IADAS section
    { name: 'iadasLogo', title: 'IADAS Logo', type: 'image' },
    { name: 'iadasDescription', title: 'IADAS Description', type: 'text', rows: 8 },
    { name: 'iadasStats', title: 'IADAS Stats', type: 'array', of: [{ type: 'heroStat' }] },

    // Trends
    { name: 'trendSections', title: 'Trend Sections', type: 'array', of: [{ type: 'trendSection' }] },

    // Signup gate
    { name: 'formFields', title: 'Signup Form Fields', type: 'array', of: [{ type: 'formField' }] },
    { name: 'submitButtonText', title: 'Submit Button Text', type: 'string', initialValue: 'Access Report' },
    { name: 'successMessage', title: 'Success Message', type: 'text' },

    // Analytics
    { name: 'gaTrackingId', title: 'GA Tracking ID', type: 'string' },
    { name: 'facebookPixelId', title: 'Facebook Pixel ID', type: 'string' },
    { name: 'googleAdsId', title: 'Google Ads ID', type: 'string' },

    // Footer
    { name: 'footerLinks', title: 'Footer Links', type: 'array', of: [{ type: 'footerLink' }] },
    { name: 'sponsorLogos', title: 'Sponsor Logos', type: 'array', of: [{ type: 'image' }] },
    { name: 'ceremonyDetails', title: 'Ceremony Details', type: 'array', of: [{ type: 'block' }] },
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
