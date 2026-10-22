'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Floating "back to Table of Contents" pill — Telly only. Hidden until
// the reader has scrolled past the Table of Contents itself (no point
// offering a shortcut back to where you already are), then stays
// visible for the rest of the report so a reader who's done with a
// section/sub-page can jump back in and pick the next thing to read.
export function TellyBackToContents() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      const toc = document.getElementById('key-findings')
      if (!toc) return
      const tocBottom = toc.offsetTop + toc.offsetHeight
      setVisible(window.scrollY > tocBottom)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleClick() {
    document.getElementById('key-findings')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 inline-flex items-center gap-2 text-[11px] md:text-[12px] uppercase tracking-[2px] py-3 px-5 md:py-3.5 md:px-6 rounded-full shadow-lg cursor-pointer"
          style={{ background: '#000000', color: '#ffffff', fontFamily: "'Basetica', -apple-system, sans-serif" }}
        >
          <span>↑</span>
          <span className="hidden sm:inline">Table of Contents</span>
          <span className="sm:hidden">Contents</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
