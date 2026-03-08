import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const ACCENT = '#E8365D'

const StarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 20 20" fill={ACCENT}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.065 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.284-3.957z" />
  </svg>
)

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

function OccasionsPage() {
  const [occasions, setOccasions] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [nlStatus, setNlStatus] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/occasions').then((r) => r.json()),
      fetch('/api/v1/products').then((r) => r.json()),
    ])
      .then(([occ, prod]) => {
        setOccasions(occ)
        setProducts(prod)
      })
      .catch(() => {
        setOccasions([])
        setProducts([])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleNewsletter = async (e) => {
    e.preventDefault()
    setNlStatus(null)
    try {
      const res = await fetch('/api/v1/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setNlStatus('success')
        setEmail('')
      } else {
        const data = await res.json().catch(() => ({}))
        setNlStatus(data.errors?.[0] || 'Something went wrong')
      }
    } catch {
      setNlStatus('Something went wrong. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-40">
          <svg
            className="w-10 h-10 animate-spin"
            style={{ color: ACCENT }}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <Footer />
      </div>
    )
  }

  const row1 = occasions.slice(0, 3)
  const row2 = occasions.slice(3, 5)

  return (
    <div className="min-h-screen bg-white text-stone-800">
      <SEO
        title="Occasions"
        description="From heartfelt anniversaries to joyful celebrations, find the perfect floral arrangement for every special moment."
        canonicalPath="/occasions"
      />
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1a1a2e]" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-40 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Gifts for Every Occasion
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            From heartfelt anniversaries to joyful celebrations, find the perfect floral
            arrangement for every meaningful moment in your life.
          </p>
          <Link
            to="/products"
            className="inline-block px-8 py-4 rounded-lg text-white font-semibold text-lg transition hover:opacity-90 hover:scale-105 duration-300"
            style={{ backgroundColor: ACCENT }}
          >
            Explore Bouquets
          </Link>
        </div>
      </section>

      {/* ── Shop by Moment ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span
                className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-3"
                style={{ color: ACCENT }}
              >
                Curated Collections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900">
                Shop by Moment
              </h2>
            </div>
            <p className="text-stone-500 max-w-sm text-sm leading-relaxed md:text-right">
              There are no rules when it comes to gifting — only moments worth celebrating.
              Let our curated collections guide you to the perfect bloom.
            </p>
          </div>

          {occasions.length > 0 && (
            <div className="space-y-5">
              {/* Row 1: 3 equal cards */}
              {row1.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {row1.map((occ) => (
                    <OccasionCard key={occ.id} occasion={occ} />
                  ))}
                </div>
              )}
              {/* Row 2: 2/3 + 1/3 */}
              {row2.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {row2.map((occ, i) => (
                    <div key={occ.id} className={i === 0 ? 'lg:col-span-2' : 'lg:col-span-1'}>
                      <OccasionCard occasion={occ} tall={i === 1} />
                    </div>
                  ))}
                </div>
              )}
              {/* Any remaining occasions in rows of 3 */}
              {occasions.length > 5 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {occasions.slice(5).map((occ) => (
                    <OccasionCard key={occ.id} occasion={occ} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Most Popular Gifts ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#FAF9F7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 mb-3">
              Most Popular Gifts
            </h2>
            <p className="text-stone-500">
              Trusted by thousands of flower lovers nationwide
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug || p.id}`}
                className="group"
              >
                <div className="aspect-square bg-white rounded-xl overflow-hidden border border-stone-200 mb-3">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon key={s} />
                  ))}
                </div>
                <h3 className="font-medium text-stone-800 group-hover:text-stone-600 transition text-sm">
                  {p.name}
                </h3>
                <p className="text-sm font-semibold mt-0.5" style={{ color: ACCENT }}>
                  {formatPrice(p.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-5">
            <svg
              className="w-10 h-10 mx-auto"
              style={{ color: ACCENT }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 mb-3">
            Join the Floral Society
          </h2>
          <p className="text-stone-500 mb-8 max-w-lg mx-auto leading-relaxed">
            Get exclusive gifts, flower care tips, early access to new collections,
            and seasonal inspiration delivered straight to your inbox.
          </p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-4 py-3.5 rounded-lg border border-stone-300 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E8365D]/40 focus:border-[#E8365D]"
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-lg text-white font-semibold transition hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              Subscribe
            </button>
          </form>
          {nlStatus === 'success' && (
            <p className="mt-4 text-sm text-green-600">Thank you for subscribing!</p>
          )}
          {nlStatus && nlStatus !== 'success' && (
            <p className="mt-4 text-sm text-red-500">{nlStatus}</p>
          )}
          <p className="mt-5 text-xs text-stone-400">
            Available for a Limited time for the First 1000 Members
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function OccasionCard({ occasion }) {
  const fallbackBg =
    'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?auto=format&fit=crop&w=800&q=80'

  return (
    <Link
      to={`/occasions/${occasion.slug}`}
      className="group relative block min-h-[220px] rounded-xl overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src={occasion.featured_image_url || fallbackBg}
          alt={occasion.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
      <div className="relative h-full min-h-[220px] flex flex-col justify-end p-6">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
          {occasion.name}
        </h3>
        {occasion.description && (
          <p className="text-white/70 text-sm line-clamp-2 mb-3 max-w-md">
            {occasion.description}
          </p>
        )}
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold tracking-wider uppercase transition group-hover:gap-2"
          style={{ color: ACCENT }}
        >
          Shop the Collection
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

export default OccasionsPage
