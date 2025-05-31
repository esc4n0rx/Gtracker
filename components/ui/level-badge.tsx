// components/ui/level-badge.tsx
"use client"

import { Level } from '@/lib/api'
import { Star, Crown, Zap } from 'lucide-react'

interface LevelBadgeProps {
  level: Level
  showNumber?: boolean
  showName?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export function LevelBadge({ 
  level, 
  showNumber = true, 
  showName = false, 
  size = 'sm',
  className = '' 
}: LevelBadgeProps) {
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2'
  }

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const getLevelIcon = () => {
    if (level.is_legendary) {
      return <Crown className={iconSizes[size]} />
    }
    if (level.level_number >= 7) {
      return <Star className={iconSizes[size]} />
    }
    return <Zap className={iconSizes[size]} />
  }

  return (
    <div
      className={`
        inline-flex items-center rounded-full font-medium text-white
        ${sizeClasses[size]}
        ${level.is_legendary ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/25' : ''}
        ${className}
      `}
      style={{ 
        backgroundColor: level.is_legendary ? undefined : level.color,
        boxShadow: level.is_legendary ? undefined : `0 0 10px ${level.color}25`
      }}
      title={`Nível ${level.level_number} - ${level.name}`}
    >
      <span className="text-sm">{level.emoji}</span>
      {getLevelIcon()}
      {showNumber && (
        <span className="font-bold">
          {level.level_number}
        </span>
      )}
      {showName && (
        <span className="truncate max-w-32">
          {level.name}
        </span>
      )}
    </div>
  )
}