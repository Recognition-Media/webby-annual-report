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
  /** Flip to the next/previous video in the same stream without closing
   * the modal — right/left arrow keys do the same thing. Omit either
   * (or leave both undefined) when there's nothing to navigate to, e.g.
   * a list of one, or this is the first/last video in it. */
  onNext?: () => void
  onPrev?: () => void
}

export function VideoPopoutModal({ videoUrl, title, subtitle, onClose, aspectRatio = '16 / 9', onNext, onPrev }: VideoPopoutModalProps) {
  const isVertical = aspectRatio === '9 / 16'

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' && onNext) onNext()
      else if (e.key === 'ArrowLeft' && onPrev) onPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    // Lock the page behind from scrolling while the modal is open — without
    // this, scroll-chaining (the modal's own overlay hits its scroll limit,
    // then the wheel event "falls through" to the page) lets a scroll
    // gesture meant for the modal move the report behind it instead. This
    // was especially bad on the tall vertical-video modal, where the user
    // is often scrolling specifically to reach the close button.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, onNext, onPrev])

  const embed = getVideoEmbed(videoUrl)

  const videoBox = (
    <div
      className="relative rounded-lg overflow-hidden"
      // Vertical video is sized by HEIGHT (capped well under the
      // viewport) with width following from the aspect ratio, rather
      // than by width like the standard 16:9 case — sizing a 9:16 video
      // by a comfortable width makes it very tall (420px wide → ~750px
      // tall), which is exactly what was pushing the close button and
      // caption off-screen. Capping the height instead keeps the whole
      // modal (button, video, copy) within the viewport at normal zoom.
      style={isVertical ? { aspectRatio, background: '#000000', height: 'min(70vh, 620px)', width: 'auto', flexShrink: 0 } : { aspectRatio, background: '#000000', width: '100%' }}
    >
      {embed?.kind === 'video' ? (
        <video
          src={embed.src}
          controls
          autoPlay
          className="absolute inset-0 w-full h-full object-contain"
        />
      ) : embed?.kind === 'iframe' ? (
        <>
          <iframe
            src={embed.src}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          {/* Every embeddable source (Drive, YouTube, Vimeo...) renders its
              own "open in a new tab/window" control somewhere near the top
              of its player chrome — we never want that, so a transparent
              strip here eats the click before it ever reaches the
              cross-origin iframe (which we otherwise can't inspect or
              suppress). Controls people actually use (play/pause, volume,
              captions, fullscreen) live in the bottom bar on every one of
              these players, so this costs nothing real. */}
          <div className="absolute top-0 inset-x-0 h-12 z-10" />
        </>
      ) : null}
    </div>
  )

  const caption = (title || subtitle) && (
    <div
      className={isVertical ? 'py-3 px-5 rounded-xl' : 'pt-4 pb-3 px-5 mt-4 text-center rounded-xl'}
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
          className={isVertical ? 'text-[14px] md:text-[16px] leading-[1.5] mt-2' : 'text-[14px] md:text-[16px] leading-[1.5] mt-2 max-w-[640px] mx-auto'}
          style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: 'rgba(216,245,255,0.75)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4 md:px-8 overflow-y-auto"
        style={{ overscrollBehavior: 'contain' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        {/* Screen-anchored (not scrolled with the modal content) so it's
            always reachable regardless of browser zoom or how tall the
            modal's content is — this was the actual fix for "can't find
            the X" on the vertical-video modal, independent of the scroll
            lock above. */}
        <button
          onClick={onClose}
          aria-label="Close video"
          className="fixed top-4 right-4 md:top-6 md:right-6 z-[60] w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <motion.div
          className="relative w-full"
          style={{ maxWidth: 900 }}
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Anchored to the whole video+caption group (not just the video
              box) so the arrows sit at the group's own outer edges instead
              of landing on top of the caption text next to a narrower
              vertical video. */}
          {onPrev && (
            <button
              onClick={onPrev}
              aria-label="Previous video"
              className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-14 z-10 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              aria-label="Next video"
              className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-14 z-10 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {isVertical ? (
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-5 md:gap-10 justify-center">
              {videoBox}
              {caption && <div className="w-full md:w-[380px] md:self-center flex-shrink-0">{caption}</div>}
            </div>
          ) : (
            <>
              {videoBox}
              {caption}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
