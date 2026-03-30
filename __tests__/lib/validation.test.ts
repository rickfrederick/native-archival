import { describe, it, expect } from 'vitest'
import { validateOrderInput } from '@/lib/validation'

const validPayload = {
  customer: {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
  },
  items: [
    { id: 'prod-1', price: 29.99, quantity: 2 },
  ],
  subtotal: 59.98,
  shipping: 8.95,
  tax: 4.80,
  total: 73.73,
  shippingAddress: '123 Main St, Portland, OR 97201',
}

describe('validateOrderInput', () => {
  it('passes with valid complete payload', () => {
    const result = validateOrderInput(validPayload)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('fails when customer email is missing', () => {
    const payload = {
      ...validPayload,
      customer: { ...validPayload.customer, email: '' },
    }
    const result = validateOrderInput(payload)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Valid customer email is required')
  })

  it('fails when email has invalid format', () => {
    const payload = {
      ...validPayload,
      customer: { ...validPayload.customer, email: 'notanemail' },
    }
    const result = validateOrderInput(payload)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Valid customer email is required')
  })

  it('fails when items array is empty', () => {
    const payload = { ...validPayload, items: [] }
    const result = validateOrderInput(payload)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('At least one order item is required')
  })

  it('fails when item has negative price', () => {
    const payload = {
      ...validPayload,
      items: [{ id: 'prod-1', price: -5.00, quantity: 1 }],
    }
    const result = validateOrderInput(payload)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('price must be a positive number'))).toBe(true)
  })

  it('fails when item has zero quantity', () => {
    const payload = {
      ...validPayload,
      items: [{ id: 'prod-1', price: 29.99, quantity: 0 }],
    }
    const result = validateOrderInput(payload)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('quantity must be a positive integer'))).toBe(true)
  })

  it('fails when shippingAddress is missing', () => {
    const payload = { ...validPayload, shippingAddress: '' }
    const result = validateOrderInput(payload)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Shipping address is required')
  })

  it('fails when total is not a number', () => {
    const payload = { ...validPayload, total: 'not-a-number' }
    const result = validateOrderInput(payload)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Total must be a non-negative number')
  })
})
