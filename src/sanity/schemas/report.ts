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
    { name: 'byTheNumbers', title: 'By the Numbers' },
    { name: 'howWeJudge', title: 'How We Judge' },
    { name: 'trends', title: 'Trends' },
    { name: 'thankYou', title: 'Thank You' },
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

    // By the Numbers
    { name: 'byTheNumbersEyebrow', title: 'Section Eyebrow', type: 'string', group: 'byTheNumbers', description: 'e.g. "Webby 30: By the Numbers"' },
    { name: 'byTheNumbersStatement', title: 'Statement (Rich Text)', type: 'array', of: [{ type: 'block' }], group: 'byTheNumbers', description: 'The big headline statement. Use bold for colored highlights.' },
    { name: 'entryStats', title: 'Entry Stats', type: 'array', of: [{ type: 'heroStat' }], group: 'byTheNumbers', description: 'The 4 stat blocks (entries, countries, states, nominees)' },
    { name: 'globalStats', title: 'Global Stats (legacy)', type: 'array', of: [{ type: 'heroStat' }], group: 'byTheNumbers', hidden: () => true },
    { name: 'webbyHistory', title: 'Webby History Text (legacy)', type: 'text', rows: 5, group: 'byTheNumbers', hidden: () => true },

    // How We Judge
    { name: 'howWeJudgeHeading', title: 'Section Heading', type: 'string', group: 'howWeJudge', description: 'e.g. "All work is reviewed by the International Academy of Digital Arts & Sciences."' },
    { name: 'iadasDescription', title: 'IADAS Description', type: 'text', rows: 5, group: 'howWeJudge' },
    { name: 'iadasStats', title: 'IADAS Stats', type: 'array', of: [{ type: 'heroStat' }], group: 'howWeJudge', description: 'e.g. 3,300+ Members, 77 Countries, 1998 Founded' },
    { name: 'iadasLogo', title: 'IADAS Logo', type: 'image', group: 'howWeJudge' },
    { name: 'iadasCardTitle', title: 'IADAS Card Title', type: 'string', group: 'howWeJudge', description: 'e.g. "International Academy of Digital Arts & Sciences"' },
    { name: 'iadasCardDescription', title: 'IADAS Card Description', type: 'string', group: 'howWeJudge' },
    { name: 'iadasCardUrl', title: 'IADAS Card URL', type: 'url', group: 'howWeJudge' },
    { name: 'auditorLogo', title: 'Auditor Logo (e.g. KPMG)', type: 'image', group: 'howWeJudge' },
    { name: 'auditorCardTitle', title: 'Auditor Card Title', type: 'string', group: 'howWeJudge', description: 'e.g. "Official Tabulation Consultant"' },
    { name: 'auditorCardDescription', title: 'Auditor Card Description', type: 'string', group: 'howWeJudge' },
    { name: 'auditorCardUrl', title: 'Auditor Card URL', type: 'url', group: 'howWeJudge' },

    // Trends
    { name: 'trendSections', title: 'Trend Sections', type: 'array', of: [{ type: 'trendSection' }], group: 'trends' },

    // Thank You
    { name: 'thankYouEyebrow', title: 'Eyebrow', type: 'string', group: 'thankYou', description: 'e.g. "Thank You"' },
    { name: 'thankYouHeading', title: 'Heading', type: 'string', group: 'thankYou' },
    { name: 'thankYouBody', title: 'Body', type: 'array', of: [{ type: 'block' }], group: 'thankYou' },
    { name: 'thankYouLinkEyebrow', title: 'Link Card Eyebrow', type: 'string', group: 'thankYou', description: 'e.g. "Learn More"' },
    { name: 'thankYouLinkTitle', title: 'Link Card Title', type: 'string', group: 'thankYou' },
    { name: 'thankYouLinkDescription', title: 'Link Card Description', type: 'string', group: 'thankYou' },
    { name: 'thankYouLinkUrl', title: 'Link Card URL', type: 'url', group: 'thankYou' },
    { name: 'thankYouCtaTitle', title: 'CTA Card Title', type: 'string', group: 'thankYou', description: 'e.g. "Get in Touch"' },
    { name: 'thankYouCtaDescription', title: 'CTA Card Description', type: 'string', group: 'thankYou' },
    { name: 'thankYouCtaUrl', title: 'CTA Card URL', type: 'url', group: 'thankYou' },

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
