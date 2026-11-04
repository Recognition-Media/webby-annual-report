'use client'

import { motion } from 'framer-motion'
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
        <motion.img
          src="/telly/telly-logo-horizontal-white.png"
          alt="The Telly Awards"
          style={{ width: 64, height: 'auto', margin: '0 auto 24px', display: 'block' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        />
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>
          © {new Date().getFullYear()} The Telly Awards
        </p>
      </div>
    </footer>
  )
}
