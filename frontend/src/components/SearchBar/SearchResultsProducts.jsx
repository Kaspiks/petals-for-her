function SearchResultsProducts({ products, highlightedIndex, startIndex, onSelect, onHighlight }) {
  if (!products?.length) return null

  return (
    <>
      <li className="px-3 py-1.5 text-xs font-medium text-stone-400 uppercase tracking-wider mt-1">
        Products
      </li>
      {products.map((p, i) => {
        const idx = startIndex + i
        return (
          <li key={`p-${p.id}`}>
            <button
              type="button"
              role="option"
              aria-selected={highlightedIndex === idx}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-stone-50 transition ${
                highlightedIndex === idx ? 'bg-stone-50' : ''
              }`}
              onClick={() => onSelect({ ...p, type: 'product' })}
              onMouseEnter={() => onHighlight(idx)}
            >
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-stone-100 shrink-0 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-stone-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.6-1.86-1.46-2.27.24-.58.37-1.22.37-1.9 0-2.21-1.79-4-4-4z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-stone-800 font-medium block truncate">{p.name}</span>
                <span className="text-xs text-stone-500">{p.collection_name}</span>
              </div>
              <span className="text-[#D4A5A5] font-medium shrink-0">
                ${p.price.toFixed(2)}
              </span>
            </button>
          </li>
        )
      })}
    </>
  )
}

export default SearchResultsProducts
