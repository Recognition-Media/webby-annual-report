// Small play-triangle shared by the per-row "watch" button, the per-list
// preview pane, and the Channel-Surfing shared player's placeholder.
export function PlayIcon({ size = 12, color = '#ffffff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 12 14" fill="none">
      <path d="M0 0L12 7L0 14V0Z" fill={color} />
    </svg>
  )
}
