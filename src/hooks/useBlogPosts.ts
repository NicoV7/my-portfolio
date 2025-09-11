'use client'

import { useState, useEffect, useCallback } from 'react'
import { BlogPost } from '../types/blog'
import { fetchBlogPosts, searchBlogPosts } from '../data/blogPosts'

interface UseBlogPostsReturn {
  posts: BlogPost[]
  loading: boolean
  error: string | null
  searchTerm: string
  setSearchTerm: (term: string) => void
  searchResults: BlogPost[]
  searching: boolean
}

export function useBlogPosts(): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<BlogPost[]>([])
  const [searching, setSearching] = useState(false)

  const loadAllPosts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const allPosts = await fetchBlogPosts()
      setPosts(allPosts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }, [])

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    setError(null)

    try {
      const results = await searchBlogPosts(query)
      setSearchResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setSearching(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    loadAllPosts()
  }, [loadAllPosts])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, performSearch])

  return {
    posts,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    searchResults,
    searching
  }
}