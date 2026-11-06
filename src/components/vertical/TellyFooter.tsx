'use client'

import type { Report } from '@/sanity/types'

export function TellyFooter({ report: _report }: { report: Report }) {
  return (
    <footer
      style={{
        backgroundColor: '#000000',
        padding: '64px 24px',
        fontFamily: "'Basetica', -apple-system, sans-serif",
        color: '#ffffff',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>
          © {new Date().getFullYear()} The Telly Awards
        </p>
      </div>
    </footer>
  )
}
