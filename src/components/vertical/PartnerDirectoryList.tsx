'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { WinEntry } from '@/sanity/types'
import { urlFor } from '@/sanity/image'

interface PartnerDirectoryListProps {
  id?: string
  heading: string
  intro?: string
  entries: WinEntry[]
}

// Non-video alternate to the ranked-table WinnerList — a horizontally
// scrolling row of partner logo tiles, one per entry (same scroll
// mechanics as PosterRowList). Logos only in the row itself; clicking one
// opens a pop-out card with that partner's name, full description, and a
// link to their website, matching the overlay-card style already
// established by TellyJudgePopup. Opt in per winnerList via the CMS
// `directoryRow` toggle (e.g. "Our Partners' Work").
export function PartnerDirectoryList({ id, heading, intro, entries }: PartnerDirectoryListProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    function update() {
      setCanScrollLeft(el!.scrollLeft > 2)
      setCanScrollRight(el!.scrollLeft < el!.scrollWidth - el!.clientWidth - 2)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [entries])

  if (!entries || entries.length === 0) return null

  function scrollByAmount(direction: 1 | -1) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  const openEntry = openIndex !== null ? entries[openIndex] : null

  return (
    <section id={id} className="relative px-5 md:px-[60px] py-16 md:py-20" style={{ background: '#110E1F' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%' }}>
        <motion.h3
          className="text-[22px] md:text-[28px] leading-[1.2] mb-4"
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 700 }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {heading}
        </motion.h3>
        {intro && (
          <motion.p
            className="text-[14px] md:text-[16px] leading-[1.6] max-w-[760px] mb-8"
            style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.65)' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {intro}
          </motion.p>
        )}

        <div className="relative group/row">
          {canScrollLeft && (
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollByAmount(-1)}
              className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-4 z-10 w-9 h-9 rounded-full items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 cursor-pointer"
              style={{ background: 'rgba(17,14,31,0.75)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollByAmount(1)}
              className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-4 z-10 w-9 h-9 rounded-full items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 cursor-pointer"
              style={{ background: 'rgba(17,14,31,0.75)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          <div ref={scrollRef} className="flex items-stretch gap-5 overflow-x-auto overflow-y-hidden pb-2" style={{ scrollbarWidth: 'thin' }}>
            {entries.map((entry, i) => {
              const logoUrl = entry.logo ? urlFor(entry.logo).width(320).url() : null
              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="flex-shrink-0 w-[200px] md:w-[220px] flex items-center justify-center rounded-xl cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                  style={{ height: 130, background: '#FBF9F4', padding: '20px 24px' }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.06 }}
                >
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoUrl} alt={`${entry.name} logo`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span
                      className="text-[14px] font-bold text-center"
                      style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#110E1F' }}
                    >
                      {entry.name}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openEntry && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center px-5"
            style={{ background: 'rgba(0,0,0,0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpenIndex(null)}
          >
            <motion.div
              className="relative w-full rounded-2xl p-6 md:p-10"
              style={{ maxWidth: 560, background: '#110E1F', border: '1px solid rgba(255,255,255,0.12)' }}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
                className="absolute top-4 right-4 md:top-5 md:right-5 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                ✕
              </button>

              {openEntry.logo && (
                <div
                  className="flex items-center justify-center rounded-xl mb-6"
                  style={{ height: 110, background: '#FBF9F4', padding: '18px 24px', maxWidth: 260 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={urlFor(openEntry.logo).width(320).url()}
                    alt={`${openEntry.name} logo`}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}

              <p
                className="text-[20px] md:text-[24px] font-bold mb-3"
                style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff' }}
              >
                {openEntry.name}
              </p>

              {openEntry.orgDescription && (
                <p
                  className="text-[14px] md:text-[15px] leading-[1.6] mb-6"
                  style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.75)' }}
                >
                  {openEntry.orgDescription}
                </p>
              )}

              {openEntry.workUrl && (
                <a
                  href={openEntry.workUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-full uppercase transition-colors duration-200 cursor-pointer"
                  style={{
                    color: '#110E1F',
                    background: '#2EFB5E',
                    fontSize: 12,
                    letterSpacing: 1.5,
                    fontWeight: 700,
                    fontFamily: "'Basetica', -apple-system, sans-serif",
                  }}
                >
                  Visit Website ↗
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
