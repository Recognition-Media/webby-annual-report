'use client'

import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'

export function IntroLetter({ report }: { report: Report }) {
  if (!report.letterBody) return null

  return (
    <section
      className="flex items-center justify-center relative overflow-hidden"
      style={{
        background: '#191919',
        minHeight: '80vh',
        padding: '80px 40px 160px',
      }}
    >
      {/* Subtle "WELCOME" watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          style={{
            fontSize: 'clamp(200px, 25vw, 400px)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.018)',
            lineHeight: 1,
          }}
        >
          WELCOME
        </span>
      </div>

      {/* Card */}
      <div className="relative z-10" style={{ maxWidth: 760, width: '100%' }}>
        {/* Gradient bar */}
        <div
          className="gradient-bar"
          style={{ width: 80, marginBottom: 40 }}
        />

        {/* Label */}
        <p
          className="uppercase font-medium"
          style={{
            fontSize: 10,
            letterSpacing: 4,
            color: '#555',
            marginBottom: 32,
          }}
        >
          Welcome Letter
        </p>

        {/* Body with purple left border */}
        <div
          style={{
            borderLeft: '3px solid #8B70D1',
            paddingLeft: 40,
          }}
        >
          <div
            className="font-normal"
            style={{
              color: '#BABABA',
              fontSize: 16,
              lineHeight: 1.85,
            }}
          >
            <div className="prose prose-sm max-w-none [&_p]:mb-5 [&_p]:text-[#BABABA] [&_p]:leading-[1.85] [&_a]:text-[#BABABA] [&_a]:underline [&_a]:decoration-[#555] [&_a]:underline-offset-2 [&_strong]:text-[#BABABA] [&_em]:text-[#BABABA] [&_li]:text-[#BABABA] [&_span]:text-[#BABABA]">
              <PortableText value={report.letterBody} />
            </div>
          </div>

          {/* Authors */}
          {report.letterAuthors && report.letterAuthors.length > 0 && (
            <div
              className="flex gap-12"
              style={{
                marginTop: 48,
                paddingTop: 32,
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {report.letterAuthors.map((author, i) => (
                <div key={i}>
                  <p className="font-medium" style={{ fontSize: 14, color: '#fff' }}>
                    {author.name}
                  </p>
                  <p className="font-normal" style={{ fontSize: 12, color: '#666' }}>
                    {author.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
