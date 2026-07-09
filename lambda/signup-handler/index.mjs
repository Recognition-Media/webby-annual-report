import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' })
const docClient = DynamoDBDocumentClient.from(ddbClient)
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'webby-report-signups'

const CIO_SITE_ID = process.env.CUSTOMERIO_SITE_ID
const CIO_API_KEY = process.env.CUSTOMERIO_API_KEY
const CIO_TRACK_URL = 'https://track.customer.io/api/v2/entity'

export const ALLOWED_ORIGINS = [
  'https://reports.webbyawards.com',
  'https://reports.anthemawards.com',
  'https://reports.lovieawards.com',
  'http://localhost:3000',
  'http://localhost:3001',
]

export function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function response(statusCode, body, origin) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    body: JSON.stringify(body),
  }
}

export function buildIdentifyPayload({ cioIdentity, property, consented, consentedAt }) {
  return {
    type: 'person',
    identifiers: { email: cioIdentity.email },
    action: 'identify',
    attributes: {
      firstName: cioIdentity.firstName || '',
      lastName: cioIdentity.lastName || '',
      organizationName: cioIdentity.company || '',
      job_title: cioIdentity.jobTitle || '',
      property: property || '',
      consented: consented === true,
      consentedAt: consentedAt || '',
    },
  }
}

export function buildEventPayload({ cioIdentity, property, reportSlug, reportTitle }) {
  return {
    type: 'person',
    identifiers: { email: cioIdentity.email },
    action: 'event',
    name: 'report_signup',
    attributes: {
      reportSlug: reportSlug || '',
      reportTitle: reportTitle || '',
      property: property || '',
      source: 'report-gate',
    },
  }
}

export async function syncToCustomerIo({ cioIdentity, property, reportSlug, reportTitle, consented, consentedAt }) {
  if (!cioIdentity?.email) return

  if (!CIO_SITE_ID || !CIO_API_KEY) {
    console.warn('Customer.io sync skipped: CUSTOMERIO_SITE_ID/CUSTOMERIO_API_KEY not configured')
    return
  }

  const authHeader = 'Basic ' + Buffer.from(`${CIO_SITE_ID}:${CIO_API_KEY}`).toString('base64')
  const payloads = [
    buildIdentifyPayload({ cioIdentity, property, consented, consentedAt }),
    buildEventPayload({ cioIdentity, property, reportSlug, reportTitle }),
  ]

  for (const payload of payloads) {
    try {
      const res = await fetch(CIO_TRACK_URL, {
        method: 'POST',
        headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        console.error('Customer.io sync failed', res.status, await res.text())
      }
    } catch (err) {
      console.error('Customer.io sync error', err)
    }
  }
}

export async function handler(event) {
  const origin = event.headers?.origin || ''
  const method = event.requestContext?.http?.method || event.httpMethod
  const path = event.requestContext?.http?.path || event.rawPath || ''

  if (method === 'OPTIONS') {
    return response(200, {}, origin)
  }

  try {
    if (method === 'POST' && path.endsWith('/signup')) {
      const body = JSON.parse(event.body || '{}')
      const { reportSlug, reportTitle, property, formData, cioIdentity, consented, consentedAt } = body

      if (!reportSlug || !formData) {
        return response(400, { error: 'Missing required fields' }, origin)
      }

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: randomUUID(),
          reportSlug,
          formData,
          consented: consented === true,
          consentedAt: consentedAt || null,
          timestamp: new Date().toISOString(),
          ip: event.headers?.['x-forwarded-for'] || 'unknown',
          userAgent: event.headers?.['user-agent'] || 'unknown',
        },
      }))

      await syncToCustomerIo({ cioIdentity, property, reportSlug, reportTitle, consented, consentedAt })

      return response(200, { success: true }, origin)
    }

    if (method === 'GET' && path.endsWith('/signups')) {
      const params = event.queryStringParameters || {}
      const scanParams = { TableName: TABLE_NAME }

      if (params.reportSlug) {
        scanParams.FilterExpression = 'reportSlug = :slug'
        scanParams.ExpressionAttributeValues = { ':slug': params.reportSlug }
      }

      const result = await docClient.send(new ScanCommand(scanParams))
      return response(200, { signups: result.Items || [] }, origin)
    }

    if (method === 'DELETE' && path.endsWith('/signup')) {
      const params = event.queryStringParameters || {}
      if (!params.id) {
        return response(400, { error: 'Missing id parameter' }, origin)
      }
      await docClient.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id: params.id },
      }))
      return response(200, { success: true }, origin)
    }

    return response(404, { error: 'Not found' }, origin)
  } catch (err) {
    console.error('Lambda error:', err)
    return response(500, { error: 'Internal server error' }, origin)
  }
}
