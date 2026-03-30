'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-store'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, count } = useCart()
  const cartTotal = total()
  const cartCount = count()

  const shipping = cartTotal >= 75 ? 0 : 8.95
  const tax = cartTotal * 0.08
  const orderTotal = cartTotal + shipping + tax

  if (cartCount === 0) {
    return (
      <div style={{ backgroundColor: 'var(--color-ivory)' }} className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="w-8 h-px mx-auto mb-8" style={{ backgroundColor: 'var(--color-kraft)' }} />
          <h1
            className="text-3xl font-light tracking-widest uppercase mb-6"
            style={{ color: 'var(--color-charcoal)' }}
          >
            Your Cart is Empty
          </h1>
          <p className="text-xs uppercase tracking-widest mb-10" style={{ color: 'var(--color-silver)' }}>
            Add some archival products to get started.
          </p>
          <Link
            href="/shop"
            className="px-8 py-3 text-xs uppercase tracking-widest font-medium"
            style={{ backgroundColor: 'var(--color-kraft)', color: 'var(--color-ivory)' }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--color-ivory)' }} className="min-h-screen">
      {/* Header */}
      <div style={{ backgroundColor: 'var(--color-charcoal)' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-8 h-px mb-4" style={{ backgroundColor: 'var(--color-kraft)' }} />
          <h1
            className="text-2xl font-light tracking-widest uppercase"
            style={{ color: 'var(--color-ivory)' }}
          >
            Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0">
            {/* Header row */}
            <div
              className="grid grid-cols-12 gap-4 pb-4 border-b text-xs uppercase tracking-widest"
              style={{ borderColor: 'var(--color-ivory-dark)', color: 'var(--color-silver)' }}
            >
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1" />
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 py-6 border-b items-center"
                style={{ borderColor: 'var(--color-ivory-dark)' }}
              >
                <div className="col-span-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-charcoal)' }}
                    >
                      <span
                        className="text-xs font-light"
                        style={{ color: 'var(--color-silver)' }}
                      >
                        {item.name.split(' ').map((w) => w[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <Link
                        href={`/shop/${item.slug}`}
                        className="text-xs font-medium uppercase tracking-wide"
                        style={{ color: 'var(--color-charcoal)' }}
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-silver)' }}>
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-3 flex items-center justify-center gap-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 border flex items-center justify-center text-xs"
                    style={{ borderColor: 'var(--color-charcoal)' }}
                  >
                    −
                  </button>
                  <div
                    className="w-10 h-8 border-t border-b flex items-center justify-center text-xs"
                    style={{ borderColor: 'var(--color-charcoal)' }}
                  >
                    {item.quantity}
                  </div>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 border flex items-center justify-center text-xs"
                    style={{ borderColor: 'var(--color-charcoal)' }}
                  >
                    +
                  </button>
                </div>

                <div className="col-span-2 text-right">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-charcoal)' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs"
                    style={{ color: 'var(--color-silver)' }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <Link
                href="/shop"
                className="text-xs uppercase tracking-widest"
                style={{ color: 'var(--color-silver)' }}
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div
              className="p-8 border"
              style={{ borderColor: 'var(--color-ivory-dark)', backgroundColor: 'var(--color-ivory-dark)' }}
            >
              <div className="w-6 h-px mb-6" style={{ backgroundColor: 'var(--color-kraft)' }} />
              <h2
                className="text-sm font-medium uppercase tracking-widest mb-6"
                style={{ color: 'var(--color-charcoal)' }}
              >
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-silver)' }}>
                    Subtotal
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-charcoal)' }}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-silver)' }}>
                    Shipping
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-charcoal)' }}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {cartTotal < 75 && (
                  <p className="text-xs" style={{ color: 'var(--color-kraft)' }}>
                    Add ${(75 - cartTotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-silver)' }}>
                    Est. Tax
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-charcoal)' }}>
                    ${tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div
                className="w-full h-px mb-6"
                style={{ backgroundColor: 'var(--color-ivory)' }}
              />

              <div className="flex justify-between mb-8">
                <span
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Total
                </span>
                <span className="text-lg font-light" style={{ color: 'var(--color-charcoal)' }}>
                  ${orderTotal.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-3 text-xs uppercase tracking-widest font-medium text-center"
                style={{ backgroundColor: 'var(--color-kraft)', color: 'var(--color-ivory)' }}
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
