// components/ui/user-info.tsx
"use client"

import { useUserProfile } from '@/hooks/use-user-profile'
import { useAuth } from '@/contexts/auth-context'
import { UserAvatar } from './user-avatar'
import { formatRelativeTime } from '@/lib/forum-utils'
import { 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  Crown,
  MessageSquare,
  Heart,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserInfoProps {
  userId?: string
  author: {
    id: string
    nickname: string
  }
  showExtended?: boolean
  showSignature?: boolean
  showStats?: boolean
  compact?: boolean
  className?: string
}

export function UserInfo({ 
  userId,
  author, 
  showExtended = false,
  showSignature = false,
  showStats = false,
  compact = false,
  className 
}: UserInfoProps) {
  const { user: currentUser } = useAuth()
  const { profile, isLoading } = useUserProfile(userId || author.id)
  
  const isCurrentUser = (!userId || userId === currentUser?.id) && author.id === currentUser?.id
  
  if (isLoading && !isCurrentUser) {
    return (
      <div className={cn('animate-pulse flex items-center gap-3', className)}>
        <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-700 rounded w-24"></div>
          <div className="h-3 bg-slate-700 rounded w-16"></div>
        </div>
      </div>
    )
  }

  const displayProfile = isCurrentUser ? null : profile
  const themeColor = displayProfile?.theme_color || '#60A5FA'
  
  return (
    <div className={cn('space-y-3', className)}>
      {/* User Header */}
      <div className="flex items-start gap-3">
        <UserAvatar 
          userId={userId || author.id}
          nickname={author.nickname}
          size={compact ? 'sm' : 'md'}
          showStatus={showExtended}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span 
              className="font-medium truncate"
              style={{ color: themeColor }}
            >
              {author.nickname}
            </span>
            
            {displayProfile?.warnings && displayProfile.warnings > 0 && (
              <AlertTriangle className="w-3 h-3 text-yellow-500" />
            )}
            
            {/* Role badge seria interessante aqui se tivéssemos */}
          </div>
          
          <div className="text-xs text-slate-400">
            {displayProfile?.custom_title || 'Membro'}
          </div>
          
          {showExtended && (
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              {displayProfile?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{displayProfile.location}</span>
                </div>
              )}
              
              {displayProfile?.created_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Desde {new Date(displayProfile.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {showStats && displayProfile && (
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{displayProfile.total_posts} posts</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{displayProfile.total_likes} curtidas</span>
          </div>
        </div>
      )}

      {/* Bio */}
      {showExtended && displayProfile?.bio && (
        <div className="text-sm text-slate-400 leading-relaxed">
          {displayProfile.bio}
        </div>
      )}

      {/* Signature */}
      {showSignature && displayProfile?.signature && (
        <div className="pt-2 mt-2 border-t border-slate-700">
          <div className="text-xs text-slate-500 italic">
            {displayProfile.signature}
          </div>
        </div>
      )}
    </div>
  )
}