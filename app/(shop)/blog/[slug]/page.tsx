import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } })
    if (!post) return { title: 'Post Not Found' }
    return {
      title: post.title,
      description: post.excerpt,
    }
  } catch {
    return { title: 'Blog Post' }
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  let post
  try {
    post = await prisma.blogPost.findUnique({ where: { slug, published: true } })
  } catch {
    post = null
  }

  if (!post) notFound()

  const tags: string[] = (() => {
    try { return JSON.parse(post.tags) as string[] } catch { return [] }
  })()

  return (
    <div style={{ backgroundColor: 'var(--color-ivory)' }} className="min-h-screen">
      {/* Cover image placeholder */}
      <div
        style={{ backgroundColor: 'var(--color-charcoal)' }}
        className="w-full h-64 md:h-80 flex items-center justify-center"
      >
        <div className="text-center">
          <div
            className="w-8 h-px mx-auto mb-4"
            style={{ backgroundColor: 'var(--color-kraft)' }}
          />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-silver)' }}
          >
            Archival Journal
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/blog"
          className="text-xs uppercase tracking-widest mb-10 inline-block"
          style={{ color: 'var(--color-silver)' }}
        >
          ← Back to Journal
        </Link>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs uppercase tracking-widest px-2 py-1"
                style={{ backgroundColor: 'var(--color-ivory-dark)', color: 'var(--color-silver)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="w-10 h-px mt-6 mb-6" style={{ backgroundColor: 'var(--color-kraft)' }} />

        <h1
          className="text-3xl md:text-4xl font-light tracking-widest uppercase mb-6 leading-tight"
          style={{ color: 'var(--color-charcoal)' }}
        >
          {post.title}
        </h1>

        <p
          className="text-xs uppercase tracking-widest mb-10"
          style={{ color: 'var(--color-silver)' }}
        >
          {formatDate(post.publishedAt)}
        </p>

        <div
          className="w-full h-px mb-10"
          style={{ backgroundColor: 'var(--color-ivory-dark)' }}
        />

        {/* Content */}
        <div
          className="prose-sm max-w-none"
          style={{ color: 'var(--color-charcoal)' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div
          className="w-full h-px mt-16 mb-8"
          style={{ backgroundColor: 'var(--color-ivory-dark)' }}
        />

        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-silver)' }}
          >
            ← All Posts
          </Link>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-kraft)' }}
          >
            Shop Products →
          </Link>
        </div>
      </div>
    </div>
  )
}
