'use client'

import { createContext, useContext } from 'react'
import type { SanityImage } from '@/sanity/types'

// What the shared Channel-Surfing player needs to render the active
// "now playing" entry, regardless of which of the four stacked winner
// lists it came from.
export interface ChannelGuideActiveEntry {
  name: string
  workTitle?: string
  videoUrl: string
  videoThumbnail?: SanityImage
  videoDescription?: string
  orgDescription?: string
  color: string
}

export interface ChannelGuideContextValue {
  activeEntry: ChannelGuideActiveEntry | null
  setActiveEntry: (entry: ChannelGuideActiveEntry) => void
  /** Called by the first video-enabled row across all grouped lists on
   * mount, so the player isn't empty before anyone hovers anything.
   * Only the first caller wins (guarded by a ref in the provider). */
  registerDefault: (entry: ChannelGuideActiveEntry) => void
}

export const ChannelGuideContext = createContext<ChannelGuideContextValue | null>(null)

export function useChannelGuide() {
  return useContext(ChannelGuideContext)
}
