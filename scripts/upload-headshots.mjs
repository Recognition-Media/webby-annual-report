import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const client = createClient({
  projectId: 'za6m18kc',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function uploadImage(filePath) {
  const buffer = fs.readFileSync(filePath)
  const asset = await client.assets.upload('image', buffer, {
    filename: path.basename(filePath),
    contentType: 'image/jpeg',
  })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function run() {
  const tom = await uploadImage('public/judges/tom_hale_720.jpg')
  console.log('Uploaded Tom Hale')
  const jeanniey = await uploadImage('public/judges/jeanniey__walden_360.jpg')
  console.log('Uploaded Jeanniey Walden')
  const martin = await uploadImage('public/judges/martin_cedergren_360.jpg')
  console.log('Uploaded Martin Cedergren')

  for (const docId of ['report-2025', 'drafts.report-2025']) {
    const doc = await client.fetch(`*[_id == '${docId}'][0]{ trendSections }`)
    if (!doc || !doc.trendSections) { console.log('Skipping', docId); continue }

    const trends = doc.trendSections
    if (trends[0] && trends[0].expertQuotes) {
      const quotes = trends[0].expertQuotes
      if (quotes[0]) quotes[0].headshot = tom
      if (quotes[1]) quotes[1].headshot = jeanniey
      if (quotes[2]) quotes[2].headshot = martin
    }

    await client.patch(docId).set({ trendSections: trends }).commit()
    console.log('Updated', docId)
  }

  console.log('Done!')
}

run().catch(e => console.error(e))
