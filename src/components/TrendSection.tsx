import type { TrendSection as TrendSectionType } from '@/sanity/types'

export function TrendSection({ section, index }: { section: TrendSectionType; index: number }) {
  return <section data-component="TrendSection">{section.trendTitle}</section>
}
