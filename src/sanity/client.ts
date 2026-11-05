import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from './config'

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

// `useCdn` only controls which Sanity endpoint gets hit (apicdn vs api) —
// it does nothing about Next.js's own Data Cache, which wraps every
// fetch() call made from a Server Component and, by default, caches a
// given query+params combination indefinitely. In a long-running `next
// dev` session that means the very first time a report is loaded, its
// content gets cached forever: every later Sanity edit keeps silently
// serving that same first response until something else happens to
// invalidate it (a server restart does NOT clear this on its own, since
// the cache can survive across restarts). `cache: 'no-store'` opts every
// query out of that cache so content edits always show up on the next
// request — negligible cost here since Sanity is already the source of
// truth being fetched fresh each time regardless.
const originalFetch = sanityClient.fetch.bind(sanityClient)

export const client = Object.assign(sanityClient, {
  fetch: ((query: unknown, params?: unknown, options?: Record<string, unknown>) =>
    originalFetch(query as never, params as never, { cache: 'no-store', ...options } as never)) as unknown as typeof sanityClient.fetch,
})
