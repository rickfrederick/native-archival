import Link from 'next/link'

type SearchParams = Promise<{ order?: string }>

export default async function OrderConfirmationPage({ searchParams }: { searchParams: SearchParams }) {
  const { order } = await searchParams

  return (
    <div style={{ backgroundColor: 'var(--color-ivory)' }} className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ backgroundColor: 'var(--color-kraft)' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
            style={{ color: 'var(--color-ivory)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div className="w-8 h-px mx-auto mb-8" style={{ backgroundColor: 'var(--color-kraft)' }} />
        <h1
          className="text-3xl font-light tracking-widest uppercase mb-4"
          style={{ color: 'var(--color-charcoal)' }}
        >
          Order Confirmed
        </h1>
        {order && (
          <p
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-silver)' }}
          >
            Order Number: <span style={{ color: 'var(--color-charcoal)' }}>{order}</span>
          </p>
        )}
        <p
          className="text-sm leading-relaxed mb-10"
          style={{ color: 'var(--color-silver)' }}
        >
          Thank you for your order. We&apos;ll send you a confirmation email shortly.
          Your archival products will be carefully packaged and shipped from Palmyra, NY.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="px-8 py-3 text-xs uppercase tracking-widest font-medium"
            style={{ backgroundColor: 'var(--color-kraft)', color: 'var(--color-ivory)' }}
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-8 py-3 text-xs uppercase tracking-widest font-medium border"
            style={{ borderColor: 'var(--color-charcoal)', color: 'var(--color-charcoal)' }}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
