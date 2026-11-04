'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getVideoEmbed } from '@/lib/videoEmbed'

interface VideoPopoutModalProps {
  videoUrl: string
  title: string
  subtitle?: string
  onClose: () => void
  /** '16 / 9' (default) for standard widescreen work, '9 / 16' for
   * vertical/mobile-native video — also narrows the modal's max width so a
   * vertical video doesn't fill the viewport edge-to-edge. */
  aspectRatio?: '16 / 9' | '9 / 16'
}

export function VideoPopoutModal({ videoUrl, title, subtitle, onClose, aspectRatio = '16 / 9' }: VideoPopoutModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const embed = getVideoEmbed(videoUrl)

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4 md:px-8 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full"
          style={{ maxWidth: aspectRatio === '9 / 16' ? 420 : 900 }}
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              aria-label="Close video"
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div
            className="relative w-full rounded-lg overflow-hidden"
            style={{ aspectRatio, background: '#000000' }}
          >
            {embed?.kind === 'video' ? (
              <video
                src={embed.src}
                controls
                autoPlay
                className="absolute inset-0 w-full h-full object-contain"
              />
            ) : embed?.kind === 'iframe' ? (
              <iframe
                src={embed.src}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : null}
          </div>

          <div
            className="pt-4 pb-3 px-5 mt-4 text-center rounded-xl"
            style={{ background: 'rgba(0,0,0,0.45)' }}
          >
            <p
              className="text-[15px] md:text-[17px]"
              style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#ffffff', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
            >
              {title}
            </p>
            {subtitle && (
              <p
                className="text-[14px] md:text-[16px] leading-[1.5] mt-2 max-w-[640px] mx-auto"
                style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.75)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
