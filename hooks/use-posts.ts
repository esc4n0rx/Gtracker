// hooks/use-posts.ts
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
      // Limpar e formatar os dados antes de enviar
      const cleanedData = {
        title: postData.title.trim(),
        content: postData.content?.trim() || undefined,
        forum_id: postData.forum_id,
        post_type: postData.post_type,
        template_data: postData.template_data && Object.keys(postData.template_data).length > 0 
          ? postData.template_data 
          : undefined
      }

      console.log('Dados enviados para API:', cleanedData)
      
      const post = await postsApi.create(cleanedData)
      return post
    } catch (err: any) {
      console.error('Erro detalhado ao criar post:', err)
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