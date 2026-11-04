export interface VideoEmbed {
  kind: 'iframe' | 'video'
  src: string
}

export interface VideoEmbedOptions {
  /** Appends the muted-autoplay params YouTube/Vimeo support, for an
   * inline hover-preview player. Direct video files are always rendered
   * with autoPlay/muted/loop by the consuming component regardless of
   * this flag (the modal just doesn't loop). Google Drive has no
   * reliable autoplay param, so this is a no-op for Drive links. */
  autoplayMuted?: boolean
}

// Normalizes a pasted share link (Drive, Dropbox, YouTube, Vimeo, or a
// direct file) into something embeddable in a pop-out player. Centralized
// here so any entry that gains a `videoUrl` just works, in the modal and
// anywhere else a preview is added later, without more URL-sniffing code.
export function getVideoEmbed(url?: string | null, options: VideoEmbedOptions = {}): VideoEmbed | null {
  if (!url) return null
  const { autoplayMuted } = options

  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (driveMatch) {
    return { kind: 'iframe', src: `https://drive.google.com/file/d/${driveMatch[1]}/preview` }
  }

  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/)
  if (youtubeMatch) {
    const params = autoplayMuted ? '&autoplay=1&mute=1' : ''
    return { kind: 'iframe', src: `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0${params}` }
  }

  const vimeoReviewMatch = url.match(/vimeo\.com\/reviews\/[^/]+\/videos\/(\d+)/)
  // Private/unlisted Vimeo links carry a privacy hash after the id
  // (vimeo.com/{id}/{hash}) that must be forwarded as `h=` or the embed
  // 403s — dropping it silently (the old regex only captured the id) is
  // what broke "Mountain Joy"'s replacement link.
  const vimeoMatch = vimeoReviewMatch || url.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/)
  if (vimeoMatch) {
    const hash = vimeoMatch[2]
    const params = [hash ? `h=${hash}` : null, autoplayMuted ? 'autoplay=1&muted=1' : null].filter(Boolean).join('&')
    return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[1]}${params ? `?${params}` : ''}` }
  }

  const instagramMatch = url.match(/instagram\.com\/(reel|p)\/([\w-]+)/)
  if (instagramMatch) {
    const [, type, id] = instagramMatch
    return { kind: 'iframe', src: `https://www.instagram.com/${type}/${id}/embed/` }
  }

  const wistiaMatch = url.match(/wistia\.com\/medias\/([\w-]+)/)
  if (wistiaMatch) {
    const params = autoplayMuted ? '?autoPlay=true&muted=true' : ''
    return { kind: 'iframe', src: `https://fast.wistia.net/embed/iframe/${wistiaMatch[1]}${params}` }
  }

  if (url.includes('dropbox.com')) {
    const direct = url.replace(/([?&])dl=[01]/, '$1raw=1')
    const src = direct.includes('raw=1') ? direct : `${direct}${direct.includes('?') ? '&' : '?'}raw=1`
    return { kind: 'video', src }
  }

  const pathname = url.split('?')[0].split('#')[0]
  if (/\.(mp4|webm|mov)$/i.test(pathname)) {
    return { kind: 'video', src: url }
  }

  return { kind: 'iframe', src: url }
}

// Best-effort poster thumbnail pulled straight from the video source, for
// entries that don't have a CMS-supplied `videoThumbnail`. Only YouTube and
// Google Drive expose a thumbnail without an API round-trip — everything
// else (Vimeo, Dropbox, direct files) returns null and the caller falls
// back to a color placeholder.
export function getVideoThumbnail(url?: string | null): string | null {
  if (!url) return null

  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/)
  if (youtubeMatch) return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`

  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (driveMatch) return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w640`

  return null
}
