import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ product })
  } catch {
    return Response.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const body = await request.json()
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        comparePrice: body.comparePrice ?? null,
        category: body.category,
        inventory: body.inventory,
        featured: body.featured,
        active: body.active,
      },
    })
    return Response.json({ product })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update product'
    return Response.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    await prisma.product.delete({ where: { id } })
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
