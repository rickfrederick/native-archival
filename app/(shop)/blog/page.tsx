import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { BlogPost } from '@prisma/client'

export const metadata = {
  title: 'Blog',
  description: 'The Archival Journal — tips, guides, and stories from Native Archival.',
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    })
  } catch {
    return []
  }
}

function formatDate(date: Date | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div>
      {/* Hero */}
      <div style={{ backgroundColor: 'var(--color-charcoal)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="w-8 h-px mx-auto mb-8"
            style={{ backgroundColor: 'var(--color-kraft)' }}
          />
          <h1
            className="text-4xl font-light tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-ivory)' }}
          >
            The Archival Journal
          </h1>
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-silver)' }}
          >
            Tips, guides, and stories from Native Archival
          </p>
        </div>
      </div>

      {/* Posts */}
      <div style={{ backgroundColor: 'var(--color-ivory)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-silver)' }}>
                No posts published yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post) => {
                const tags = (() => {
                  try { return JSON.parse(post.tags) as string[] } catch { return [] }
                })()
                return (
                  <article key={post.id} className="group">
                    {/* Cover image placeholder */}
                    <div
                      className="aspect-video mb-6 flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: 'var(--color-charcoal)' }}
                    >
                      <span
                        className="text-xs uppercase tracking-widest"
                        style={{ color: 'var(--color-silver)' }}
                      >
                        Archival Journal
                      </span>
                      <div
                        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ backgroundColor: 'var(--color-kraft)' }}
                      />
                    </div>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs uppercase tracking-widest px-2 py-1"
                            style={{
                              backgroundColor: 'var(--color-ivory-dark)',
                              color: 'var(--color-silver)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="w-6 h-px mb-4" style={{ backgroundColor: 'var(--color-kraft)' }} />
                    <h2
                      className="text-sm font-medium uppercase tracking-wide mb-3 leading-relaxed"
                      style={{ color: 'var(--color-charcoal)' }}
                    >
                      {post.title}
                    </h2>
                    <p
                      className="text-xs leading-relaxed mb-4"
                      style={{ color: 'var(--color-silver)' }}
                    >
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs uppercase tracking-widest"
                        style={{ color: 'var(--color-silver)' }}
                      >
                        {formatDate(post.publishedAt)}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs uppercase tracking-widest"
                        style={{ color: 'var(--color-kraft)' }}
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
