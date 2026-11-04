// Channel-guide color scheme shared between WinnerList.tsx (per-list
// preview) and ChannelGuideGroup.tsx (the single shared player). Every
// video-enabled "channel" row reads blue at rest; whichever one is
// currently active (hovered/focused, or playing in the shared player)
// turns green — rather than a different fixed color per row.
export const DEFAULT_CHANNEL_COLOR = '#D8F5FF'
export const CHANNEL_VIDEO_RESTING_COLOR = '#0C75FF'
export const CHANNEL_ACTIVE_COLOR = '#2EFB5E'

export function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

// Pale/bright colors (D8F5FF, 2EFB5E) need a dark icon/text on top to
// stay legible — richer ones (0C75FF) read fine in white.
export function iconColorFor(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#110E1F' : '#ffffff'
}

export function titleColorFor(hasVideo: boolean, isActive: boolean) {
  if (!hasVideo) return null
  return isActive ? CHANNEL_ACTIVE_COLOR : CHANNEL_VIDEO_RESTING_COLOR
}
