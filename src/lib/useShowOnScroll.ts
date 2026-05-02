'use client'

import { useEffect, useState } from 'react'

/**
 * Returns `true` while the user is actively scrolling/navigating, `false`
 * after the page has been idle for `idleMs` (default 1.5s).
 *
 * Listens for scroll, wheel, keydown, and touchmove so it works for the
 * Webby horizontal carousel (which navigates via wheel/key/swipe rather
 * than actual page scroll) as well as the Anthem vertical scroll.
 *
 * Used by AnthemBottomNav (vertical) and TrendSubnav (horizontal) so the
 * bottom UI only appears when the visitor is engaged with navigation.
 */
export function useShowOnScroll(idleMs = 1500) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    function show() {
      setVisible(true)
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => setVisible(false), idleMs)
    }

    window.addEventListener('scroll', show, { passive: true })
    window.addEventListener('wheel', show, { passive: true })
    window.addEventListener('touchmove', show, { passive: true })
    window.addEventListener('keydown', show)

    return () => {
      window.removeEventListener('scroll', show)
      window.removeEventListener('wheel', show)
      window.removeEventListener('touchmove', show)
      window.removeEventListener('keydown', show)
      if (timer) clearTimeout(timer)
    }
  }, [idleMs])

  return visible
}
