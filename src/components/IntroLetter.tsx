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
        minHeight: 'calc(100vh - 50px)',
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
            <p>Welcome to the 30th Annual Webby Awards Report: a deeper look at what defines the Best of the Internet in 2026.</p>

            <p>Thirty years into our Webby journey, we're at another major inflection point for technology, culture, and society. These moments are what make the Internet's evolution fascinating, and what make defining excellence such a worthy challenge. This report is built from what Executive Judges observed as they received and selected the Webby Nominees across every category.</p>

            <p><strong>Inside, you'll find eight themes drawn directly from judges' observations:</strong> invisible AI products, craft as an act of defiance, depth over reach in creator work, brand partnerships that feel Internet native, podcasts becoming full visual worlds, web experiences that practice restraint, and ad campaigns that created ecosystems.</p>

            <p>In sharing these insights, we hope they can inform and inspire the work you and your team are creating online.</p>

            <p>Thank you again for participating in this year's Webby Awards. We are honored to have you in our community.</p>
          </div>

          {/* Authors */}
          <div
            className="flex flex-col gap-6 md:flex-row md:gap-12 pb-8 md:pb-0"
            style={{
              marginTop: 48,
              paddingTop: 32,
              borderTop: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <div>
              <p className="font-medium" style={{ fontSize: 14, color: '#fff' }}>
                <a href="https://www.linkedin.com/in/nborenstein/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }} className="hover:underline">
                  Nick Borenstein
                </a>
              </p>
              <p className="font-normal" style={{ fontSize: 12, color: '#999' }}>
                General Manager, The Webby Awards
              </p>
            </div>
            <div>
              <p className="font-medium" style={{ fontSize: 14, color: '#fff' }}>
                <a href="https://www.linkedin.com/in/jesse-feister-6552b174" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }} className="hover:underline">
                  Jesse Feister
                </a>
              </p>
              <p className="font-normal" style={{ fontSize: 12, color: '#999' }}>
                Executive Director, Webby Media Group
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
