import { describe, it, expect, vi } from 'vitest'
import { prismaMock } from '../../helpers/prisma-mock'
import { createRequest, getJsonResponse } from '../../helpers/request'
import { GET } from '@/app/api/admin/orders/route'
import { PUT } from '@/app/api/admin/orders/[id]/route'

vi.mock('@/lib/admin-auth', () => ({
  verifyAdminSession: vi.fn().mockResolvedValue(true),
}))

import { verifyAdminSession } from '@/lib/admin-auth'

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) })

describe('GET /api/admin/orders', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(verifyAdminSession).mockResolvedValueOnce(false)

    const req = createRequest('GET')
    const res = await GET(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(401)
  })

  it('returns orders with customer and items', async () => {
    prismaMock.order.findMany.mockResolvedValue([
      { id: '1', orderNumber: 'NA-TEST-1', customer: {}, items: [] },
    ] as never)

    const req = createRequest('GET')
    const res = await GET(req)
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.orders).toHaveLength(1)
    expect(prismaMock.order.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      include: { customer: true, items: { include: { product: true } } },
    })
  })
})

describe('PUT /api/admin/orders/[id]', () => {
  it('updates order status', async () => {
    prismaMock.order.update.mockResolvedValue({
      id: '1',
      status: 'shipped',
    } as never)

    const req = createRequest('PUT', 'http://localhost:3000', { status: 'shipped' })
    const res = await PUT(req, makeParams('1'))
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.order.status).toBe('shipped')
  })

  it('returns 500 on error', async () => {
    prismaMock.order.update.mockRejectedValue(new Error('Update failed'))

    const req = createRequest('PUT', 'http://localhost:3000', { status: 'invalid' })
    const res = await PUT(req, makeParams('1'))
    const { status } = await getJsonResponse(res)

    expect(status).toBe(500)
  })
})
