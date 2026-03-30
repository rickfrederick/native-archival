'use client'

import { useCart } from '@/lib/cart-store'

type Product = {
  id: string
  name: string
  price: number
  slug: string
}

export default function HomeAddToCart({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)

  return (
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
  )
}
