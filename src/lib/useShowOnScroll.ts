'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Returns `{ visible, pin, unpin }` for show-on-scroll UI.
 *
 * Visible while the user is actively scrolling/navigating (scroll, wheel,
 * touchmove, keydown), then fades out after `idleMs` (default 1.5s).
 *
 * `pin()` / `unpin()` let consumers force-keep the UI visible (e.g. while
 * the mouse is hovering over the nav itself, so it doesn't disappear out
 * from under the cursor). On unpin, the idle timer restarts so the UI
 * stays one more idle window before fading.
 *
 * Listens for wheel/touchmove/keydown alongside scroll so it works for
 * the Webby horizontal carousel (which navigates via wheel/key/swipe
 * rather than actual page scroll) as well as the Anthem vertical scroll.
 */
export function useShowOnScroll(idleMs = 1500) {
  const [visible, setVisible] = useState(false)
  const [pinned, setPinned] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const keepAlive = useCallback(() => {
    setVisible(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), idleMs)
  }, [idleMs])

  const pin = useCallback(() => {
    setPinned(true)
  }, [])

  const unpin = useCallback(() => {
    setPinned(false)
    // Reset the idle window so the nav stays for one more `idleMs` after
    // the cursor leaves, instead of disappearing instantly.
    keepAlive()
  }, [keepAlive])

  useEffect(() => {
    window.addEventListener('scroll', keepAlive, { passive: true })
    window.addEventListener('wheel', keepAlive, { passive: true })
    window.addEventListener('touchmove', keepAlive, { passive: true })
    window.addEventListener('keydown', keepAlive)

    return () => {
      window.removeEventListener('scroll', keepAlive)
      window.removeEventListener('wheel', keepAlive)
      window.removeEventListener('touchmove', keepAlive)
      window.removeEventListener('keydown', keepAlive)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [keepAlive])

  return { visible: visible || pinned, pin, unpin }
}
