import { groq } from 'next-sanity'

export const reportBySlugQuery = groq`
  *[_type == "report" && slug.current == $slug][0] {
    _id,
    year,
    title,
    slug,
    property,
    status,
    metaTitle,
    metaDescription,
    shareImage,
    heroHeadline,
    heroSubtitle,
    heroButtonText,
    headerImage,
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
    trendIntroEyebrow,
    trendIntroHeadline,
    trendIntroBody,
    trendIntroStats,
    trendIntroCta,
    trendSections[] {
      enabled,
      trendTitle,
      moduleOrder,
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
        sourceType,
        videoFile { "url": asset->url },
        youtubeUrl,
        aspectRatio,
        name,
        title,
        description
      },
      videoType,
      videoUrl,
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
    signupTitle,
    signupSubhead,
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
