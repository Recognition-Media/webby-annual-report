import { groq } from 'next-sanity'

export const reportBySlugQuery = groq`
  *[_type == "report" && slug.current == $slug][0] {
    _id,
    year,
    title,
    slug,
    property,
    template,
    signupGateEnabled,
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
    keyFindings[] { number, title, description, hoverColor, anchor },
    section01Cover { sectionNumber, title, subtitle, copy, accentColor },
    section02Cover { sectionNumber, title, subtitle, copy, accentColor },
    section03Cover { sectionNumber, title, subtitle, copy, accentColor },
    section04Cover { sectionNumber, title, subtitle, copy, accentColor },
    trendSections[] {
      enabled,
      trendTitle,
      accentColor,
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
    ceremonyDetails,
    footerEyebrow,
    footerHeadline,
    footerSubhead,
    footerCtaUrl,
    footerBody,
    creditsCreatedBy[] { name, title, url },
    creditsContributors[] { name, title, url }
  }
`

export const latestReportSlugQuery = groq`
  *[_type == "report" && status == "live"] | order(year desc)[0] {
    slug
  }
`

// Latest live report restricted to a single property (e.g. 'webby', 'anthem').
// Used by the per-property landing routes (/webby, /anthem) so each subdomain
// resolves to its own report regardless of which is "newest" overall.
export const latestReportSlugByPropertyQuery = groq`
  *[_type == "report" && status == "live" && property == $property] | order(year desc)[0] {
    slug
  }
`

export const allReportSlugsQuery = groq`
  *[_type == "report" && status == "live"] {
    "slug": slug.current
  }
`
