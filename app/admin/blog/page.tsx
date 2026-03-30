import { redirect } from 'next/navigation'
import Link from 'next/link'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import type { BlogPost } from '@prisma/client'

async function getPosts(): Promise<BlogPost[]> {
  try {
    return await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function AdminBlogPage() {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) redirect('/admin/login')

  const posts = await getPosts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} total posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 text-sm font-medium text-white rounded"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          + New Post
        </Link>
      </div>

      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
                {['Title', 'Status', 'Date', 'Tags', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                    No posts yet.{' '}
                    <Link href="/admin/blog/new" className="text-blue-600 hover:underline">
                      Create your first post
                    </Link>
                  </td>
                </tr>
              ) : (
                posts.map((post) => {
                  const tags: string[] = (() => {
                    try { return JSON.parse(post.tags) } catch { return [] }
                  })()
                  return (
                    <tr
                      key={post.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#f3f4f6' }}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        <div className="text-xs text-gray-400">/blog/{post.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Edit
                          </Link>
                          {post.published && (
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-xs text-gray-500 hover:underline"
                              target="_blank"
                            >
                              View
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
