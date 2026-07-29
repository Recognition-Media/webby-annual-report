export const metadata = {
  title: 'Sanity Studio',
}

// Studio nested under the root layout's <html>/<body>. Older Next
// versions accepted a nested <html> here; Next 16 flags it as a
// hydration error, so this layout returns children directly and
// lets the root layout own the document shell.
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
