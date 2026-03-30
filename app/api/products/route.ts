import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })
    return Response.json({ products })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
