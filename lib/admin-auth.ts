import { cookies } from 'next/headers'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'dev-secret-change-in-production'

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return false
  try {
    const dotIndex = token.lastIndexOf('.')
    if (dotIndex === -1) return false
    const email = token.substring(0, dotIndex)
    const sig = token.substring(dotIndex + 1)
    if (!email || !sig) return false
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(ADMIN_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    )
    const sigBuf = Uint8Array.from(atob(sig), c => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, sigBuf, encoder.encode(email))
    return valid
  } catch {
    return false
  }
}

export async function createAdminToken(email: string): Promise<string> {
  const secret = process.env.ADMIN_SECRET || 'dev-secret-change-in-production'
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(email))
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
  return `${email}.${sigB64}`
}
