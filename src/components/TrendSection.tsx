'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { TrendSection as TrendSectionType } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { ExpertQuoteCard } from './ExpertQuoteCard'
import { ScrollReveal } from './ScrollReveal'

export function TrendSection({ section, index }: { section: TrendSectionType; index: number }) {
  const bgColor = index % 2 === 0 ? '#85CEFF' : '#7ACA6C'

  return (
    <ScrollReveal>
      {/* Divider before section (except first) */}
      {index > 0 && <div className="trend-divider" />}

      <section className="px-6 md:px-[60px]">
        <div className="flex flex-col lg:flex-row">
          {/* Vertical title on left — rotates on lg screens */}
          <div className="text-2xl lg:text-[32px] font-bold uppercase mb-6 lg:mb-0 lg:shrink-0 lg:flex lg:items-center text-center lg:text-left lg:pr-6 lg:[writing-mode:vertical-rl] lg:[transform:rotate(180deg)]">
            {section.trendTitle}
          </div>

          {/* Content area — two columns */}
          <div className="flex-1 flex flex-col md:flex-row">
            {/* Left column — article text + section image */}
            <div className="w-full md:w-1/2 p-6 md:p-10">
              {section.trendBody && (
                <div className="prose prose-sm max-w-none">
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

            {/* Right column — colored quote panel */}
            {section.expertQuotes && section.expertQuotes.length > 0 && (
              <div
                className="w-full md:w-1/2 relative overflow-hidden p-8 md:p-10"
                style={{ backgroundColor: bgColor }}
              >
                {/* Large decorative quote mark */}
                <div className="absolute top-[-40px] left-[-10px] text-[20rem] md:text-[25rem] opacity-20 leading-none select-none pointer-events-none font-bold text-black">
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
