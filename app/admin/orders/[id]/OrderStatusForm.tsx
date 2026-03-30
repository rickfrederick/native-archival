'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrderStatusForm({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border rounded p-6" style={{ borderColor: '#e5e7eb' }}>
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Update Status</h2>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-3 py-2 text-sm border rounded outline-none mb-3 capitalize"
        style={{ borderColor: '#d1d5db' }}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">{s}</option>
        ))}
      </select>
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full py-2 text-sm font-medium text-white rounded disabled:opacity-50"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        {saved ? 'Saved ✓' : loading ? 'Saving...' : 'Save Status'}
      </button>
    </div>
  )
}
