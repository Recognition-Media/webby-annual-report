import type { PortableTextBlock } from '@portabletext/types'

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface HeroStat {
  label: string
  value: string
}

export interface LetterAuthor {
  name: string
  title?: string
  linkedInUrl?: string
}

export interface FeaturedProject {
  title: string
  url?: string
  image?: SanityImage
}

export interface ExpertQuote {
  name: string
  title?: string
  quoteText: PortableTextBlock[]
  linkedInUrl?: string
  headshot?: SanityImage
  headshotUrl?: string
}

export interface DataStat {
  value: number
  label: string
}

export interface TrendVideo {
  sourceType: 'upload' | 'youtube'
  videoFile?: { url: string }
  youtubeUrl?: string
  aspectRatio: '9:16' | '16:9' | '1:1'
  name: string
  title?: string
  description?: string
}

export interface InsideTheHubs {
  eyebrow?: string
  heading?: string
  spainCopy?: PortableTextBlock[]
  italyCopy?: PortableTextBlock[]
  portugalCopy?: PortableTextBlock[]
}

export interface TrendSection {
  enabled?: boolean
  trendTitle: string
  accentColor?: string
  moduleOrder?: { module: string }[]
  trendBody?: PortableTextBlock[]
  showFeaturedProjects?: boolean
  featuredProjects?: FeaturedProject[]
  showData?: boolean
  dataEyebrow?: string
  dataHeadline?: string
  dataSubheadline?: string
  dataContext?: string
  dataStats?: DataStat[]
  showInsideTheHubs?: boolean
  insideTheHubs?: InsideTheHubs
  showTips?: boolean
  tipsTitle?: string
  tipsItems?: string[]
  showQuotes?: boolean
  expertQuotes?: ExpertQuote[]
  showVideo?: boolean
  videoFeatureLabel?: string
  trendVideo?: TrendVideo
  videoType?: 'local' | 'youtube'
  videoUrl?: string
  sectionImages?: (SanityImage & { alt?: string })[]
  contentSlabs?: SIContentSlab[]
}

// ─────────────────────────────────────────────────────────────────
// Shared Influence content blocks — polymorphic types for the
// contentSlabs field on trendSection. Each block has a _type
// discriminator that matches its Sanity schema name.
// ─────────────────────────────────────────────────────────────────

export interface SIBodyBlock {
  _type: 'siBodyBlock'
  _key?: string
  body?: PortableTextBlock[]
}

