import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function ProductCard({ product }) {
  const displayPrice =
    product?.price != null
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)
      : '—'

  return (
    <Link
      to={`/product/${product?.id}`}
      className="group block bg-white rounded-xl overflow-hidden border border-stone-100 hover:shadow-lg transition"
    >
      <div className="aspect-square bg-stone-50 flex items-center justify-center overflow-hidden">
        {product?.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="text-stone-300">
            <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-stone-500 mb-1">{product?.collection?.name}</p>
        <h3 className="font-sans font-semibold text-stone-800 group-hover:text-[#D4A5A5] transition">
          {product?.name || 'Product'}
        </h3>
        <p className="text-sm text-stone-500 mt-1">
          {product?.collection_type || product?.description}
        </p>
        <p className="text-[#D4A5A5] font-semibold mt-2">{displayPrice}</p>
      </div>
    </Link>
  )
}

function ProductsPage() {
  const [searchParams] = useSearchParams()
  const collectionId = searchParams.get('collection')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = collectionId
      ? `/api/v1/products?collection_id=${collectionId}`
      : '/api/v1/products'
    fetch(url)
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [collectionId])

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-stone-800">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-800 mb-2">
          All Arrangements
        </h1>
        <p className="text-stone-600 mb-10">
          Explore our full collection of silk bouquets with bespoke fragrances.
        </p>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-[#D4A5A5] rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-stone-600">
            <p>No products available yet.</p>
            <Link to="/" className="text-[#D4A5A5] font-medium hover:underline mt-2 inline-block">
              ← Back to home
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default ProductsPage
