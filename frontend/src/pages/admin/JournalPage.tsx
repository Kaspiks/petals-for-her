import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit3,
  MoreVertical,
  Eye,
  Clock,
  Target,
  SlidersHorizontal,
  Image,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const ACCENT = '#E8365D'
const BG = '#FAF9F7'

const CATEGORY_COLORS = [
  { bg: 'bg-pink-100', text: 'text-pink-800' },
  { bg: 'bg-green-100', text: 'text-green-800' },
  { bg: 'bg-blue-100', text: 'text-blue-800' },
  { bg: 'bg-purple-100', text: 'text-purple-800' },
  { bg: 'bg-orange-100', text: 'text-orange-800' },
]

function hashCategoryName(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = (h << 5) - h + name.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function getCategoryBadgeStyle(categoryName: string) {
  const idx = hashCategoryName(categoryName) % CATEGORY_COLORS.length
  return CATEGORY_COLORS[idx]
}

function formatPostId(id: number): string {
  const year = new Date().getFullYear()
  return `PJ-${year}-${String(id).padStart(3, '0')}`
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Author {
  id: number
  name: string
}

interface Post {
  id: number
  title: string
  slug: string
  status: 'published' | 'scheduled' | 'draft'
  featured: boolean
  published_at: string | null
  word_count: number | null
  reading_time: number | null
  category: Category | null
  author: Author
  hero_image_url: string | null
  created_at: string
}

interface ApiResponse {
  data: Post[]
  total: number
  page: number
  per_page: number
  stats: {
    total_posts: number
    published: number
    drafts: number
    scheduled: number
  }
}

export default function JournalPage() {
  const { fetchWithAuth } = useAuth()
  const [data, setData] = useState<ApiResponse>({
    data: [],
    total: 0,
    page: 1,
    per_page: 20,
    stats: { total_posts: 0, published: 0, drafts: 0, scheduled: 0 },
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [page, setPage] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchDebounced) params.set('q', searchDebounced)
    if (categoryFilter) params.set('category_id', categoryFilter)
    if (statusFilter) params.set('status', statusFilter)
    params.set('page', String(page))
    params.set('per_page', '20')

    try {
      const res = await fetchWithAuth(`/api/v1/admin/posts?${params}`)
      if (res.ok) {
        const json: ApiResponse = await res.json()
        setData(json)
      } else {
        setData((prev) => ({
          ...prev,
          data: [],
          total: 0,
          page: 1,
        }))
      }
    } catch {
      setData((prev) => ({
        ...prev,
        data: [],
        total: 0,
        page: 1,
      }))
    } finally {
      setLoading(false)
    }
  }, [fetchWithAuth, searchDebounced, page, categoryFilter, statusFilter])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/api/v1/admin/categories?category_type=journal&per_page=100')
      if (res.ok) {
        const json = await res.json()
        const list = (json.data ?? []) as Array<{ id: number; name: string; slug: string }>
        setCategories(list)
      }
    } catch {
      setCategories([])
    }
  }, [fetchWithAuth])

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [searchDebounced, categoryFilter, statusFilter])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const totalPages = Math.ceil(data.total / data.per_page) || 1
  const start = data.total === 0 ? 0 : (data.page - 1) * data.per_page + 1
  const end = Math.min(data.page * data.per_page, data.total)

  if (loading && data.data.length === 0) {
    return (
      <div className="p-8 min-h-screen" style={{ backgroundColor: BG }}>
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
    <div className="p-8 min-h-screen" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800 mb-1">Journal Posts</h1>
          <p className="text-stone-500 text-sm">
            Manage your blog stories, wedding inspiration, and gift guides.
          </p>
        </div>
        <Link
          to="/admin/journal/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          <Plus className="w-4 h-4" />
          Create New Post
        </Link>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search posts by title, tag or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-[#E8365D]/30 focus:border-[#E8365D] bg-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-stone-200 text-stone-700 bg-white text-sm font-medium focus:ring-2 focus:ring-[#E8365D]/30 focus:border-[#E8365D]"
        >
          <option value="">Category: All</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-stone-200 text-stone-700 bg-white text-sm font-medium focus:ring-2 focus:ring-[#E8365D]/30 focus:border-[#E8365D]"
        >
          <option value="">Status: All</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Draft</option>
        </select>
        <button
          type="button"
          className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
          title="Filter"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500 bg-stone-50 border-b border-stone-100">
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Preview</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">
                  Article Details
                </th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Category</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Author</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Date</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Status</th>
                <th className="py-3 px-4 font-medium uppercase text-xs tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((post) => {
                const badgeStyle = post.category
                  ? getCategoryBadgeStyle(post.category.name)
                  : { bg: 'bg-stone-100', text: 'text-stone-600' }
                return (
                  <tr
                    key={post.id}
                    className="border-b border-stone-50 hover:bg-stone-50/80 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0 flex items-center justify-center">
                        {post.hero_image_url ? (
                          <img
                            src={post.hero_image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image className="w-6 h-6 text-stone-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-stone-800">{post.title}</p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          ID: {formatPostId(post.id)}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {post.category ? (
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${badgeStyle.bg} ${badgeStyle.text}`}
                        >
                          {post.category.name}
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      {post.author?.name ?? '—'}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {formatDate(post.published_at ?? post.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : post.status === 'scheduled'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            post.status === 'published'
                              ? 'bg-emerald-500'
                              : post.status === 'scheduled'
                                ? 'bg-amber-500'
                                : 'bg-stone-400'
                          }`}
                        />
                        {post.status === 'published'
                          ? 'Published'
                          : post.status === 'scheduled'
                            ? 'Scheduled'
                            : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/journal/${post.id}/edit`}
                          className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                          title="More"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {data.data.length === 0 && (
          <div className="py-12 text-center text-stone-500">
            No journal posts found. Create your first post to get started.
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

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-stone-100">
              <Eye className="w-5 h-5 text-stone-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                Total Views
              </p>
              <p className="text-2xl font-semibold text-stone-800 mt-0.5">12.8k</p>
              <p className="text-xs text-emerald-600 mt-0.5">+14% from last month</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-stone-100">
              <Clock className="w-5 h-5 text-stone-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                Avg. Read Time
              </p>
              <p className="text-2xl font-semibold text-stone-800 mt-0.5">4m 32s</p>
              <p className="text-xs text-stone-500 mt-0.5">Steady engagement</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-stone-100">
              <Target className="w-5 h-5 text-stone-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                Conversion Rate
              </p>
              <p className="text-2xl font-semibold text-stone-800 mt-0.5">3.2%</p>
              <p className="text-xs text-emerald-600 mt-0.5">+0.5% growth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
