// hooks/use-profile-customization.ts
"use client"

import { useState, useCallback } from 'react'
import { apiRequest } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'

export interface ProfileCustomization {
  user_id: string
  display_name: string
  username: string
  total_posts: number
  total_comments: number
  total_likes: number
  warnings: number
  avatar_url?: string
  cover_image_url?: string
  theme_color: string
  custom_title?: string
  signature?: string
  social_links: {
    twitter?: string
    instagram?: string
    facebook?: string
    linkedin?: string
    github?: string
    youtube?: string
    discord?: string
  }
  birthday?: string
  timezone: string
  status: 'online' | 'away' | 'busy' | 'invisible' | 'offline'
  bio?: string
  location?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface UpdateProfileData {
  theme_color?: string
  custom_title?: string
  signature?: string
  social_links?: Record<string, string>
  birthday?: string
  timezone?: string
  status?: string
  bio?: string
  location?: string
  website?: string
}

export function useProfileCustomization() {
  const [profile, setProfile] = useState<ProfileCustomization | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchProfile = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await apiRequest<ProfileCustomization>('/customization/stats')
      setProfile(response.data!)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar perfil')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiRequest<ProfileCustomization>('/customization/profile', {
        method: 'PATCH',
        body: JSON.stringify(data)
      })
      
      setProfile(response.data!)
      return response.data!
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadAvatar = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await apiRequest<{ avatar_url: string }>('/customization/avatar', {
        method: 'POST',
        body: formData,
        headers: {} // Remove Content-Type para FormData
      })

      if (profile) {
        setProfile(prev => ({
          ...prev!,
          avatar_url: response.data!.avatar_url
        }))
      }

      return response.data!.avatar_url
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload do avatar')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [profile])

  const uploadCover = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('cover', file)

      const response = await apiRequest<{ cover_image_url: string }>('/customization/cover', {
        method: 'POST',
        body: formData,
        headers: {} // Remove Content-Type para FormData
      })

      if (profile) {
        setProfile(prev => ({
          ...prev!,
          cover_image_url: response.data!.cover_image_url
        }))
      }

      return response.data!.cover_image_url
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload da capa')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [profile])

  const removeAvatar = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await apiRequest('/customization/avatar', {
        method: 'DELETE'
      })

      if (profile) {
        setProfile(prev => ({
          ...prev!,
          avatar_url: undefined
        }))
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao remover avatar')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [profile])

  const removeCover = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await apiRequest('/customization/cover', {
        method: 'DELETE'
      })

      if (profile) {
        setProfile(prev => ({
          ...prev!,
          cover_image_url: undefined
        }))
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao remover capa')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [profile])

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    uploadCover,
    removeAvatar,
    removeCover
  }
}