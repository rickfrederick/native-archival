import { describe, it, expect, vi } from 'vitest'
import { prismaMock } from '../../helpers/prisma-mock'
import { createRequest, getJsonResponse } from '../../helpers/request'
import { GET, POST } from '@/app/api/admin/products/route'

vi.mock('@/lib/admin-auth', () => ({
  verifyAdminSession: vi.fn(),
}))

import { verifyAdminSession } from '@/lib/admin-auth'

describe('GET /api/admin/products', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(verifyAdminSession).mockResolvedValue(false)

    const req = createRequest('GET')
    const res = await GET(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(401)
  })

  it('returns all products when authenticated', async () => {
    vi.mocked(verifyAdminSession).mockResolvedValue(true)
    prismaMock.product.findMany.mockResolvedValue([
      { id: '1', name: 'Active Product', active: true },
      { id: '2', name: 'Inactive Product', active: false },
    ] as never)

    const req = createRequest('GET')
    const res = await GET(req)
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.products).toHaveLength(2)
  })
})

describe('POST /api/admin/products', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(verifyAdminSession).mockResolvedValue(false)

    const req = createRequest('POST', 'http://localhost:3000/api/admin/products', {
      name: 'Test',
      slug: 'test',
    })
    const res = await POST(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(401)
  })

  it('creates product and returns 201', async () => {
    vi.mocked(verifyAdminSession).mockResolvedValue(true)
    const productData = {
      name: 'New Product',
      slug: 'new-product',
      description: 'A test product',
      price: 29.99,
      category: 'Albums',
      inventory: 10,
    }
    prismaMock.product.create.mockResolvedValue({ id: '1', ...productData } as never)

    const req = createRequest('POST', 'http://localhost:3000/api/admin/products', productData)
    const res = await POST(req)
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(201)
    expect(data.product.name).toBe('New Product')
  })

  it('returns 500 on duplicate slug', async () => {
    vi.mocked(verifyAdminSession).mockResolvedValue(true)
    prismaMock.product.create.mockRejectedValue(new Error('Unique constraint failed on slug'))

    const req = createRequest('POST', 'http://localhost:3000/api/admin/products', {
      name: 'Dup',
      slug: 'existing-slug',
    })
    const res = await POST(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(500)
  })
})
