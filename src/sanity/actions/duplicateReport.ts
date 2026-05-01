import { type DocumentActionComponent, useClient } from 'sanity'
import { CopyIcon } from '@sanity/icons'
import { useState } from 'react'
import { useRouter } from 'sanity/router'

export const duplicateReportAction: DocumentActionComponent = ({ draft, published, id }) => {
  const client = useClient({ apiVersion: '2024-01-01' })
  const router = useRouter()
  const [isDuplicating, setIsDuplicating] = useState(false)

  return {
    label: isDuplicating ? 'Duplicating...' : 'Duplicate Report',
    icon: CopyIcon,
    disabled: isDuplicating,
    onHandle: async () => {
      const source = draft || published
      if (!source) return

      setIsDuplicating(true)

      try {
        const { _id, _rev, _createdAt, _updatedAt, _type, slug, status, title, ...rest } = source as any

        const newDoc = {
          ...rest,
          _type: 'report',
          title: `${title} (Copy)`,
          slug: { _type: 'slug', current: `${slug?.current}-copy` },
          status: 'draft',
        }

        const result = await client.create(newDoc)
        router.navigateIntent('edit', { id: result._id, type: 'report' })
      } catch (err) {
        console.error('Failed to duplicate report:', err)
      } finally {
        setIsDuplicating(false)
      }
    },
  }
}
