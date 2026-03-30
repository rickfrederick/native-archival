import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { customer: true, items: { include: { product: true } } },
    })
    return Response.json({ orders })
  } catch {
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
