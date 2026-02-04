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
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-6 text-3xl font-bold">{section.trendTitle}</h2>

        {section.trendBody && (
          <div className="prose prose-lg max-w-none">
            <PortableText value={section.trendBody} />
          </div>
        )}

        {section.featuredProjects && section.featuredProjects.length > 0 && (
          <div className="mt-8 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Featured Projects</h3>
            <ul className="space-y-2">
              {section.featuredProjects.map((project, i) => (
                <li key={i}>
                  {project.url ? (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {project.title}
                    </a>
                  ) : (
                    <span>{project.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {section.expertQuotes && section.expertQuotes.length > 0 && (
          <div className="mt-8 space-y-6">
            {section.expertQuotes.map((quote, i) => (
              <ExpertQuoteCard key={i} quote={quote} />
            ))}
          </div>
        )}

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
