import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { projectId, dataset } from './config'
import { signupExportPlugin } from './plugins/signupExport'

export default defineConfig({
  name: 'webby-annual-report',
  title: 'Webby Annual Report',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool(),
    signupExportPlugin(),
    visionTool({
      defaultApiVersion: '2024-01-01',
    }),
  ],
  schema: { types: schemaTypes },
  tools: (prev, { currentUser }) => {
    const isAdmin = currentUser?.roles?.some((r) => r.name === 'administrator')
    if (isAdmin) return prev
    return prev.filter((tool) => tool.name !== 'vision')
  },
})
