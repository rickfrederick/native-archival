import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params
  try {
    const product = await prisma.product.findUnique({
      where: { slug, active: true },
    })
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }
    return Response.json({ product })
  } catch {
    return Response.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
