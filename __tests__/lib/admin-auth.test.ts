import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createAdminToken, verifyAdminSession } from '@/lib/admin-auth'
import { setMockCookie, clearMockCookies } from '../setup'

beforeEach(() => {
  clearMockCookies()
  vi.stubEnv('ADMIN_SECRET', 'test-secret-key')
})

describe('admin-auth', () => {
  describe('createAdminToken', () => {
    it('returns token in email.signature format', async () => {
      const token = await createAdminToken('admin@test.com')
      expect(token).toContain('.')
      const dotIndex = token.lastIndexOf('.')
      const email = token.substring(0, dotIndex)
      const sig = token.substring(dotIndex + 1)
      expect(email).toBe('admin@test.com')
      expect(sig.length).toBeGreaterThan(0)
    })

    it('produces same token for same inputs', async () => {
      const token1 = await createAdminToken('admin@test.com')
      const token2 = await createAdminToken('admin@test.com')
      expect(token1).toBe(token2)
    })

    it('produces different tokens for different emails', async () => {
      const token1 = await createAdminToken('admin@test.com')
      const token2 = await createAdminToken('other@test.com')
      expect(token1).not.toBe(token2)
    })
  })

  describe('verifyAdminSession', () => {
    it('returns true for valid roundtrip token', async () => {
      const token = await createAdminToken('admin@test.com')
      setMockCookie('admin_token', token)
      const result = await verifyAdminSession()
      expect(result).toBe(true)
    })

    it('returns false when no cookie present', async () => {
      const result = await verifyAdminSession()
      expect(result).toBe(false)
    })

    it('returns false for malformed token (no dot)', async () => {
      setMockCookie('admin_token', 'notokenformathere')
      const result = await verifyAdminSession()
      expect(result).toBe(false)
    })

    it('returns false for empty email portion', async () => {
      setMockCookie('admin_token', '.somesignature')
      const result = await verifyAdminSession()
      expect(result).toBe(false)
    })

    it('returns false for tampered signature', async () => {
      const token = await createAdminToken('admin@test.com')
      const tampered = token.slice(0, -3) + 'xxx'
      setMockCookie('admin_token', tampered)
      const result = await verifyAdminSession()
      expect(result).toBe(false)
    })

    it('returns false for token created with different secret', async () => {
      const token = await createAdminToken('admin@test.com')
      vi.stubEnv('ADMIN_SECRET', 'different-secret')
      setMockCookie('admin_token', token)
      const result = await verifyAdminSession()
      expect(result).toBe(false)
    })

    it('returns false for empty cookie value', async () => {
      setMockCookie('admin_token', '')
      const result = await verifyAdminSession()
      expect(result).toBe(false)
    })
  })
})
