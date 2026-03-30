import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prismaMock } from '../../helpers/prisma-mock'
import { createRequest, getJsonResponse } from '../../helpers/request'
import { POST } from '@/app/api/admin/login/route'

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
  },
}))

import bcrypt from 'bcryptjs'

vi.mock('@/lib/admin-auth', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>
  return {
    ...actual,
    createAdminToken: vi.fn().mockResolvedValue('admin@test.com.fakesignature'),
  }
})

beforeEach(() => {
  vi.mocked(bcrypt.compare).mockReset()
})

describe('POST /api/admin/login', () => {
  it('returns 200 with valid credentials', async () => {
    prismaMock.adminUser.findUnique.mockResolvedValue({
      id: '1',
      email: 'admin@test.com',
      password: '$2a$hashed',
      name: 'Admin',
    } as never)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const req = createRequest('POST', 'http://localhost:3000/api/admin/login', {
      email: 'admin@test.com',
      password: 'correct-password',
    })
    const res = await POST(req)
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('returns 400 when email is missing', async () => {
    const req = createRequest('POST', 'http://localhost:3000/api/admin/login', {
      password: 'test',
    })
    const res = await POST(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(400)
  })

  it('returns 400 when password is missing', async () => {
    const req = createRequest('POST', 'http://localhost:3000/api/admin/login', {
      email: 'admin@test.com',
    })
    const res = await POST(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(400)
  })

  it('returns 401 when user not found', async () => {
    prismaMock.adminUser.findUnique.mockResolvedValue(null)

    const req = createRequest('POST', 'http://localhost:3000/api/admin/login', {
      email: 'nonexistent@test.com',
      password: 'test',
    })
    const res = await POST(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(401)
  })

  it('returns 401 when password is wrong', async () => {
    prismaMock.adminUser.findUnique.mockResolvedValue({
      id: '1',
      email: 'admin@test.com',
      password: '$2a$hashed',
      name: 'Admin',
    } as never)
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    const req = createRequest('POST', 'http://localhost:3000/api/admin/login', {
      email: 'admin@test.com',
      password: 'wrong-password',
    })
    const res = await POST(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(401)
  })

  it('returns 500 on unexpected error', async () => {
    prismaMock.adminUser.findUnique.mockRejectedValue(new Error('DB crash'))

    const req = createRequest('POST', 'http://localhost:3000/api/admin/login', {
      email: 'admin@test.com',
      password: 'test',
    })
    const res = await POST(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(500)
  })
})
