'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import type { PortableTextComponents } from '@portabletext/react'
import type { Report } from '@/sanity/types'

// Custom renderers so Lovie's CMS-driven letter body matches the
// styling of the hardcoded fallback: paragraphs fade in on scroll,
// bold marks render at 700, links stay editorial.
const loviePortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
    em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#ff6000', textDecoration: 'underline', textUnderlineOffset: 3 }}
      >
        {children}
      </a>
    ),
  },
}

export function IntroLetter({ report }: { report: Report }) {
  const author = report.letterAuthors?.[0]
  const isLovie = report.property === 'lovie'
  const authorName = author?.name || (isLovie ? 'Jesse Feister' : 'Patricia McLoughlin')
  const authorTitle = author?.title || (isLovie ? 'Group Executive Director, The Lovie Awards' : 'General Manager, The Anthem Awards')

  // Color fork — Anthem keeps its dark moss palette with purple accents.
  // Lovie sits on the lime brand background with orange accents and dark text.
  const theme = isLovie
    ? {
        // Beige reading surface — the hero is the only lime moment; the
        // Opening Letter through to the trend sections share this calm
        // base so long-form copy stays editorial and the lime "moments"
        // (hero, Inside The Report cover-art banner) hit harder.
        sectionBg: '#f2eeed',
        eyebrowColor: '#ff6000',
        textColor: '#000000',
        textColorMuted: 'rgba(0,0,0,0.55)',
        accentColor: '#ff6000',
        authorPhoto: '/lovie/jesse-feister-headshot.jpg',
        // Jesse's photo is landscape (3615×2250); Patricia's was portrait.
        // Skip the 5% offset + 5% zoom that were tuned for Patricia — they
        // soften the image and crop Jesse poorly.
        authorPhotoImgClass: 'object-cover object-center',
        bodyTextClasses:
          '[&_p]:mb-5 [&_p]:text-[15px] md:[&_p]:text-[16px] [&_p]:text-black [&_p]:leading-[28px] [&_strong]:text-black [&_strong]:font-medium [&_blockquote]:border-none [&_blockquote]:pl-0',
      }
    : {
        sectionBg: '#21261A',
        eyebrowColor: '#D17DD0',
        textColor: '#E3DDCA',
        textColorMuted: 'rgba(227,221,202,0.5)',
        accentColor: '#D17DD0',
        authorPhoto: '/anthem/patricia-headshot.png',
        authorPhotoImgClass: 'object-cover object-[center_5%] scale-[1.05]',
        bodyTextClasses:
          '[&_p]:mb-5 [&_p]:text-[15px] md:[&_p]:text-[16px] [&_p]:text-[#E3DDCA] [&_p]:leading-[28px] [&_strong]:text-[#E3DDCA] [&_strong]:font-medium [&_blockquote]:border-none [&_blockquote]:pl-0',
      }

  return (
    <section
      id="welcome-letter"
      data-snap
      className="relative overflow-hidden px-5 md:px-[60px] pt-16 pb-4 md:py-28"
      style={{
        background: theme.sectionBg,
      }}
    >
      <div className="relative z-10 flex flex-col md:flex-row gap-10 md:gap-16" style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {/* Left: eyebrow + portrait + author info */}
        <div className="flex-shrink-0 flex flex-col items-center md:items-start md:sticky md:top-28 md:self-start" style={{ width: 'auto' }}>
          {/* Eyebrow above photo */}
          <p
            className="uppercase font-medium mb-5"
            style={{
              fontSize: 11,
              letterSpacing: 4,
              color: theme.eyebrowColor,
            }}
          >
            Introduction
          </p>

          <div className="w-[200px] h-[250px] md:w-[300px] md:h-[390px] relative rounded-lg overflow-hidden mb-4">
            <Image
              src={theme.authorPhoto}
              alt={authorName}
              fill
              sizes="(min-width: 768px) 300px, 200px"
              className={theme.authorPhotoImgClass}
            />
          </div>
          <p className="font-medium text-[15px]" style={{ color: theme.textColor }}>{authorName}</p>
          <p className="text-[13px]" style={{ color: theme.textColorMuted }}>{authorTitle}</p>
        </div>

        {/* Right: letter content */}
        <div className="flex-1">
          {/* Header */}
          <motion.h2
            className={isLovie ? 'mb-6 text-[22px] md:text-[24px] leading-[1.3] font-bold' : 'mb-6 text-[32px] md:text-[32px] leading-[1.2]'}
            style={{
              fontFamily: 'var(--font-display)',
              color: theme.textColor,
              fontStyle: isLovie ? 'normal' : 'italic',
              fontWeight: isLovie ? 700 : 400,
            }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {isLovie ? 'Europe has never been one digital story.' : 'Our community is not waiting.'}
          </motion.h2>

          {/* Divider */}
          <div style={{ width: 40, height: 2, background: theme.accentColor, marginBottom: 24 }} />

          {/* Body */}
          <div
            data-content
            className={`font-normal prose max-w-none ${theme.bodyTextClasses}`}
            style={{
              color: theme.textColor,
              fontSize: 16,
              lineHeight: '28px',
              // Lovie body copy uses Scto Grotesk A Regular (matches the
              // trend body + Inside the Hubs typography). Anthem keeps its
              // Roc Grotesk variable typeface.
              fontFamily: isLovie
                ? "'Scto Grotesk A', -apple-system, sans-serif"
                : "'roc-grotesk-variable', -apple-system, sans-serif",
            }}
          >
            {isLovie ? (
              report.letterBody && report.letterBody.length > 0 ? (
                // CMS-driven path — renders whatever Jordana has written
                // in Studio's "Welcome Letter" rich text field.
                <PortableText value={report.letterBody} components={loviePortableTextComponents} />
              ) : (
                // Hardcoded fallback — used only when the CMS field is
                // empty. Mirrors what shipped before the field was wired.
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    It is a creative mosaic: multiple languages, creative traditions, and ways of imagining what technology should do, all working in tandem. From the Nordics to the Mediterranean, each region brings its own realities, strengths, and ambitions, shaping Europe{"'"}s contribution to the Internet in distinct ways.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <strong style={{ fontWeight: 700 }}>The Lovie Awards x Creative Hubs series</strong> explores those differences. Each report maps a different European region: the communities producing its most influential digital work, the forces shaping its creative identity, and the ideas the rest of the world should be paying attention to.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <strong style={{ fontWeight: 700 }}>The series begins in the Mediterranean, a region that deserves more recognition in global narratives</strong> about creativity and technology in Europe. Spain, Portugal, and Italy approach the internet on their own terms, drawing on deep cultural traditions while experimenting with new forms of storytelling and technology. Their success suggests some of the most interesting ideas are emerging outside the industry{"'"}s usual centres of attention.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    At a pivotal moment for creativity and technology, these regions offer different pathways of building the internet, which the rest of the world can learn from.
                  </motion.p>
                </>
              )
            ) : (
              <>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Last year, the Anthem Awards launched the inaugural State of Social Impact Survey to find the source of what organizations in the United States and beyond were feeling in a time of upheaval. This year, we{"'"}re back to better understand the lasting impact of 2025{"'"}s regulatory, cultural, and funding challenges, and how we move forward together.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  If you{"'"}re reading this report, you probably aren{"'"}t surprised to hear that 2025 wasn{"'"}t a blip. The collapse of USAID, continued federal funding freezes, and the erosion of diversity initiatives have compounded into something that our community is still carrying.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  But we are also seeing renewed investment in grassroots organizing, in new tools and strategies, in cross-sector collaboration, and in the art of telling stories that change perspectives.
                </motion.p>

                {/* Inline pull quote — breaks the text flow */}
                <motion.blockquote
                  className="mb-5 mt-0 py-0 border-none not-italic"
                  style={{ borderLeft: 'none', fontStyle: 'normal' }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <p
                    className="!text-[16px] !leading-[1.5] !mb-0 not-italic"
                    style={{
                      fontFamily: "'roc-grotesk-variable', -apple-system, sans-serif",
                      color: theme.accentColor,
                      fontWeight: 700,
                      fontStyle: 'normal',
                    }}
                  >
                    We{"'"}ve seen something that no policy can easily dismantle: people showing up. From No Kings Day to the Flotilla, and the fight for our neighbors and friends in Minneapolis, collective action is alive, and it is loud.
                  </p>
                </motion.blockquote>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  The Anthem Awards sit at the intersection of nonprofits, brands, agencies, and institutions. A rare vantage point from which to take the sector{"'"}s pulse. This year, we are not just documenting the moment. We are committed to being a resource inside it, sharing openly, celebrating wins, and helping our community move from surviving to leading.
                </motion.p>
              </>
            )}
          </div>

          {/* Closing line — Anthem closes with an italic tagline. Lovie has
              no closing signature (the author column on the left already
              names "Jesse Feister, Group Executive Director, The Lovie
              Awards", so a team byline below would be redundant). */}
          {!isLovie && (
            <motion.p
              className="mt-6 text-[15px] md:text-[16px]"
              style={{
                fontFamily: 'var(--font-display)',
                color: theme.accentColor,
                fontStyle: 'italic',
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Together, let{"'"}s set the new standard for good.
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}
