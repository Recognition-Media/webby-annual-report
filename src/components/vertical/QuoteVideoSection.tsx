'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

interface Quote {
  name: string
  title: string
  text: string
  headshotUrl?: string
  borderColor?: string
}

interface QuoteVideoSectionProps {
  eyebrow?: string
  quotes: Quote[]
  videoSrc?: string
  videoUrl?: string
  videoLabel?: string
  videoName?: string
  videoTitle?: string
  imageSrc?: string
  imageAlt?: string
  imageVariant?: 'cover' | 'contain'
  accentColor?: string
}

export function QuoteVideoSection({
  eyebrow = 'What Our Community Is Saying',
  quotes,
  videoSrc,
  videoUrl,
  videoLabel = 'Watch Video',
  videoName = '',
  videoTitle = '',
  imageSrc,
  imageAlt = '',
  imageVariant = 'cover',
  accentColor = '#8C001C',
}: QuoteVideoSectionProps) {
  const defaultBorderColors = ['#8C001C', '#D17DD0', '#066DBA', '#00B469']
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const isInView = useInView(containerRef, { amount: 0.3 })

  // Stop video when scrolled out of view
  useEffect(() => {
    if (!isInView && isPlaying && videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [isInView, isPlaying])

  function togglePlay() {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative px-5 md:px-[60px] py-16 md:py-24"
      style={{ background: '#E3DDCA' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div className="flex flex-col md:flex-row gap-10 md:gap-16">
          {/* Left: quotes with headshots + border-left accent */}
          <div className="md:w-[50%]">
            <motion.p
              className="mb-6"
              style={{ fontSize: 36, fontFamily: 'var(--font-display)', color: '#21261A', fontWeight: 400 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {eyebrow}
            </motion.p>

            <div className="flex flex-col gap-8">
              {quotes.map((quote, i) => {
                const color = quote.borderColor || defaultBorderColors[i % defaultBorderColors.length]
                return (
                  <motion.div
                    key={i}
                    className="flex gap-4 items-start"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
                  >
                    {quote.headshotUrl ? (
                      <div
                        className="w-[132px] h-[132px] rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
                        style={{ border: `2px solid ${color}`, background: quote.headshotUrl.endsWith('.svg') ? '#066DBA' : 'transparent' }}
                      >
                        {quote.headshotUrl.endsWith('.svg') ? (
                          <img
                            src={quote.headshotUrl}
                            alt={quote.name}
                            className="w-[95%] h-[95%]"
                            style={{ objectFit: 'contain' }}
                          />
                        ) : (
                          <img
                            src={quote.headshotUrl}
                            alt={quote.name}
                            className="w-full h-full object-cover object-top scale-[1.4]"
                          />
                        )}
                      </div>
                    ) : (
                      <div
                        className="w-[132px] h-[132px] rounded-full bg-[#d5cfbc] flex-shrink-0"
                        style={{ border: `2px solid ${color}` }}
                      />
                    )}
                    <div className="pl-4" style={{ borderLeft: `3px solid ${color}` }}>
                      <p
                        className="text-[15px] md:text-[17px] leading-[1.6] mb-2"
                        style={{ fontFamily: 'var(--font-display)', color: '#21261A', fontStyle: 'italic' }}
                      >
                        {quote.text}
                      </p>
                      <p className="text-[13px]" style={{ color: '#21261A', opacity: 0.5 }}>
                        — <strong style={{ fontWeight: 600 }}>{quote.name}</strong>, {quote.title}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Right: video, image, or nothing */}
          <div className="md:w-[50%]">
            {videoSrc ? (
              <>
                {/* Video player — 16:9 */}
                <motion.div
                  className="rounded-lg overflow-hidden relative cursor-pointer"
                  style={{ background: '#21261A', paddingBottom: '56.25%' }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  onClick={togglePlay}
                >
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    onEnded={() => setIsPlaying(false)}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                    style={{ opacity: isPlaying ? 0 : 1 }}
                  >
                    <div className="w-14 h-14 rounded-full border-2 border-[#E3DDCA] flex items-center justify-center bg-[#21261A]/50">
                      <svg width="16" height="18" viewBox="0 0 12 14" fill="none">
                        <path d="M0 0L12 7L0 14V0Z" fill="#E3DDCA" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: '#21261A' }}>{videoName}</p>
                    <p className="text-[13px]" style={{ color: '#21261A', opacity: 0.55 }}>{videoTitle}</p>
                  </div>
                  <button
                    onClick={togglePlay}
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[2px] py-2.5 px-5 rounded-full transition-colors cursor-pointer flex-shrink-0"
                    style={{ background: accentColor, color: '#E3DDCA' }}
                  >
                    <svg width="12" height="10" viewBox="0 0 14 12" fill="none">
                      <path d="M0 12L7 0L14 12H0Z" fill="#E3DDCA" />
                    </svg>
                    {isPlaying ? 'Pause' : videoLabel}
                  </button>
                </div>
              </>
            ) : imageSrc ? (
              imageVariant === 'contain' ? (
                <motion.div
                  className="rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(33, 38, 26, 0.06)', aspectRatio: '4 / 3', padding: '8% 10%' }}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="max-w-full max-h-full"
                    style={{ objectFit: 'contain' }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  className="rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </motion.div>
              )
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
