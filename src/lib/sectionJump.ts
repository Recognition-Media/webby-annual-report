// Coordinates "jump straight to this section" actions (Table of Contents
// cards, the sticky-bar dropdown, hero nav deep links) with anything that
// needs to tell a deliberate jump apart from a section merely being
// scrolled past on the way to one further down — e.g. TellyJudgePopup,
// which should only ever treat the jump's actual destination as a genuine
// "arrival," never an intermediate section the jump happened to cross.
//
// Call jumpToSection(id) instead of el.scrollIntoView(...) directly for
// any "jump to a specific section" action. Subscribers are notified with
// the target id when a jump starts, and with null once it's done (either
// the browser's own 'scrollend' event, or a generous timeout fallback for
// browsers that don't support it yet / an interrupted scroll).

type Listener = (targetId: string | null) => void

const listeners = new Set<Listener>()
let endTimer: ReturnType<typeof setTimeout> | null = null
let scrollEndHandler: (() => void) | null = null

function notify(targetId: string | null) {
  listeners.forEach((l) => l(targetId))
}

function clearJump() {
  if (endTimer) {
    clearTimeout(endTimer)
    endTimer = null
  }
  if (scrollEndHandler) {
    window.removeEventListener('scrollend', scrollEndHandler)
    scrollEndHandler = null
  }
  notify(null)
}

export function jumpToSection(targetId: string, el?: HTMLElement | null) {
  const target = el ?? document.getElementById(targetId)
  if (!target) return false

  if (scrollEndHandler) window.removeEventListener('scrollend', scrollEndHandler)
  if (endTimer) clearTimeout(endTimer)

  notify(targetId)

  scrollEndHandler = () => clearJump()
  window.addEventListener('scrollend', scrollEndHandler, { once: true })
  // Fallback for browsers without 'scrollend' (or an interrupted scroll)
  // — long enough for any real jump across this report to finish.
  endTimer = setTimeout(clearJump, 2500)

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return true
}

export function onSectionJump(cb: Listener) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
