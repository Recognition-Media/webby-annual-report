import { client } from '@/sanity/client'
import { latestReportSlugByPropertyQuery } from '@/sanity/queries'
import { redirect } from 'next/navigation'

// Landing route for reports.webbyawards.com — CloudFront rewrites the root
// path to /webby on that hostname; this redirects to the latest live Webby
// report. Stays in sync automatically when new Webby reports are published.
export default async function WebbyHome() {
  const result = await client.fetch<{ slug: { current: string } } | null>(
    latestReportSlugByPropertyQuery,
    { property: 'webby' }
  )

  if (result?.slug?.current) {
    redirect(`/${result.slug.current}`)
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-lg text-gray-500">No Webby reports published yet.</p>
    </main>
  )
}
