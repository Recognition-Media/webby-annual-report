import { useClient, type DocumentActionComponent } from 'sanity'
import { uuid } from '@sanity/uuid'
import { CopyIcon } from '@sanity/icons'
import { useRouter } from 'sanity/router'

export const duplicateReportAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: '2024-01-01' })
  const router = useRouter()
  const { draft, published } = props

  return {
    label: 'Duplicate Report',
    icon: CopyIcon,
    onHandle: async () => {
      const source = draft || published
      if (!source) return

      const newId = uuid()
      const { _id, _rev, _createdAt, _updatedAt, slug, status, ...rest } = source as any

      const newDoc = {
        ...rest,
        _id: `drafts.${newId}`,
        _type: 'report',
        title: `${(source as any).title} (Copy)`,
        slug: { _type: 'slug', current: `${slug?.current}-copy` },
        status: 'draft',
      }

      await client.create(newDoc)

      router.navigateIntent('edit', { id: newId, type: 'report' })
    },
  }
}
