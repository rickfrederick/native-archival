'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-store'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const cartTotal = total()
  const shipping = cartTotal >= 75 ? 0 : 8.95
  const tax = cartTotal * 0.08
  const orderTotal = cartTotal + shipping + tax

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items,
          subtotal: cartTotal,
          shipping,
          tax,
          total: orderTotal,
          shippingAddress: `${form.address}, ${form.city}, ${form.state} ${form.zip}`,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Order failed')
      }
      const data = await res.json()
      clearCart()
      router.push(`/order-confirmation?order=${data.orderNumber}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
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
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2 space-y-10">
              {/* Contact */}
              <div>
                <h2
                  className="text-xs font-medium uppercase tracking-widest mb-6"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'firstName', label: 'First Name', type: 'text' },
                    { name: 'lastName', label: 'Last Name', type: 'text' },
                    { name: 'email', label: 'Email Address', type: 'email' },
                    { name: 'phone', label: 'Phone (Optional)', type: 'tel' },
                  ].map((field) => (
                    <div key={field.name}>
                      <label
                        className="block text-xs uppercase tracking-widest mb-2"
                        style={{ color: 'var(--color-silver)' }}
                      >
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleChange}
                        required={field.name !== 'phone'}
                        className="w-full px-4 py-3 text-sm border bg-transparent outline-none focus:ring-1"
                        style={{
                          borderColor: 'var(--color-silver)',
                          color: 'var(--color-charcoal)',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h2
                  className="text-xs font-medium uppercase tracking-widest mb-6"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-xs uppercase tracking-widest mb-2"
                      style={{ color: 'var(--color-silver)' }}
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-sm border bg-transparent outline-none"
                      style={{ borderColor: 'var(--color-silver)', color: 'var(--color-charcoal)' }}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label
                        className="block text-xs uppercase tracking-widest mb-2"
                        style={{ color: 'var(--color-silver)' }}
                      >
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 text-sm border bg-transparent outline-none"
                        style={{ borderColor: 'var(--color-silver)', color: 'var(--color-charcoal)' }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs uppercase tracking-widest mb-2"
                        style={{ color: 'var(--color-silver)' }}
                      >
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required
                        maxLength={2}
                        className="w-full px-4 py-3 text-sm border bg-transparent outline-none uppercase"
                        style={{ borderColor: 'var(--color-silver)', color: 'var(--color-charcoal)' }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs uppercase tracking-widest mb-2"
                        style={{ color: 'var(--color-silver)' }}
                      >
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={form.zip}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 text-sm border bg-transparent outline-none"
                        style={{ borderColor: 'var(--color-silver)', color: 'var(--color-charcoal)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2
                  className="text-xs font-medium uppercase tracking-widest mb-6"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Payment
                </h2>
                <div
                  className="p-6 border flex items-center gap-4"
                  style={{ borderColor: 'var(--color-silver)' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                    style={{ color: 'var(--color-kraft)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <div>
                    <p
                      className="text-xs font-medium uppercase tracking-widest"
                      style={{ color: 'var(--color-charcoal)' }}
                    >
                      Secure Payment via Stripe
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: 'var(--color-silver)' }}
                    >
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 uppercase tracking-wider">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full py-4 text-xs uppercase tracking-widest font-medium transition-opacity disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-kraft)', color: 'var(--color-ivory)' }}
              >
                {loading ? 'Placing Order...' : `Place Order — $${orderTotal.toFixed(2)}`}
              </button>
            </div>

            {/* Summary */}
            <div>
              <div
                className="p-8 border sticky top-4"
                style={{ borderColor: 'var(--color-ivory-dark)', backgroundColor: 'var(--color-ivory-dark)' }}
              >
                <div className="w-6 h-px mb-6" style={{ backgroundColor: 'var(--color-kraft)' }} />
                <h2
                  className="text-sm font-medium uppercase tracking-widest mb-6"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-xs" style={{ color: 'var(--color-charcoal)' }}>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--color-charcoal)' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="w-full h-px mb-4"
                  style={{ backgroundColor: 'var(--color-ivory)' }}
                />
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: 'var(--color-silver)' }}>Subtotal</span>
                    <span className="text-xs" style={{ color: 'var(--color-charcoal)' }}>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: 'var(--color-silver)' }}>Shipping</span>
                    <span className="text-xs" style={{ color: 'var(--color-charcoal)' }}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: 'var(--color-silver)' }}>Tax</span>
                    <span className="text-xs" style={{ color: 'var(--color-charcoal)' }}>${tax.toFixed(2)}</span>
                  </div>
                </div>
                <div
                  className="w-full h-px mb-4"
                  style={{ backgroundColor: 'var(--color-ivory)' }}
                />
                <div className="flex justify-between">
                  <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-charcoal)' }}>Total</span>
                  <span className="text-base font-light" style={{ color: 'var(--color-charcoal)' }}>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
