import { redirect, notFound } from 'next/navigation'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import EditProductForm from './EditProductForm'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) redirect('/admin/login')

  const { id } = await params

  let product
  try {
    product = await prisma.product.findUnique({ where: { id } })
  } catch {
    product = null
  }

  if (!product) notFound()

  return <EditProductForm product={product} />
}
