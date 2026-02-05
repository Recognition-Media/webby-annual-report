import { client } from '@/sanity/client'
import { latestReportSlugQuery } from '@/sanity/queries'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const result = await client.fetch<{ slug: { current: string } } | null>(latestReportSlugQuery)

  if (result?.slug?.current) {
    redirect(`/${result.slug.current}`)
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-lg text-gray-500">No published reports yet.</p>
    </main>
  )
}
