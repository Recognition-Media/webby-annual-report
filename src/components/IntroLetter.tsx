'use client'

import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { ScrollReveal } from './ScrollReveal'

export function IntroLetter({ report }: { report: Report }) {
  if (!report.letterBody) return null

  return (
    <ScrollReveal>
      <section
        className="py-20 px-6"
        style={{ background: 'linear-gradient(to bottom right, #eee, #eee, #75b9f2)' }}
      >
        <div className="relative bg-white border-[8px] border-black mx-auto w-[92%] max-w-4xl">
          {/* Label sits on the top border */}
          <div className="absolute -top-[18px] left-1/2 -translate-x-1/2">
            <span className="bg-black text-white text-xs font-normal uppercase tracking-[0.25em] px-6 py-2 inline-block">
              WELCOME LETTER
            </span>
          </div>
          <div className="p-8 md:p-12 text-sm leading-relaxed text-black text-left">
            <div className="prose prose-sm max-w-none">
              <PortableText value={report.letterBody} />
            </div>

            {report.letterAuthors && report.letterAuthors.length > 0 && (
              <div>
                {report.letterAuthors.map((author, i) => (
                  <div key={i} className="mt-6">
                    <p className="font-bold text-sm">{author.name}</p>
                    <p className="text-sm">{author.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}
