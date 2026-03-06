import { useState, useEffect, useRef } from 'react'
import { useSearch } from '../../hooks/useSearch'
import SearchResults from './SearchResults'

const defaultOnSelect = (item) => {
  if (item.type === 'collection') {
    window.location.hash = 'collections'
  } else {
    window.location.hash = `product-${item.id}`
    const el = document.getElementById(`product-${item.id}`)
    el?.scrollIntoView({ behavior: 'smooth' })
  }
}

function SearchBar({
  placeholder = 'Search anything here...',
  onSelect = defaultOnSelect,
  showCollections = true,
  showProducts = true,
  className = '',
  resultsClassName = '',
  minQueryLength = 2,
}) {
  const {
    query,
    setQuery,
    results,
    isLoading,
    hasQuery,
  } = useSearch({ minQueryLength })

  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const collectionsToShow = showCollections ? results.collections : []
  const productsToShow = showProducts ? results.products : []
  const flatResults = [
    ...collectionsToShow.map((c) => ({ ...c, type: 'collection' })),
    ...productsToShow.map((p) => ({ ...p, type: 'product' })),
  ]
  const hasResults = flatResults.length > 0

  useEffect(() => {
    if (hasQuery) setIsOpen(true)
    else setIsOpen(false)
  }, [hasQuery])

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (item) => {
    onSelect(item)
    setQuery('')
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e) => {
    if (!isOpen || !hasResults) {
      if (e.key === 'Escape') {
        setQuery('')
        setIsOpen(false)
        inputRef.current?.blur()
      }
      return
    }

    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((i) => (i < flatResults.length - 1 ? i + 1 : 0))
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((i) => (i > 0 ? i - 1 : flatResults.length - 1))
      return
    }

    if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault()
      handleSelect(flatResults[highlightedIndex])
    }
  }

  return (
    <div ref={containerRef} className={`relative flex-1 max-w-xs lg:max-w-sm ${className}`}>
      <div className="relative flex items-center bg-stone-50 rounded-full px-4 py-2 w-full">
        <svg
          className="w-4 h-4 text-stone-400 shrink-0 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= minQueryLength && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-transparent w-full text-sm text-stone-800 placeholder-stone-400 outline-none"
          aria-label="Search products and collections"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen && hasResults}
        />
        {isLoading && (
          <div className="absolute right-3 w-4 h-4 border-2 border-stone-300 border-t-[#D4A5A5] rounded-full animate-spin" />
        )}
      </div>

      {isOpen && query.length >= minQueryLength && (
        <div
          id="search-results"
          role="listbox"
          className={`absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden z-50 max-h-80 overflow-y-auto ${resultsClassName}`}
        >
          <SearchResults
            products={results.products}
            collections={results.collections}
            query={query}
            isLoading={isLoading}
            highlightedIndex={highlightedIndex}
            onHighlight={setHighlightedIndex}
            onSelect={handleSelect}
            showCollections={showCollections}
            showProducts={showProducts}
            emptyMessage={`No results for "{query}"`}
          />
        </div>
      )}
    </div>
  )
}

export default SearchBar
export { default as SearchResults } from './SearchResults'
export { default as SearchResultsCollections } from './SearchResultsCollections'
export { default as SearchResultsProducts } from './SearchResultsProducts'
