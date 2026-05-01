'use client'

import { motion } from 'framer-motion'

interface PriorityGroup {
  count: number
  total: number
  priority: string
  causes: string
  color: string
}

interface TabbedPrioritiesProps {
  eyebrow?: string
  title?: string
  data: PriorityGroup[]
  accentColor?: string
}

export function TabbedPriorities({
  eyebrow = 'Top Priority By Cause Area',
  title = 'What Each Cause Is Prioritizing',
  data,
  accentColor = '#00B469',
}: TabbedPrioritiesProps) {
  return (
    <section
      className="relative px-5 md:px-[60px] py-16 md:py-24"
      style={{ background: '#E3DDCA' }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {eyebrow && (
          <motion.p
            className="uppercase font-medium mb-3 text-center"
            style={{ fontSize: 11, letterSpacing: 4, color: accentColor }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {eyebrow}
          </motion.p>
        )}

        <motion.p
          className="mb-10 text-center"
          style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#21261A' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {title}
        </motion.p>

        {/* Proportional bar */}
        <div className="flex gap-1 md:gap-1.5 mb-4" style={{ height: 80 }}>
          {data.map((item, i) => (
            <motion.div
              key={i}
              className="rounded-md flex items-center justify-center px-3 md:px-4"
              style={{ flex: item.count, background: item.color }}
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
            >
              <span
                className="text-[9px] md:text-[11px] font-semibold text-center leading-tight"
                style={{ color: '#E3DDCA' }}
              >
                {item.priority}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Labels: cause lists */}
        <div className="flex gap-1 md:gap-1.5">
          {data.map((item, i) => (
            <motion.div
              key={i}
              style={{ flex: item.count }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
            >
              <p className="text-[10px] md:text-[11px] mb-1" style={{ color: '#21261A', opacity: 0.4 }}>
                {item.count} of {item.total} causes
              </p>
              <p className="text-[9px] md:text-[10px] leading-[1.5]" style={{ color: '#21261A', opacity: 0.5 }}>
                {item.causes}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
