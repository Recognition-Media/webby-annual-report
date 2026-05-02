import Studio from './Studio'

export function generateStaticParams() {
  // The Sanity Studio is a client-side SPA — all sub-routes render the same page.
  // We pre-render known paths so deep links work with static export.
  const tools = ['signups', 'structure', 'vision']
  const structurePages = [
    'report',
    'report;report-2025',
    'report;report-2026',
    'report;82f6f241-2d89-4df6-b168-94b3d6040c99',
  ]

  return [
    { tool: [] },
    ...tools.map((t) => ({ tool: [t] })),
    ...structurePages.map((p) => ({ tool: ['structure', p] })),
  ]
}

export default function StudioPage() {
  return <Studio />
}
