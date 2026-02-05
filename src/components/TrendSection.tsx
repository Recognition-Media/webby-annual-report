'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { TrendSection as TrendSectionType } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { ExpertQuoteCard } from './ExpertQuoteCard'
import { ScrollReveal } from './ScrollReveal'

export function TrendSection({ section, index }: { section: TrendSectionType; index: number }) {
  const bgColor = index % 2 === 0 ? '#76B9F2' : '#7ACA6C'

  return (
    <ScrollReveal>
      {/* Divider before section (except first) */}
      {index > 0 && <div className="trend-divider" />}

      <section className={`pl-6 md:pl-[60px] pr-0 ${index === 0 ? 'pt-[100px]' : ''}`}>
        <div className="flex flex-col lg:flex-row">
          {/* Vertical title on left — rotates on lg screens, vertically centered */}
          <div className="text-2xl lg:text-[32px] font-bold uppercase mb-6 lg:mb-0 lg:w-[80px] lg:shrink-0 flex flex-col items-center justify-center lg:pr-[8px] lg:ml-[-10px] lg:[writing-mode:vertical-rl] lg:[transform:rotate(180deg)]">
            {section.trendTitle.split('\n').map((line, lineIndex) => (
              <div key={lineIndex} className="text-center">
                {line.split(/([\p{Emoji_Presentation}\p{Extended_Pictographic}])/gu).map((part, i) =>
                  /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(part) ? (
                    <span key={i} style={{ display: 'inline-block', transform: 'rotate(90deg)', margin: '0 4px' }}>{part}</span>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Content area — two columns, pushed right */}
          <div className="flex-1 flex flex-col md:flex-row md:ml-[42px]">
            {/* Left column — article text, vertically centered */}
            <div className="w-full md:w-[48%] p-6 md:p-10 md:pr-[50px] flex flex-col justify-center">
              {section.trendBody && (
                <div className="max-w-none text-base font-normal leading-[26px] [&>p]:mb-4">
                  <PortableText value={section.trendBody} />
                </div>
              )}

              {/* Featured projects inline */}
              {section.featuredProjects && section.featuredProjects.length > 0 && (
                <div className="mt-4 text-sm">
                  <p>
                    Standout projects include:{' '}
                    {section.featuredProjects.map((project, i) => (
                      <span key={i}>
                        {i > 0 && ', '}
                        {project.url ? (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">
                            {project.title}
                          </a>
                        ) : (
                          <strong>{project.title}</strong>
                        )}
                      </span>
                    ))}
                    .
                  </p>
                </div>
              )}

              {/* Section image below text in left column */}
              {section.sectionImages && section.sectionImages.length > 0 && (
                <div className="mt-8">
                  {section.sectionImages.map((img, i) => (
                    <Image
                      key={i}
                      src={urlFor(img).width(500).url()}
                      alt={img.alt || ''}
                      width={500}
                      height={889}
                      className="w-full max-w-[320px] h-auto"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right column — colored quote panel, extends to browser edge */}
            {section.expertQuotes && section.expertQuotes.length > 0 && (
              <div
                className="w-full md:flex-1 relative overflow-hidden p-8 md:p-10 md:pl-[50px] md:pr-[60px]"
                style={{ backgroundColor: bgColor }}
              >
                {/* Large decorative quote mark */}
                <div className="absolute top-[-30px] md:top-[-40px] left-[10px] text-[12rem] md:text-[16rem] opacity-20 leading-none select-none pointer-events-none font-bold text-black">
                  &ldquo;
                </div>

                {/* Quotes */}
                <div className="relative z-10">
                  {section.expertQuotes.map((quote, i) => (
                    <ExpertQuoteCard
                      key={i}
                      quote={quote}
                      showDivider={i < (section.expertQuotes?.length ?? 0) - 1}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}
