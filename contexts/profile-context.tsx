// contexts/profile-context.tsx
"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { useProfileCustomization, ProfileCustomization } from '@/hooks/use-profile-customization'

interface ProfileContextType {
  profile: ProfileCustomization | null
  isLoading: boolean
  error: string | null
  refreshProfile: () => void
  updateLocalProfile: (updates: Partial<ProfileCustomization>) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

interface ProfileProviderProps {
  children: ReactNode
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const { user, isAuthenticated } = useAuth()
  const { profile, isLoading, error, fetchProfile } = useProfileCustomization()

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile()
    }
  }, [isAuthenticated, user, fetchProfile])

  const updateLocalProfile = (updates: Partial<ProfileCustomization>) => {
    // Atualizar localmente sem fazer nova requisição
    // Útil para atualizações imediatas na UI
  }

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        error,
        refreshProfile: fetchProfile,
        updateLocalProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useCurrentUserProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useCurrentUserProfile deve ser usado dentro de um ProfileProvider')
  }
  return context
}