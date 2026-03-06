import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import JsonLdOrganization from '../components/JsonLdOrganization'

const ACCENT = '#E8365D'
const NAVY = '#1a1a2e'

const StarIcon = ({ filled }) => (
  <svg className="w-4 h-4" viewBox="0 0 20 20" fill={filled ? ACCENT : '#e5e7eb'}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.065 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.284-3.957z" />
  </svg>
)

const artFeatures = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'Hand-Stitched Details',
    desc: 'Every petal is individually shaped and assembled by our artisans for lifelike beauty.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.72.607 5.18 1.64" />
      </svg>
    ),
    title: 'Scented to Bloom',
    desc: 'Proprietary fragrance infusion that lasts for months, bringing real flower aromas home.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    title: 'Zero Watering',
    desc: 'No sunlight, no water, no wilting — just timeless beauty that lasts a lifetime.',
  },
]

const occasions = [
  { title: 'Anniversary', emoji: '💕', bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700' },
  { title: 'Birthday', emoji: '🎂', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
  { title: 'Wedding', emoji: '💒', bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-700' },
  { title: "Valentine's Day", emoji: '❤️', bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700' },
]

const testimonials = [
  { stars: 5, text: '"I gifted these to my mom and she cried happy tears. They look SO real and smell incredible."', name: 'Emily R.', avatar: 'E' },
  { stars: 5, text: '"Best purchase I\'ve made this year. Our living room has never looked more elegant."', name: 'David W.', avatar: 'D' },
  { stars: 5, text: '"My wife\'s face when she opened the box was priceless. These flowers are a work of art."', name: 'Michael T.', avatar: 'M' },
]

function HomePage() {
  const [products, setProducts] = useState([])
  const [email, setEmail] = useState('')
  const [nlStatus, setNlStatus] = useState(null)

  useEffect(() => {
    fetch('/api/v1/products')
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]))
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

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

  return (
    <div className="min-h-screen bg-white text-stone-800">
      <SEO
        title=""
        description="Timeless beauty, captured in fragrance. Handcrafted silk bouquets with bespoke scents. Shop everlasting blooms and artisanal arrangements."
        canonicalPath="/"
      />
      <JsonLdOrganization />
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left copy */}
            <div>
              <span
                className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4"
                style={{ color: ACCENT }}
              >
                Forever Flowers
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-900 leading-tight mb-6">
                <span className="font-sans">Flowers that </span>
                <span className="font-serif italic">last forever</span>
              </h1>
              <p className="text-lg text-stone-500 leading-relaxed mb-8 max-w-lg">
                Handcrafted silk bouquets infused with bespoke scents.
                Hyper-realistic, everlasting blooms that bring joy without the wilting.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/products"
                  className="px-7 py-3.5 rounded-lg text-white font-semibold transition hover:opacity-90"
                  style={{ backgroundColor: ACCENT }}
                >
                  Shop Now
                </Link>
                <Link
                  to="/#process"
                  className="px-7 py-3.5 rounded-lg font-semibold border-2 transition hover:bg-stone-50"
                  style={{ borderColor: ACCENT, color: ACCENT }}
                >
                  Our Story
                </Link>
              </div>
              <div className="flex items-start gap-3 border-l-2 border-stone-200 pl-4">
                <p className="text-sm text-stone-400 italic leading-relaxed">
                  "These bouquets are indistinguishable from real flowers. Absolutely breathtaking."
                  <span className="block mt-1 not-italic font-medium text-stone-500">— Anna K., Verified Buyer</span>
                </p>
              </div>
            </div>

            {/* Right image */}
            <div className="relative">
              <div className="aspect-[4/5] bg-[#FAF9F7] rounded-2xl overflow-hidden border border-stone-100 flex items-center justify-center">
                <div className="text-center text-stone-300">
                  <svg className="w-24 h-24 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <p className="text-sm">Hero image</p>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl px-4 py-3 shadow-lg border border-stone-100 max-w-[220px]">
                <p className="text-xs font-semibold text-stone-700">
                  🔥 This bouquet has sold <span style={{ color: ACCENT }}>1.5k+</span> times
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Bouquets ── */}
      <section className="bg-[#FAF9F7] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
              Featured Bouquets
            </h2>
            <Link
              to="/products"
              className="text-sm font-medium hover:underline"
              style={{ color: ACCENT }}
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug || p.id}`}
                className="group"
              >
                <div className="aspect-square bg-white rounded-xl overflow-hidden border border-stone-100 mb-3">
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

      {/* ── The Art of Everlasting Blooms ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 mb-4">
            The Art of Everlasting Blooms
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto mb-14">
            Every bouquet from Petals for Her is a masterpiece — crafted, scented, and designed to last a lifetime.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {artFeatures.map((f) => (
              <div key={f.title} className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ backgroundColor: '#E8365D14', color: ACCENT }}
                >
                  {f.icon}
                </div>
                <h3 className="font-serif font-semibold text-stone-800 text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed max-w-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perfect for Every Occasion ── */}
      <section className="bg-[#FAF9F7] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 mb-4">
            Perfect for Every Occasion
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto mb-12">
            Whether it's a milestone moment or an everyday surprise, our bouquets speak the language of love.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {occasions.map((o) => (
              <Link
                key={o.title}
                to="/products"
                className={`${o.bg} ${o.border} border rounded-2xl p-6 lg:p-8 transition hover:shadow-md hover:-translate-y-0.5`}
              >
                <span className="text-4xl block mb-4">{o.emoji}</span>
                <h3 className={`font-serif font-semibold text-lg ${o.text}`}>{o.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 text-center mb-12">
            Loved by our Customers
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#FAF9F7] border border-stone-100 rounded-xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon key={s} filled={s <= t.stars} />
                  ))}
                </div>
                <p className="text-stone-600 leading-relaxed mb-5 text-sm">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {t.avatar}
                  </div>
                  <span className="font-semibold text-stone-800 text-sm">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social ── */}
      <section className="bg-[#FAF9F7] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span
            className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: ACCENT }}
          >
            Social Media
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 mb-10">
            Follow Our Floral Journey
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="aspect-square bg-white rounded-xl border border-stone-100 flex items-center justify-center text-stone-300"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section style={{ backgroundColor: NAVY }} className="py-16 lg:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-3">
            Join the Petals Circle
          </h2>
          <p className="text-stone-400 mb-8">
            Receive early access to seasonal collections and chic tips for your everlasting blooms.
          </p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-4 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E8365D]/50"
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
            <p className="mt-4 text-sm text-green-400">Thank you for subscribing!</p>
          )}
          {nlStatus && nlStatus !== 'success' && (
            <p className="mt-4 text-sm text-red-400">{nlStatus}</p>
          )}
          <p className="mt-5 text-xs text-stone-500">
            By subscribing, you agree to our{' '}
            <Link to="/privacy_policy" className="underline hover:text-stone-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage
