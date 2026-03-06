import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetch(`/api/v1/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found')
        return res.json()
      })
      .then(setProduct)
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 flex justify-center">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-[#D4A5A5] rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAF9F7]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-stone-600 mb-4">{error || 'Product not found'}</p>
          <Link to="/" className="text-[#D4A5A5] font-medium hover:underline">
            ← Back to home
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

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-stone-800">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900 mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="aspect-square max-h-[600px] bg-white rounded-2xl overflow-hidden border border-stone-100">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
                </svg>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-stone-500 mb-1">{product.collection?.name}</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-800 mb-2">
              {product.name}
            </h1>
            {product.collection_type && (
              <p className="text-stone-600 mb-4">{product.collection_type}</p>
            )}
            <p className="text-2xl text-[#D4A5A5] font-semibold mb-6">{displayPrice}</p>
            {product.description && (
              <p className="text-stone-600 leading-relaxed mb-8">{product.description}</p>
            )}
            <button
              type="button"
              className="px-6 py-3 bg-[#D4A5A5] text-white font-medium rounded-lg hover:bg-[#B88A8A] transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProductPage
