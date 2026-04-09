import { useClient } from 'sanity'
import { uuid } from '@sanity/uuid'

export function duplicateReportAction(props: any) {
  const client = useClient({ apiVersion: '2024-01-01' })
  const { draft, published, type } = props

  if (type !== 'report') return null

  return {
    label: 'Duplicate Report',
    onHandle: async () => {
      const source = draft || published
      if (!source) return

      const newId = uuid()
      const { _id, _rev, _createdAt, _updatedAt, slug, status, ...rest } = source

      const newDoc = {
        ...rest,
        _id: newId,
        _type: 'report',
        title: `${source.title} (Copy)`,
        slug: { _type: 'slug', current: `${slug?.current}-copy` },
        status: 'draft',
      }

      await client.create(newDoc)
      window.location.href = `${window.location.pathname.split('/').slice(0, -1).join('/')}/report;${newId}`
    },
  }
}
