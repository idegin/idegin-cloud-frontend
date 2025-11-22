"use client"

import { useState, useEffect, useCallback } from "react"

export function useDebouncedSearch(
  initialValue: string = "",
  delay: number = 300,
  onSearch?: (searchQuery: string) => void
) {
  const [searchQuery, setSearchQuery] = useState(initialValue)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialValue)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      if (onSearch) {
        onSearch(searchQuery)
      }
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery, delay, onSearch])

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])

  const resetSearch = useCallback(() => {
    setSearchQuery("")
    setDebouncedSearchQuery("")
    if (onSearch) {
      onSearch("")
    }
  }, [onSearch])

  return {
    searchQuery,
    debouncedSearchQuery,
    handleSearchChange,
    resetSearch,
  }
}