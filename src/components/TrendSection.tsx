'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { TrendSection as TrendSectionType } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { ExpertQuoteCard } from './ExpertQuoteCard'
import { ScrollReveal } from './ScrollReveal'

export function TrendSection({ section, index }: { section: TrendSectionType; index: number }) {
  return (
    <ScrollReveal>
      {/* Divider before section (except first) */}
      {index > 0 && <div className="trend-divider" />}

      <section className="px-6 md:px-[60px]">
        <div className="flex flex-col lg:flex-row">
          {/* Vertical title on left */}
          <div className="lg:vertical-title lg:text-[32px] text-2xl font-bold uppercase lg:pr-6 mb-6 lg:mb-0 lg:flex-shrink-0 lg:flex lg:items-center text-center lg:text-left">
            {section.trendTitle}
          </div>

          {/* Content area - two halves */}
          <div className="flex-1 flex flex-col md:flex-row">
            {/* Left half - article text */}
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
            </div>

            {/* Right half - colored quote panel */}
            {section.expertQuotes && section.expertQuotes.length > 0 && (
              <div
                className="w-full md:w-1/2 relative overflow-hidden p-8 md:p-10"
                style={{ backgroundColor: index % 2 === 0 ? '#85CEFF' : '#7ACA6C' }}
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

        {/* Section images below if any */}
        {section.sectionImages && section.sectionImages.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {section.sectionImages.map((img, i) => (
              <Image
                key={i}
                src={urlFor(img).width(600).url()}
                alt={img.alt || ''}
                width={600}
                height={400}
                className="rounded"
              />
            ))}
          </div>
        )}
      </section>
    </ScrollReveal>
  )
}
