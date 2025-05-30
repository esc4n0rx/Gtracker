"use client"

import { useState, useEffect } from 'react'
import { Category, Forum } from '@/lib/api'
import { ChevronDown, ChevronRight, Folder, FolderOpen, Check } from 'lucide-react'

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
      
      // Auto-expandir fórum pai se um subfórum estiver selecionado
      if (selectedForum) {
        const category = categories.find(cat => cat.id === selectedCategory)
        if (category) {
          const selectedForumData = category.forums.find(f => f.id === selectedForum)
          if (selectedForumData?.parent_forum_id) {
            setExpandedForums(prev => new Set([...prev, selectedForumData.parent_forum_id!]))
          }
        }
      }
    }
  }, [selectedCategory, selectedForum, categories])

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

  const handleForumSelect = (forumId: string, categoryId: string) => {
    onCategoryChange(categoryId)
    onForumChange(forumId)
  }

  const getForumPath = (forum: Forum, category: Category): string => {
    if (forum.parent_forum_id) {
      const parentForum = category.forums.find(f => f.id === forum.parent_forum_id)
      if (parentForum) {
        return `${parentForum.name} > ${forum.name}`
      }
    }
    return forum.name
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
        Selecione onde deseja postar seu conteúdo. Você pode escolher fóruns principais ou subfóruns específicos. *
      </p>

      {/* Selected Forum Display */}
      {selectedForum && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">Selecionado:</span>
          </div>
          <div className="mt-1 text-sm text-slate-300">
            {(() => {
              const category = categories.find(cat => cat.id === selectedCategory)
              const forum = category?.forums.find(f => f.id === selectedForum)
              return forum && category ? `${category.name} > ${getForumPath(forum, category)}` : 'Fórum selecionado'
            })()}
          </div>
        </div>
      )}

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
                  const subforums = category.forums.filter(f => f.parent_forum_id === forum.id)
                  const hasSubforums = subforums.length > 0
                  const isForumExpanded = expandedForums.has(forum.id)

                  return (
                    <div key={forum.id}>
                      {/* Main Forum */}
                      <div className="flex border-t border-slate-600">
                        <button
                          type="button"
                          onClick={() => handleForumSelect(forum.id, category.id)}
                          className={`
                            flex-1 p-3 text-left flex items-center gap-3
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
                            <div className="font-medium flex items-center gap-2">
                              {forum.name}
                              {selectedForum === forum.id && (
                                <Check className="w-4 h-4 text-retro-neon" />
                              )}
                            </div>
                            {forum.description && (
                              <div className="text-xs text-slate-400 mt-1">{forum.description}</div>
                            )}
                          </div>
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
                          {subforums
                            .sort((a, b) => a.display_order - b.display_order)
                            .map(subforum => (
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
                                  <div className="text-sm font-medium flex items-center gap-2">
                                    ↳ {subforum.name}
                                    {selectedForum === subforum.id && (
                                      <Check className="w-4 h-4 text-retro-neon" />
                                    )}
                                  </div>
                                  {subforum.description && (
                                    <div className="text-xs text-slate-400 mt-1">{subforum.description}</div>
                                  )}
                                </div>
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