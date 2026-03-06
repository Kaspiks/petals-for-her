import SearchResultsCollections from './SearchResultsCollections'
import SearchResultsProducts from './SearchResultsProducts'

function SearchResults({
  products = [],
  collections = [],
  query,
  isLoading,
  highlightedIndex,
  onHighlight,
  onSelect,
  showCollections = true,
  showProducts = true,
  emptyMessage = 'No results found',
}) {
  const collectionsToShow = showCollections ? collections : []
  const productsToShow = showProducts ? products : []
  const totalCount = collectionsToShow.length + productsToShow.length

  if (totalCount === 0 && !isLoading) {
    return (
      <div className="px-4 py-6 text-center text-stone-500 text-sm">
        {emptyMessage.replace('{query}', query || '')}
      </div>
    )
  }

  let productStartIndex = collectionsToShow.length

  return (
    <ul className="py-2">
      <SearchResultsCollections
        collections={collectionsToShow}
        highlightedIndex={highlightedIndex}
        startIndex={0}
        onSelect={onSelect}
        onHighlight={onHighlight}
      />
      <SearchResultsProducts
        products={productsToShow}
        highlightedIndex={highlightedIndex}
        startIndex={productStartIndex}
        onSelect={onSelect}
        onHighlight={onHighlight}
      />
    </ul>
  )
}

export default SearchResults
