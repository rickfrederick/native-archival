import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { customer: true, items: { include: { product: true } } },
    })
    if (!order) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ order })
  } catch {
    return Response.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const { status } = await request.json()
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    })
    return Response.json({ order })
  } catch {
    return Response.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
