import { describe, it, expect, vi } from 'vitest'
import { prismaMock } from '../../helpers/prisma-mock'
import { createRequest, getJsonResponse } from '../../helpers/request'
import { GET, PUT, DELETE } from '@/app/api/admin/products/[id]/route'

vi.mock('@/lib/admin-auth', () => ({
  verifyAdminSession: vi.fn().mockResolvedValue(true),
}))

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) })

describe('GET /api/admin/products/[id]', () => {
  it('returns product by id', async () => {
    prismaMock.product.findUnique.mockResolvedValue({ id: '1', name: 'Test' } as never)

    const req = createRequest('GET')
    const res = await GET(req, makeParams('1'))
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.product.id).toBe('1')
  })

  it('returns 404 when not found', async () => {
    prismaMock.product.findUnique.mockResolvedValue(null)

    const req = createRequest('GET')
    const res = await GET(req, makeParams('nonexistent'))
    const { status } = await getJsonResponse(res)

    expect(status).toBe(404)
  })
})

describe('PUT /api/admin/products/[id]', () => {
  it('updates product fields', async () => {
    const updated = { id: '1', name: 'Updated', slug: 'updated', price: 39.99 }
    prismaMock.product.update.mockResolvedValue(updated as never)

    const req = createRequest('PUT', 'http://localhost:3000', {
      name: 'Updated',
      slug: 'updated',
      price: 39.99,
    })
    const res = await PUT(req, makeParams('1'))
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.product.name).toBe('Updated')
  })

  it('returns 500 on error', async () => {
    prismaMock.product.update.mockRejectedValue(new Error('Update failed'))

    const req = createRequest('PUT', 'http://localhost:3000', { name: 'Test' })
    const res = await PUT(req, makeParams('1'))
    const { status } = await getJsonResponse(res)

    expect(status).toBe(500)
  })
})

describe('DELETE /api/admin/products/[id]', () => {
  it('deletes product successfully', async () => {
    prismaMock.product.delete.mockResolvedValue({ id: '1' } as never)

    const req = createRequest('DELETE')
    const res = await DELETE(req, makeParams('1'))
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('returns 500 on error', async () => {
    prismaMock.product.delete.mockRejectedValue(new Error('FK constraint'))

    const req = createRequest('DELETE')
    const res = await DELETE(req, makeParams('1'))
    const { status } = await getJsonResponse(res)

    expect(status).toBe(500)
  })
})