export interface SISectionHeaderBlock {
  _type: 'siSectionHeaderBlock'
  _key?: string
  title: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

export interface SIPullQuoteBlock {
  _type: 'siPullQuoteBlock'
  _key?: string
  quote: string
  name: string
  role?: string
  headshot?: SanityImage
}

export interface SIAudienceBlock {
  _type: 'siAudienceBlock'
  _key?: string
  label: string
  body?: PortableTextBlock[]
  inlineQuote?: SIPullQuoteBlock
}

export interface SIVideoBlock {
  _type: 'siVideoBlock'
  _key?: string
  videoFile?: { url?: string }
  name?: string
  title?: string
  orientation?: 'landscape' | 'portrait'
  eyebrow?: string
}

export interface SITipsBlock {
  _type: 'siTipsBlock'
  _key?: string
  title?: string
  items?: string[]
}

export interface SICaseStudyBlock {
  _type: 'siCaseStudyBlock'
  _key?: string
  eyebrow?: string
  title: string
  body?: PortableTextBlock[]
}

export interface SIInstagramEmbedBlock {
  _type: 'siInstagramEmbedBlock'
  _key?: string
  url: string
  caption?: string
}

export interface SIScrollingCard {
  _key?: string
  title: string
  body?: PortableTextBlock[]
}

export interface SIScrollingCardsBlock {
  _type: 'siScrollingCardsBlock'
  _key?: string
  eyebrow?: string
  cards?: SIScrollingCard[]
}

export type SIContentBlock =
  | SIBodyBlock
  | SISectionHeaderBlock
  | SIAudienceBlock
  | SIPullQuoteBlock
  | SIVideoBlock
  | SITipsBlock
  | SICaseStudyBlock
  | SIInstagramEmbedBlock
  | SIScrollingCardsBlock

export interface SIContentSlab {
  _key?: string
  fullWidth?: boolean
  leftBlocks?: SIContentBlock[]
  rightBlocks?: SIContentBlock[]
}

export interface CarouselImage {
  image: SanityImage
  caption?: string
}

export interface FormField {
  label: string
  fieldType: 'text' | 'email' | 'url' | 'dropdown'
  required: boolean
  dropdownOptions?: string[]
  ciofield?: 'none' | 'email' | 'firstName' | 'lastName' | 'company' | 'jobTitle'
}

export interface FooterLink {
  label: string
  url: string
}

export interface KeyFinding {
  number: string
  title: string
  description?: string
  hoverColor?: string
  anchor?: string
}

export interface LovieTakeaway {
  title: string
  body: string
}

export interface CreditPerson {
  name: string
  title?: string
  url?: string
}

export interface SectionCover {
  sectionNumber: string
  title: string
  subtitle?: string
  copy?: string
  accentColor?: string
}

export interface Report {
  _id: string
  year: number
  title: string
  slug: { current: string }
  property?: 'webby' | 'anthem' | 'telly' | 'lovie'
  template?: 'vertical' | 'horizontal'
  signupGateEnabled?: boolean
  status: 'draft' | 'live'
  metaTitle?: string
  metaDescription?: string
  shareImage?: SanityImage
  heroHeadline?: string
  heroSubtitle?: string
  heroButtonText?: string
  headerImage?: SanityImage
  heroStats?: HeroStat[]
  globalStats?: HeroStat[]
  byTheNumbersEyebrow?: string
  byTheNumbersStatement?: import('@portabletext/types').PortableTextBlock[]
  entryStats?: HeroStat[]
  webbyHistory?: string
  howWeJudgeHeading?: string
  iadasDescription?: string
  iadasStats?: HeroStat[]
  iadasLogo?: SanityImage
  iadasCardTitle?: string
  iadasCardDescription?: string
  iadasCardUrl?: string
  auditorLogo?: SanityImage
  auditorCardTitle?: string
  auditorCardDescription?: string
  auditorCardUrl?: string
  letterBody?: PortableTextBlock[]
  letterAuthors?: LetterAuthor[]
  carouselImages?: CarouselImage[]
  trendIntroEyebrow?: string
  trendIntroHeadline?: string
  trendIntroBody?: PortableTextBlock[]
  trendIntroStats?: DataStat[]
  trendIntroCta?: string
  keyFindings?: KeyFinding[]
  /**
   * Newer reports use `sectionCovers` (unlimited-length array). Legacy
   * per-slot fields below stay for reports published before that field
   * existed.
   */
  sectionCovers?: SectionCover[]
  section01Cover?: SectionCover
  section02Cover?: SectionCover
  section03Cover?: SectionCover
  section04Cover?: SectionCover
  trendSections?: TrendSection[]
  lovieTakeaways?: LovieTakeaway[]
  thankYouEyebrow?: string
  thankYouHeading?: string
  thankYouBody?: import('@portabletext/types').PortableTextBlock[]
  thankYouLinkEyebrow?: string
  thankYouLinkTitle?: string
  thankYouLinkDescription?: string
  thankYouLinkUrl?: string
  thankYouCtaTitle?: string
  thankYouCtaDescription?: string
  thankYouCtaUrl?: string
  signupTitle?: string
  signupSubhead?: string
  formFields?: FormField[]
  submitButtonText?: string
  successMessage?: string
  specifier?: string
  gaTrackingId?: string
  facebookPixelId?: string
  googleAdsId?: string
  segmentWriteKey?: string
  footerLinks?: FooterLink[]
  sponsorLogos?: SanityImage[]
  ceremonyDetails?: PortableTextBlock[]
  footerEyebrow?: string
  footerHeadline?: string
  footerSubhead?: string
  footerCtaUrl?: string
  footerBody?: PortableTextBlock[]
  creditsCreatedBy?: CreditPerson[]
  creditsContributors?: CreditPerson[]
}
