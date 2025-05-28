"use client"

import { useState } from 'react'
import { tmdbApi, formatTMDBData } from '@/lib/tmdb'
import { RetroInput } from '@/components/ui/retro-input'
import { RetroButton } from '@/components/ui/retro-button'
import { Search, Loader2, CheckCircle, X, Hash } from 'lucide-react'

interface TMDBIdSearcherProps {
  mediaType: 'movie' | 'tv'
  onDataReceived: (data: any) => void
  currentData?: any
}

export function TMDBIdSearcher({ mediaType, onDataReceived, currentData }: TMDBIdSearcherProps) {
  const [tmdbId, setTmdbId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearchById = async () => {
    if (!tmdbId.trim()) return

    const id = parseInt(tmdbId.trim())
    if (isNaN(id)) {
      setError('ID deve ser um número válido')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const details = await tmdbApi.getDetails(id, mediaType)
      const formattedData = formatTMDBData(details)
      
      onDataReceived({
        id: id,
        title: mediaType === 'movie' ? (details as any).title : (details as any).name,
        ...formattedData
      })
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error)
      setError('Não foi possível encontrar este ID no TMDB')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      handleSearchById()
    }
  }

  const handleClearData = () => {
    onDataReceived(null)
    setTmdbId('')
    setError(null)
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
                  <h4 className="font-medium text-green-400">Carregado do TMDB</h4>
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

      {/* ID Search */}
      {!currentData && (
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <RetroInput
                value={tmdbId}
                onChange={(e) => {
                  setTmdbId(e.target.value)
                  setError(null)
                }}
                onKeyPress={handleKeyPress}
                placeholder={`Digite o ID do TMDB (ex: 822119)`}
                error={error ?? undefined}
              />
            </div>
            <RetroButton 
              type="button" 
              onClick={handleSearchById}
              disabled={isLoading || !tmdbId.trim()}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Hash className="w-4 h-4" />
              )}
            </RetroButton>
          </div>

          <div className="text-sm text-slate-400">
            <p>💡 <strong>Dica:</strong> O ID do TMDB pode ser encontrado na URL do filme/série no site do TMDB.</p>
            <p>Exemplo: themoviedb.org/movie/<strong>822119</strong> → ID é 822119</p>
          </div>
        </div>
      )}
    </div>
  )
}