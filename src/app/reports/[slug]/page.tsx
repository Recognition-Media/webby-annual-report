import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { reportBySlugQuery } from '@/sanity/queries'
import type { Report } from '@/sanity/types'
import { ReportView } from '@/components/ReportView'

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
