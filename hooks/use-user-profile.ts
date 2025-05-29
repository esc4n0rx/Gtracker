// hooks/use-user-profile.ts
"use client"

import { useState, useCallback, useEffect } from 'react'
import { apiRequest } from '@/lib/api'
import { ProfileCustomization } from './use-profile-customization'

// Cache simples para evitar requisições desnecessárias
const profileCache = new Map<string, { data: ProfileCustomization; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<ProfileCustomization | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserProfile = useCallback(async (targetUserId: string) => {
    // Verificar cache primeiro
    const cached = profileCache.get(targetUserId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setProfile(cached.data)
      return cached.data
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await apiRequest<ProfileCustomization>(`/profile/me`)
      const profileData = response.data!
      
      // Salvar no cache
      profileCache.set(targetUserId, {
        data: profileData,
        timestamp: Date.now()
      })
      
      setProfile(profileData)
      return profileData
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar perfil do usuário')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId)
    }
  }, [userId, fetchUserProfile])

  return {
    profile,
    isLoading,
    error,
    fetchUserProfile,
    // Função para limpar cache se necessário
    clearCache: () => profileCache.clear()
  }
}

// Hook para múltiplos perfis (útil para listas)
export function useMultipleUserProfiles(userIds: string[]) {
  const [profiles, setProfiles] = useState<Record<string, ProfileCustomization>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMultipleProfiles = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const profilesData: Record<string, ProfileCustomization> = {}
      
      // Buscar perfis em paralelo
      const promises = ids.map(async (id) => {
        // Verificar cache
        const cached = profileCache.get(id)
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          profilesData[id] = cached.data
          return
        }

        try {
          const response = await apiRequest<ProfileCustomization>(`/users/${id}/profile`)
          const profileData = response.data!
          
          profileCache.set(id, {
            data: profileData,
            timestamp: Date.now()
          })
          
          profilesData[id] = profileData
        } catch (err) {
          console.error(`Erro ao buscar perfil ${id}:`, err)
        }
      })

      await Promise.all(promises)
      setProfiles(profilesData)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar perfis')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userIds.length > 0) {
      fetchMultipleProfiles(userIds)
    }
  }, [userIds, fetchMultipleProfiles])

  return {
    profiles,
    isLoading,
    error,
    getProfile: (userId: string) => profiles[userId] || null
  }
}