// components/forum/forum-stats.tsx
import { MessageSquare, Eye, Clock } from 'lucide-react'
import { Forum } from '@/lib/api'

interface ForumStatsProps {
  forum: Forum
}

export function ForumStats({ forum }: ForumStatsProps) {
  const formatDate = (dateString: string) => {
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
    <div className="flex items-center justify-between text-xs text-slate-400">
      <div className="flex space-x-4">
        <span className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          {forum.topic_count || 0} tópicos
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {forum.post_count || 0} posts
        </span>
      </div>

      {forum.last_post && (
        <div className="text-right">
          <div className="text-retro-blue">{forum.last_post.author.nickname}</div>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3 h-3" />
            {formatDate(forum.last_post.created_at)}
          </div>
        </div>
      )}
    </div>
  )
}