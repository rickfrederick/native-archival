import { describe, it, expect } from 'vitest'
import { prismaMock } from '../helpers/prisma-mock'
import { createRequest, getJsonResponse } from '../helpers/request'
import { POST, generateOrderNumber } from '@/app/api/orders/route'

const validOrderBody = {
  customer: {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '555-1234',
    address: '123 Main St',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
  },
  items: [{ id: 'prod-1', price: 29.99, quantity: 2 }],
  subtotal: 59.98,
  shipping: 8.95,
  tax: 4.80,
  total: 73.73,
  shippingAddress: '123 Main St, Portland, OR 97201',
}

describe('POST /api/orders', () => {
  it('creates order successfully with new customer', async () => {
    prismaMock.customer.findUnique.mockResolvedValue(null)
    prismaMock.customer.create.mockResolvedValue({
      id: 'cust-1',
      email: 'test@example.com',
    } as never)
    prismaMock.order.create.mockResolvedValue({
      id: 'order-1',
      orderNumber: 'NA-TEST-1234',
    } as never)

    const req = createRequest('POST', 'http://localhost:3000/api/orders', validOrderBody)
    const res = await POST(req)
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(201)
    expect(data.orderNumber).toBeDefined()
    expect(data.id).toBeDefined()
  })

  it('finds existing customer by email', async () => {
    prismaMock.customer.findUnique.mockResolvedValue({
      id: 'existing-cust',
      email: 'test@example.com',
    } as never)
    prismaMock.order.create.mockResolvedValue({
      id: 'order-1',
      orderNumber: 'NA-TEST-1234',
    } as never)

    const req = createRequest('POST', 'http://localhost:3000/api/orders', validOrderBody)
    await POST(req)

    expect(prismaMock.customer.create).not.toHaveBeenCalled()
    expect(prismaMock.customer.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    })
  })

  it('returns 400 when customer data is missing', async () => {
    const body = { ...validOrderBody, customer: undefined }
    const req = createRequest('POST', 'http://localhost:3000/api/orders', body as never)
    const res = await POST(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(400)
  })

  it('returns 400 when items array is empty', async () => {
    const body = { ...validOrderBody, items: [] }
    const req = createRequest('POST', 'http://localhost:3000/api/orders', body)
    const res = await POST(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(400)
  })

  it('returns 400 when items have negative price', async () => {
    const body = {
      ...validOrderBody,
      items: [{ id: 'prod-1', price: -5, quantity: 1 }],
    }
    const req = createRequest('POST', 'http://localhost:3000/api/orders', body)
    const res = await POST(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(400)
  })

  it('returns 500 on database error', async () => {
    prismaMock.customer.findUnique.mockRejectedValue(new Error('DB error'))

    const req = createRequest('POST', 'http://localhost:3000/api/orders', validOrderBody)
    const res = await POST(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(500)
  })
})

describe('generateOrderNumber', () => {
  it('returns string matching NA-{base36}-{base36} format', () => {
    const orderNum = generateOrderNumber()
    expect(orderNum).toMatch(/^NA-[A-Z0-9]+-[A-Z0-9]+$/)
  })

  it('generates unique numbers', () => {
    const nums = new Set(Array.from({ length: 100 }, () => generateOrderNumber()))
    expect(nums.size).toBe(100)
  })
})
