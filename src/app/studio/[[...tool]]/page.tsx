import Studio from './Studio'

export function generateStaticParams() {
  return [
    { tool: [] },
    { tool: ['signups'] },
    { tool: ['structure'] },
    { tool: ['vision'] },
  ]
}

export default function StudioPage() {
  return <Studio />
}
