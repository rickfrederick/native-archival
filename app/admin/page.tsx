import { redirect } from 'next/navigation'
import Link from 'next/link'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

async function getStats() {
  try {
    const [productCount, orderCount, customerCount, orders] = await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.order.findMany({ select: { total: true } }),
    ])
    const revenue = orders.reduce((sum, o) => sum + o.total, 0)
    return { productCount, orderCount, customerCount, revenue }
  } catch {
    return { productCount: 0, orderCount: 0, customerCount: 0, revenue: 0 }
  }
}

async function getRecentOrders() {
  try {
    return await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { customer: true },
    })
  } catch {
    return [] as never[]
  }
}

export default async function AdminDashboard() {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) redirect('/admin/login')

  const [stats, recentOrders] = await Promise.all([getStats(), getRecentOrders()])

  const statCards = [
    { label: 'Active Products', value: stats.productCount, href: '/admin/products' },
    { label: 'Total Orders', value: stats.orderCount, href: '/admin/orders' },
    { label: 'Customers', value: stats.customerCount, href: '/admin/customers' },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, href: '/admin/orders' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Native Archival overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="p-6 bg-white border rounded hover:shadow-sm transition-shadow"
            style={{ borderColor: '#e5e7eb' }}
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{card.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { href: '/admin/products/new', label: 'New Product' },
          { href: '/admin/orders', label: 'View Orders' },
          { href: '/admin/blog/new', label: 'New Blog Post' },
          { href: '/admin/customers', label: 'Customers' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="p-4 bg-white border rounded text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            style={{ borderColor: '#e5e7eb' }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border rounded" style={{ borderColor: '#e5e7eb' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e5e7eb' }}>
          <h2 className="text-sm font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottomColor: '#e5e7eb' }} className="border-b">
                {['Order #', 'Customer', 'Date', 'Status', 'Total'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50"
                    style={{ borderBottomColor: '#f3f4f6' }}
                  >
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-sm text-blue-600 hover:underline font-medium">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.customer.firstName} {order.customer.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
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

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}
