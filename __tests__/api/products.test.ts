import { describe, it, expect } from 'vitest'
import { prismaMock } from '../helpers/prisma-mock'
import { createRequest, getJsonResponse } from '../helpers/request'
import { GET } from '@/app/api/products/route'
import { GET as GET_SLUG } from '@/app/api/products/[slug]/route'

describe('GET /api/products', () => {
  it('returns active products', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', slug: 'product-1', active: true, featured: true },
      { id: '2', name: 'Product 2', slug: 'product-2', active: true, featured: false },
    ]
    prismaMock.product.findMany.mockResolvedValue(mockProducts as never)

    const req = createRequest('GET', 'http://localhost:3000/api/products')
    const res = await GET(req)
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.products).toHaveLength(2)
    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: { active: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })
  })

  it('returns empty array when no products', async () => {
    prismaMock.product.findMany.mockResolvedValue([])

    const req = createRequest('GET')
    const res = await GET(req)
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.products).toEqual([])
  })

  it('returns 500 on database error', async () => {
    prismaMock.product.findMany.mockRejectedValue(new Error('DB error'))

    const req = createRequest('GET')
    const res = await GET(req)
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(500)
    expect(data.error).toBe('Failed to fetch products')
  })
})

describe('GET /api/products/[slug]', () => {
  const makeParams = (slug: string) => ({ params: Promise.resolve({ slug }) })

  it('returns product when found', async () => {
    const mockProduct = { id: '1', name: 'Test', slug: 'test', active: true }
    prismaMock.product.findUnique.mockResolvedValue(mockProduct as never)

    const req = createRequest('GET')
    const res = await GET_SLUG(req, makeParams('test'))
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.product.slug).toBe('test')
  })

  it('returns 404 when product not found', async () => {
    prismaMock.product.findUnique.mockResolvedValue(null)

    const req = createRequest('GET')
    const res = await GET_SLUG(req, makeParams('nonexistent'))
    const { status } = await getJsonResponse(res)

    expect(status).toBe(404)
  })

  it('queries with active: true', async () => {
    prismaMock.product.findUnique.mockResolvedValue(null)

    const req = createRequest('GET')
    await GET_SLUG(req, makeParams('test-slug'))

    expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
      where: { slug: 'test-slug', active: true },
    })
  })

  it('returns 500 on database error', async () => {
    prismaMock.product.findUnique.mockRejectedValue(new Error('DB error'))

    const req = createRequest('GET')
    const res = await GET_SLUG(req, makeParams('test'))
    const { status } = await getJsonResponse(res)

    expect(status).toBe(500)
  })
})
