import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const ACCENT = '#E8365D'

function formatPrice(price) {
  if (price == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

function ProductCardCompact({ product }) {
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
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
            </svg>
          </div>
        )}
        {isBestSeller && (
          <span className="absolute top-2.5 left-2.5 bg-[#E8365D] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
            Best Seller
          </span>
        )}
      </div>
      <h3 className="font-semibold text-stone-800 group-hover:text-[#E8365D] transition text-sm">
        {product?.name || 'Product'}
      </h3>
      <p className="text-[#E8365D] font-semibold text-sm mt-0.5">{formatPrice(product?.price)}</p>
    </Link>
  )
}

function ProductCardFeatured({ product }) {
  const slug = product?.slug ?? product?.id
  const isBestSeller = product?.stock_status === 'low_stock'

  return (
    <Link to={`/product/${slug}`} className="group block relative">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-100">
        {product?.image_url ? (
          <img
            src={product.image_url}
            alt={product?.name || 'Product'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
            </svg>
          </div>
        )}
        {isBestSeller && (
          <span className="absolute top-3 left-3 bg-[#E8365D] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
            Best Seller
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 pt-16">
          <h3 className="font-semibold text-white text-sm mb-2">{product?.name || 'Product'}</h3>
          <span className="inline-block bg-[#E8365D] hover:bg-[#d42e52] text-white text-xs font-semibold px-3 py-1.5 rounded transition">
            Shop Now · {formatPrice(product?.price)}
          </span>
        </div>
      </div>
    </Link>
  )
}

function CollectionSectionA({ collection }) {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:gap-16">
          <div className="lg:w-1/3 shrink-0 mb-10 lg:mb-0">
            <div className="lg:sticky lg:top-24">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-800 mb-4">
                {collection.name}
              </h2>
              {collection.description && (
                <p className="text-stone-500 leading-relaxed mb-6">{collection.description}</p>
              )}
              <Link
                to={`/products?collection=${collection.id}`}
                className="inline-flex items-center gap-1 text-[#E8365D] font-semibold text-sm hover:gap-2 transition-all"
              >
                View Entire Collection
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {collection.products?.length > 0 ? (
              <div className={`grid gap-5 ${
                collection.products.length <= 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-2 lg:grid-cols-3'
              }`}>
                {collection.products.map((product) => (
                  <ProductCardCompact key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16 rounded-xl bg-stone-50 border border-dashed border-stone-200">
                <p className="text-stone-400 text-sm italic">Coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function CollectionSectionB({ collection }) {
  return (
    <section className="py-16 lg:py-20 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:gap-16">
          <div className="lg:w-2/5 shrink-0 mb-10 lg:mb-0">
            <div className="lg:sticky lg:top-24">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-800 mb-4">
                {collection.name}
              </h2>
              {collection.description && (
                <p className="text-stone-500 leading-relaxed mb-6">{collection.description}</p>
              )}
              <Link
                to={`/products?collection=${collection.id}`}
                className="inline-flex items-center gap-1 text-[#E8365D] font-semibold text-sm hover:gap-2 transition-all"
              >
                View Entire Collection
                <span aria-hidden="true">→</span>
              </Link>

              {collection.featured_image_url && (
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 mt-6">
                  <img
                    src={collection.featured_image_url}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {collection.products?.length > 0 ? (
              <div className={`grid gap-5 ${
                collection.products.length <= 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-2'
              }`}>
                {collection.products.map((product) => (
                  <ProductCardFeatured key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16 rounded-xl bg-white border border-dashed border-stone-200">
                <p className="text-stone-400 text-sm italic">Coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/collections')
      .then((r) => r.json())
      .then((data) => setCollections(Array.isArray(data) ? data : []))
      .catch(() => setCollections([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white text-stone-800">
      <SEO
        title="Collections"
        description="Explore our signature floral collections — hand-crafted arrangements designed for moments worth remembering."
        canonicalPath="/collections"
      />
      <Header />

      {/* Hero */}
      <section className="relative bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1600&q=80')] bg-cover bg-center opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight">
            The Signature Collections
          </h1>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Hand-crafted floral arrangements designed for moments worth remembering.
            Every bouquet tells a story of beauty, elegance, and lasting love.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#collections"
              className="px-7 py-3 bg-[#E8365D] hover:bg-[#d42e52] text-white text-sm font-semibold rounded-lg transition shadow-lg shadow-[#E8365D]/20"
            >
              Shop All Collections
            </a>
            <Link
              to="/#our-story"
              className="px-7 py-3 border border-white/40 hover:border-white text-white text-sm font-semibold rounded-lg transition"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Collections */}
      <div id="collections">
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-8 h-8 border-2 border-stone-200 border-t-[#E8365D] rounded-full animate-spin" />
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-stone-400">No collections available yet.</p>
          </div>
        ) : (
          collections.map((collection, index) =>
            index % 2 === 0 ? (
              <CollectionSectionA key={collection.id} collection={collection} />
            ) : (
              <CollectionSectionB key={collection.id} collection={collection} />
            )
          )
        )}
      </div>

      {/* Bespoke Collection Services */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#E8365D]/10 rounded-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-8 sm:p-12 lg:p-16">
                <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-[#E8365D] mb-4">
                  Artisan's Reserve
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-800 mb-4">
                  Bespoke Collection Services
                </h2>
                <p className="text-stone-500 leading-relaxed mb-8 max-w-lg">
                  Work directly with our master florists to create a truly one-of-a-kind
                  arrangement. From intimate gatherings to grand celebrations, we bring your
                  floral vision to life with meticulous attention to detail and artistry.
                </p>

                <ul className="space-y-3 mb-10">
                  {[
                    'Personal or business arrangements',
                    'Celebrations, staging or home décor',
                    'Artful gifting with delivery services',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#E8365D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-stone-600">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact_us"
                  className="inline-block px-7 py-3 bg-[#E8365D] hover:bg-[#d42e52] text-white text-sm font-semibold rounded-lg transition shadow-lg shadow-[#E8365D]/20"
                >
                  Inquire Today
                </Link>
              </div>

              <div className="hidden lg:flex lg:w-2/5 items-center justify-center p-12">
                <div className="w-full aspect-square rounded-2xl bg-[#E8365D]/5 flex items-center justify-center">
                  <svg className="w-24 h-24 text-[#E8365D]/30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default CollectionsPage
