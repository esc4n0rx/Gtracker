// components/ui/user-avatar.tsx
"use client"

import { useUserProfile } from '@/hooks/use-user-profile'
import { useAuth } from '@/contexts/auth-context'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  userId?: string
  nickname?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showStatus?: boolean
  className?: string
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const statusSizeClasses = {
  xs: 'w-2 h-2',
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4'
}

export function UserAvatar({ 
  userId, 
  nickname, 
  size = 'md', 
  showStatus = false,
  className 
}: UserAvatarProps) {
  const { user: currentUser } = useAuth()
  const { profile } = useUserProfile(userId)
  
  // Se é o usuário atual, usar os dados do contexto
  const isCurrentUser = !userId || userId === currentUser?.id
  const displayName = nickname || currentUser?.nickname || 'Usuário'
  
  // Para o usuário atual, podemos usar um hook diferente ou passar os dados diretamente
  const themeColor = isCurrentUser ? '#4A5568' : (profile?.theme_color || '#4A5568')
  const avatarUrl = isCurrentUser ? null : profile?.avatar_url // Vamos implementar isso no contexto depois
  const status = isCurrentUser ? 'online' : (profile?.status || 'offline')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      case 'invisible': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden border-2 flex items-center justify-center',
          sizeClasses[size]
        )}
        style={{ borderColor: themeColor }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`Avatar de ${displayName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: themeColor }}
          >
            <User className={cn(
              size === 'xs' ? 'w-3 h-3' :
              size === 'sm' ? 'w-4 h-4' :
              size === 'md' ? 'w-5 h-5' :
              size === 'lg' ? 'w-6 h-6' :
              'w-8 h-8'
            )} />
          </div>
        )}
      </div>
      
      {showStatus && (
        <div 
          className={cn(
            'absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-slate-800',
            statusSizeClasses[size],
            getStatusColor(status)
          )}
        />
      )}
    </div>
  )
}