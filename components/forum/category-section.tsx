// components/forum/category-section.tsx
"use client"

import { useState } from 'react'
import { Category } from '@/lib/api'
import { ForumItem } from './forum-item'
import { ChevronDown, ChevronRight, Hash } from 'lucide-react'
import { 
  Film, 
  Tv, 
  Gamepad2, 
  Monitor, 
  FileText, 
  Music, 
  Star,
  MessageSquare,
  Settings,
  Users
} from 'lucide-react'

interface CategorySectionProps {
  category: Category
  defaultExpanded?: boolean
}

// Mapeamento de ícones baseado no nome da categoria/fórum
const getForumIcon = (name: string) => {
  const nameLower = name.toLowerCase()
  
  if (nameLower.includes('filme')) return Film
  if (nameLower.includes('série') || nameLower.includes('series')) return Tv
  if (nameLower.includes('jogo') || nameLower.includes('game')) return Gamepad2
  if (nameLower.includes('software') || nameLower.includes('programa')) return Monitor
  if (nameLower.includes('música') || nameLower.includes('music')) return Music
  if (nameLower.includes('documento') || nameLower.includes('ebook')) return FileText
  if (nameLower.includes('anime')) return Star
  if (nameLower.includes('admin') || nameLower.includes('moderaç')) return Settings
  if (nameLower.includes('apresent') || nameLower.includes('membro')) return Users
  
  return MessageSquare // ícone padrão
}

export function CategorySection({ category, defaultExpanded = true }: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  // Organizar fóruns: apenas os principais (sem parent_forum_id)
  const mainForums = category.forums
    .filter(forum => !forum.parent_forum_id)
    .sort((a, b) => a.display_order - b.display_order)

  // Calcular estatísticas da categoria
  const totalTopics = category.forums.reduce((sum, forum) => 
    sum + (forum.total_topics || forum.topic_count || 0), 0
  )
  const totalPosts = category.forums.reduce((sum, forum) => 
    sum + (forum.total_posts || forum.post_count || 0), 0
  )
  
  const totalSubforums = category.forums.length - mainForums.length

  return (
    <div className="border-2 border-slate-600 rounded-lg overflow-hidden shadow-lg">
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 bg-gradient-to-r from-retro-blue/20 to-retro-purple/20 hover:from-retro-blue/30 hover:to-retro-purple/30 transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-retro-blue to-retro-purple rounded-lg flex items-center justify-center shadow-lg">
            <Hash className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-retro-text group-hover:text-retro-neon transition-colors">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-sm text-slate-400 mt-1">{category.description}</p>
            )}
            <div className="flex items-center gap-6 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-retro-blue rounded-full"></div>
                {totalTopics.toLocaleString()} tópicos
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-retro-purple rounded-full"></div>
                {totalPosts.toLocaleString()} posts
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-retro-neon rounded-full"></div>
                {mainForums.length} fóruns
              </span>
              {totalSubforums > 0 && (
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  {totalSubforums} subfóruns
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right text-xs text-slate-400 hidden md:block">
            <div className="font-medium text-retro-text">{mainForums.length}</div>
            <div>fóruns principais</div>
          </div>
          <div className={`
            w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center
            transition-transform duration-200
            ${isExpanded ? 'rotate-180' : ''}
          `}>
            <ChevronDown className="w-4 h-4 text-slate-300" />
          </div>
        </div>
      </button>

      {/* Forums List */}
      {isExpanded && (
        <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50">
          {mainForums.length > 0 ? (
            <div className="divide-y divide-slate-700/50">
              {mainForums.map((forum, index) => (
                <div key={forum.id} className={index === 0 ? '' : ''}>
                  <ForumItem 
                    forum={forum} 
                    icon={getForumIcon(forum.name)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-retro-text mb-2">
                Nenhum fórum disponível
              </h3>
              <p className="text-slate-400 text-sm">
                Esta categoria ainda não possui fóruns configurados.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}