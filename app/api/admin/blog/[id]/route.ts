import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ post })
  } catch {
    return Response.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const body = await request.json()
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        tags: JSON.stringify(body.tags || []),
        published: body.published,
        publishedAt: body.published && !existing?.publishedAt ? new Date() : existing?.publishedAt,
      },
    })
    return Response.json({ post })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update post'
    return Response.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    await prisma.blogPost.delete({ where: { id } })
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
