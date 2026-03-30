import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

async function getCustomers() {
  try {
    return await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orders: { select: { total: true } },
      },
    })
  } catch {
    return [] as never[]
  }
}

export default async function AdminCustomersPage() {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) redirect('/admin/login')

  const customers = await getCustomers()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-1">{customers.length} total customers</p>
      </div>

      <div className="bg-white border rounded overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
                {['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Joined'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                    No customers yet
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const totalSpent = customer.orders.reduce((sum, o) => sum + o.total, 0)
                  return (
                    <tr
                      key={customer.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#f3f4f6' }}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{customer.phone || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{customer.orders.length}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ${totalSpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
