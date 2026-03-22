import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Download,
  Edit3,
  Trash2,
  FileText,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const ACCENT = '#E8365D'
const BLUSH = '#D4A5A5'

type CategoryType = 'product' | 'journal'

interface Category {
  id: number
  name: string
  type: CategoryType
  description?: string
  slug: string
  items_count?: number
  articles_count?: number
}

interface ApiResponse {
  data: Category[]
  total: number
  page: number
  per_page: number
  stats?: {
    product_categories: number
    journal_categories: number
    total_items_categorized: number
  }
}

function truncate(str: string | undefined, len = 60): string {
  if (!str) return ''
  return str.length <= len ? str : str.slice(0, len) + '…'
}

function getTypeIconColor(type: CategoryType): string {
  return type === 'product' ? '#6B7280' : '#059669'
}

export default function CategoriesPage() {
  const { fetchWithAuth } = useAuth()
  const [data, setData] = useState<ApiResponse>({
    data: [],
    total: 0,
    page: 1,
    per_page: 20,
    stats: { product_categories: 0, journal_categories: 0, total_items_categorized: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [page, setPage] = useState(1)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchDebounced) params.set('q', searchDebounced)
    params.set('page', String(page))
    params.set('per_page', '20')

    try {
      const res = await fetchWithAuth(`/api/v1/admin/categories?${params}`)
      if (res.ok) {
        const json: ApiResponse = await res.json()
        setData(json)
      } else {
        setData({
          data: [],
          total: 0,
          page: 1,
          per_page: 20,
          stats: { product_categories: 0, journal_categories: 0, total_items_categorized: 0 },
        })
      }
    } catch {
      setData({
        data: [],
        total: 0,
        page: 1,
        per_page: 20,
        stats: { product_categories: 0, journal_categories: 0, total_items_categorized: 0 },
      })
    } finally {
      setLoading(false)
    }
  }, [fetchWithAuth, searchDebounced, page])

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Delete "${category.name}"? This cannot be undone.`)) return
    try {
      const res = await fetchWithAuth(`/api/v1/admin/categories/${category.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchCategories()
      } else {
        const json = await res.json().catch(() => ({}))
        alert((json as { errors?: string[] }).errors?.join(', ') || 'Failed to delete category')
      }
    } catch {
      alert('Failed to delete category')
    }
  }

  const stats = data.stats ?? {
    product_categories: 0,
    journal_categories: 0,
    total_items_categorized: 0,
  }

  const totalPages = Math.ceil(data.total / data.per_page) || 1
  const start = data.total === 0 ? 0 : (data.page - 1) * data.per_page + 1
  const end = Math.min(data.page * data.per_page, data.total)

  if (loading && data.data.length === 0) {
    return (
      <div className="p-8" style={{ backgroundColor: '#FAF9F7' }}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-48" />
          <div className="h-12 bg-stone-200 rounded-lg w-full" />
          <div className="h-64 bg-stone-200 rounded-xl" />
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-stone-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: '#FAF9F7' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800 mb-1">Categories</h1>
          <p className="text-stone-500 text-sm">
            Manage your product and journal taxonomies with ease.
          </p>
        </div>
        <Link
          to="/admin/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          <span>+</span> Create New Category
        </Link>
      </div>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search categories by name, slug or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-[#E8365D]/30 focus:border-[#E8365D] bg-white"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 bg-stone-50 border-b border-stone-100">
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Name</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Type</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Description</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Slug</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Count</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-stone-50 hover:bg-stone-50/80 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getTypeIconColor(category.type) }}
                      />
                      <span className="font-semibold text-stone-800">{category.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        category.type === 'product'
                          ? 'bg-stone-200 text-stone-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {category.type === 'product' ? 'Product' : 'Journal'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-600 max-w-[200px]">
                    {truncate(category.description, 50) || '—'}
                  </td>
                  <td className="py-3 px-4" style={{ color: BLUSH }}>
                    {category.slug}
                  </td>
                  <td className="py-3 px-4 text-stone-700">
                    {category.type === 'product'
                      ? `${category.items_count ?? 0} Items`
                      : `${category.articles_count ?? 0} Articles`}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/categories/${category.id}/edit`}
                        className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.data.length === 0 && (
          <div className="py-12 text-center text-stone-500">
            No categories found. Create your first category to get started.
          </div>
        )}

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
              <ChevronLeft className="w-4 h-4" />
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
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-stone-100">
              <FileText className="w-5 h-5 text-stone-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                Product Categories
              </p>
              <p className="text-2xl font-semibold text-stone-800 mt-0.5">
                {stats.product_categories}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-stone-100">
              <FileText className="w-5 h-5 text-stone-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                Journal Categories
              </p>
              <p className="text-2xl font-semibold text-stone-800 mt-0.5">
                {stats.journal_categories}
              </p>
            </div>
          </div>
        </div>
        <div
          className="rounded-xl shadow-sm border border-stone-100 p-6"
          style={{ backgroundColor: ACCENT }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/90 uppercase tracking-wider">
                Total Items Categorized
              </p>
              <p className="text-2xl font-semibold text-white mt-0.5">
                {stats.total_items_categorized}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
