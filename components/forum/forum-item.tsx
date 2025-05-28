// components/forum/forum-item.tsx
import Link from 'next/link'
import { Forum } from '@/lib/api'
import { ForumStats } from './forum-stats'
import { LucideIcon, MessageSquare, ChevronRight, Folder, FolderOpen } from 'lucide-react'

interface ForumItemProps {
  forum: Forum
  icon?: LucideIcon
  isSubforum?: boolean
  level?: number
}

export function ForumItem({ forum, icon: Icon = MessageSquare, isSubforum = false, level = 0 }: ForumItemProps) {
  const totalTopics = forum.total_topics || forum.topic_count || 0
  const totalPosts = forum.total_posts || forum.post_count || 0
  const hasSubforums = forum.subforums && forum.subforums.length > 0

  return (
    <div>
      <Link href={`/forum/${forum.id}`}>
        <div className={`
          flex items-center justify-between p-4 border-t border-slate-600 
          hover:bg-slate-700/50 transition-colors cursor-pointer
          ${isSubforum ? 
            'bg-slate-800/30 ml-8 border-l-4 border-retro-blue/40 relative' : 
            'bg-slate-800/10'
          }
        `}>
          {/* Linha conectora para subfóruns */}
          {isSubforum && (
            <div className="absolute -left-8 top-0 bottom-0 w-8 flex items-center justify-center">
              <div className="w-6 h-px bg-slate-600"></div>
            </div>
          )}

          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Ícone do fórum */}
            <div className={`
              flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
              ${isSubforum ? 
                'bg-gradient-to-br from-slate-600 to-slate-700' : 
                'bg-gradient-to-br from-retro-blue to-retro-purple'
              }
            `}>
              {isSubforum ? (
                <Folder className="w-5 h-5 text-slate-300" />
              ) : hasSubforums ? (
                <FolderOpen className="w-5 h-5 text-white" />
              ) : (
                <Icon className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Informações do fórum */}
            <div className="flex-1 min-w-0">
              <h3 className={`
                font-medium text-retro-text
                ${isSubforum ? 'text-sm text-slate-300' : 'text-base'}
              `}>
                {isSubforum && '↳ '}{forum.name}
              </h3>
              {forum.description && (
                <p className={`
                  text-slate-400 mt-1 line-clamp-2
                  ${isSubforum ? 'text-xs' : 'text-sm'}
                `}>
                  {forum.description}
                </p>
              )}
              
              {/* Estatísticas inline para subfóruns */}
              {isSubforum && (
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>{totalTopics} tópicos</span>
                  <span>{totalPosts} posts</span>
                </div>
              )}
            </div>
          </div>

          {/* Estatísticas (apenas para fóruns principais) */}
          {!isSubforum && (
            <div className="text-right min-w-0 flex items-center gap-4">
              <div className="text-xs text-slate-400">
                <div className="flex items-center gap-3 justify-end">
                  <span className="font-medium">{totalTopics}</span>
                  <span className="text-slate-500">tópicos</span>
                </div>
                <div className="flex items-center gap-3 justify-end mt-1">
                  <span className="font-medium">{totalPosts}</span>
                  <span className="text-slate-500">posts</span>
                </div>
                {forum.last_post_at && (
                  <div className="text-retro-blue mt-1 text-xs">
                    {formatRelativeTime(forum.last_post_at)}
                  </div>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          )}

          {/* Seta apenas para subfóruns */}
          {isSubforum && (
            <ChevronRight className="w-4 h-4 text-slate-400 ml-2" />
          )}
        </div>
      </Link>

      {/* Renderizar subfóruns */}
      {hasSubforums && (
        <div className="bg-slate-900/30">
          {forum.subforums!
            .sort((a, b) => a.display_order - b.display_order)
            .map((subforum) => (
              <ForumItem 
                key={subforum.id} 
                forum={subforum} 
                icon={Icon}
                isSubforum={true}
                level={level + 1}
              />
            ))}
        </div>
      )}
    </div>
  )
}

// Função helper para formatar tempo relativo
function formatRelativeTime(dateString: string): string {
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
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }
}