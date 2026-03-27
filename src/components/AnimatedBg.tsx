'use client'

const COLORS = ['#8B70D1', '#FF7F63', '#FFDE67', '#FF67CB', '#82D8EB']

const SHAPES = [
  { viewBox: '0 0 80 250', width: 400, height: 750, blur: 60, animation: 'blobDrift1 20s', path: 'M40 0 L75 35 L40 70 L75 105 L40 140 L75 175 L40 210 L40 250 L5 215 L40 180 L5 145 L40 110 L5 75 L40 40 Z' },
  { viewBox: '0 0 200 180', width: 650, height: 600, blur: 65, animation: 'blobDrift4 18s', path: 'M0 90 L40 30 L80 90 L120 30 L160 90 L200 30 L200 150 L160 90 L120 150 L80 90 L40 150 L0 90 Z' },
]

export function AnimatedBg({ variant = 0 }: { variant?: number }) {
  const color1 = COLORS[variant % COLORS.length]
  const color2 = COLORS[(variant + 1) % COLORS.length]
  const flipped = variant % 2 === 1

  // Alternate diagonal: even = TL+BR, odd = BL+TR
  const pos1 = flipped
    ? { bottom: 0, left: 0 }
    : { top: 0, left: 0 }
  const pos2 = flipped
    ? { top: 0, right: 0 }
    : { bottom: 0, right: 0 }

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <svg
        style={{
          position: 'absolute',
          ...pos1,
          width: SHAPES[0].width,
          height: SHAPES[0].height,
          opacity: 0.5,
          filter: `blur(${SHAPES[0].blur}px)`,
          animation: `${SHAPES[0].animation} ease-in-out infinite`,
        }}
        viewBox={SHAPES[0].viewBox}
        fill={color1}
      >
        <path d={SHAPES[0].path} />
      </svg>
      <svg
        style={{
          position: 'absolute',
          ...pos2,
          width: SHAPES[1].width,
          height: SHAPES[1].height,
          opacity: 0.5,
          filter: `blur(${SHAPES[1].blur}px)`,
          animation: `${SHAPES[1].animation} ease-in-out infinite`,
        }}
        viewBox={SHAPES[1].viewBox}
        fill={color2}
      >
        <path d={SHAPES[1].path} />
      </svg>
    </div>
  )
}
