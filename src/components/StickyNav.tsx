'use client'

import Image from 'next/image'
import type { Report } from '@/sanity/types'
import { urlFor } from '@/sanity/image'

export function StickyNav({ report }: { report: Report }) {
  return (
    <nav className="sticky top-0 z-50 bg-white px-6 py-[11px]">
      {report.headerImage && (
        <Image
          src={urlFor(report.headerImage).width(200).url()}
          alt="The Webby Awards"
          width={120}
          height={48}
          className="w-auto h-auto max-h-[38px]"
        />
      )}
    </nav>
  )
}
