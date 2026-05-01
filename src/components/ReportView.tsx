import type { Report } from '@/sanity/types'
import { ReportView as VerticalReportView } from './vertical/ReportView'
import { ReportView as HorizontalReportView } from './horizontal/ReportView'

/**
 * Template router. Picks which scroll/layout template renders this report.
 *
 * Today: switches on `report.property` (existing field — `webby` or `anthem`).
 * Once the Sanity schema gains a dedicated `template` field, switch this on
 * `report.template` instead so editors can pick the layout independent of
 * brand at create-time.
 */
export function ReportView({ report }: { report: Report }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const property = (report as any).property
  if (property === 'anthem') {
    return <HorizontalReportView report={report} />
  }
  return <VerticalReportView report={report} />
}
