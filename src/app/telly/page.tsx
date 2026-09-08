import { client } from '@/sanity/client'
import { latestReportSlugByPropertyQuery } from '@/sanity/queries'
import { redirect } from 'next/navigation'

// Landing route for reports.tellyawards.com — the root page maps that host
// to /telly; this redirects to the latest live Telly report once one is
// published. Until then it renders a neutral "coming soon" placeholder.
export default async function TellyHome() {
  const result = await client.fetch<{ slug: { current: string } } | null>(
    latestReportSlugByPropertyQuery,
    { property: 'telly' }
  )

  if (result?.slug?.current) {
    redirect(`/${result.slug.current}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-white/50">The Telly Awards</p>
      <h1 className="text-2xl font-medium text-white">Annual Report</h1>
      <p className="text-sm text-white/50">Coming soon.</p>
    </main>
  )
}
