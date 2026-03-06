import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminProductPage() {
  const { id } = useParams()
  const { fetchWithAuth } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetchWithAuth(`/api/v1/admin/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found')
        return res.json()
      })
      .then(setProduct)
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false))
  }, [id, fetchWithAuth])

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

  if (error || !product) {
    return (
      <div className="p-8">
        <p className="text-stone-600 mb-4">{error || 'Product not found'}</p>
        <Link to="/admin/products" className="text-[#D4A5A5] font-medium hover:underline">
          ← Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      <nav className="text-sm text-stone-500 mb-4">
        <Link to="/admin/products" className="hover:text-[#D4A5A5]">Products</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-800">{product.name}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
        <div className="flex gap-6">
          <div className="w-48 h-48 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 text-sm">No image</div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-stone-800 mb-2">{product.name}</h1>
            <p className="text-stone-500 mb-4">{product.description || 'No description'}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="font-medium text-stone-800">${product.price?.toFixed(2)}</span>
              <span className="text-stone-500">SKU: {product.sku || '—'}</span>
              <span
                className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                  product.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {product.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        <Link
          to={`/admin/products/${product.id}/edit`}
          className="px-4 py-2 bg-[#D4A5A5] text-white rounded-lg font-medium hover:bg-[#B88A8A] transition-colors inline-block"
        >
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Details</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-stone-500">Collection</dt>
              <dd className="font-medium text-stone-800">{product.collection?.name || '—'}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Vase Option</dt>
              <dd className="font-medium text-stone-800">{product.vase_option?.value || '—'}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Ribbon Material</dt>
              <dd className="font-medium text-stone-800">{product.ribbon_material?.value || '—'}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Ribbon Color</dt>
              <dd className="flex items-center gap-2">
                {product.ribbon_color?.hex_code && (
                  <span
                    className="w-4 h-4 rounded border border-stone-200"
                    style={{ backgroundColor: product.ribbon_color.hex_code }}
                  />
                )}
                <span className="font-medium text-stone-800">{product.ribbon_color?.value || '—'}</span>
              </dd>
            </div>
            <div>
              <dt className="text-stone-500">Primary Fragrance</dt>
              <dd className="font-medium text-stone-800">{product.primary_fragrance_option?.value || '—'}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Scent Intensity</dt>
              <dd className="font-medium text-stone-800 capitalize">{product.scent_intensity || '—'}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Silk Material</dt>
              <dd className="font-medium text-stone-800">{product.silk_material_type || '—'}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Gift Wrapping</dt>
              <dd className="font-medium text-stone-800">{product.gift_wrapping_included ? 'Included' : 'Not included'}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Scent Refill</dt>
              <dd className="font-medium text-stone-800">{product.include_scent_refill ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Stock Status</dt>
              <dd className="font-medium text-stone-800">{product.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
