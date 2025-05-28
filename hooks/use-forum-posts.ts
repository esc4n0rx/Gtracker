// hooks/use-forum-posts.ts
"use client"

import { useState, useEffect } from 'react'
import { postsApi, Post, ApiError } from '@/lib/api'

interface PostsResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function useForumPosts(forumId: string) {
  const [data, setData] = useState<PostsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async (page = 1, limit = 20) => {
    if (!forumId) return

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await postsApi.getByForum(forumId, page, limit)
      setData(response)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao carregar posts')
      }
      console.error('Erro ao carregar posts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [forumId])

  return {
    posts: data?.posts || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch: () => fetchPosts(),
    loadPage: (page: number) => fetchPosts(page),
  }
}