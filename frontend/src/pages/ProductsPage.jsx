import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const ACCENT = '#E8365D'
const PER_PAGE = 9
const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest' },
]

function formatPrice(price) {
  if (price == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

function ProductCard({ product }) {
  const slug = product?.slug ?? product?.id
  const isBestSeller = product?.stock_status === 'low_stock'
  const isNew = product?.collection_type === 'new_arrival'

  return (
    <Link to={`/product/${slug}`} className="group block">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 mb-3">
        {product?.image_url ? (
          <img
            src={product.image_url}
            alt={product?.name || 'Product'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
            </svg>
          </div>
        )}
        {isBestSeller && (
          <span className="absolute top-3 left-3 bg-[#E8365D] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
            Best Seller
          </span>
        )}
        {isNew && !isBestSeller && (
          <span className="absolute top-3 left-3 bg-[#E8365D]/90 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
            New
          </span>
        )}
      </div>
      <h3 className="font-semibold text-stone-800 group-hover:text-[#E8365D] transition text-sm">
        {product?.name || 'Product'}
      </h3>
      <p className="text-[#E8365D] font-semibold text-sm mt-0.5">{formatPrice(product?.price)}</p>
      {product?.scent_profile && (
        <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
          </svg>
          Scent: {product.scent_profile}
        </p>
      )}
    </Link>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex items-center justify-center gap-1.5 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-9 h-9 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition">1</button>
          {start > 2 && <span className="px-1 text-stone-400">…</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
            p === currentPage
              ? 'bg-[#E8365D] text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-stone-400">…</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-9 h-9 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition">{totalPages}</button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [occasions, setOccasions] = useState([])
  const [fragranceOptions, setFragranceOptions] = useState([])

  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const sort = searchParams.get('sort') || ''
  const occasionId = searchParams.get('occasion') || ''
  const collectionId = searchParams.get('collection') || ''
  const query = searchParams.get('q') || ''
  const minPrice = searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')) : null
  const maxPrice = searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')) : null
  const scentProfile = searchParams.get('scent') || ''

  const [email, setEmail] = useState('')

  useEffect(() => {
    fetch('/api/v1/occasions')
      .then((r) => r.json())
      .then(setOccasions)
      .catch(() => setOccasions([]))
  }, [])
  useEffect(() => {
    fetch('/api/v1/fragrance_options')
      .then((r) => r.json())
      .then(setFragranceOptions)
      .catch(() => setFragranceOptions([]))
  }, [])

  const fetchProducts = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', String(currentPage))
    params.set('per_page', String(PER_PAGE))
    if (sort) params.set('sort', sort)
    if (occasionId) params.set('occasion_id', occasionId)
    if (collectionId) params.set('collection_id', collectionId)
    if (query) params.set('q', query)
    if (scentProfile) params.set('scent_profile', scentProfile)
    if (minPrice != null && !Number.isNaN(minPrice)) params.set('min_price', String(minPrice))
    if (maxPrice != null && !Number.isNaN(maxPrice)) params.set('max_price', String(maxPrice))

    fetch(`/api/v1/products?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res)) {
          setProducts(res)
          setTotal(res.length)
        } else {
          setProducts(res.data || [])
          setTotal(res.total || 0)
        }
      })
      .catch(() => {
        setProducts([])
        setTotal(0)
      })
      .finally(() => setLoading(false))
  }, [currentPage, sort, occasionId, collectionId, query, scentProfile, minPrice, maxPrice])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const totalPages = Math.ceil(total / PER_PAGE)

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-stone-800">
      <SEO
        title="Shop Bouquets"
        description="Explore our curated collection of luxury silk bouquets with bespoke fragrances. Timeless beauty, handcrafted arrangements."
        canonicalPath="/products"
      />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-800 mb-3">
            Shop Bouquets
          </h1>
          <p className="text-stone-500 max-w-2xl leading-relaxed">
            Discover our curated collection of luxury arrangements, each meticulously crafted to evoke emotion and timeless beauty. From romantic roses to modern minimalist designs.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 shrink-0 space-y-8">
            {/* Scent */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">Scent</h3>
              <div className="space-y-2">
                {fragranceOptions.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="scent"
                      checked={scentProfile === opt.value}
                      onChange={() => updateParam('scent', scentProfile === opt.value ? '' : opt.value)}
                      className="w-4 h-4 border-stone-300 text-[#E8365D] focus:ring-[#E8365D]/30"
                    />
                    <span className="text-sm text-stone-600 group-hover:text-stone-800 transition">{opt.value}</span>
                  </label>
                ))}
                {fragranceOptions.length === 0 && (
                  <p className="text-xs text-stone-400 italic">Loading…</p>
                )}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">Occasion</h3>
              <div className="space-y-2">
                {occasions.map((occ) => (
                  <label key={occ.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="occasion"
                      checked={occasionId === String(occ.id)}
                      onChange={() => updateParam('occasion', occasionId === String(occ.id) ? '' : String(occ.id))}
                      className="w-4 h-4 border-stone-300 text-[#E8365D] focus:ring-[#E8365D]/30"
                    />
                    <span className="text-sm text-stone-600 group-hover:text-stone-800 transition">{occ.name}</span>
                  </label>
                ))}
                {occasions.length === 0 && (
                  <p className="text-xs text-stone-400 italic">Loading…</p>
                )}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">Price Range</h3>
              <div className="flex justify-between text-sm text-stone-600 mb-2">
                <span>${minPrice ?? 0}</span>
                <span>${maxPrice ?? 500}</span>
              </div>
              <input
                type="range"
                min={0}
                max={500}
                step={10}
                value={maxPrice ?? 500}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10)
                  updateParam('max_price', val < 500 ? String(val) : '')
                }}
                className="w-full h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-[#E8365D]"
              />
            </div>
          </aside>

          {/* Main content */}
          <section className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <p className="text-sm text-stone-500">
                Showing <span className="font-medium text-stone-700">{total}</span> exquisite arrangements
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-stone-500 whitespace-nowrap">Sort by:</label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="text-sm border border-stone-200 rounded-lg px-3 py-1.5 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#E8365D]/20 focus:border-[#E8365D]/40"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product grid */}
            {loading ? (
              <div className="flex justify-center py-24">
                <div className="w-8 h-8 border-2 border-stone-200 border-t-[#E8365D] rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-stone-500 mb-2">No arrangements found.</p>
                <Link to="/products" className="text-[#E8365D] text-sm font-medium hover:underline">
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => updateParam('page', String(p))}
            />
          </section>
        </div>
      </main>

      {/* Newsletter */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-3">The Bloom Registry</h2>
          <p className="text-stone-400 max-w-lg mx-auto mb-8 text-sm leading-relaxed">
            Join our exclusive circle for first access to seasonal collections, styling inspiration, and members-only offers.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); setEmail('') }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-stone-800 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8365D]/40 focus:border-[#E8365D]/40"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#E8365D] hover:bg-[#d42e52] text-white text-sm font-semibold rounded-lg transition whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ProductsPage
