import { client } from '@/sanity/client'
import { latestReportSlugByPropertyQuery } from '@/sanity/queries'
import { redirect } from 'next/navigation'

// Landing route for reports.lovieawards.com — the root page maps that host
// to /lovie; this redirects to the latest live Lovie report once one is
// published. Until then it renders a neutral "coming soon" placeholder.
// Stays in sync automatically when new Lovie reports are published (each
// Sanity publish rebuilds the static export).
export default async function LovieHome() {
  const result = await client.fetch<{ slug: { current: string } } | null>(
    latestReportSlugByPropertyQuery,
    { property: 'lovie' }
  )

  if (result?.slug?.current) {
    redirect(`/${result.slug.current}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-gray-400">The Lovie Awards</p>
      <h1 className="text-2xl font-medium text-gray-700">Annual Report</h1>
      <p className="text-sm text-gray-400">Coming soon.</p>
    </main>
  )
}
