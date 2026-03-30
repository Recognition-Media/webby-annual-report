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
    byTheNumbersEyebrow,
    byTheNumbersStatement,
    entryStats,
    webbyHistory,
    howWeJudgeHeading,
    iadasLogo,
    iadasDescription,
    iadasStats,
    iadasCardTitle,
    iadasCardDescription,
    iadasCardUrl,
    auditorLogo,
    auditorCardTitle,
    auditorCardDescription,
    auditorCardUrl,
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
      dataEyebrow,
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
        headshot,
        headshotUrl
      },
      showVideo,
      trendVideo {
        videoFile { "url": asset->url },
        aspectRatio,
        name,
        title,
        description
      },
      sectionImages
    },
    thankYouEyebrow,
    thankYouHeading,
    thankYouBody,
    thankYouLinkEyebrow,
    thankYouLinkTitle,
    thankYouLinkDescription,
    thankYouLinkUrl,
    thankYouCtaTitle,
    thankYouCtaDescription,
    thankYouCtaUrl,
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
