import { Link } from 'react-router-dom'

export default function TopProductsList({ products }) {
  if (!products?.length) {
    return (
      <div className="py-8 text-center text-stone-400 text-sm">
        No product sales for this period
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-stone-50 transition-colors"
        >
          <div className="w-14 h-14 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                No image
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-stone-800 truncate">{product.name}</p>
            <p className="text-sm text-stone-500 truncate">{product.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-semibold text-[#D4A5A5]">${product.total_sales.toLocaleString()}</p>
            <p className="text-xs text-stone-500">{product.sale_count} sales</p>
          </div>
        </div>
      ))}
      <Link
        to="/admin/products"
        className="block w-full py-3 text-center text-[#D4A5A5] hover:text-[#B88A8A] font-medium text-sm rounded-lg border border-[#D4A5A5]/30 hover:bg-[#D4A5A5]/5 transition-colors"
      >
        View All Products
      </Link>
    </div>
  )
}
