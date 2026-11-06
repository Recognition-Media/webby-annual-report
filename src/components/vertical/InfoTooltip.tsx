'use client'

import { useState } from 'react'

// Small "i" icon next to a list heading that reveals a longer note on
// hover (desktop) or tap (touch, where there's no hover) — a second,
// optional layer of context below the always-visible intro paragraph.
// Shared across every list layout (Poster Row, Ranked Thumbnail Row, …)
// so the icon and popover read identically wherever it's used.
export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span
      className="relative inline-flex flex-shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="More info"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-150"
        style={{
          background: 'rgba(255,255,255,0.22)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: '#ffffff',
          fontSize: 13,
          fontWeight: 700,
          fontStyle: 'italic',
          fontFamily: 'Georgia, serif',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.32)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)' }}
      >
        i
      </button>
      {open && (
        <div
          className="absolute z-20 top-full left-0 mt-2 p-5 rounded-xl text-[15px] md:text-[16px] leading-[1.6]"
          style={{
            width: 'min(90vw, 480px)',
            background: '#1A1630',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(216,245,255,0.85)',
            fontFamily: "'Basetica', -apple-system, sans-serif",
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          }}
        >
          {text}
        </div>
      )}
    </span>
  )
}
