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
  title: string
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

export interface TrendSection {
  enabled?: boolean
  trendTitle: string
  trendBody?: PortableTextBlock[]
  showFeaturedProjects?: boolean
  featuredProjects?: FeaturedProject[]
  showData?: boolean
  dataEyebrow?: string
  dataHeadline?: string
  dataSubheadline?: string
  dataContext?: string
  dataStats?: DataStat[]
  showQuotes?: boolean
  expertQuotes?: ExpertQuote[]
  showVideo?: boolean
  videoType?: 'local' | 'youtube'
  videoUrl?: string
  sectionImages?: (SanityImage & { alt?: string })[]
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
}

export interface FooterLink {
  label: string
  url: string
}

export interface Report {
  _id: string
  year: number
  title: string
  slug: { current: string }
  status: 'draft' | 'live'
  metaTitle?: string
  metaDescription?: string
  shareImage?: SanityImage
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
  trendSections?: TrendSection[]
  formFields?: FormField[]
  submitButtonText?: string
  successMessage?: string
  gaTrackingId?: string
  facebookPixelId?: string
  googleAdsId?: string
  footerLinks?: FooterLink[]
  sponsorLogos?: SanityImage[]
  ceremonyDetails?: PortableTextBlock[]
}
