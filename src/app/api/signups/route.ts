import { NextRequest, NextResponse } from 'next/server'
import { getSignups } from '@/lib/dynamodb'

export async function GET(request: NextRequest) {
  try {
    const reportSlug = request.nextUrl.searchParams.get('reportSlug') || undefined
    const signups = await getSignups(reportSlug)
    return NextResponse.json({ signups })
  } catch (error) {
    console.error('Failed to fetch signups:', error)
    return NextResponse.json({ error: 'Failed to fetch signups' }, { status: 500 })
  }
}
