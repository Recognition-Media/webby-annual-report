'use client'

import Image from 'next/image'
import type { Report } from '@/sanity/types'
import { urlFor } from '@/sanity/image'

export function ReportFooter({ report }: { report: Report }) {
  return (
    <footer className="bg-[#1a1a1a]">
      {/* Top border line */}
      <div className="border-t border-gray-700" />

      {/* Main footer content */}
      <div className="px-8 md:px-16 py-12">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          {/* Logo */}
          <div className="flex-shrink-0 w-[80px]">
            {report.headerImage && (
              <Image
                src={urlFor(report.headerImage).width(240).url()}
                alt="Webby Awards"
                width={80}
                height={40}
                className="brightness-0 invert"
              />
            )}
          </div>

          {/* Organization links */}
          <div id="org-column">
            <h4 className="text-white text-sm font-bold mb-6">Organization</h4>
            <ul className="list-none p-0 m-0 space-y-3">
              <li><a href="https://www.iadas.net" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">IADAS</a></li>
              <li><a href="https://www.webbyawards.com/resources/" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">Resources</a></li>
              <li><a href="https://www.webbyawards.com/webby-brand-studio/" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">Webby Brand Studio</a></li>
              <li><a href="https://www.webbyawards.com/faq/" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">FAQ</a></li>
              <li><a href="https://www.webbyawards.com/netted/" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">Get Netted</a></li>
              <li><a href="https://www.webbyawards.com/insights/" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">Webby Insights</a></li>
              <li><a href="https://www.webbyawards.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white text-sm font-bold mb-6">Connect</h4>
            <ul className="list-none p-0 m-0 space-y-3">
              <li><a href="https://www.facebook.com/TheWebbyAwards" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">Facebook</a></li>
              <li><a href="https://www.instagram.com/thewebbyawards/" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://twitter.com/TheWebbyAwards" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">X (Twitter)</a></li>
              <li><a href="https://www.youtube.com/user/WebbyAwards" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">YouTube</a></li>
              <li><a href="https://www.flickr.com/photos/webbyawards" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">Flickr</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-8 md:mx-16 border-t border-gray-700" />

      {/* Large tagline — aligned with Organization column */}
      <div className="px-8 md:px-16 py-16 md:pl-[calc(64px+80px+80px)]">
        <h2
          className="text-white font-normal"
          style={{
            fontFamily: 'aktiv-grotesk, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
            fontSize: 'clamp(60px, 10vw, 150px)',
            lineHeight: '1.05'
          }}
        >
          Honoring<br />
          The Best Of The<br />
          Internet Since ©1997
        </h2>

        {/* Site designed credit */}
        <p
          className="mt-12"
          style={{
            fontFamily: 'aktiv-grotesk, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
            fontSize: '14px',
            lineHeight: '21px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 400
          }}
        >
          Site designed<br />
          by <a href="https://www.basicagency.com" target="_blank" rel="noopener noreferrer" className="hover:underline">BASIC<sup>®</sup></a>
        </p>
      </div>

      {/* Bottom copyright bar */}
      <div className="bg-black px-8 md:px-16 py-4">
        <p
          style={{
            fontFamily: 'aktiv-grotesk, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
            fontSize: '14px',
            lineHeight: '21px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 400
          }}
        >
          Copyright © {new Date().getFullYear()} Webby Awards
        </p>
      </div>
    </footer>
  )
}
