'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { loviePortableTextComponents } from './IntroLetter'

// The hero carousel's second slide — the report's intro letter (heading,
// body, closing tagline) alongside the author's photo/name/title. This
// used to be a "More Info" pop-out modal (see git history /
// TellyMoreInfoModal.tsx); Ann asked for it to live as its own carousel
// slide instead, with "More Info" just advancing the carousel rather than
// opening an overlay. Content/author fallbacks stay in sync with
// IntroLetter.tsx, which still renders the full version of this same
// copy for every other property. Text is sized/padded to roughly match
// slide 0's visual weight (that slide's height is driven by the TV
// graphic; this one has no equivalent, so generous type scale + vertical
// padding keeps the carousel from visibly shrinking when it rotates in.
export function TellyIntroSlide({ report }: { report: Report }) {
  const author = report.letterAuthors?.[0]
  const authorName = author?.name || 'Amanda Needham'
  const authorTitle = author?.title || 'Managing Director, The Telly Awards'
  const authorPhoto = author?.photo?.url || '/telly/author-placeholder.svg'

  return (
    <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-16 px-6 md:px-10 py-6 md:py-14">
      <div className="flex-1" style={{ minWidth: 280 }}>
        <h2
          className="mb-5 text-[32px] md:text-[48px] leading-[1.12] font-bold"
          style={{ fontFamily: 'var(--font-display)', color: '#ffffff' }}
        >
          Video has never had more screens.
        </h2>
        <div style={{ width: 56, height: 4, background: '#ef1e40', borderRadius: 2, marginBottom: 26 }} />
        <div
          className="font-normal prose max-w-none [&_p]:mb-4 [&_p]:text-[16px] md:[&_p]:text-[19px] [&_p]:leading-[1.75] [&_p]:text-white [&_strong]:text-white [&_strong]:font-bold"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", maxWidth: 680 }}
        >
          {report.letterBody && report.letterBody.length > 0 ? (
            <PortableText value={report.letterBody} components={loviePortableTextComponents} />
          ) : (
            <p>Great video work is everywhere, but knowing where to look is the hard part.</p>
          )}
        </div>
        <p
          className="mt-2 text-[17px] md:text-[21px]"
          style={{ fontFamily: 'var(--font-display)', color: '#ef1e40', fontStyle: 'italic' }}
        >
          Together, let&rsquo;s set the new standard for good.
        </p>
      </div>

      <div className="flex-shrink-0 w-[200px] md:w-[280px]">
        <p
          className="uppercase font-medium mb-3"
          style={{ fontSize: 12, letterSpacing: 1.5, color: '#ef1e40' }}
        >
          What&rsquo;s Inside This Report
        </p>
        <div className="relative rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '3 / 4' }}>
          <Image
            src={authorPhoto}
            alt={author?.photo?.alt || authorName}
            fill
            sizes="280px"
            className="object-cover object-center"
          />
        </div>
        <p className="font-bold text-[18px] md:text-[20px]" style={{ color: '#ffffff' }}>{authorName}</p>
        <p className="text-[13px] md:text-[14px]" style={{ color: 'rgba(216,245,255,0.65)' }}>{authorTitle}</p>
      </div>
    </div>
  )
}
