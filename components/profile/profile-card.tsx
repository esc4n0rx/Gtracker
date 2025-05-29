"use client"

import { useEffect } from 'react'
import { useProfileCustomization } from '@/hooks/use-profile-customization'
import { formatRelativeTime } from '@/lib/forum-utils'
import {
  User,
  MapPin,
  Calendar,
  Globe,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  MessageSquare,
  Heart,
  Eye,
  AlertTriangle,
  Crown
} from 'lucide-react'

interface ProfileCardProps {
  userId?: string
  compact?: boolean
  showStats?: boolean
  className?: string
  
}

export function ProfileCard({
  userId,
  compact = false,
  showStats = true,
  className = ''
}: ProfileCardProps) {
  const { profile, isLoading, fetchProfile } = useProfileCustomization()

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile, userId]) 

  if (isLoading || !profile) {
    return (
      <div className={`retro-panel p-4 animate-pulse ${className}`}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  const socialIcons = {
    github: Github,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      case 'invisible': return 'bg-gray-500'
      default: return 'bg-gray-500' 
    }
  }

  return (
    <div className={`retro-panel p-6 ${className}`}>
      {/* Cover Image */}
      {!compact && profile.cover_image_url && (
        <div className="relative -m-6 mb-0 h-32 overflow-hidden rounded-t-lg">
          <img
            src={profile.cover_image_url}
            alt="Capa do perfil"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      )}

      {/* Profile Header */}
      <div className={`flex ${compact ? 'items-center gap-4' : 'items-start gap-6'} ${!compact && profile.cover_image_url ? 'pt-6' : ''}`}>
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className={`
              ${compact ? 'w-16 h-16' : 'w-24 h-24'}
              rounded-full overflow-hidden border-4
              ${!compact && profile.cover_image_url ? '-mt-12' : ''}
            `}
            style={{
              borderColor: profile.theme_color || '#4A5568'
            }}
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: profile.theme_color || '#4A5568' }}
              >
                <User className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Status Indicator */}
          {profile.status && (
            <div
              className={`
                absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800
                ${getStatusColor(profile.status)}
              `}
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-retro-text truncate">
              {profile.display_name || profile.username || 'Membro'} {/* Adicionado fallback para username */}
            </h3>
            {profile.warnings > 0 && (
              <span title={`${profile.warnings} aviso(s)`}>
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              </span>
            )}
          </div>

          {profile.bio && (
            <p className={`text-slate-400 ${compact ? 'line-clamp-1' : 'line-clamp-2'} mb-2`}>
              {profile.bio}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{profile.location}</span>
              </div>
            )}

            {profile.created_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          {!compact && (profile.social_links && Object.keys(profile.social_links).length > 0 || profile.website) && (
            <div className="flex items-center gap-3 mt-3">
              {profile.social_links && Object.entries(profile.social_links).map(([platform, url]) => {
                const Icon = socialIcons[platform as keyof typeof socialIcons]
                if (!Icon || !url) return null

                return (
                  <a // Tag <a> adicionada
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={platform.charAt(0).toUpperCase() + platform.slice(1)} // Adiciona um tooltip
                    className="text-slate-400 hover:text-retro-blue transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}

              {profile.website && (
                <a // Tag <a> adicionada
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Website" // Adiciona um tooltip
                  className="text-slate-400 hover:text-retro-blue transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {showStats && !compact && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-600">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <MessageSquare className="w-3 h-3" />
            </div>
            <div className="text-lg font-bold text-retro-text">{profile.total_posts || 0}</div>
            <div className="text-xs text-slate-500">Posts</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              {/* Poderia ser um ícone diferente para comentários se disponível */}
              <MessageSquare className="w-3 h-3" />
            </div>
            <div className="text-lg font-bold text-retro-text">{profile.total_comments || 0}</div>
            <div className="text-xs text-slate-500">Comentários</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Heart className="w-3 h-3" />
            </div>
            <div className="text-lg font-bold text-retro-text">{profile.total_likes || 0}</div>
            <div className="text-xs text-slate-500">Curtidas</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Crown className="w-3 h-3" /> {/* Ícone pode ser alterado para algo como ShieldAlert para avisos */}
            </div>
            <div className="text-lg font-bold text-retro-text">
              {profile.warnings === 0 ? '✓' : profile.warnings}
            </div>
            <div className="text-xs text-slate-500">Avisos</div>
          </div>
        </div>
      )}

      {/* Signature */}
      {!compact && profile.signature && (
        <div className="mt-4 pt-4 border-t border-slate-600">
          <div className="text-sm text-slate-400 italic">
            "{profile.signature}"
          </div>
        </div>
      )}
    </div>
  )
}