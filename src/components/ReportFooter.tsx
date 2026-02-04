'use client'

import Image from 'next/image'
import type { Report } from '@/sanity/types'
import { urlFor } from '@/sanity/image'

export function ReportFooter({ report }: { report: Report }) {
  return (
    <footer className="bg-black px-6 py-10">
      <div className="mx-auto max-w-3xl text-center">
        {/* Logo - white version using invert filter */}
        {report.headerImage && (
          <div className="mb-8">
            <Image
              src={urlFor(report.headerImage).width(240).url()}
              alt="Webby Awards"
              width={120}
              height={40}
              className="mx-auto brightness-0 invert"
            />
          </div>
        )}

        {/* Navigation links */}
        {report.footerLinks && report.footerLinks.length > 0 && (
          <nav className="mb-6">
            <ul className="flex flex-wrap justify-center gap-0 list-none p-0 m-0">
              {report.footerLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm no-underline hover:underline px-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Copyright */}
        <p className="text-xs" style={{ color: '#999' }}>
          &copy; {new Date().getFullYear()} The Webby Awards. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
