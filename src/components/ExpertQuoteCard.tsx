'use client'

import { motion } from 'framer-motion'
import type { ExpertQuote } from '@/sanity/types'

export function ExpertQuoteCard({ quote }: { quote: ExpertQuote }) {
  return (
    <motion.blockquote
      className="border-l-4 border-gray-300 pl-6 py-2"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-lg italic">&ldquo;{quote.quoteText}&rdquo;</p>
      <footer className="mt-2 text-sm text-gray-600">
        {quote.linkedInUrl ? (
          <a href={quote.linkedInUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
            <strong>{quote.name}</strong>
          </a>
        ) : (
          <strong>{quote.name}</strong>
        )}
        {quote.title && <span> — {quote.title}</span>}
      </footer>
    </motion.blockquote>
  )
}
