import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [productCount, orderCount, customerCount, orders] = await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.order.findMany({ select: { total: true } }),
    ])
    const revenue = orders.reduce((sum, o) => sum + o.total, 0)
    return Response.json({ productCount, orderCount, customerCount, revenue })
  } catch {
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
