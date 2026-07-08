import test from 'node:test'
import assert from 'node:assert/strict'
import { buildIdentifyPayload, buildEventPayload, corsHeaders, ALLOWED_ORIGINS } from './index.mjs'

test('buildIdentifyPayload maps cioIdentity fields to CIO attributes', () => {
  const payload = buildIdentifyPayload({
    cioIdentity: { email: 'jane@example.com', firstName: 'Jane', lastName: 'Doe', company: 'Acme', jobTitle: 'CTO' },
    property: 'anthem',
    consented: true,
    consentedAt: '2026-07-08T12:00:00.000Z',
  })

  assert.deepEqual(payload, {
    type: 'person',
    identifiers: { email: 'jane@example.com' },
    action: 'identify',
    attributes: {
      first_name: 'Jane',
      last_name: 'Doe',
      company: 'Acme',
      job_title: 'CTO',
      property: 'anthem',
      consented: true,
      consentedAt: '2026-07-08T12:00:00.000Z',
    },
  })
})

test('buildIdentifyPayload defaults missing optional fields to empty strings', () => {
  const payload = buildIdentifyPayload({
    cioIdentity: { email: 'jane@example.com' },
    property: 'webby',
    consented: true,
    consentedAt: '2026-07-08T12:00:00.000Z',
  })

  assert.equal(payload.attributes.first_name, '')
  assert.equal(payload.attributes.last_name, '')
  assert.equal(payload.attributes.company, '')
  assert.equal(payload.attributes.job_title, '')
})

test('buildEventPayload names the event report_signup with report attributes', () => {
  const payload = buildEventPayload({
    cioIdentity: { email: 'jane@example.com' },
    property: 'lovie',
    reportSlug: 'lovie-creative-hubs-mediterranean',
    reportTitle: 'The Lovie Awards Creative Hubs Series',
  })

  assert.deepEqual(payload, {
    type: 'person',
    identifiers: { email: 'jane@example.com' },
    action: 'event',
    name: 'report_signup',
    attributes: {
      reportSlug: 'lovie-creative-hubs-mediterranean',
      reportTitle: 'The Lovie Awards Creative Hubs Series',
      property: 'lovie',
      source: 'report-gate',
    },
  })
})

test('corsHeaders allows all three report origins', () => {
  for (const origin of [
    'https://reports.webbyawards.com',
    'https://reports.anthemawards.com',
    'https://reports.lovieawards.com',
  ]) {
    assert.equal(corsHeaders(origin)['Access-Control-Allow-Origin'], origin)
  }
})

test('corsHeaders falls back to the first allowed origin for unknown origins', () => {
  assert.equal(corsHeaders('https://evil.example.com')['Access-Control-Allow-Origin'], ALLOWED_ORIGINS[0])
})
