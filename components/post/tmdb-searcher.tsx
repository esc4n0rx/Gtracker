"use client"

import { useState } from 'react'
import { TMDBIdSearcher } from './tmdb-id-searcher'
import { TMDBTextSearcher } from './tmdb-text-searcher'
import { Hash, Search } from 'lucide-react'

interface TMDBSearcherProps {
  mediaType: 'movie' | 'tv'
  onDataReceived: (data: any) => void
  currentData?: any
}

export function TMDBSearcher({ mediaType, onDataReceived, currentData }: TMDBSearcherProps) {
  const [searchMode, setSearchMode] = useState<'id' | 'text'>('id')

  return (
    <div className="space-y-4">
      {/* Search Mode Tabs */}
      {!currentData && (
        <div className="flex gap-2 p-1 bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setSearchMode('id')}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${searchMode === 'id' 
                ? 'bg-retro-blue text-white' 
                : 'text-slate-400 hover:text-slate-300'
              }
            `}
          >
            <Hash className="w-4 h-4" />
            Buscar por ID
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('text')}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${searchMode === 'text' 
                ? 'bg-retro-blue text-white' 
                : 'text-slate-400 hover:text-slate-300'
              }
            `}
          >
            <Search className="w-4 h-4" />
            Buscar por Nome
          </button>
        </div>
      )}

      {/* Search Components */}
      {searchMode === 'id' ? (
        <TMDBIdSearcher
          mediaType={mediaType}
          onDataReceived={onDataReceived}
          currentData={currentData}
        />
      ) : (
        <TMDBTextSearcher
          mediaType={mediaType}
          onDataReceived={onDataReceived}
          currentData={currentData}
        />
      )}
    </div>
  )
}