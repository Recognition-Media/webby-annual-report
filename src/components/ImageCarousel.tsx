'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { CarouselImage } from '@/sanity/types'
import { urlFor } from '@/sanity/image'
import { ScrollReveal } from './ScrollReveal'

interface ImageCarouselProps {
  images: CarouselImage[]
  variant?: 'hero' | 'standalone'
}

export function ImageCarousel({ images, variant = 'standalone' }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (variant !== 'hero') return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [variant, images.length])

  function next() {
    setCurrent((prev) => (prev + 1) % images.length)
  }

  function prev() {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }

  if (variant === 'hero') {
    return (
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <Image
              src={urlFor(images[current].image).width(1600).height(900).url()}
              alt={images[current].caption || ''}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <ScrollReveal>
      <section className="relative mx-auto max-w-4xl overflow-hidden px-6 py-16">
        <div className="relative aspect-video">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={urlFor(images[current].image).width(1200).height(675).url()}
                alt={images[current].caption || ''}
                fill
                className="rounded object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {images[current].caption && (
          <p className="mt-4 text-center text-sm text-gray-500">{images[current].caption}</p>
        )}

        {images.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <button onClick={prev} className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300" aria-label="Previous image">&larr;</button>
            <span className="text-sm text-gray-500">{current + 1} / {images.length}</span>
            <button onClick={next} className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300" aria-label="Next image">&rarr;</button>
          </div>
        )}
      </section>
    </ScrollReveal>
  )
}
