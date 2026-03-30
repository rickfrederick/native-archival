import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    return Response.json({ products })
  } catch {
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        comparePrice: body.comparePrice ?? null,
        category: body.category,
        inventory: body.inventory ?? 0,
        featured: body.featured ?? false,
        active: body.active ?? true,
      },
    })
    return Response.json({ product }, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create product'
    return Response.json({ error: msg }, { status: 500 })
  }
}
