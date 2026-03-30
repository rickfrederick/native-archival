type ValidationResult = {
  valid: boolean
  errors: string[]
}

export function validateOrderInput(body: unknown): ValidationResult {
  const errors: string[] = []

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body is required'] }
  }

  const data = body as Record<string, unknown>

  // Validate customer
  if (!data.customer || typeof data.customer !== 'object') {
    errors.push('Customer information is required')
  } else {
    const customer = data.customer as Record<string, unknown>
    if (!customer.email || typeof customer.email !== 'string' || !customer.email.includes('@')) {
      errors.push('Valid customer email is required')
    }
    if (!customer.firstName || typeof customer.firstName !== 'string' || customer.firstName.trim() === '') {
      errors.push('Customer first name is required')
    }
    if (!customer.lastName || typeof customer.lastName !== 'string' || customer.lastName.trim() === '') {
      errors.push('Customer last name is required')
    }
  }

  // Validate items
  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push('At least one order item is required')
  } else {
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i] as Record<string, unknown>
      if (!item.id || typeof item.id !== 'string') {
        errors.push(`Item ${i + 1}: product ID is required`)
      }
      if (typeof item.price !== 'number' || item.price <= 0) {
        errors.push(`Item ${i + 1}: price must be a positive number`)
      }
      if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        errors.push(`Item ${i + 1}: quantity must be a positive integer`)
      }
    }
  }

  // Validate totals
  if (typeof data.subtotal !== 'number' || data.subtotal < 0) {
    errors.push('Subtotal must be a non-negative number')
  }
  if (typeof data.total !== 'number' || data.total < 0) {
    errors.push('Total must be a non-negative number')
  }

  // Validate shipping address
  if (!data.shippingAddress || typeof data.shippingAddress !== 'string' || data.shippingAddress.trim() === '') {
    errors.push('Shipping address is required')
  }

  return { valid: errors.length === 0, errors }
}
