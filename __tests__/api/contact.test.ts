import { describe, it, expect, vi } from 'vitest'
import { createRequest, getJsonResponse } from '../helpers/request'
import { POST } from '@/app/api/contact/route'

describe('POST /api/contact', () => {
  it('returns success on valid submission', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})

    const body = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test',
      message: 'Hello',
    }
    const req = createRequest('POST', 'http://localhost:3000/api/contact', body)
    const res = await POST(req)
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('returns 500 on malformed JSON', async () => {
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: 'not-json',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req as never)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(500)
  })
})
