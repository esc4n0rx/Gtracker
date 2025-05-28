// components/ui/forum-card.tsx (atualizar o arquivo existente)
"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Forum } from "@/lib/api"

interface ForumCardProps {
  forum: Forum
  icon: LucideIcon
  className?: string
  onClick?: () => void
}

export function ForumCard({
  forum,
  icon: Icon,
  className,
  onClick,
}: ForumCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins}min atrás`
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`
    } else if (diffDays < 7) {
      return `${diffDays}d atrás`
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  }

  return (
    <div className={cn("forum-card cursor-pointer", className)} onClick={onClick}>
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-retro-blue to-retro-purple rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-retro-text mb-1">{forum.name}</h3>
          {forum.description && (
            <p className="text-sm text-slate-400 mb-3">{forum.description}</p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex space-x-4">
              <span>{forum.topic_count || 0} tópicos</span>
              <span>{forum.post_count || 0} posts</span>
            </div>

            {forum.last_post && (
              <div className="text-right">
                <div className="text-retro-blue">{forum.last_post.author.nickname}</div>
                <div>{formatDate(forum.last_post.created_at)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}