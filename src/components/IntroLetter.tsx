'use client'

import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { AnimatedBg } from './AnimatedBg'

export function IntroLetter({ report }: { report: Report }) {
  if (!report.letterBody) return null

  return (
    <section
      id="welcome-letter"
      data-snap
      className="relative overflow-hidden"
      style={{
        background: '#191919',
        minHeight: '100vh',
        padding: '0 60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
          style={{
            borderLeft: '3px solid #8B70D1',
            paddingLeft: 40,
          }}
        >
          <div
            className="font-normal"
            style={{
              color: '#D4D4D4',
              fontSize: 16,
              lineHeight: '28px',
            }}
          >
            <div className="prose max-w-none [&_p]:mb-5 [&_p]:text-[16px] [&_p]:text-[#D4D4D4] [&_p]:leading-[28px] [&_a]:text-[#D4D4D4] [&_strong]:text-white [&_strong]:font-medium [&_em]:text-[#D4D4D4] [&_li]:text-[#D4D4D4] [&_span]:text-[#D4D4D4]">
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
                borderTop: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {report.letterAuthors.map((author, i) => (
                <div key={i}>
                  <p className="font-medium" style={{ fontSize: 14, color: '#fff' }}>
                    {author.name}
                  </p>
                  <p className="font-normal" style={{ fontSize: 12, color: '#999' }}>
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
