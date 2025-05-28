// components/forum/category-section.tsx
"use client"

import { useState } from 'react'
import { Category } from '@/lib/api'
import { ForumItem } from './forum-item'
import { ChevronDown, ChevronRight } from 'lucide-react'
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

  // Organizar fóruns: principais primeiro, depois subfóruns
  const mainForums = category.forums.filter(forum => !forum.parent_forum_id)
  
  // Adicionar subfóruns aos fóruns principais
  const forumsWithSubforums = mainForums.map(forum => ({
    ...forum,
    subforums: category.forums.filter(subforum => subforum.parent_forum_id === forum.id)
  }))

  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden">
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-gradient-to-r from-retro-blue/20 to-retro-purple/20 hover:from-retro-blue/30 hover:to-retro-purple/30 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-retro-blue" />
          <div className="text-left">
            <span className="text-lg font-bold text-retro-text">{category.name}</span>
            {category.description && (
              <p className="text-sm text-slate-400 mt-1">{category.description}</p>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {/* Forums List */}
      {isExpanded && (
        <div className="bg-slate-800/50">
          {forumsWithSubforums.length > 0 ? (
            forumsWithSubforums.map((forum) => (
              <ForumItem 
                key={forum.id} 
                forum={forum} 
                icon={getForumIcon(forum.name)}
              />
            ))
          ) : (
            <div className="p-4 text-center text-slate-400">
              Nenhum fórum disponível nesta categoria
            </div>
          )}
        </div>
      )}
    </div>
  )
}