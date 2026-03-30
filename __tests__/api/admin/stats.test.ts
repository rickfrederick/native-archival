import { describe, it, expect, vi } from 'vitest'
import { prismaMock } from '../../helpers/prisma-mock'
import { createRequest, getJsonResponse } from '../../helpers/request'
import { GET } from '@/app/api/admin/stats/route'

vi.mock('@/lib/admin-auth', () => ({
  verifyAdminSession: vi.fn().mockResolvedValue(true),
}))

import { verifyAdminSession } from '@/lib/admin-auth'

describe('GET /api/admin/stats', () => {
  it('returns aggregated counts and revenue', async () => {
    prismaMock.product.count.mockResolvedValue(10)
    prismaMock.order.count.mockResolvedValue(5)
    prismaMock.customer.count.mockResolvedValue(3)
    prismaMock.order.findMany.mockResolvedValue([
      { total: 100.50 },
      { total: 200.00 },
      { total: 50.25 },
    ] as never)

    const req = createRequest('GET')
    const res = await GET(req)
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.productCount).toBe(10)
    expect(data.orderCount).toBe(5)
    expect(data.customerCount).toBe(3)
    expect(data.revenue).toBeCloseTo(350.75)
  })

  it('returns 401 when unauthenticated', async () => {
    vi.mocked(verifyAdminSession).mockResolvedValueOnce(false)

    const req = createRequest('GET')
    const res = await GET(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(401)
  })

  it('returns 500 on error', async () => {
    prismaMock.product.count.mockRejectedValue(new Error('DB error'))

    const req = createRequest('GET')
    const res = await GET(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(500)
  })
})
