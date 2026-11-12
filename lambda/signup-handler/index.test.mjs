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
      firstName: 'Jane',
      lastName: 'Doe',
      organizationName: 'Acme',
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

  assert.equal(payload.attributes.firstName, '')
  assert.equal(payload.attributes.lastName, '')
  assert.equal(payload.attributes.organizationName, '')
  assert.equal(payload.attributes.job_title, '')
})

test('buildEventPayload names the event form_submitted with propertyName, source, and specifier', () => {
  const payload = buildEventPayload({
    cioIdentity: { email: 'jane@example.com' },
    property: 'lovie',
    reportSlug: 'lovie-creative-hubs-mediterranean',
    reportTitle: 'The Lovie Awards Creative Hubs Series',
    specifier: 'Trend Report 2026',
  })

  assert.deepEqual(payload, {
    type: 'person',
    identifiers: { email: 'jane@example.com' },
    action: 'event',
    name: 'form_submitted',
    attributes: {
      reportSlug: 'lovie-creative-hubs-mediterranean',
      reportTitle: 'The Lovie Awards Creative Hubs Series',
      propertyName: 'Lovie Awards',
      source: 'The Lovie Awards Creative Hubs Series',
      specifier: 'Trend Report 2026',
      privateLink: '',
      shareLink: '',
    },
  })
})

test('buildEventPayload carries privateLink and shareLink through to the event', () => {
  const payload = buildEventPayload({
    cioIdentity: { email: 'jane@example.com' },
    property: 'telly',
    reportSlug: '2026-telly-watchlist',
    reportTitle: '2026 Telly Watchlist',
    specifier: '2026 Telly Watchlist',
    privateLink: 'https://reports.tellyawards.com/2026-telly-watchlist/?access=direct',
    shareLink: 'https://reports.tellyawards.com/2026-telly-watchlist/',
  })

  assert.equal(payload.attributes.privateLink, 'https://reports.tellyawards.com/2026-telly-watchlist/?access=direct')
  assert.equal(payload.attributes.shareLink, 'https://reports.tellyawards.com/2026-telly-watchlist/')
  // The private link is the one that skips the gate; the share link must not.
  assert.ok(payload.attributes.privateLink.includes('access=direct'))
  assert.ok(!payload.attributes.shareLink.includes('access=direct'))
})

test('buildEventPayload falls back to an empty propertyName for an unrecognized property', () => {
  const payload = buildEventPayload({
    cioIdentity: { email: 'jane@example.com' },
    property: 'not-a-real-property',
    reportSlug: 'some-slug',
    reportTitle: 'Some Report',
  })

  assert.equal(payload.attributes.propertyName, '')
})

test('buildEventPayload defaults specifier to an empty string when omitted', () => {
  const payload = buildEventPayload({
    cioIdentity: { email: 'jane@example.com' },
    property: 'webby',
    reportSlug: 'some-slug',
    reportTitle: 'Some Report',
  })

  assert.equal(payload.attributes.specifier, '')
})

test('corsHeaders allows all four report origins', () => {
  for (const origin of [
    'https://reports.webbyawards.com',
    'https://reports.anthemawards.com',
    'https://reports.lovieawards.com',
    'https://reports.tellyawards.com',
  ]) {
    assert.equal(corsHeaders(origin)['Access-Control-Allow-Origin'], origin)
  }
})

test('corsHeaders falls back to the first allowed origin for unknown origins', () => {
  assert.equal(corsHeaders('https://evil.example.com')['Access-Control-Allow-Origin'], ALLOWED_ORIGINS[0])
})
