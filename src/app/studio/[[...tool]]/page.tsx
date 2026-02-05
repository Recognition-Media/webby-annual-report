import Studio from './Studio'

export function generateStaticParams() {
  return [{ tool: [] }]
}

export default function StudioPage() {
  return <Studio />
}
