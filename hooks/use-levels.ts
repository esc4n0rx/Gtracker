"use client"

import { useState, useCallback, useEffect } from 'react'
import { levelsApi, Level, UserLevel, RankingUser, ApiError } from '@/lib/api'

export function useLevels() {
  const [myLevel, setMyLevel] = useState<UserLevel | null>(null)
  const [allLevels, setAllLevels] = useState<Level[]>([])
  const [ranking, setRanking] = useState<RankingUser[]>([])
  const [rankingPagination, setRankingPagination] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyLevel = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await levelsApi.getMyLevel()
      setMyLevel(data)
      return data
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao carregar nível do usuário')
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchUserLevel = useCallback(async (userId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await levelsApi.getUserLevel(userId)
      return data
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao carregar nível do usuário')
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchAllLevels = useCallback(async () => {
    try {
      setError(null)
      const data = await levelsApi.getAllLevels()
      setAllLevels(data)
      return data
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao carregar níveis')
      }
      throw err
    }
  }, [])

  const fetchRanking = useCallback(async (page = 1, limit = 10) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await levelsApi.getRanking(page, limit)
      setRanking(data.ranking)
      setRankingPagination(data.pagination)
      return data
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao carregar ranking')
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const awardXP = useCallback(async (userId: string, xpAmount: number, reason: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await levelsApi.awardXP({ user_id: userId, xp_amount: xpAmount, reason })
      
      // Se for o próprio usuário, atualizar o nível local
      if (myLevel && userId === myLevel.level_details.id.toString()) {
        await fetchMyLevel()
      }
      
      return result
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao conceder XP')
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [myLevel, fetchMyLevel])

  return {
    myLevel,
    allLevels,
    ranking,
    rankingPagination,
    isLoading,
    error,
    fetchMyLevel,
    fetchUserLevel,
    fetchAllLevels,
    fetchRanking,
    awardXP,
    refreshMyLevel: fetchMyLevel,
  }
}

// Hook específico para exibir informações de nível em componentes
export function useUserLevelDisplay(userId?: string) {
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLevel = useCallback(async () => {
    if (!userId) return

    try {
      setIsLoading(true)
      setError(null)
      const data = await levelsApi.getUserLevel(userId)
      setUserLevel(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao carregar nível')
      }
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchLevel()
    }
  }, [userId, fetchLevel])

  return {
    userLevel,
    isLoading,
    error,
    refetch: fetchLevel,
  }
}