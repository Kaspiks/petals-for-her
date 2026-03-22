import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const ACCENT = '#E8365D'

function formatPrice(price) {
  if (price == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

function OccasionProductCard({ product }) {
  const slug = product?.slug ?? product?.id
  const isBestSeller = product?.stock_status === 'low_stock'

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
              <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9z" />
            </svg>
          </div>
        )}
        {isBestSeller && (
          <span className="absolute top-3 left-3 bg-[#E8365D] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
            Best Seller
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
            <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9z" />
          </svg>
          Scent: {product.scent_profile}
        </p>
      )}
    </Link>
  )
}

export default function OccasionDetailPage() {
  const { slug } = useParams()
  const [occasion, setOccasion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) {
      setNotFound(true)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setNotFound(false)

    fetch(`/api/v1/occasions/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (res.status === 404) {
          if (!cancelled) {
            setNotFound(true)
            setOccasion(null)
          }
          return null
        }
        if (!res.ok) throw new Error('load failed')
        return res.json()
      })
      .then((data) => {
        if (cancelled || data == null) return
        setOccasion(data)
      })
      .catch(() => {
        if (!cancelled) {
          setNotFound(true)
          setOccasion(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-40">
          <svg className="w-10 h-10 animate-spin" style={{ color: ACCENT }} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <Footer />
      </div>
    )
  }

  if (notFound || !occasion) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] text-stone-800">
        <SEO
          title="Occasion Not Found"
          description="This occasion could not be found."
          canonicalPath="/occasions"
          noindex
        />
        <Header />
        <main className="max-w-lg mx-auto px-4 py-24 text-center">
          <h1 className="font-serif text-2xl font-semibold text-stone-800 mb-3">Occasion not found</h1>
          <p className="text-stone-500 mb-8">The page you’re looking for doesn’t exist or is no longer available.</p>
          <Link
            to="/occasions"
            className="inline-block px-6 py-3 rounded-lg text-white text-sm font-semibold transition hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            All occasions
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const seoTitle = occasion.meta_title?.trim() || occasion.name
  const seoDescription =
    occasion.meta_description?.trim() ||
    (occasion.description
      ? occasion.description.replace(/<[^>]+>/g, '').slice(0, 160)
      : `Shop ${occasion.name} — hand-crafted silk bouquets from Petals for Her.`)

  const gallery = occasion.gallery_image_urls || []

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-stone-800">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonicalPath={`/occasions/${occasion.slug}`}
        image={occasion.featured_image_url || undefined}
      />
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="text-sm text-stone-500">
          <Link to="/" className="hover:text-stone-800 transition">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/occasions" className="hover:text-stone-800 transition">
            Occasions
          </Link>
          <span className="mx-2">/</span>
          <span className="text-stone-800">{occasion.name}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative mt-6 mb-12 lg:mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden min-h-[280px] lg:min-h-[360px] bg-stone-200">
            {occasion.featured_image_url ? (
              <img
                src={occasion.featured_image_url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-stone-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
            <div className="relative z-10 flex flex-col justify-end min-h-[280px] lg:min-h-[360px] p-8 lg:p-12">
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
                style={{ color: ACCENT }}
              >
                Occasion
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {occasion.name}
              </h1>
              {occasion.description && (
                <p className="text-white/85 max-w-2xl text-lg leading-relaxed">{occasion.description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <h2 className="font-serif text-xl font-semibold text-stone-800 mb-6">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.map((url) => (
              <div key={url} className="aspect-square rounded-xl overflow-hidden bg-stone-200">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-800 mb-2">Shop the collection</h2>
            <p className="text-stone-500 text-sm">
              {occasion.products?.length
                ? `${occasion.products.length} arrangement${occasion.products.length === 1 ? '' : 's'} curated for this occasion.`
                : 'Arrangements for this occasion will appear here soon.'}
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold shrink-0 hover:underline"
            style={{ color: ACCENT }}
          >
            Browse all bouquets →
          </Link>
        </div>

        {occasion.products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
            {occasion.products.map((product) => (
              <OccasionProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl bg-white border border-stone-100">
            <p className="text-stone-500 mb-4">No products are linked to this occasion yet.</p>
            <Link
              to="/occasions"
              className="inline-block text-sm font-semibold hover:underline"
              style={{ color: ACCENT }}
            >
              ← Back to occasions
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
