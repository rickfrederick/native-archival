'use client'

export default function DeleteProductForm({ productId }: { productId: string }) {
  async function handleDelete() {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
    window.location.reload()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-500 hover:underline"
    >
      Delete
    </button>
  )
}
