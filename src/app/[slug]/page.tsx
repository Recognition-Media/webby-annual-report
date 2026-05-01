import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { reportBySlugQuery, allReportSlugsQuery } from '@/sanity/queries'
import type { Report } from '@/sanity/types'
import { ReportView } from '@/components/ReportView'
import { urlFor } from '@/sanity/image'

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

  const title = report?.metaTitle || report?.title || 'Annual Report'
  const description = report?.metaDescription || ''
  const ogImage = report?.shareImage
    ? urlFor(report.shareImage).width(1200).height(630).fit('crop').url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}
