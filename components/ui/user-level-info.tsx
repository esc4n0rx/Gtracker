// components/ui/user-level-info.tsx
"use client"

import { useState, useEffect } from 'react'
import { UserLevel } from '@/lib/api'
import { useUserLevelDisplay } from '@/hooks/use-levels'
import { LevelBadge } from './level-badge'
import { XPProgressBar } from './xp-progress-bar'
import { TrendingUp, Loader2 } from 'lucide-react'

interface UserLevelInfoProps {
  userId: string
  showProgress?: boolean
  showXP?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserLevelInfo({ 
  userId, 
  showProgress = true, 
  showXP = true, 
  size = 'md',
  className = '' 
}: UserLevelInfoProps) {
  const { userLevel, isLoading, error } = useUserLevelDisplay(userId)

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-retro-blue" />
        <span className="text-sm text-slate-400">Carregando nível...</span>
      </div>
    )
  }

  if (error || !userLevel) {
    return (
      <div className={`text-sm text-slate-500 ${className}`}>
        Nível não disponível
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <LevelBadge level={userLevel.level_details} size={size} showName />
        {showXP && (
          <span className="text-sm text-slate-400">
            {userLevel.total_xp.toLocaleString('pt-BR')} XP
          </span>
        )}
      </div>
      
      {showProgress && (
        <XPProgressBar 
          progress={userLevel.progress} 
          totalXP={userLevel.total_xp}
          size={size}
          showDetails={size !== 'sm'}
        />
      )}
    </div>
  )
}