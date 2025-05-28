// components/post/tmdb-text-searcher.tsx
"use client"

import { useState } from 'react'
import { tmdbApi, TMDBSearchResult, formatTMDBData, getImageUrl } from '@/lib/tmdb'
import { RetroInput } from '@/components/ui/retro-input'
import { RetroButton } from '@/components/ui/retro-button'
import { Search, Loader2, CheckCircle, Star, Calendar, X } from 'lucide-react'

interface TMDBTextSearcherProps {
  mediaType: 'movie' | 'tv'
  onDataReceived: (data: any) => void
  currentData?: any
}

export function TMDBTextSearcher({ mediaType, onDataReceived, currentData }: TMDBTextSearcherProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<TMDBSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    try {
      const results = mediaType === 'movie' 
        ? await tmdbApi.searchMovies(searchTerm)
        : await tmdbApi.searchTV(searchTerm)
      
      setSearchResults(results)
    } catch (error) {
      console.error('Erro na busca TMDB:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      handleSearch()
    }
  }

  const handleSelectItem = async (item: TMDBSearchResult) => {
    setIsLoadingDetails(true)
    setSelectedId(item.id)

    try {
      const details = await tmdbApi.getDetails(item.id, mediaType)
      const formattedData = formatTMDBData(details)
      
      onDataReceived({
        id: item.id,
        title: mediaType === 'movie' ? (details as any).title : (details as any).name,
        ...formattedData
      })
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error)
    } finally {
      setIsLoadingDetails(false)
      setSelectedId(null)
    }
  }

  const handleClearData = () => {
    onDataReceived(null)
    setSearchResults([])
    setSearchTerm('')
  }

  return (
    <div className="space-y-4">
      {/* Current Selection */}
      {currentData && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              {currentData.poster && (
                <img
                  src={currentData.poster}
                  alt={currentData.title}
                  className="w-16 h-24 object-cover rounded"
                />
              )}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h4 className="font-medium text-green-400">Selecionado do TMDB</h4>
                </div>
                <h3 className="font-bold text-retro-text mb-1">{currentData.title}</h3>
                <div className="text-sm text-slate-400 space-y-1">
                  <p>ID: {currentData.id}</p>
                  <p>Ano: {currentData.ano_lancamento}</p>
                  {currentData.generos && (
                    <p>Gêneros: {currentData.generos.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
            <RetroButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClearData}
            >
              <X className="w-4 h-4" />
            </RetroButton>
          </div>
        </div>
      )}

      {/* Search Input */}
      {!currentData && (
        <>
          <div className="flex gap-3">
            <div className="flex-1">
              <RetroInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Buscar ${mediaType === 'movie' ? 'filme' : 'série'} por nome...`}
              />
            </div>
            <RetroButton 
              type="button" 
              onClick={handleSearch}
              disabled={isSearching || !searchTerm.trim()}
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </RetroButton>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <div className="text-sm text-slate-400 mb-3">
                Encontrados {searchResults.length} resultado(s) para "{searchTerm}"
              </div>
              
              {searchResults.map(item => (
                <div
                  key={item.id}
                  className="border border-slate-600 rounded-lg p-4 hover:border-retro-blue/50 transition-colors"
                >
                  <div className="flex gap-4">
                    {item.poster_path ? (
                      <img
                        src={getImageUrl(item.poster_path, 'w200') || ''}
                        alt={item.title || item.name}
                        className="w-12 h-18 object-cover rounded flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-18 bg-slate-700 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-slate-400">Sem<br/>Poster</span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-retro-text mb-1">
                        {item.title || item.name}
                      </h4>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.release_date || item.first_air_date ? 
                            new Date(item.release_date || item.first_air_date || '').getFullYear() : 
                            'N/A'
                          }
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                        </div>
                        <div className="text-xs bg-slate-700 px-2 py-0.5 rounded">
                          ID: {item.id}
                        </div>
                      </div>

                      {item.overview && (
                        <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                          {item.overview}
                        </p>
                      )}

                      <RetroButton
                        type="button"
                        size="sm"
                        onClick={() => handleSelectItem(item)}
                        disabled={isLoadingDetails}
                      >
                        {isLoadingDetails && selectedId === item.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Carregando...
                          </>
                        ) : (
                          'Selecionar'
                        )}
                      </RetroButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchResults.length === 0 && searchTerm && !isSearching && (
            <div className="text-center text-slate-400 py-8">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <h3 className="font-medium mb-2">Nenhum resultado encontrado</h3>
              <p className="text-sm">
                Não encontramos nenhum {mediaType === 'movie' ? 'filme' : 'série'} com o termo "{searchTerm}"
              </p>
              <div className="mt-4 text-xs space-y-1">
                <p>💡 <strong>Dicas:</strong></p>
                <p>• Tente usar o título original em inglês</p>
                <p>• Verifique a ortografia</p>
                <p>• Use termos mais simples</p>
                <p>• Se souber o ID do TMDB, use a busca por ID</p>
              </div>
            </div>
          )}

          {/* Search Help */}
          {!searchTerm && (
            <div className="text-sm text-slate-400 bg-slate-800/50 p-4 rounded-lg">
              <p className="font-medium mb-2">💡 Como buscar:</p>
              <ul className="space-y-1">
                <li>• Digite o nome do {mediaType === 'movie' ? 'filme' : 'série'}</li>
                <li>• Use preferencialmente o título original</li>
                <li>• Pressione Enter ou clique no botão para buscar</li>
                <li>• Selecione o resultado correto da lista</li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}