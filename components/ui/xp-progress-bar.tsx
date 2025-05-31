// components/ui/xp-progress-bar.tsx
"use client"

import { LevelProgress } from '@/lib/api'
import { TrendingUp } from 'lucide-react'

interface XPProgressBarProps {
  progress: LevelProgress
  totalXP: number
  showDetails?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function XPProgressBar({ 
  progress, 
  totalXP, 
  showDetails = true, 
  size = 'md',
  className = '' 
}: XPProgressBarProps) {
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-retro-blue" />
            <span className={`font-medium text-retro-text ${textSizes[size]}`}>
              Nível {progress.current_level}
            </span>
            <span className={`text-slate-400 ${textSizes[size]}`}>
              {progress.level_name}
            </span>
          </div>
          <div className={`text-slate-400 ${textSizes[size]}`}>
            {totalXP.toLocaleString('pt-BR')} XP
          </div>
        </div>
      )}
      
      <div className="space-y-1">
        <div className={`w-full bg-slate-700 rounded-full overflow-hidden ${heightClasses[size]}`}>
          <div
            className="bg-gradient-to-r from-retro-blue to-retro-purple transition-all duration-500 ease-out rounded-full"
            style={{ 
              width: `${Math.min(progress.percentage, 100)}%`,
              height: '100%'
            }}
          />
        </div>
        
        {showDetails && (
          <div className="flex justify-between">
            <span className={`text-slate-500 ${textSizes[size]}`}>
              {progress.percentage.toFixed(1)}% completo
            </span>
            <span className={`text-slate-500 ${textSizes[size]}`}>
              {progress.xp_to_next > 0 ? `${progress.xp_to_next} XP para o próximo nível` : 'Nível máximo'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}