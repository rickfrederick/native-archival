'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string
  published: boolean
}

export default function EditBlogForm({ post }: { post: BlogPost }) {
  const router = useRouter()
  const initialTags: string[] = (() => {
    try { return JSON.parse(post.tags) as string[] } catch { return [] }
  })()

  const [form, setForm] = useState({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    tags: initialTags.join(', '),
    published: post.published,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    if (name === 'title') {
      setForm({ ...form, title: value, slug: slugify(value) })
    } else {
      setForm({ ...form, [name]: val })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tags }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update post')
      }
      router.push('/admin/blog')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="text-sm text-gray-500 hover:text-gray-700">
          ← Blog
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Edit Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded p-6 space-y-5" style={{ borderColor: '#e5e7eb' }}>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm border rounded outline-none"
            style={{ borderColor: '#d1d5db' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Slug</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm border rounded outline-none"
            style={{ borderColor: '#d1d5db' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            required
            rows={2}
            className="w-full px-3 py-2 text-sm border rounded outline-none resize-none"
            style={{ borderColor: '#d1d5db' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={16}
            className="w-full px-3 py-2 text-sm border rounded outline-none resize-y font-mono"
            style={{ borderColor: '#d1d5db' }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border rounded outline-none"
            style={{ borderColor: '#d1d5db' }}
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Published
          </label>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-white rounded disabled:opacity-50"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/blog" className="text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
