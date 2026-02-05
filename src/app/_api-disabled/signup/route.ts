import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { saveSignup } from '@/lib/dynamodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reportSlug, formData } = body

    if (!reportSlug || !formData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await saveSignup({
      id: uuidv4(),
      reportSlug,
      formData,
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Failed to save signup' }, { status: 500 })
  }
}
