import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `NA-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, items, subtotal, shipping, tax, total, shippingAddress } = body

    if (!customer || !items || items.length === 0) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find or create customer
    let dbCustomer = await prisma.customer.findUnique({
      where: { email: customer.email },
    })

    if (!dbCustomer) {
      dbCustomer = await prisma.customer.create({
        data: {
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone || null,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          zip: customer.zip,
        },
      })
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: dbCustomer.id,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress,
        items: {
          create: items.map((item: { id: string; price: number; quantity: number }) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    return Response.json({ orderNumber: order.orderNumber, id: order.id }, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return Response.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
