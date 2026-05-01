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
    { name: 'trendIntro', title: 'Trend Intro' },
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
    {
      name: 'property',
      title: 'Property (brand)',
      type: 'string',
      description: 'Drives branding (logo, palette). Independent of layout template.',
      options: {
        list: [
          { title: 'Webby', value: 'webby' },
          { title: 'Anthem', value: 'anthem' },
          { title: 'Telly', value: 'telly' },
          { title: 'Lovie', value: 'lovie' },
        ],
      },
      initialValue: 'webby',
      group: 'core',
    },
    {
      name: 'template',
      title: 'Layout Template',
      type: 'string',
      description:
        'Picks the layout/scroll pattern. Horizontal = Webby-style snap-scroll trend slides. Vertical = Anthem-style top-to-bottom scroll. Independent of brand.',
      options: {
        list: [
          { title: 'Horizontal (Webby-style)', value: 'horizontal' },
          { title: 'Vertical (Anthem-style)', value: 'vertical' },
        ],
      },
      initialValue: 'horizontal',
      validation: (r) => r.required(),
      group: 'core',
    },

    // SEO
    { name: 'metaTitle', title: 'Meta Title', type: 'string', group: 'seo' },
    { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3, group: 'seo' },
    { name: 'shareImage', title: 'Share Image', type: 'image', group: 'seo' },

    // Intro & Hero
    { name: 'heroHeadline', title: 'Hero Headline', type: 'string', group: 'intro', description: 'e.g. "Webby 30: In Review" — use \\n for line break' },
    { name: 'heroSubtitle', title: 'Hero Subtitle', type: 'string', group: 'intro', description: 'e.g. "A deeper look into the 30th Annual Webby Awards"' },
    { name: 'heroButtonText', title: 'Hero Button Text', type: 'string', group: 'intro', initialValue: 'See The Report' },
    { name: 'headerImage', title: 'Header Image / Logo', type: 'image', options: { hotspot: true }, group: 'intro' },

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

    // Trend Intro (gateway slide before trends)
    { name: 'trendIntroEyebrow', title: 'Eyebrow', type: 'string', group: 'trendIntro', description: 'e.g. "About The Trends"' },
    { name: 'trendIntroHeadline', title: 'Headline', type: 'string', group: 'trendIntro' },
    { name: 'trendIntroBody', title: 'Body', type: 'array', of: [{ type: 'block' }], group: 'trendIntro' },
    { name: 'trendIntroStats', title: 'Stats', type: 'array', of: [{ type: 'dataStat' }], group: 'trendIntro', description: 'Percentage bars (same as trend data modules)' },
    { name: 'trendIntroCta', title: 'CTA Button Text', type: 'string', group: 'trendIntro', initialValue: 'SEE THE TRENDS', description: 'Button that starts the trend journey' },

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
    { name: 'signupTitle', title: 'Form Title', type: 'text', rows: 2, group: 'signup', description: 'Supports line breaks. e.g. "Welcome to the\\n30th Annual Webby Awards"' },
    { name: 'signupSubhead', title: 'Form Subhead', type: 'text', rows: 2, group: 'signup', description: 'e.g. "Please provide us with some basic info..."' },
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
    select: { title: 'title', year: 'year', status: 'status', property: 'property' },
    prepare({ title, year, status, property }) {
      return { title: `${title} (${year})`, subtitle: `${property || 'webby'} — ${status}` }
    },
  },
})
