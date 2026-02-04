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
  quoteText: string
  linkedInUrl?: string
}

export interface TrendSection {
  trendTitle: string
  trendBody?: PortableTextBlock[]
  featuredProjects?: FeaturedProject[]
  expertQuotes?: ExpertQuote[]
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
