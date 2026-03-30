import { redirect } from 'next/navigation'
import Link from 'next/link'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import DeleteProductForm from './DeleteProductForm'
import type { Product } from '@prisma/client'

async function getProducts(): Promise<Product[]> {
  try {
    return await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function AdminProductsPage() {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) redirect('/admin/login')

  const products = await getProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 text-sm font-medium text-white rounded"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          + New Product
        </Link>
      </div>

      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
                {['Name', 'Category', 'Price', 'Inventory', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                    No products yet.{' '}
                    <Link href="/admin/products/new" className="text-blue-600 hover:underline">
                      Create your first product
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#f3f4f6' }}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-400">/shop/{product.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</div>
                      {product.comparePrice && (
                        <div className="text-xs text-gray-400 line-through">${product.comparePrice.toFixed(2)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.inventory}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                      {product.featured && (
                        <span className="ml-1 inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function DeleteProductButton({ productId }: { productId: string }) {
  return <DeleteProductForm productId={productId} />
}
