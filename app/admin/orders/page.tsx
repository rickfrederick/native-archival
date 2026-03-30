import { redirect } from 'next/navigation'
import Link from 'next/link'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import type { Order, Customer } from '@prisma/client'

const STATUSES = ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

async function getOrders(): Promise<(Order & { customer: Customer })[]> {
  try {
    return await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { customer: true },
    })
  } catch {
    return []
  }
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

type SearchParams = Promise<{ status?: string }>

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) redirect('/admin/login')

  const { status } = await searchParams
  const allOrders = await getOrders()
  const orders = status && status !== 'All' ? allOrders.filter((o) => o.status === status) : allOrders

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{allOrders.length} total orders</p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === 'All' ? '/admin/orders' : `/admin/orders?status=${s}`}
            className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition-colors ${
              (s === 'All' && !status) || s === status
                ? 'bg-gray-900 text-white'
                : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}
            style={{ borderColor: '#e5e7eb' }}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
                {['Order #', 'Customer', 'Date', 'Status', 'Total', ''].map((h, i) => (
                  <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#f3f4f6' }}
                  >
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.customer.firstName} {order.customer.lastName}
                      <div className="text-xs text-gray-400">{order.customer.email}</div>
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
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-xs text-blue-600 hover:underline">
                        View
                      </Link>
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
