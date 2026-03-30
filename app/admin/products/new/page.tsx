'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CATEGORIES = ['Albums', 'Photo Storage', 'Print Preservers', 'Portfolios', 'Card Collectors']

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    comparePrice: '',
    category: CATEGORIES[0],
    inventory: '0',
    featured: false,
    active: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    if (name === 'name') {
      setForm({ ...form, name: value, slug: slugify(value) })
    } else {
      setForm({ ...form, [name]: val })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
          inventory: parseInt(form.inventory),
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create product')
      }
      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-700">
          ← Products
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded p-6 space-y-5" style={{ borderColor: '#e5e7eb' }}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border rounded outline-none focus:ring-2 focus:ring-gray-300"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Slug (URL)</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border rounded outline-none focus:ring-2 focus:ring-gray-300"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 text-sm border rounded outline-none focus:ring-2 focus:ring-gray-300 resize-none"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border rounded outline-none"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Compare Price ($)</label>
            <input
              name="comparePrice"
              type="number"
              step="0.01"
              min="0"
              value={form.comparePrice}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded outline-none"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded outline-none"
              style={{ borderColor: '#d1d5db' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Inventory</label>
            <input
              name="inventory"
              type="number"
              min="0"
              value={form.inventory}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border rounded outline-none"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="w-4 h-4"
              />
              Active
            </label>
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-white rounded disabled:opacity-50"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
