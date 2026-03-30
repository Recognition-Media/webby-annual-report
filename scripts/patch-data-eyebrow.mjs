import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'za6m18kc',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function run() {
  for (const docId of ['report-2025', 'drafts.report-2025']) {
    const doc = await client.fetch(`*[_id == '${docId}'][0]{ trendSections }`)
    if (!doc || !doc.trendSections) { console.log('Skipping', docId); continue }

    const trends = doc.trendSections
    // Trend 0 and 1 have data modules
    if (trends[0]) trends[0].dataEyebrow = 'What Judges Said'
    if (trends[1]) trends[1].dataEyebrow = 'What Judges Said'

    await client.patch(docId).set({ trendSections: trends }).commit()
    console.log('Updated', docId)
  }
  console.log('Done!')
}

run().catch(e => console.error(e))
