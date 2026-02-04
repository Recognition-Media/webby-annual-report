'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

interface Props {
  value: string
  label: string
}

function parseNumeric(value: string): { num: number; prefix: string; suffix: string } | null {
  const match = value.match(/^([^0-9]*)([0-9,]+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  return {
    prefix: match[1],
    num: parseFloat(match[2].replace(/,/g, '')),
    suffix: match[3],
  }
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function AnimatedCounter({ value, label }: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const parsed = parseNumeric(value)

  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => formatNumber(Math.round(v)))

  useEffect(() => {
    if (isInView && parsed) {
      animate(count, parsed.num, { duration: 1.5, ease: 'easeOut' })
    }
  }, [isInView, parsed, count])

  if (!parsed) {
    return (
      <div ref={ref} className="text-center">
        <div className="text-4xl font-bold">{value}</div>
        <div className="text-sm opacity-70">{label}</div>
      </div>
    )
  }

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold">
        {parsed.prefix}
        <motion.span>{rounded}</motion.span>
        {parsed.suffix}
      </div>
      <div className="text-sm opacity-70">{label}</div>
    </div>
  )
}
