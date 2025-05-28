// hooks/use-forum-stats.ts
"use client"

import { useState, useEffect } from 'react'
import { ApiError } from '@/lib/api'

interface ForumStats {
  total_topics: number
  total_posts: number
  total_users: number
  online_users: number
  newest_member: {
    id: string
    nickname: string
    created_at: string
  }
}

export function useForumStats() {
  const [stats, setStats] = useState<ForumStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Por enquanto, vamos usar dados mock
      // Quando a API tiver endpoint para estatísticas, substituir por:
      // const response = await apiRequest<ForumStats>('/stats')
      
      const mockStats: ForumStats = {
        total_topics: 2847,
        total_posts: 18392,
        total_users: 1234,
        online_users: 127,
        newest_member: {
          id: '1',
          nickname: 'NewUser2024',
          created_at: new Date().toISOString(),
        }
      }
      
      setStats(mockStats)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao carregar estatísticas')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  }
}