import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ACCENT = '#E8365D'

const STATUS_TABS = [
  { id: 'all', label: 'All', status: '' },
  { id: 'published', label: 'Published', status: 'published' },
  { id: 'drafts', label: 'Drafts', status: 'drafts' },
]

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

function PencilIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

function DotsVerticalIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function truncate(str, len = 60) {
  if (!str) return ''
  return str.length <= len ? str : str.slice(0, len) + '…'
}

export default function CollectionsPage() {
  const { fetchWithAuth } = useAuth()
  const [data, setData] = useState({ data: [], total: 0, page: 1, per_page: 20 })
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 })
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [statusTab, setStatusTab] = useState('all')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('newest')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const statusParam = STATUS_TABS.find((t) => t.id === statusTab)?.status ?? ''

  const fetchCollections = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchDebounced) params.set('q', searchDebounced)
    if (statusParam) params.set('status', statusParam)
    params.set('page', String(page))
    params.set('per_page', '20')

    const res = await fetchWithAuth(`/api/v1/admin/collections?${params}`)
    if (res.ok) {
      const json = await res.json()
      setData(json)
    } else {
      setData({ data: [], total: 0, page: 1, per_page: 20 })
    }
    setLoading(false)
  }, [fetchWithAuth, searchDebounced, statusParam, page])

  const fetchStats = useCallback(async () => {
    try {
      const [allRes, publishedRes, draftsRes] = await Promise.all([
        fetchWithAuth('/api/v1/admin/collections?per_page=1'),
        fetchWithAuth('/api/v1/admin/collections?status=published&per_page=1'),
        fetchWithAuth('/api/v1/admin/collections?status=drafts&per_page=1'),
      ])
      const all = allRes.ok ? (await allRes.json()).total : 0
      const published = publishedRes.ok ? (await publishedRes.json()).total : 0
      const drafts = draftsRes.ok ? (await draftsRes.json()).total : 0
      setStats({ total: all, published, drafts })
    } catch {
      setStats({ total: 0, published: 0, drafts: 0 })
    }
  }, [fetchWithAuth])

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  const handleToggleActive = async (collection) => {
    setTogglingId(collection.id)
    setOpenMenuId(null)
    try {
      const res = await fetchWithAuth(`/api/v1/admin/collections/${collection.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !collection.active }),
      })
      if (res.ok) {
        fetchCollections()
        fetchStats()
      }
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (collection) => {
    setOpenMenuId(null)
    if (!window.confirm(`Delete "${collection.name}"? This cannot be undone.`)) return
    if (collection.products_count > 0) {
      alert('Cannot delete a collection that has products. Remove all products first.')
      return
    }
    try {
      const res = await fetchWithAuth(`/api/v1/admin/collections/${collection.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchCollections()
        fetchStats()
      } else {
        const json = await res.json().catch(() => ({}))
        alert(json.errors?.join(', ') || 'Failed to delete collection')
      }
    } catch {
      alert('Failed to delete collection')
    }
  }

  const averageProducts =
    data.data.length > 0
      ? (data.data.reduce((sum, c) => sum + (c.products_count ?? 0), 0) / data.data.length).toFixed(1)
      : '0'

  const totalPages = Math.ceil(data.total / data.per_page) || 1
  const start = data.total === 0 ? 0 : (data.page - 1) * data.per_page + 1
  const end = Math.min(data.page * data.per_page, data.total)

  if (loading && data.data.length === 0) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-48" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-stone-200 rounded-xl" />
            ))}
          </div>
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
          <h1 className="text-2xl font-semibold text-stone-800 mb-1">Collections Management</h1>
          <p className="text-stone-500 text-sm">Manage your curated collections</p>
        </div>
        <Link
          to="/admin/collections/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          <span>+</span> Create New Collection
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Collections</p>
          <p className="text-2xl font-semibold text-stone-800 mt-1">{stats.total}</p>
          <p className="text-sm text-stone-500 mt-0.5">All collections</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Published</p>
          <p className="text-2xl font-semibold text-stone-800 mt-1">{stats.published}</p>
          <p className="text-sm text-stone-500 mt-0.5">Visible on store</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Average Products</p>
          <p className="text-2xl font-semibold text-stone-800 mt-1">{averageProducts}</p>
          <p className="text-sm text-stone-500 mt-0.5">Per collection</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Draft</p>
          <p className="text-2xl font-semibold text-stone-800 mt-1">{stats.drafts}</p>
          <p className="text-sm text-stone-500 mt-0.5">Not yet published</p>
        </div>
      </div>

      {/* Search + Filter tabs + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search collections..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-[#E8365D]/30 focus:border-[#E8365D]"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusTab(tab.id)
                setPage(1)
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusTab === tab.id ? 'text-white' : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
              }`}
              style={statusTab === tab.id ? { backgroundColor: ACCENT } : {}}
            >
              {tab.label}
            </button>
          ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-stone-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 text-stone-700 text-sm focus:ring-2 focus:ring-[#E8365D]/30 focus:border-[#E8365D]"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name A–Z</option>
            <option value="products">Most products</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 bg-stone-50 border-b border-stone-100">
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Thumbnail</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Collection Name</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Date Created</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Products</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Visibility</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((collection) => (
                <tr key={collection.id} className="border-b border-stone-50 hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-stone-200">
                      {collection.featured_image_url ? (
                        <img
                          src={collection.featured_image_url}
                          alt={collection.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full rounded-full"
                          style={{ backgroundColor: ACCENT }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-semibold text-stone-800">{collection.name}</div>
                      {collection.description && (
                        <div className="text-xs text-stone-500">{truncate(collection.description, 100)}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-700">{formatDate(collection.created_at)}</td>
                  <td className="py-3 px-4">
                    <span className="font-medium" style={{ color: ACCENT }}>
                      {collection.products_count ?? 0}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(collection)}
                      disabled={togglingId === collection.id}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8365D]/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        collection.active ? 'bg-[#E8365D]' : 'bg-stone-200'
                      }`}
                      role="switch"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                          collection.active ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/collections/${collection.id}/edit`}
                        className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenMenuId(openMenuId === collection.id ? null : collection.id)}
                          className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                        >
                          <DotsVerticalIcon className="w-4 h-4" />
                        </button>
                        {openMenuId === collection.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 z-20 py-1 bg-white rounded-lg shadow-lg border border-stone-200 min-w-[140px]">
                              <button
                                type="button"
                                onClick={() => handleDelete(collection)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.data.length === 0 && (
          <div className="py-12 text-center text-stone-500">
            No collections found. Create your first collection to get started.
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-3 border-t border-stone-100 bg-stone-50/50">
          <div className="text-sm text-stone-500">
            Showing {start}–{end} of {data.total} collections
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
