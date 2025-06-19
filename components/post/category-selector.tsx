"use client"

import { useState, useEffect } from 'react'
import { Category, Forum } from '@/lib/api' // Assuming Forum has display_order
import { ChevronDown, ChevronRight, Folder, FolderOpen, Check } from 'lucide-react'

// Interface for the nested forum structure
interface NestedForum extends Forum {
  subforums: NestedForum[];
}

interface CategorySelectorProps {
  categories: Category[]
  isLoading: boolean
  selectedCategory: string
  selectedForum: string
  onCategoryChange: (categoryId: string) => void
  onForumChange: (forumId: string) => void
}

// Helper function to nest forums
const nestForums = (forums: Forum[]): NestedForum[] => {
  const forumMap: Record<string, NestedForum> = {};
  const nestedForums: NestedForum[] = [];

  // Initialize forums in the map and add subforums array
  forums.forEach(forum => {
    forumMap[forum.id] = { ...forum, subforums: [] };
  });

  // Populate subforums arrays and identify root forums
  forums.forEach(forum => {
    if (forum.parent_forum_id && forumMap[forum.parent_forum_id]) {
      // Ensure we don't add a forum to its own parent's subforums if it's already there (edge case)
      if (!forumMap[forum.parent_forum_id].subforums.find(sf => sf.id === forum.id)) {
        forumMap[forum.parent_forum_id].subforums.push(forumMap[forum.id]);
      }
    } else {
      // Add to root if it's not already there (in case of duplicates in flat list or complex scenarios)
       if (!nestedForums.find(nf => nf.id === forum.id)) {
        nestedForums.push(forumMap[forum.id]);
      }
    }
  });

  // Sort subforums and main forums by display_order
  Object.values(forumMap).forEach(forum => {
    if (forum.subforums.length > 0) {
      forum.subforums.sort((a, b) => a.display_order - b.display_order);
    }
  });
  nestedForums.sort((a,b) => a.display_order - b.display_order);

  return nestedForums;
};


// Recursive Forum Item Component
interface SelectableForumItemProps {
  forum: NestedForum;
  level: number;
  expandedForums: Set<string>;
  toggleForum: (forumId: string) => void;
  selectedForum: string;
  handleForumSelect: (forumId: string, categoryId: string) => void;
  categoryId: string;
}

