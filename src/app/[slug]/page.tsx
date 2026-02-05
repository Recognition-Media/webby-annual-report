import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { reportBySlugQuery, allReportSlugsQuery } from '@/sanity/queries'
import type { Report } from '@/sanity/types'
import { ReportView } from '@/components/ReportView'

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allReportSlugsQuery)
  return slugs.map((s) => ({ slug: s.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ReportPage({ params }: Props) {
  const { slug } = await params
  const report = await client.fetch<Report | null>(reportBySlugQuery, { slug })

  if (!report || report.status !== 'live') {
    notFound()
  }

  return <ReportView report={report} />
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const report = await client.fetch<Report | null>(reportBySlugQuery, { slug })

  return {
    title: report?.metaTitle || report?.title || 'Annual Report',
    description: report?.metaDescription || '',
  }
}
