import { client } from '@/sanity/client'
import { latestReportSlugByPropertyQuery } from '@/sanity/queries'
import { redirect } from 'next/navigation'

// Landing route for reports.anthemawards.com — CloudFront rewrites the root
// path to /anthem on that hostname; this redirects to the latest live Anthem
// report. Stays in sync automatically when new Anthem reports are published.
export default async function AnthemHome() {
  const result = await client.fetch<{ slug: { current: string } } | null>(
    latestReportSlugByPropertyQuery,
    { property: 'anthem' }
  )

  if (result?.slug?.current) {
    redirect(`/${result.slug.current}`)
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-lg text-gray-500">No Anthem reports published yet.</p>
    </main>
  )
}
