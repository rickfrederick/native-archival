import { describe, it, expect, vi } from 'vitest'
import { prismaMock } from '../../helpers/prisma-mock'
import { createRequest, getJsonResponse } from '../../helpers/request'
import { GET, POST } from '@/app/api/admin/blog/route'
import { PUT, DELETE } from '@/app/api/admin/blog/[id]/route'

vi.mock('@/lib/admin-auth', () => ({
  verifyAdminSession: vi.fn().mockResolvedValue(true),
}))

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) })

describe('GET /api/admin/blog', () => {
  it('returns posts ordered by createdAt desc', async () => {
    prismaMock.blogPost.findMany.mockResolvedValue([
      { id: '1', title: 'Post 1' },
      { id: '2', title: 'Post 2' },
    ] as never)

    const req = createRequest('GET')
    const res = await GET(req)
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.posts).toHaveLength(2)
    expect(prismaMock.blogPost.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    })
  })
})

describe('POST /api/admin/blog', () => {
  it('creates post and returns 201', async () => {
    prismaMock.blogPost.create.mockResolvedValue({
      id: '1',
      title: 'New Post',
      slug: 'new-post',
      published: false,
    } as never)

    const req = createRequest('POST', 'http://localhost:3000', {
      title: 'New Post',
      slug: 'new-post',
      excerpt: 'Test excerpt',
      content: '<p>Test</p>',
      published: false,
    })
    const res = await POST(req)
    const { status } = await getJsonResponse(res)

    expect(status).toBe(201)
  })

  it('sets publishedAt when published is true', async () => {
    prismaMock.blogPost.create.mockResolvedValue({ id: '1' } as never)

    const req = createRequest('POST', 'http://localhost:3000', {
      title: 'Published Post',
      slug: 'published-post',
      published: true,
    })
    await POST(req)

    const createCall = prismaMock.blogPost.create.mock.calls[0][0]
    expect(createCall.data.publishedAt).toBeInstanceOf(Date)
  })

  it('sets publishedAt to null when not published', async () => {
    prismaMock.blogPost.create.mockResolvedValue({ id: '1' } as never)

    const req = createRequest('POST', 'http://localhost:3000', {
      title: 'Draft Post',
      slug: 'draft-post',
      published: false,
    })
    await POST(req)

    const createCall = prismaMock.blogPost.create.mock.calls[0][0]
    expect(createCall.data.publishedAt).toBeNull()
  })
})

describe('PUT /api/admin/blog/[id]', () => {
  it('preserves existing publishedAt when already published', async () => {
    const existingDate = new Date('2024-01-01')
    prismaMock.blogPost.findUnique.mockResolvedValue({
      id: '1',
      publishedAt: existingDate,
    } as never)
    prismaMock.blogPost.update.mockResolvedValue({ id: '1' } as never)

    const req = createRequest('PUT', 'http://localhost:3000', {
      title: 'Updated',
      slug: 'updated',
      published: true,
    })
    await PUT(req, makeParams('1'))

    const updateCall = prismaMock.blogPost.update.mock.calls[0][0]
    expect(updateCall.data.publishedAt).toEqual(existingDate)
  })

  it('sets publishedAt when newly published', async () => {
    prismaMock.blogPost.findUnique.mockResolvedValue({
      id: '1',
      publishedAt: null,
    } as never)
    prismaMock.blogPost.update.mockResolvedValue({ id: '1' } as never)

    const req = createRequest('PUT', 'http://localhost:3000', {
      title: 'Now Published',
      slug: 'now-published',
      published: true,
    })
    await PUT(req, makeParams('1'))

    const updateCall = prismaMock.blogPost.update.mock.calls[0][0]
    expect(updateCall.data.publishedAt).toBeInstanceOf(Date)
  })
})

describe('DELETE /api/admin/blog/[id]', () => {
  it('deletes post successfully', async () => {
    prismaMock.blogPost.delete.mockResolvedValue({ id: '1' } as never)

    const req = createRequest('DELETE')
    const res = await DELETE(req, makeParams('1'))
    const { status, data } = await getJsonResponse(res)

    expect(status).toBe(200)
    expect(data.success).toBe(true)
  })
})
