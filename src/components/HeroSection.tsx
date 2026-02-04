import type { Report } from '@/sanity/types'

export function HeroSection({ report }: { report: Report }) {
  return <section data-component="HeroSection">{report.title}</section>
}
