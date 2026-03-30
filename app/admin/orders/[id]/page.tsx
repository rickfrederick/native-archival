import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import OrderStatusForm from './OrderStatusForm'

type Props = {
  params: Promise<{ id: string }>
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

export default async function AdminOrderDetailPage({ params }: Props) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) redirect('/admin/login')

  const { id } = await params

  let order
  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { include: { product: true } },
      },
    })
  } catch {
    order = null
  }

  if (!order) notFound()

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-700">
          ← Orders
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Order {order.orderNumber}</h1>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={order.status} />
            <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: '#e5e7eb' }}>
              <h2 className="text-sm font-semibold text-gray-900">Order Items</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: '#f3f4f6', backgroundColor: '#f9fafb' }}>
                  {['Product', 'Qty', 'Unit Price', 'Total'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b" style={{ borderColor: '#f3f4f6' }}>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t space-y-2" style={{ borderColor: '#e5e7eb' }}>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-900">${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t" style={{ borderColor: '#e5e7eb' }}>
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white border rounded p-6" style={{ borderColor: '#e5e7eb' }}>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Customer</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-gray-900">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="text-gray-500">{order.customer.email}</p>
              {order.customer.phone && <p className="text-gray-500">{order.customer.phone}</p>}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white border rounded p-6" style={{ borderColor: '#e5e7eb' }}>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{order.shippingAddress}</p>
          </div>

          {/* Status update */}
          <OrderStatusForm orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  )
}
