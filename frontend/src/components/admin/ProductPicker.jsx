import { useState, useEffect } from 'react'

export default function ProductPicker({ selectedProductIds = [], onSelectionChange, fetchWithAuth }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchWithAuth('/api/v1/admin/products?per_page=999')
        if (res.ok) {
          const json = await res.json()
          setProducts(json.data ?? [])
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [fetchWithAuth])

  const filteredProducts = search.trim()
    ? products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    : products

  const selectedSet = new Set(selectedProductIds.map(String))

  function toggleProduct(id) {
    const idStr = String(id)
    const next = selectedSet.has(idStr)
      ? selectedProductIds.filter((x) => String(x) !== idStr)
      : [...selectedProductIds, id]
    onSelectionChange(next)
  }

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-stone-800">Products</h2>
        <span className="text-sm text-stone-500">{selectedProductIds.length} products selected</span>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products by name..."
        className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder:text-stone-400 focus:ring-2 focus:ring-[#E8365D]/20 focus:border-[#E8365D] outline-none transition-colors mb-4"
      />

      {loading ? (
        <div className="py-12 text-center text-stone-500 text-sm">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const isSelected = selectedSet.has(String(product.id))
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => toggleProduct(product.id)}
                className={`text-left rounded-xl border-2 p-4 transition-colors hover:border-[#E8365D]/40 ${
                  isSelected ? 'border-[#E8365D] bg-[#FFF0F0]/20' : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-stone-100 mb-3">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="font-medium text-stone-800 truncate">{product.name}</p>
                <p className="text-sm text-stone-500 mt-0.5">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price ?? '0.00'}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#E8365D] bg-[#E8365D]' : 'border-stone-300'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-xs text-stone-500">{isSelected ? 'Selected' : 'Click to select'}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="py-12 text-center text-stone-500 text-sm">
          {search.trim() ? 'No products match your search.' : 'No products available.'}
        </div>
      )}
    </div>
  )
}
