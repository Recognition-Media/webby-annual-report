import { groq } from 'next-sanity'

export const reportBySlugQuery = groq`
  *[_type == "report" && slug.current == $slug][0] {
    _id,
    year,
    title,
    slug,
    status,
    metaTitle,
    metaDescription,
    shareImage,
    headerImage,
    heroStats,
    letterBody,
    letterAuthors,
    carouselImages,
    trendSections[] {
      trendTitle,
      trendBody,
      featuredProjects,
      expertQuotes,
      sectionImages
    },
    formFields,
    submitButtonText,
    successMessage,
    gaTrackingId,
    facebookPixelId,
    googleAdsId,
    footerLinks,
    sponsorLogos,
    ceremonyDetails
  }
`

export const latestReportSlugQuery = groq`
  *[_type == "report" && status == "live"] | order(year desc)[0] {
    slug
  }
`

export const allReportSlugsQuery = groq`
  *[_type == "report" && status == "live"] {
    "slug": slug.current
  }
`
