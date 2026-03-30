'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-store'

type Product = {
  id: string
  name: string
  price: number
  slug: string
  inventory: number
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCart((s) => s.addItem)

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      slug: product.slug,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-0">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-10 border flex items-center justify-center text-sm transition-colors"
          style={{ borderColor: 'var(--color-charcoal)', color: 'var(--color-charcoal)' }}
        >
          −
        </button>
        <div
          className="w-14 h-10 border-t border-b flex items-center justify-center text-sm"
          style={{ borderColor: 'var(--color-charcoal)', color: 'var(--color-charcoal)' }}
        >
          {quantity}
        </div>
        <button
          onClick={() => setQuantity(Math.min(product.inventory || 99, quantity + 1))}
          className="w-10 h-10 border flex items-center justify-center text-sm transition-colors"
          style={{ borderColor: 'var(--color-charcoal)', color: 'var(--color-charcoal)' }}
        >
          +
        </button>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        disabled={product.inventory === 0}
        className="px-8 py-3 text-xs uppercase tracking-widest font-medium transition-colors disabled:opacity-50"
        style={{
          backgroundColor: added ? 'var(--color-charcoal)' : 'var(--color-kraft)',
          color: 'var(--color-ivory)',
        }}
      >
        {added ? 'Added to Cart ✓' : product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  )
}
