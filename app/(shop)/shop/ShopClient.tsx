'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-store'

type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice: number | null
  category: string
  featured: boolean
  createdAt: Date
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest'

const CATEGORIES = ['All', 'Albums', 'Photo Storage', 'Print Preservers', 'Portfolios', 'Card Collectors']

export default function ShopClient({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sort, setSort] = useState<SortOption>('featured')
  const addItem = useCart((s) => s.addItem)

  const filtered = useMemo(() => {
    const list = activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory)
    switch (sort) {
      case 'price-asc': return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price)
      case 'newest': return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      default: return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
  }, [products, activeCategory, sort])

  return (
    <div>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--color-charcoal)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-8 h-px mb-6" style={{ backgroundColor: 'var(--color-kraft)' }} />
          <h1 className="text-3xl font-light tracking-widest uppercase" style={{ color: 'var(--color-ivory)' }}>
            All Products
          </h1>
          <p className="text-xs uppercase tracking-widest mt-2" style={{ color: 'var(--color-silver)' }}>
            {products.length} products — made in the USA
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-ivory)' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-2 text-xs uppercase tracking-widest font-medium transition-colors"
                  style={{
                    backgroundColor: activeCategory === cat ? 'var(--color-charcoal)' : 'transparent',
                    color: activeCategory === cat ? 'var(--color-ivory)' : 'var(--color-silver)',
                    border: `1px solid ${activeCategory === cat ? 'var(--color-charcoal)' : 'var(--color-silver)'}`,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-4 py-2 text-xs uppercase tracking-wider border bg-transparent outline-none"
              style={{ borderColor: 'var(--color-silver)', color: 'var(--color-charcoal)' }}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-silver)' }}>
                No products found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <div key={product.id} className="group">
                  <Link href={`/shop/${product.slug}`}>
                    <div
                      className="aspect-square mb-4 flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: 'var(--color-charcoal)' }}
                    >
                      <span
                        className="text-2xl font-light tracking-widest uppercase"
                        style={{ color: 'var(--color-silver)' }}
                      >
                        {product.name.split(' ').map((w) => w[0]).join('').substring(0, 3)}
                      </span>
                      <div
                        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ backgroundColor: 'var(--color-kraft)' }}
                      />
                    </div>
                    <div className="mb-1">
                      <span
                        className="text-xs uppercase tracking-wider"
                        style={{ color: 'var(--color-silver)' }}
                      >
                        {product.category}
                      </span>
                    </div>
                    <h3
                      className="text-sm font-medium uppercase tracking-wide mb-2 leading-tight"
                      style={{ color: 'var(--color-charcoal)' }}
                    >
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'var(--color-charcoal)' }}
                    >
                      ${product.price.toFixed(2)}
                    </span>
                    {product.comparePrice && (
                      <span
                        className="text-xs line-through"
                        style={{ color: 'var(--color-silver)' }}
                      >
                        ${product.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        slug: product.slug,
                      })
                    }
                    className="w-full py-2 text-xs uppercase tracking-widest font-medium transition-colors border"
                    style={{ borderColor: 'var(--color-charcoal)', color: 'var(--color-charcoal)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-charcoal)'
                      e.currentTarget.style.color = 'var(--color-ivory)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--color-charcoal)'
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
