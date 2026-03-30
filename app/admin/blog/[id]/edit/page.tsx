import { redirect, notFound } from 'next/navigation'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import EditBlogForm from './EditBlogForm'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: Props) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) redirect('/admin/login')

  const { id } = await params

  let post
  try {
    post = await prisma.blogPost.findUnique({ where: { id } })
  } catch {
    post = null
  }

  if (!post) notFound()

  return <EditBlogForm post={post} />
}
