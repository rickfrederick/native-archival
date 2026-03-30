import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(_request: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
    return Response.json({ posts })
  } catch {
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        tags: JSON.stringify(body.tags || []),
        published: body.published ?? false,
        publishedAt: body.published ? new Date() : null,
      },
    })
    return Response.json({ post }, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create post'
    return Response.json({ error: msg }, { status: 500 })
  }
}
