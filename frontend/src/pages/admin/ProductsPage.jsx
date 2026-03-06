import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ACCENT = '#E8365D'

const CATEGORY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'bouquets', label: 'Bouquets' },
  { id: 'scents', label: 'Scents' },
  { id: 'materials', label: 'Materials' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Draft' },
  { value: 'out_of_stock', label: 'Out of Stock' },
]

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function ChevronLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

function getStatusBadge(product) {
  if (product.stock_status === 'out_of_stock') {
    return { label: 'Out of Stock', className: 'bg-red-100 text-red-800' }
  }
  if (product.active) {
    return { label: 'Active', className: 'bg-emerald-100 text-emerald-800' }
  }
  return { label: 'Draft', className: 'bg-stone-100 text-stone-500' }
}

export default function AdminProductsPage() {
  const { fetchWithAuth } = useAuth()
  const [data, setData] = useState({ data: [], total: 0, page: 1, per_page: 20 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [categoryTab, setCategoryTab] = useState('all')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchDebounced) params.set('q', searchDebounced)
    if (statusFilter === 'active') params.set('active', 'true')
    if (statusFilter === 'inactive') params.set('active', 'false')
    if (statusFilter === 'out_of_stock') params.set('stock_status', 'out_of_stock')
    params.set('page', String(page))
    params.set('per_page', '20')

    const res = await fetchWithAuth(`/api/v1/admin/products?${params}`)
    if (res.ok) {
      const json = await res.json()
      setData(json)
    } else {
      setData({ data: [], total: 0, page: 1, per_page: 20 })
    }
    setLoading(false)
  }, [fetchWithAuth, searchDebounced, statusFilter, page])

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const totalPages = Math.ceil(data.total / data.per_page) || 1
  const start = data.total === 0 ? 0 : (data.page - 1) * data.per_page + 1
  const end = Math.min(data.page * data.per_page, data.total)

  if (loading && data.data.length === 0) {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800 mb-1">Products</h1>
          <p className="text-stone-500 text-sm">Manage your floral collections and curated scents</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          <span>+</span> Add New Product
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search products, scents, or SKUs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-[#E8365D]/30 focus:border-[#E8365D]"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categoryTab === tab.id
                  ? 'text-white'
                  : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
              }`}
              style={categoryTab === tab.id ? { backgroundColor: ACCENT } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-2 rounded-lg border border-stone-200 text-stone-700 text-sm focus:ring-2 focus:ring-[#E8365D]/30 focus:border-[#E8365D]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 bg-stone-50 border-b border-stone-100">
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Product</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Price</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Scent Profile</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Status</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((product) => {
                const status = getStatusBadge(product)
                return (
                  <tr key={product.id} className="border-b border-stone-50 hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-stone-100 overflow-hidden flex-shrink-0">
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
                        <div>
                          <div className="font-semibold text-stone-800">{product.name}</div>
                          {product.sku && (
                            <div className="text-xs text-stone-500">{product.sku}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      ${Number(product.price ?? 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {product.scent_profile ? (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                          {product.scent_profile}
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="font-medium hover:underline"
                        style={{ color: ACCENT }}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-3 border-t border-stone-100 bg-stone-50/50">
          <div className="text-sm text-stone-500">
            Showing {start}–{end} of {data.total} products
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 7) return true
                if (p === 1 || p === totalPages) return true
                if (Math.abs(p - page) <= 1) return true
                return false
              })
              .map((p, idx, arr) => {
                const prev = arr[idx - 1]
                const showEllipsis = prev != null && p - prev > 1
                return (
                  <span key={p} className="flex items-center gap-1">
                    {showEllipsis && <span className="px-2 text-stone-400">…</span>}
                    <button
                      type="button"
                      onClick={() => setPage(p)}
                      className={`min-w-[2rem] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? 'text-white'
                          : 'text-stone-600 hover:bg-stone-200'
                      }`}
                      style={page === p ? { backgroundColor: ACCENT } : {}}
                    >
                      {p}
                    </button>
                  </span>
                )
              })}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
