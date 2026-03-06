import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ACCENT = '#E8365D'

const STATUS_TABS = [
  { id: 'all', label: 'All Occasions' },
  { id: 'active', label: 'Active' },
  { id: 'draft', label: 'Draft' },
]

function PencilIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

function getStatusBadge(occasion) {
  if (occasion.active) {
    return { label: 'Active', className: 'bg-emerald-100 text-emerald-800' }
  }
  return { label: 'Draft', className: 'bg-stone-100 text-stone-500' }
}

export default function OccasionsPage() {
  const { fetchWithAuth } = useAuth()
  const [data, setData] = useState({ data: [], total: 0, page: 1, per_page: 20 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [statusTab, setStatusTab] = useState('all')
  const [page, setPage] = useState(1)
  const fetchOccasions = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchDebounced) params.set('q', searchDebounced)
    if (statusTab === 'active') params.set('status', 'active')
    if (statusTab === 'draft') params.set('status', 'draft')
    params.set('page', String(page))
    params.set('per_page', '20')

    try {
      const res = await fetchWithAuth(`/api/v1/admin/occasions?${params}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      } else {
        setData({ data: [], total: 0, page: 1, per_page: 20 })
      }
    } catch {
      setData({ data: [], total: 0, page: 1, per_page: 20 })
    } finally {
      setLoading(false)
    }
  }, [fetchWithAuth, searchDebounced, statusTab, page])

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    fetchOccasions()
  }, [fetchOccasions])

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this occasion?')) return
    try {
      const res = await fetchWithAuth(`/api/v1/admin/occasions/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchOccasions()
      }
    } catch {
      // Error handling
    }
  }

  const totalPages = Math.ceil(data.total / data.per_page) || 1
  const start = data.total === 0 ? 0 : (data.page - 1) * data.per_page + 1
  const end = Math.min(data.page * data.per_page, data.total)

  // Compute stats from data
  const totalOccasions = data.total
  const activeCount = data.data?.filter((o) => o.active).length ?? 0
  const draftCount = data.data?.filter((o) => !o.active).length ?? 0
  const mostPopular = data.data?.reduce((best, o) => {
    const count = o.products_count ?? 0
    return !best || count > (best.products_count ?? 0) ? o : best
  }, null)

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
          <h1 className="text-2xl font-semibold text-stone-800 mb-1">Occasions Management</h1>
          <p className="text-stone-500 text-sm">Organize and curate event-based collections</p>
        </div>
        <Link
          to="/admin/occasions/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          <span>+</span> Add New Occasion
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-stone-100 p-5 shadow-sm">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Occasions</p>
          <p className="text-2xl font-semibold text-stone-800 mt-1">{totalOccasions}</p>
          <p className="text-sm text-stone-500 mt-1">— vs last period</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-100 p-5 shadow-sm">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Most Popular</p>
          <p className="text-lg font-semibold text-stone-800 mt-1 truncate">{mostPopular?.name ?? '—'}</p>
          <p className="text-sm text-stone-500 mt-1">
            {mostPopular ? `${mostPopular.products_count ?? 0} products` : '—'}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-stone-100 p-5 shadow-sm">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Active Displays</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">{activeCount}</p>
          <p className="text-sm text-stone-500 mt-1">Live on storefront</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-100 p-5 shadow-sm">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Draft Status</p>
          <p className="text-2xl font-semibold text-stone-600 mt-1">{draftCount}</p>
          <p className="text-sm text-stone-500 mt-1">Not yet published</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search occasions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-4 pr-4 py-2 rounded-lg border border-stone-200 text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-[#E8365D]/30 focus:border-[#E8365D]"
          />
        </div>
        <div className="flex border-b border-stone-200 -mb-px">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusTab(tab.id)
                setPage(1)
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                statusTab === tab.id
                  ? 'border-[#E8365D] text-[#E8365D]'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 bg-stone-50 border-b border-stone-100">
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Occasion Name</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Featured Image</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Products</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Status</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((occasion) => {
                const status = getStatusBadge(occasion)
                return (
                  <tr key={occasion.id} className="border-b border-stone-50 hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-800">{occasion.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                        {occasion.featured_image_url ? (
                          <img
                            src={occasion.featured_image_url}
                            alt={occasion.name}
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
                      <span className="text-stone-700">{occasion.products_count ?? 0}</span>
                      <span className="text-stone-500 ml-1">Products</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/occasions/${occasion.id}/edit`}
                          className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-[#E8365D] transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(occasion.id)}
                          className="p-2 rounded-lg text-stone-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {data.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    No occasions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-3 border-t border-stone-100 bg-stone-50/50">
          <div className="text-sm text-stone-500">
            Showing {start} to {end} of {data.total} results
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
                        page === p ? 'text-white' : 'text-stone-600 hover:bg-stone-200'
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
