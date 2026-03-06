function SearchResultsCollections({ collections, highlightedIndex, startIndex, onSelect, onHighlight }) {
  if (!collections?.length) return null

  return (
    <>
      <li className="px-3 py-1.5 text-xs font-medium text-stone-400 uppercase tracking-wider">
        Collections
      </li>
      {collections.map((c, i) => {
        const idx = startIndex + i
        return (
          <li key={`c-${c.id}`}>
            <button
              type="button"
              role="option"
              aria-selected={highlightedIndex === idx}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-stone-50 transition ${
                highlightedIndex === idx ? 'bg-stone-50' : ''
              }`}
              onClick={() => onSelect({ ...c, type: 'collection' })}
              onMouseEnter={() => onHighlight(idx)}
            >
              <span className="text-stone-600">{c.name}</span>
              <span className="text-xs text-stone-400">Collection</span>
            </button>
          </li>
        )
      })}
    </>
  )
}

export default SearchResultsCollections
