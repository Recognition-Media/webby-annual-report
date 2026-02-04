'use client'

import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { ScrollReveal } from './ScrollReveal'

export function IntroLetter({ report }: { report: Report }) {
  if (!report.letterBody) return null

  return (
    <ScrollReveal>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="prose prose-lg max-w-none">
          <PortableText value={report.letterBody} />
        </div>

        {report.letterAuthors && report.letterAuthors.length > 0 && (
          <div className="mt-8 space-y-1">
            {report.letterAuthors.map((author, i) => (
              <p key={i} className="text-base">
                <strong>{author.name}</strong>
                {author.title && <span className="text-gray-600"> -- {author.title}</span>}
              </p>
            ))}
          </div>
        )}
      </section>
    </ScrollReveal>
  )
}
