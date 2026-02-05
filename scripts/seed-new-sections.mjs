#!/usr/bin/env node
/**
 * Seeds the new sections (globalStats, entryStats, IADAS, webbyHistory)
 * into the existing report document.
 *
 * Usage: SANITY_API_TOKEN=<token> node scripts/seed-new-sections.mjs
 */

const PROJECT_ID = 'za6m18kc'
const DATASET = 'production'
const DOC_ID = 'report-2025'
const API_VERSION = '2024-01-01'

const token = process.env.SANITY_API_TOKEN
if (!token) {
  console.error('Missing SANITY_API_TOKEN env variable')
  process.exit(1)
}

// IADAS logo is already uploaded as sponsorLogos[0]
const IADAS_LOGO_REF = 'image-8b94eb241fdf1adfc0e90f1e967d422756afc45e-713x356-png'

const patch = {
  globalStats: [
    { _key: 'gs1', _type: 'heroStat', label: 'Global Population', value: '8,200,000,000' },
    { _key: 'gs2', _type: 'heroStat', label: 'Total Internet Users', value: '5,400,000,000' },
    { _key: 'gs3', _type: 'heroStat', label: 'Social Media Users', value: '5,100,000,000' },
    { _key: 'gs4', _type: 'heroStat', label: 'Mobile Phone Subscribers', value: '7,400,000,000' },
  ],
  entryStats: [
    { _key: 'es1', _type: 'heroStat', label: 'Entries Received', value: '13,000+' },
    { _key: 'es2', _type: 'heroStat', label: 'Countries Represented', value: '70+' },
    { _key: 'es3', _type: 'heroStat', label: 'US States Entering', value: '50' },
  ],
  webbyHistory:
    'The Webby Awards has been celebrating the best of the Internet for 29 years\u2014over half the life of the Internet itself. From a professional and academic tool to a ubiquitous communications platform, the Internet has evolved into the universal medium for the most significant breakthroughs in consumer technology and culture at large. It has prevailed as a place where creativity is celebrated, profitable industries are born, and communities have a voice. We are humbled to celebrate another year of Internet excellence with the Webby community, those responsible for creating the awesome, safe, accessible, and inspiring Internet we want.',
  iadasLogo: {
    _type: 'image',
    asset: { _type: 'reference', _ref: IADAS_LOGO_REF },
  },
  iadasDescription:
    'The Webby Awards are judged by the International Academy of Digital Arts and Sciences (IADAS), an invitation-only organization made up of Associate and Executive experts representing artists, creators, media companies, brands, agencies, production companies, cultural institutions, podcasts, games, technology, nonprofits, and beyond. The Academy is an intellectually diverse group of former Winners, creatives, organizers, entertainers, leaders and innovators that was founded to help drive the creative, technical, purpose-driven and professional progress of the Internet and evolving forms of digital media.',
  iadasStats: [
    { _key: 'is1', _type: 'heroStat', label: 'Number of Academy Members', value: '3,000+' },
    { _key: 'is2', _type: 'heroStat', label: 'Countries Represented', value: '40+' },
    { _key: 'is3', _type: 'heroStat', label: 'Year Founded', value: '1998' },
  ],
}

async function run() {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mutations: [
        {
          patch: {
            id: DOC_ID,
            set: patch,
          },
        },
      ],
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('Failed:', JSON.stringify(data, null, 2))
    process.exit(1)
  }

  console.log('Successfully seeded new sections:', JSON.stringify(data, null, 2))
}

run()
