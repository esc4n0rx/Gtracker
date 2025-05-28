// components/post/category-selector.tsx
"use client"

import { useState, useEffect } from 'react'
import { Category, Forum } from '@/lib/api'
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react'

interface CategorySelectorProps {
  categories: Category[]
  isLoading: boolean
  selectedCategory: string
  selectedForum: string
  onCategoryChange: (categoryId: string) => void
  onForumChange: (forumId: string) => void
}

export function CategorySelector({
  categories,
  isLoading,
  selectedCategory,
  selectedForum,
  onCategoryChange,
  onForumChange
}: CategorySelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [expandedForums, setExpandedForums] = useState<Set<string>>(new Set())

  // Auto-expandir categoria selecionada
  useEffect(() => {
    if (selectedCategory) {
      setExpandedCategories(prev => new Set([...prev, selectedCategory]))
    }
  }, [selectedCategory])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const toggleForum = (forumId: string) => {
    setExpandedForums(prev => {
      const newSet = new Set(prev)
      if (newSet.has(forumId)) {
        newSet.delete(forumId)
      } else {
        newSet.add(forumId)
      }
      return newSet
    })
  }

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId)
    onForumChange('') // Reset forum selection
  }

  const handleForumSelect = (forumId: string, categoryId: string) => {
    onCategoryChange(categoryId)
    onForumChange(forumId)
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-slate-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-400 mb-4">
        Selecione onde deseja postar seu conteúdo *
      </p>

      {categories.map(category => {
        const isExpanded = expandedCategories.has(category.id)
        const mainForums = category.forums.filter(forum => !forum.parent_forum_id)

        return (
          <div key={category.id} className="border border-slate-600 rounded-lg overflow-hidden">
            {/* Category Header */}
            <button
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`
                w-full p-4 text-left flex items-center justify-between
                hover:bg-slate-700/50 transition-colors
                ${selectedCategory === category.id ? 'bg-retro-blue/20 border-retro-blue' : 'bg-slate-800/30'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-retro-blue to-retro-purple rounded flex items-center justify-center">
                  <Folder className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-retro-text">{category.name}</h4>
                  {category.description && (
                    <p className="text-xs text-slate-400 mt-1">{category.description}</p>
                  )}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Forums List */}
            {isExpanded && (
              <div className="bg-slate-900/50">
                {mainForums.map(forum => {
                  const hasSubforums = category.forums.some(f => f.parent_forum_id === forum.id)
                  const isForumExpanded = expandedForums.has(forum.id)
                  const subforums = category.forums.filter(f => f.parent_forum_id === forum.id)

                  return (
                    <div key={forum.id}>
                      {/* Main Forum */}
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => handleForumSelect(forum.id, category.id)}
                          className={`
                            flex-1 p-3 text-left flex items-center gap-3 border-t border-slate-600
                            hover:bg-slate-700/30 transition-colors
                            ${selectedForum === forum.id ? 'bg-retro-blue/10 text-retro-neon' : 'text-retro-text'}
                          `}
                        >
                          <div className="w-5 h-5 bg-gradient-to-br from-slate-600 to-slate-700 rounded flex items-center justify-center ml-4">
                            {hasSubforums ? (
                              <FolderOpen className="w-3 h-3 text-slate-300" />
                            ) : (
                              <Folder className="w-3 h-3 text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{forum.name}</div>
                            {forum.description && (
                              <div className="text-xs text-slate-400 mt-1">{forum.description}</div>
                            )}
                          </div>
                          {selectedForum === forum.id && (
                            <div className="w-2 h-2 bg-retro-neon rounded-full"></div>
                          )}
                        </button>

                        {/* Toggle Subforum Button */}
                        {hasSubforums && (
                          <button
                            type="button"
                            onClick={() => toggleForum(forum.id)}
                            className="p-3 border-t border-slate-600 hover:bg-slate-700/30 transition-colors"
                          >
                            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isForumExpanded ? 'rotate-90' : ''}`} />
                          </button>
                        )}
                      </div>

                      {/* Subforums */}
                      {hasSubforums && isForumExpanded && (
                        <div className="bg-slate-800/30">
                          {subforums.map(subforum => (
                            <button
                              key={subforum.id}
                              type="button"
                              onClick={() => handleForumSelect(subforum.id, category.id)}
                              className={`
                                w-full p-3 text-left flex items-center gap-3 border-t border-slate-600
                                hover:bg-slate-700/30 transition-colors ml-8
                                ${selectedForum === subforum.id ? 'bg-retro-blue/10 text-retro-neon' : 'text-slate-300'}
                              `}
                            >
                              <div className="w-4 h-4 bg-slate-600 rounded flex items-center justify-center">
                                <Folder className="w-2 h-2 text-slate-400" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">↳ {subforum.name}</div>
                                {subforum.description && (
                                  <div className="text-xs text-slate-400 mt-1">{subforum.description}</div>
                                )}
                              </div>
                              {selectedForum === subforum.id && (
                                <div className="w-2 h-2 bg-retro-neon rounded-full"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}

                {mainForums.length === 0 && (
                  <div className="p-4 text-center text-slate-400 text-sm">
                    Nenhum fórum disponível nesta categoria
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {categories.length === 0 && (
        <div className="text-center text-slate-400 py-8">
          Nenhuma categoria disponível
        </div>
      )}
    </div>
  )
}