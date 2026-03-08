import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import JsonLdProduct from '../components/JsonLdProduct'

const ACCENT = '#E8365D'

const StarIcon = ({ filled }) => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill={filled ? ACCENT : '#e5e7eb'}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.065 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.284-3.957z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill={ACCENT}>
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: 'Artisan Sourced',
    desc: 'Premium silk petals hand-selected for authenticity.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0l8.955 8.955M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    title: 'Memory of Home',
    desc: 'Scented to evoke warmth and nostalgia.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18" />
      </svg>
    ),
    title: 'Gifting Ready',
    desc: 'Beautifully boxed and ready to surprise.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Safe for Everyone',
    desc: 'Hypoallergenic, pet-friendly, no pollen.',
  },
]

const whyBullets = [
  {
    icon: (
      <svg className="w-5 h-5 text-[#E8365D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'Premium Materials',
    desc: 'Each petal is crafted from multi-layered silk that mimics the translucency of real flowers.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#E8365D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.72.607 5.18 1.64" />
      </svg>
    ),
    title: 'Long-lasting Fragrances',
    desc: 'Our proprietary scenting process locks in aroma for months, not days.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#E8365D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    title: 'Handmade with Love',
    desc: 'Every bouquet is assembled by hand in our studio with meticulous attention to detail.',
  },
]

const staticReviews = [
  { stars: 5, text: '"These flowers are absolutely stunning. My wife thought they were real! The scent is divine."', name: 'Jessica M.' },
  { stars: 5, text: '"I ordered for our anniversary and she was over the moon. They still look perfect months later."', name: 'Robert K.' },
  { stars: 5, text: '"Best gift I\'ve ever given. The packaging was beautiful and the quality is unmatched."', name: 'Sarah L.' },
]

