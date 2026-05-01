'use client'

import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { AnimatedBg } from './AnimatedBg'

export function IntroLetter({ report }: { report: Report }) {
  return (
    <section
      id="welcome-letter"
      data-snap
      className="relative overflow-hidden px-5 md:px-[60px] pt-16 md:pt-[calc(13vh+5px)]"
      style={{
        background: '#191919',
        minHeight: '100vh',
        paddingBottom: 50,
      }}
    >

      {/* Card */}
      <div className="relative z-10" style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        {/* Gradient bar */}
        <div
          className="gradient-bar"
          style={{ width: 80, marginBottom: 40 }}
        />

        {/* Label */}
        <p
          className="uppercase font-medium"
          style={{
            fontSize: 11,
            letterSpacing: 4,
            color: '#8B70D1',
            marginBottom: 32,
          }}
        >
          Welcome Letter
        </p>

        {/* Body with purple left border */}
        <div
          data-content
          className="pl-5 md:pl-10"
          style={{
            borderLeft: '3px solid #8B70D1',
          }}
        >
          <div
            className="font-normal prose max-w-none [&_p]:mb-5 [&_p]:text-[16px] [&_p]:text-[#D4D4D4] [&_p]:leading-[28px] [&_strong]:text-white [&_strong]:font-medium"
            style={{
              color: '#D4D4D4',
              fontSize: 16,
              lineHeight: '28px',
            }}
          >
            {report.letterBody ? (
              <div className="report-links [&_p]:mb-5">
                <PortableText value={report.letterBody} />
              </div>
            ) : (
              <>
                <p>Welcome to the 30th Annual Webby Awards Report.</p>
              </>
            )}
          </div>

          {/* Authors */}
          {report.letterAuthors && report.letterAuthors.length > 0 ? (
            <div
              className="flex flex-col gap-6 md:flex-row md:gap-12 pb-8 md:pb-0"
              style={{
                marginTop: 48,
                paddingTop: 32,
                borderTop: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {report.letterAuthors.map((author, i) => (
                <div key={i}>
                  <p className="font-medium" style={{ fontSize: 14, color: '#fff' }}>
                    {author.linkedInUrl ? (
                      <a href={author.linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }} className="hover:underline">
                        {author.name}
                      </a>
                    ) : author.name}
                  </p>
                  {author.title && (
                    <p className="font-normal" style={{ fontSize: 12, color: '#999' }}>
                      {author.title}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