const SelectableForumItem: React.FC<SelectableForumItemProps> = ({
  forum,
  level,
  expandedForums,
  toggleForum,
  selectedForum,
  handleForumSelect,
  categoryId,
}) => {
  const hasSubforums = forum.subforums && forum.subforums.length > 0;
  const isExpanded = expandedForums.has(forum.id);
  const isSelected = selectedForum === forum.id;

  // Indentation: ml-0 for level 0, ml-4 for level 1, ml-8 for level 2 etc.
  // Using paddingLeft on the button for more precise control of the whole clickable area.
  const paddingLeft = `${0.75 + level * 1.25}rem`; // p-3 base (0.75rem) + 1.25rem per level

  return (
    // Each item has a top border. For the very first item in a list, this might be redundant if the parent container also has a border.
    // The old code had <div className="flex border-t border-slate-600"> for each main forum.
    // This is now handled by this div if we want a border for each item.
    <div className={`${level === 0 ? 'border-t border-slate-600' : ''}`}>
      <button
        type="button"
        onClick={() => {
          if (hasSubforums) {
            toggleForum(forum.id);
          } else {
            handleForumSelect(forum.id, categoryId);
          }
        }}
        className={`
          w-full text-left flex items-center justify-between gap-3
          transition-colors group
          py-3 pr-3
          ${!hasSubforums && isSelected ? 'bg-retro-blue/10 text-retro-neon' : 'text-retro-text'}
          ${!hasSubforums ? 'hover:bg-slate-700/30' : 'hover:bg-slate-800/40'}
        `}
        style={{ paddingLeft }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0"> {/* min-w-0 for text truncation if needed */}
          {/* Icon */}
          <div className={`
            w-5 h-5 rounded flex items-center justify-center flex-shrink-0
            ${hasSubforums ? 'bg-gradient-to-br from-slate-500 to-slate-600' : 'bg-gradient-to-br from-slate-600 to-slate-700'}
            group-hover:from-slate-500 group-hover:to-slate-600
          `}>
            {hasSubforums ? (
              isExpanded ? <FolderOpen className="w-3 h-3 text-slate-200" /> : <Folder className="w-3 h-3 text-slate-200" />
            ) : (
              <Folder className="w-3 h-3 text-slate-300" />
            )}
          </div>
          {/* Name and Description */}
          <div className="flex-1 truncate">
            <div className="font-medium flex items-center gap-2 text-sm">
              {forum.name}
              {!hasSubforums && isSelected && (
                <Check className="w-4 h-4 text-retro-neon flex-shrink-0" />
              )}
            </div>
            {forum.description && (
              <div className="text-xs text-slate-400 mt-0.5 truncate">{forum.description}</div>
            )}
          </div>
        </div>
        {/* Chevron for parent forums */}
        {hasSubforums && (
          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
        )}
      </button>

      {hasSubforums && isExpanded && (
        <div className="bg-slate-900/30"> {/* Slightly different background for sub-items container */}
          {forum.subforums.map(sub => (
            <SelectableForumItem
              key={sub.id}
              forum={sub}
              level={level + 1}
              expandedForums={expandedForums}
              toggleForum={toggleForum}
              selectedForum={selectedForum}
              handleForumSelect={handleForumSelect}
              categoryId={categoryId}
            />
          ))}
        </div>
      )}
    </div>
  );
};


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

  // Helper to find a forum and its parents in the original flat list for path reconstruction
  const getForumAndParents = (forumId: string, allForums: Forum[]): Forum[] => {
    const path: Forum[] = [];
    let current = allForums.find(f => f.id === forumId);
    while (current) {
      path.unshift(current); // Add to the beginning
      current = allForums.find(f => f.id === current!.parent_forum_id);
    }
    return path;
  };

  const getPathString = (forumId: string, currentCategoryId: string): string => {
    const category = categories.find(cat => cat.id === currentCategoryId);
    if (!category) return 'Fórum selecionado';

    const forumPathArray = getForumAndParents(forumId, category.forums);
    if (forumPathArray.length === 0) return 'Fórum selecionado';

    return `${category.name} > ${forumPathArray.map(f => f.name).join(' > ')}`;
  }


  useEffect(() => {
    if (selectedCategory) {
      setExpandedCategories(prev => new Set(prev).add(selectedCategory)); // Simplified add

      if (selectedForum) {
        const category = categories.find(cat => cat.id === selectedCategory);
        if (category) {
          // Auto-expand parent forums up to the root of the selection
          const path = getForumAndParents(selectedForum, category.forums);
          setExpandedForums(prev => {
            const newSet = new Set(prev);
            // Expand all parents of the selected forum, but not the selected forum itself if it's a parent
            path.slice(0, -1).forEach(f => newSet.add(f.id));
            return newSet;
          });
        }
      }
    }
  }, [selectedCategory, selectedForum, categories]); // categories dependency is important if data can change

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) newSet.delete(categoryId);
      else newSet.add(categoryId);
      return newSet
    })
  }

  const toggleForum = (forumId: string) => {
    setExpandedForums(prev => {
      const newSet = new Set(prev)
      if (newSet.has(forumId)) newSet.delete(forumId);
      else newSet.add(forumId);
      return newSet
    })
  }

  const handleForumSelectInternal = (forumId: string, categoryId: string) => {
    onCategoryChange(categoryId) // Selects the category
    onForumChange(forumId)      // Selects the forum
    // Optionally, collapse other expanded main forums in other categories or this one
  }

  if (isLoading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-700 rounded-lg"></div>)}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-400 mb-4">
        Selecione onde deseja postar seu conteúdo. Você pode escolher fóruns principais ou subfóruns específicos. *
      </p>

      {selectedForum && selectedCategory && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">Selecionado:</span>
          </div>
          <div className="mt-1 text-sm text-slate-300">
            {getPathString(selectedForum, selectedCategory)}
          </div>
        </div>
      )}

      {categories.map(category => {
        const isCategoryExpanded = expandedCategories.has(category.id);
        // Nest forums for the current category
        const nestedMainForums = nestForums(category.forums);

        return (
          <div key={category.id} className="border border-slate-700 bg-slate-800 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`
                w-full p-4 text-left flex items-center justify-between
                hover:bg-slate-700/80 transition-colors
                ${selectedCategory === category.id ? 'bg-retro-blue/10 border-b border-retro-blue/30' : 'border-b border-slate-700'}
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
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCategoryExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryExpanded && (
              // Container for forums list, remove previous bg-slate-900/50 if SelectableForumItem handles its own background
              <div className="bg-slate-800">
                {nestedMainForums.length > 0 ? (
                  nestedMainForums.map(forum => (
                    <SelectableForumItem
                      key={forum.id}
                      forum={forum}
                      level={0} // Main forums are level 0
                      expandedForums={expandedForums}
                      toggleForum={toggleForum}
                      selectedForum={selectedForum}
                      handleForumSelect={handleForumSelectInternal}
                      categoryId={category.id}
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400 text-sm border-t border-slate-700">
                    Nenhum fórum disponível nesta categoria.
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {categories.length === 0 && !isLoading && (
        <div className="text-center text-slate-400 py-8">
          Nenhuma categoria disponível.
        </div>
      )}
    </div>
  )
}