const ImagePlaceholder = ({ className = 'w-12 h-12' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const FlowerPlaceholder = ({ className = 'w-32 h-32' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
  </svg>
)

function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(null)
    setSelectedImageIndex(0)
    setQuantity(1)
    fetch(`/api/v1/products/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found')
        return res.json()
      })
      .then(setProduct)
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    fetch('/api/v1/products')
      .then((res) => res.json())
      .then(setAllProducts)
      .catch(() => setAllProducts([]))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 flex justify-center">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-[#E8365D] rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-stone-600 mb-4">{error || 'Product not found'}</p>
          <Link to="/products" className="text-[#E8365D] font-medium hover:underline">
            &larr; Back to shop
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const displayPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price)

  const productPath = `/product/${product.slug || product.id}`

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

  const galleryImages = [
    product.image_url,
    ...(product.gallery_image_urls || []).slice(0, 2),
  ]
  while (galleryImages.length < 4) galleryImages.push(null)

  const activeImageUrl = galleryImages[selectedImageIndex] || product.image_url

  return (
    <div className="min-h-screen bg-white text-stone-800">
      <SEO
        title={product.meta_title || product.name}
        description={
          product.meta_description ||
          product.description ||
          `${product.name} – ${product.collection?.name || 'Silk bouquet'}. ${displayPrice}.`
        }
        canonicalPath={productPath}
        image={product.image_url || undefined}
        type="product"
      />
      <JsonLdProduct product={product} />
      <Header />

      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="text-sm text-stone-400 flex items-center gap-1.5">
            <Link to="/" className="hover:text-stone-600 transition">Home</Link>
            <span>&gt;</span>
            <Link to="/products" className="hover:text-stone-600 transition">Collections</Link>
            {product.collection?.name && (
              <>
                <span>&gt;</span>
                <span className="text-stone-600">{product.collection.name}</span>
              </>
            )}
          </nav>
        </div>

        {/* Product Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Image Gallery */}
            <div>
              <div className="aspect-square bg-[#FAF9F7] rounded-2xl overflow-hidden border border-stone-100">
                {activeImageUrl ? (
                  <img
                    src={activeImageUrl}
                    alt={`${product.name} – ${product.collection?.name || 'silk bouquet'} from Petals for Her`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <FlowerPlaceholder />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-3 mt-4">
                {galleryImages.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                      i === selectedImageIndex
                        ? 'border-[#E8365D]'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {url ? (
                      <img
                        src={url}
                        alt={`${product.name} view ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#FAF9F7] flex items-center justify-center text-stone-300">
                        <ImagePlaceholder className="w-6 h-6" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="lg:pt-2">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} filled />
                ))}
                <span className="ml-2 text-sm text-stone-400">(128 reviews)</span>
              </div>

              {/* Name */}
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-2xl font-bold mb-5" style={{ color: ACCENT }}>
                {displayPrice}
              </p>

              {/* Description */}
              {product.description && (
                <p className="text-stone-600 leading-relaxed mb-6">{product.description}</p>
              )}

              {/* Info badges */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8">
                <span className="flex items-center gap-1.5 text-sm text-stone-600">
                  <CheckIcon /> Handcrafted Silk
                </span>
                <span className="flex items-center gap-1.5 text-sm text-stone-600">
                  <CheckIcon /> Scented
                </span>
                <span className="flex items-center gap-1.5 text-sm text-stone-600">
                  <CheckIcon /> Gift Ready
                </span>
              </div>

              {/* Quantity selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-stone-700 mb-2 block">Quantity</label>
                <div
                  className="inline-flex items-center border-2 rounded-lg overflow-hidden"
                  style={{ borderColor: ACCENT }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-stone-600 hover:bg-stone-50 transition font-medium"
                    aria-label="Decrease quantity"
                  >
                    &minus;
                  </button>
                  <span className="px-5 py-2.5 text-stone-800 font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2.5 text-stone-600 hover:bg-stone-50 transition font-medium"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                className="w-full py-3.5 rounded-lg text-white font-semibold text-lg transition hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ backgroundColor: ACCENT }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </button>

              <p className="text-center text-sm text-stone-400 mt-3">
                Free shipping on orders over $75
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-[#FAF9F7] py-14 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f) => (
                <div key={f.title} className="text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: '#E8365D1A', color: ACCENT }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-serif font-semibold text-stone-800 mb-1">{f.title}</h3>
                  <p className="text-sm text-stone-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why They Last Forever */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 mb-8">
                Why They Last Forever
              </h2>
              <div className="space-y-6">
                {whyBullets.map((b) => (
                  <div key={b.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E8365D1A] flex items-center justify-center shrink-0 mt-0.5">
                      {b.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800 mb-1">{b.title}</h3>
                      <p className="text-sm text-stone-500 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-[4/3] bg-[#FAF9F7] rounded-2xl overflow-hidden border border-stone-100 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={`${product.name} close-up`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-stone-300">
                  <svg className="w-20 h-20 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <p className="text-sm">Close-up image</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="bg-[#FAF9F7] py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
                Loved by over 10,000 gifters
              </h2>
              <button className="text-sm font-medium hover:underline" style={{ color: ACCENT }}>
                View all reviews
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {staticReviews.map((r) => (
                <div key={r.name} className="bg-white rounded-xl p-6 border border-stone-100">
                  <div className="flex gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon key={s} filled={s <= r.stars} />
                    ))}
                  </div>
                  <p className="text-stone-600 leading-relaxed mb-4 text-sm">{r.text}</p>
                  <p className="font-semibold text-stone-800 text-sm">{r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* You May Also Adore */}
        {relatedProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 mb-10 text-center">
              You May Also Adore
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug || p.id}`}
                  className="group"
                >
                  <div className="aspect-square bg-[#FAF9F7] rounded-xl overflow-hidden border border-stone-100 mb-3">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <FlowerPlaceholder className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-stone-800 group-hover:text-stone-600 transition text-sm">
                    {p.name}
                  </h3>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: ACCENT }}>
                    {formatPrice(p.price)}
                  </p>
                  {p.scent_profile && (
                    <p className="text-xs text-stone-400 mt-0.5">{p.scent_profile}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ProductPage
