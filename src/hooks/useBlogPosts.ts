'use client'

import { useState, useEffect, useCallback } from 'react'
import { BlogPost } from '../types/blog'
import { fetchBlogPosts, searchBlogPosts } from '../data/blogPosts'

interface UseBlogPostsReturn {
  posts: BlogPost[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  searchResults: BlogPost[]
  searching: boolean
}

const POSTS_PER_PAGE = 6

export function useBlogPosts(): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<BlogPost[]>([])
  const [searching, setSearching] = useState(false)

  const loadPosts = useCallback(async (currentOffset: number, isInitial = false) => {
    if (loading) return
    
    setLoading(true)
    setError(null)

    try {
      const newPosts = await fetchBlogPosts(currentOffset, POSTS_PER_PAGE)
      
      if (isInitial) {
        setPosts(newPosts)
      } else {
        setPosts(prev => [...prev, ...newPosts])
      }
      
      setHasMore(newPosts.length === POSTS_PER_PAGE)
      setOffset(currentOffset + POSTS_PER_PAGE)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }, [loading])

  const loadMore = useCallback(() => {
    if (hasMore && !loading && !searchTerm) {
      loadPosts(offset)
    }
  }, [hasMore, loading, searchTerm, offset, loadPosts])

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
    loadPosts(0, true)
  }, [loadPosts])

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
    hasMore,
    loadMore,
    searchTerm,
    setSearchTerm,
    searchResults,
    searching
  }
}