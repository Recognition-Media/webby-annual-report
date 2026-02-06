import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(ddbClient);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'webby-report-signups';

const ALLOWED_ORIGINS = [
  'https://reports.webbyawards.com',
  'http://localhost:3000',
  'http://localhost:3001',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function response(statusCode, body, origin) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    body: JSON.stringify(body),
  };
}

export async function handler(event) {
  const origin = event.headers?.origin || '';
  const method = event.requestContext?.http?.method || event.httpMethod;
  const path = event.requestContext?.http?.path || event.rawPath || '';

  if (method === 'OPTIONS') {
    return response(200, {}, origin);
  }

  try {
    if (method === 'POST' && path.endsWith('/signup')) {
      const body = JSON.parse(event.body || '{}');
      const { reportSlug, formData } = body;

      if (!reportSlug || !formData) {
        return response(400, { error: 'Missing required fields' }, origin);
      }

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: randomUUID(),
          reportSlug,
          formData,
          timestamp: new Date().toISOString(),
          ip: event.headers?.['x-forwarded-for'] || 'unknown',
          userAgent: event.headers?.['user-agent'] || 'unknown',
        },
      }));

      return response(200, { success: true }, origin);
    }

    if (method === 'GET' && path.endsWith('/signups')) {
      const params = event.queryStringParameters || {};
      const scanParams = { TableName: TABLE_NAME };

      if (params.reportSlug) {
        scanParams.FilterExpression = 'reportSlug = :slug';
        scanParams.ExpressionAttributeValues = { ':slug': params.reportSlug };
      }

      const result = await docClient.send(new ScanCommand(scanParams));
      return response(200, { signups: result.Items || [] }, origin);
    }

    if (method === 'DELETE' && path.endsWith('/signup')) {
      const params = event.queryStringParameters || {};
      if (!params.id) {
        return response(400, { error: 'Missing id parameter' }, origin);
      }
      await docClient.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id: params.id },
      }));
      return response(200, { success: true }, origin);
    }

    return response(404, { error: 'Not found' }, origin);
  } catch (err) {
    console.error('Lambda error:', err);
    return response(500, { error: 'Internal server error' }, origin);
  }
}
