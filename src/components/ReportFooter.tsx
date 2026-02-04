'use client'

import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type { Report } from '@/sanity/types'
import { urlFor } from '@/sanity/image'

export function ReportFooter({ report }: { report: Report }) {
  return (
    <footer className="border-t border-gray-200 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        {report.ceremonyDetails && (
          <div className="prose mb-8">
            <PortableText value={report.ceremonyDetails} />
          </div>
        )}

        {report.sponsorLogos && report.sponsorLogos.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-8">
            {report.sponsorLogos.map((logo, i) => (
              <Image
                key={i}
                src={urlFor(logo).height(40).url()}
                alt="Sponsor"
                width={120}
                height={40}
              />
            ))}
          </div>
        )}

        {report.footerLinks && report.footerLinks.length > 0 && (
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {report.footerLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  )
}
