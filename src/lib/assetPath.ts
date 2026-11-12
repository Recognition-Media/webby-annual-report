// Next.js rewrites asset URLs automatically for `next/image` and `<Link>`,
// but NOT for raw `<img src="/...">` tags — those resolve against the
// domain root, which is wrong on any deploy served under a base path
// (branch previews live at /preview/<branch>/...). Wrap public-folder
// paths in this so they resolve correctly in both places; it's a no-op
// in dev and on production, where the base path is empty.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function assetPath(path: string) {
  return path.startsWith('/') ? `${BASE}${path}` : path
}
