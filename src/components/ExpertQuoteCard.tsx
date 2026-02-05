'use client'

import { PortableText } from '@portabletext/react'
import type { ExpertQuote } from '@/sanity/types'

interface Props {
  quote: ExpertQuote
  showDivider?: boolean
}

export function ExpertQuoteCard({ quote, showDivider = false }: Props) {
  return (
    <div className="mb-4">
      <div className="text-base leading-relaxed">
        &ldquo;<PortableText value={quote.quoteText} />&rdquo;
      </div>
      <div className="text-xs mt-3" style={{ color: '#555' }}>
        {'- '}
        {quote.linkedInUrl ? (
          <a
            href={quote.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit hover:underline"
          >
            {quote.name}
          </a>
        ) : (
          <span>{quote.name}</span>
        )}
        {quote.title && `, ${quote.title}`}
      </div>
      {showDivider && <div className="squiggle-divider my-4" />}
    </div>
  )
}
