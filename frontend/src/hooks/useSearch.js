import { useState, useEffect, useCallback } from 'react'

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

export function useSearch(options = {}) {
  const { minQueryLength = 2, debounceMs = 300 } = options
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ products: [], collections: [] })
  const [isLoading, setIsLoading] = useState(false)

  const debouncedQuery = useDebounce(query.trim(), debounceMs)

  const fetchResults = useCallback(async (q) => {
    if (q.length < minQueryLength) {
      setResults({ products: [], collections: [] })
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/v1/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data)
    } catch {
      setResults({ products: [], collections: [] })
    } finally {
      setIsLoading(false)
    }
  }, [minQueryLength])

  useEffect(() => {
    if (debouncedQuery.length >= minQueryLength) {
      fetchResults(debouncedQuery)
    } else {
      setResults({ products: [], collections: [] })
    }
  }, [debouncedQuery, minQueryLength, fetchResults])

  return {
    query,
    setQuery,
    results,
    isLoading,
    debouncedQuery,
    hasQuery: debouncedQuery.length >= minQueryLength,
  }
}
