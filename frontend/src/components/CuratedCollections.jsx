import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  const productSlug = product?.slug ?? product?.id
  const displayPrice = product?.price != null
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)
    : '$120.00'

  return (
    <Link
      to={`/product/${productSlug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-stone-100 hover:shadow-lg transition"
    >
      <div className="aspect-square bg-stone-50 flex items-center justify-center overflow-hidden">
        {product?.image_url ? (
          <img
            src={product.image_url}
            alt={product?.name ? `${product.name} – ${product.collection?.name || 'silk bouquet'} from Petals for Her` : 'Product'}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="text-stone-300">
            <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4-1.86 0-3.43 1.27-3.87 3.02-.55-.12-1.11-.02-1.6.27-1.22.68-1.65 2.23-.98 3.45.36.64 1 1.03 1.72 1.03.44 0 .87-.14 1.23-.4-.01.1-.01.19-.01.3z"/>
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-sans font-semibold text-stone-800 group-hover:text-[#D4A5A5] transition">
          {product?.name || 'Blush Romance'}
        </h3>
        <p className="text-sm text-stone-500 mt-1">
          {product?.collection_type || product?.description || '2x Stem Collection Arrangement'}
        </p>
        <p className="text-[#D4A5A5] font-semibold mt-2">{displayPrice}</p>
      </div>
    </Link>
  )
}

function CuratedCollections({ products }) {
  // Fallback products when API is not available
  const displayProducts = products?.length > 0 ? products : [
    { id: 1, name: 'Blush Romance', collection_type: '2x Stem Collection Arrangement', price: 120 },
    { id: 2, name: 'Sage Garden', collection_type: 'White Peony & Eucalyptus Collection', price: 120 },
    { id: 3, name: 'Green Elegance', collection_type: 'Minimalist Ivory Orchid Lei', price: 120 },
  ]

  return (
    <section id="collections" className="py-16 lg:py-24 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-800">
            Curated Collections
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900 transition"
          >
            View All Arrangements
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CuratedCollections
