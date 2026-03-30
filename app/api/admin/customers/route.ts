import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: { orders: { select: { total: true } } },
    })
    return Response.json({ customers })
  } catch {
    return Response.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
