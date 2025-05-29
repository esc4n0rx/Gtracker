// components/post/tmdb-display.tsx
"use client"

import { useState, useEffect } from 'react'
import { tmdbApi, getImageUrl, formatTMDBData } from '@/lib/tmdb'
import { Star, Calendar, Users, Clock, Play } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface TMDBDisplayProps {
  tmdbId: string
  mediaType: 'movie' | 'tv'
  title?: string
}

export function TMDBDisplay({ tmdbId, mediaType, title }: TMDBDisplayProps) {
  const [tmdbData, setTmdbData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTMDBData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const details = await tmdbApi.getDetails(parseInt(tmdbId), mediaType)
        const formattedData = formatTMDBData(details)
        setTmdbData({
          ...formattedData,
          title: mediaType === 'movie' ? (details as any).title : (details as any).name,
          vote_average: details.vote_average,
          runtime: mediaType === 'movie' ? (details as any).runtime : null,
          number_of_seasons: mediaType === 'tv' ? (details as any).number_of_seasons : null,
          number_of_episodes: mediaType === 'tv' ? (details as any).number_of_episodes : null,
        })
      } catch (err) {
        console.error('Erro ao buscar dados do TMDB:', err)
        setError('Erro ao carregar informações do TMDB')
      } finally {
        setIsLoading(false)
      }
    }

    if (tmdbId) {
      fetchTMDBData()
    }
  }, [tmdbId, mediaType])

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="flex gap-6">
          <Skeleton className="w-48 h-72 rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !tmdbData) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-lg p-6 border border-slate-600">
      <div className="flex gap-6">
        {/* Poster */}
        {tmdbData.poster && (
          <div className="flex-shrink-0">
            <img
              src={tmdbData.poster}
              alt={tmdbData.title || title}
              className="w-48 h-72 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-retro-text mb-2">
              {tmdbData.title || title}
            </h3>
            {tmdbData.sinopse && (
              <p className="text-slate-300 text-sm leading-relaxed">
                {tmdbData.sinopse}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            {tmdbData.ano_lancamento && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{tmdbData.ano_lancamento}</span>
              </div>
            )}
            
            {tmdbData.vote_average && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{tmdbData.vote_average.toFixed(1)}</span>
              </div>
            )}

            {tmdbData.runtime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{tmdbData.runtime} min</span>
              </div>
            )}

            {tmdbData.number_of_seasons && (
              <div className="flex items-center gap-1">
                <Play className="w-4 h-4" />
                <span>{tmdbData.number_of_seasons} temporadas</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {tmdbData.generos && tmdbData.generos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tmdbData.generos.map((genre: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-retro-blue/20 text-retro-blue text-xs rounded-full border border-retro-blue/30"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Cast */}
          {tmdbData.elenco && tmdbData.elenco.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-retro-text mb-2 flex items-center gap-1">
                <Users className="w-4 h-4" />
                Elenco Principal
              </h4>
              <div className="flex flex-wrap gap-2">
                {tmdbData.elenco.slice(0, 5).map((actor: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Director/Creators */}
          {(tmdbData.diretor || tmdbData.criadores) && (
            <div>
              <h4 className="text-sm font-medium text-retro-text mb-2">
                {tmdbData.diretor ? 'Direção' : 'Criação'}
              </h4>
              <p className="text-slate-300 text-sm">
                {tmdbData.diretor || tmdbData.criadores?.join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}