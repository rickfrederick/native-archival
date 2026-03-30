import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import HomeAddToCart from '@/components/HomeAddToCart'
import type { Product, BlogPost } from '@prisma/client'

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    return await prisma.product.findMany({
      where: { featured: true, active: true },
      take: 4,
    })
  } catch {
    return []
  }
}

async function getLatestBlogPosts(): Promise<BlogPost[]> {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    })
  } catch {
    return []
  }
}

const categories = [
  { name: 'Albums', slug: 'Albums', desc: 'Archival photo albums for lasting preservation.' },
  { name: 'Photo Storage', slug: 'Photo+Storage', desc: 'Acid-free sleeves and storage boxes.' },
  { name: 'Print Preservers', slug: 'Print+Preservers', desc: 'Protect prints from UV, moisture, and time.' },
  { name: 'Portfolios', slug: 'Portfolios', desc: 'Professional presentation portfolios.' },
  { name: 'Card Collectors', slug: 'Card+Collectors', desc: 'Archival sleeves and cases for cards.' },
]

export default async function HomePage() {
  const [featuredProducts, blogPosts] = await Promise.all([
    getFeaturedProducts(),
    getLatestBlogPosts(),
  ])

  return (
    <div>
      {/* Hero */}
      <section
        style={{ backgroundColor: 'var(--color-charcoal)' }}
        className="relative min-h-[85vh] flex items-center"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 41px)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <div
              className="w-12 h-px mb-8"
              style={{ backgroundColor: 'var(--color-kraft)' }}
            />
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl mb-6 leading-tight"
              style={{ color: 'var(--color-ivory)', fontFamily: 'var(--font-display)' }}
            >
              Preserve<br />What<br />Matters.
            </h1>
            <p
              className="text-sm tracking-widest uppercase mb-10"
              style={{ color: 'var(--color-silver)' }}
            >
              Archival-quality storage products made in the USA.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="px-8 py-3 text-xs uppercase tracking-widest font-medium transition-colors bg-kraft hover:bg-kraft-light text-ivory"
              >
                Shop Now
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 text-xs uppercase tracking-widest font-medium border transition-colors"
                style={{ borderColor: 'var(--color-ivory)', color: 'var(--color-ivory)' }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section style={{ backgroundColor: 'var(--color-charcoal-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              'Made in the USA',
              'Acid-Free & Archival',
              'Direct-to-Consumer Pricing',
              '5 Product Categories',
            ].map((item) => (
              <div key={item} className="flex items-center justify-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--color-kraft)' }}
                />
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--color-silver)' }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ backgroundColor: 'var(--color-ivory-dark)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div
              className="w-8 h-px mx-auto mb-6"
              style={{ backgroundColor: 'var(--color-kraft)' }}
            />
            <h2
              className="text-2xl font-light tracking-widest uppercase"
              style={{ color: 'var(--color-charcoal)' }}
            >
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/shop?category=${cat.slug}`}
                className="group relative block p-6 transition-transform hover:-translate-y-1"
                style={{ backgroundColor: 'var(--color-charcoal)' }}
              >
                <div
                  className="w-8 h-0.5 mb-4 transition-all group-hover:w-12"
                  style={{ backgroundColor: 'var(--color-kraft)' }}
                />
                <h3
                  className="text-xs font-medium uppercase tracking-widest mb-2"
                  style={{ color: 'var(--color-ivory)' }}
                >
                  {cat.name}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--color-silver)' }}
                >
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-ivory)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-14">
            <div>
              <div
                className="w-8 h-px mb-4"
                style={{ backgroundColor: 'var(--color-kraft)' }}
              />
              <h2
                className="text-2xl font-light tracking-widest uppercase"
                style={{ color: 'var(--color-charcoal)' }}
              >
                Featured Products
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest"
              style={{ color: 'var(--color-kraft)' }}
            >
              View All →
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div
                    className="aspect-square mb-4"
                    style={{ backgroundColor: 'var(--color-ivory-dark)' }}
                  />
                  <div
                    className="h-3 w-3/4 mb-2"
                    style={{ backgroundColor: 'var(--color-ivory-dark)' }}
                  />
                  <div
                    className="h-3 w-1/4"
                    style={{ backgroundColor: 'var(--color-ivory-dark)' }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
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
                        className="absolute bottom-0 left-0 right-0 h-0.5 transition-all group-hover:opacity-100 opacity-0"
                        style={{ backgroundColor: 'var(--color-kraft)' }}
                      />
                    </div>
                    <h3
                      className="text-xs font-medium uppercase tracking-wider mb-1"
                      style={{ color: 'var(--color-charcoal)' }}
                    >
                      {product.name}
                    </h3>
                  </Link>
                  <p
                    className="text-xs mb-3"
                    style={{ color: 'var(--color-silver)' }}
                  >
                    ${product.price.toFixed(2)}
                  </p>
                  <HomeAddToCart product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Preview */}
      {blogPosts.length > 0 && (
        <section style={{ backgroundColor: 'var(--color-ivory-dark)' }} className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-14">
              <div>
                <div
                  className="w-8 h-px mb-4"
                  style={{ backgroundColor: 'var(--color-kraft)' }}
                />
                <h2
                  className="text-2xl font-light tracking-widest uppercase"
                  style={{ color: 'var(--color-charcoal)' }}
                >
                  The Archival Journal
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-xs uppercase tracking-widest"
                style={{ color: 'var(--color-kraft)' }}
              >
                All Posts →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article key={post.id}>
                  <div
                    className="aspect-video mb-5 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-charcoal)' }}
                  >
                    <span
                      className="text-xs uppercase tracking-widest"
                      style={{ color: 'var(--color-silver)' }}
                    >
                      Archival Journal
                    </span>
                  </div>
                  <div
                    className="w-6 h-px mb-4"
                    style={{ backgroundColor: 'var(--color-kraft)' }}
                  />
                  <h3
                    className="text-sm font-medium uppercase tracking-wider mb-3 leading-relaxed"
                    style={{ color: 'var(--color-charcoal)' }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed mb-4"
                    style={{ color: 'var(--color-silver)' }}
                  >
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs uppercase tracking-widest"
                    style={{ color: 'var(--color-kraft)' }}
                  >
                    Read More →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section style={{ backgroundColor: 'var(--color-charcoal)' }} className="py-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div
            className="w-8 h-px mx-auto mb-8"
            style={{ backgroundColor: 'var(--color-kraft)' }}
          />
          <h2
            className="text-3xl font-light tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-ivory)' }}
          >
            Protecting Memories Since 2018
          </h2>
          <p
            className="text-xs uppercase tracking-widest mb-10"
            style={{ color: 'var(--color-silver)' }}
          >
            Join thousands of collectors, photographers, and archivists.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="flex-1 px-4 py-3 text-xs uppercase tracking-wider bg-transparent border outline-none"
              style={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'var(--color-ivory)',
              }}
            />
            <button
              type="submit"
              className="px-6 py-3 text-xs uppercase tracking-widest font-medium whitespace-nowrap"
              style={{ backgroundColor: 'var(--color-kraft)', color: 'var(--color-ivory)' }}
            >
              Subscribe
            </button>
          </form>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest underline underline-offset-4"
            style={{ color: 'var(--color-silver)' }}
          >
            Shop All Products
          </Link>
        </div>
      </section>
    </div>
  )
}
