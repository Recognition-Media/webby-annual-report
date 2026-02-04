import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, ScanCommand, type ScanCommandInput } from '@aws-sdk/lib-dynamodb'

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' })
export const docClient = DynamoDBDocumentClient.from(ddbClient)

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'webby-report-signups'

export async function saveSignup(data: {
  id: string
  reportSlug: string
  formData: Record<string, string>
  timestamp: string
  ip: string
  userAgent: string
}) {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: data,
    })
  )
}

export async function getSignups(reportSlug?: string) {
  const params: ScanCommandInput = { TableName: TABLE_NAME }

  if (reportSlug) {
    params.FilterExpression = 'reportSlug = :slug'
    params.ExpressionAttributeValues = { ':slug': reportSlug }
  }

  const result = await docClient.send(new ScanCommand(params))
  return result.Items || []
}
