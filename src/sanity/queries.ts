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
    globalStats,
    entryStats,
    webbyHistory,
    iadasLogo,
    iadasDescription,
    iadasStats,
    letterBody,
    letterAuthors,
    carouselImages,
    trendSections[] {
      enabled,
      trendTitle,
      trendBody,
      showFeaturedProjects,
      featuredProjects,
      showData,
      dataHeadline,
      dataSubheadline,
      dataContext,
      dataStats,
      showQuotes,
      expertQuotes[] {
        name,
        title,
        quoteText,
        linkedInUrl,
        headshotUrl
      },
      showVideo,
      videoType,
      videoUrl,
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
