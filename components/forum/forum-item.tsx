// components/forum/forum-item.tsx
import Link from 'next/link'
import { Forum } from '@/lib/api'
import { ForumStats } from './forum-stats'
import { LucideIcon, MessageSquare } from 'lucide-react'

interface ForumItemProps {
  forum: Forum
  icon?: LucideIcon
  isSubforum?: boolean
}

export function ForumItem({ forum, icon: Icon = MessageSquare, isSubforum = false }: ForumItemProps) {
  return (
    <Link href={`/forum/${forum.id}`}>
      <div className={`p-4 border-t border-slate-600 hover:bg-slate-700/50 transition-colors cursor-pointer ${
        isSubforum ? 'ml-6 border-l-2 border-retro-blue/30' : ''
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-retro-blue flex-shrink-0" />
            <div>
              <h3 className="font-medium text-retro-text">{forum.name}</h3>
              {forum.description && (
                <p className="text-sm text-slate-400 mt-1">{forum.description}</p>
              )}
            </div>
          </div>
          <div className="text-right min-w-0">
            <ForumStats forum={forum} />
          </div>
        </div>

        {/* Subfóruns */}
        {forum.subforums && forum.subforums.length > 0 && (
          <div className="mt-3 space-y-0">
            {forum.subforums.map((subforum) => (
              <ForumItem 
                key={subforum.id} 
                forum={subforum} 
                icon={Icon}
                isSubforum={true}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}