import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Log the contact form submission
    console.log('Contact form submission:', { name, email, subject, message, timestamp: new Date().toISOString() })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
