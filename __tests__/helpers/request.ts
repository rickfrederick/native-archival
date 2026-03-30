import { NextRequest } from 'next/server'

export function createRequest(
  method: string,
  url: string = 'http://localhost:3000',
  body?: Record<string, unknown>
): NextRequest {
  const init: RequestInit = { method }
  if (body) {
    init.body = JSON.stringify(body)
    init.headers = { 'Content-Type': 'application/json' }
  }
  return new NextRequest(new URL(url), init as ConstructorParameters<typeof NextRequest>[1])
}

export async function getJsonResponse(response: Response) {
  const data = await response.json()
  return { status: response.status, data }
}
