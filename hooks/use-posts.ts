// hooks/use-posts.ts (versão corrigida)
"use client"

import { useState } from 'react'
import { postsApi } from '@/lib/api'

interface CreatePostData {
  title: string
  content?: string
  forum_id: string
  post_type: string
  template_data?: Record<string, any>
}

interface Post {
  id: string
  title: string
  content?: string
  slug: string
  post_type: string
  template_data?: Record<string, any>
  author: {
    id: string
    nickname: string
  }
  forum: {
    id: string
    name: string
  }
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
}

export function usePosts() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPost = async (postData: CreatePostData): Promise<Post> => {
    setIsLoading(true)
    setError(null)

    try {
      // Usar a função da API que já está configurada
      const post = await postsApi.create(postData)
      return post
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar post'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createPost,
    isLoading,
    error,
  }
}