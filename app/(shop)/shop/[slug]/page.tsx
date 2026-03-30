import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductDetailClient from './ProductDetailClient'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  try {
    const product = await prisma.product.findUnique({ where: { slug } })
    if (!product) return { title: 'Product Not Found' }
    return {
      title: product.name,
      description: product.description,
    }
  } catch {
    return { title: 'Product' }
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  let product
  try {
    product = await prisma.product.findUnique({ where: { slug, active: true } })
  } catch {
    product = null
  }

  if (!product) notFound()

  return (
    <div style={{ backgroundColor: 'var(--color-ivory)' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/shop"
          className="text-xs uppercase tracking-widest mb-10 inline-block"
          style={{ color: 'var(--color-silver)' }}
        >
          ← Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-6">
          {/* Image */}
          <div
            className="aspect-square flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-charcoal)' }}
          >
            <div className="text-center">
              <div
                className="text-5xl font-light tracking-widest uppercase mb-4"
                style={{ color: 'var(--color-silver)' }}
              >
                {product.name.split(' ').map((w: string) => w[0]).join('').substring(0, 3)}
              </div>
              <div
                className="w-8 h-px mx-auto"
                style={{ backgroundColor: 'var(--color-kraft)' }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="py-4">
            <div
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-kraft)' }}
            >
              {product.category}
            </div>
            <h1
              className="text-3xl font-light tracking-widest uppercase mb-4 leading-tight"
              style={{ color: 'var(--color-charcoal)' }}
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span
                className="text-2xl font-light"
                style={{ color: 'var(--color-charcoal)' }}
              >
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span
                  className="text-base line-through"
                  style={{ color: 'var(--color-silver)' }}
                >
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            <div
              className="w-full h-px mb-6"
              style={{ backgroundColor: 'var(--color-ivory-dark)' }}
            />

            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: 'var(--color-charcoal)' }}
            >
              {product.description}
            </p>

            <ProductDetailClient product={product} />

            {/* Made in USA badge */}
            <div
              className="mt-8 p-4 border flex items-center gap-3"
              style={{ borderColor: 'var(--color-ivory-dark)' }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-kraft)' }}
              />
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: 'var(--color-silver)' }}
              >
                Made in the USA — Archival Quality Guaranteed
              </span>
            </div>

            {/* Inventory */}
            {product.inventory > 0 ? (
              <p
                className="text-xs uppercase tracking-widest mt-4"
                style={{ color: 'var(--color-silver)' }}
              >
                In Stock — {product.inventory} available
              </p>
            ) : (
              <p
                className="text-xs uppercase tracking-widest mt-4"
                style={{ color: 'var(--color-kraft)' }}
              >
                Out of Stock
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
