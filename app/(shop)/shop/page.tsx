import { prisma } from '@/lib/prisma'
import ShopClient from './ShopClient'

export const metadata = {
  title: 'Shop',
  description: 'Browse all archival and preservation products from Native Archival.',
}

async function getProducts() {
  try {
    return await prisma.product.findMany({
      where: { active: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })
  } catch {
    return []
  }
}

export default async function ShopPage() {
  const products = await getProducts()
  return <ShopClient products={products} />
}
