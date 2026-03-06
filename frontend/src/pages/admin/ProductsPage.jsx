import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminProductsPage() {
  const { fetchWithAuth } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', price: '', active: true })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetchWithAuth('/api/v1/admin/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [fetchWithAuth])

  function startEditing(product) {
    setEditing(product.id)
    setEditForm({ name: product.name, price: String(product.price ?? ''), active: product.active ?? true })
  }

  async function saveProduct() {
    if (!editing) return
    setSaving(true)
    try {
      const fields = {
        name: editForm.name,
        price: parseFloat(editForm.price) || 0,
        active: editForm.active,
      }
      const res = await fetchWithAuth(`/api/v1/admin/products/${editing}`, {
        method: 'PATCH',
        body: JSON.stringify(fields),
      })
      if (res.ok) {
        const updated = await res.json()
        setProducts((prev) => prev.map((p) => (p.id === editing ? updated : p)))
        setEditing(null)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-48" />
          <div className="h-64 bg-stone-200 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800 mb-2">Products</h1>
          <p className="text-stone-500">Manage your product catalog.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4A5A5] text-white rounded-lg font-medium hover:bg-[#B88A8A] transition-colors"
        >
          <span>+</span> Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 bg-stone-50 border-b border-stone-100">
                <th className="py-3 px-4 font-medium">Image</th>
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Collection</th>
                <th className="py-3 px-4 font-medium">Price</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-stone-50">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                          —
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/admin/products/${product.id}`} className="font-medium text-stone-800 hover:text-[#D4A5A5]">
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-stone-600">{product.collection?.name}</td>
                  <td className="py-3 px-4">${product.price?.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        product.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => startEditing(product)}
                      className="text-sm text-[#D4A5A5] hover:text-[#B88A8A] font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#D4A5A5]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.price}
                  onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#D4A5A5]/30"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={editForm.active}
                  onChange={(e) => setEditForm((f) => ({ ...f, active: e.target.checked }))}
                  className="rounded border-stone-300 text-[#D4A5A5] focus:ring-[#D4A5A5]"
                />
                <label htmlFor="active" className="text-sm text-stone-600">Active</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={saveProduct}
                disabled={saving}
                className="flex-1 py-2 bg-[#D4A5A5] text-white rounded-lg font-medium hover:bg-[#B88A8A] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="flex-1 py-2 border border-stone-200 rounded-lg text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
