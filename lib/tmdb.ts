// lib/tmdb.ts
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export interface TMDBSearchResult {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  genre_ids: number[]
  media_type?: 'movie' | 'tv'
}

export interface TMDBMovieDetails {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  runtime: number
  genres: { id: number; name: string }[]
  credits?: {
    cast: Array<{ id: number; name: string; character: string }>
    crew: Array<{ id: number; name: string; job: string }>
  }
  vote_average: number
}

export interface TMDBTVDetails {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  genres: { id: number; name: string }[]
  created_by: Array<{ id: number; name: string }>
  credits?: {
    cast: Array<{ id: number; name: string; character: string }>
  }
  vote_average: number
  number_of_seasons: number
  number_of_episodes: number
}

class TMDBError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'TMDBError'
  }
}

async function tmdbRequest<T>(endpoint: string): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new TMDBError('TMDB API key não configurada')
  }

  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}&language=pt-BR`
  
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new TMDBError(`Erro na API do TMDB: ${response.status}`, response.status)
    }

    return response.json()
  } catch (error) {
    if (error instanceof TMDBError) {
      throw error
    }
    throw new TMDBError('Erro de conexão com TMDB')
  }
}

export const tmdbApi = {
  // Buscar filmes/séries
  search: async (query: string): Promise<TMDBSearchResult[]> => {
    const response = await tmdbRequest<{
      results: TMDBSearchResult[]
    }>(`/search/multi?query=${encodeURIComponent(query)}`)
    
    return response.results.filter(item => 
      item.media_type === 'movie' || item.media_type === 'tv'
    )
  },

  // Buscar apenas filmes
  searchMovies: async (query: string): Promise<TMDBSearchResult[]> => {
    const response = await tmdbRequest<{
      results: TMDBSearchResult[]
    }>(`/search/movie?query=${encodeURIComponent(query)}`)
    
    return response.results
  },

  // Buscar apenas séries
  searchTV: async (query: string): Promise<TMDBSearchResult[]> => {
    const response = await tmdbRequest<{
      results: TMDBSearchResult[]
    }>(`/search/tv?query=${encodeURIComponent(query)}`)
    
    return response.results
  },

  // Obter detalhes de um filme
  getMovieDetails: async (id: number): Promise<TMDBMovieDetails> => {
    return tmdbRequest<TMDBMovieDetails>(`/movie/${id}?append_to_response=credits`)
  },

  // Obter detalhes de uma série
  getTVDetails: async (id: number): Promise<TMDBTVDetails> => {
    return tmdbRequest<TMDBTVDetails>(`/tv/${id}?append_to_response=credits`)
  },

  // Obter detalhes por ID (detecta automaticamente se é filme ou série)
  getDetails: async (id: number, mediaType?: 'movie' | 'tv'): Promise<TMDBMovieDetails | TMDBTVDetails> => {
    if (mediaType === 'movie') {
      return tmdbApi.getMovieDetails(id)
    } else if (mediaType === 'tv') {
      return tmdbApi.getTVDetails(id)
    } else {
      // Tentar filme primeiro, depois série
      try {
        return await tmdbApi.getMovieDetails(id)
      } catch (error) {
        return await tmdbApi.getTVDetails(id)
      }
    }
  }
}

// Funções utilitárias
export function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null
}

export function formatTMDBData(data: TMDBMovieDetails | TMDBTVDetails): {
  poster: string | null
  sinopse: string
  elenco: string[]
  diretor?: string
  criadores?: string[]
  generos: string[]
  ano_lancamento: string
} {
  const isMovie = 'title' in data
  
  return {
    poster: getImageUrl(data.poster_path),
    sinopse: data.overview,
    elenco: data.credits?.cast.slice(0, 5).map(actor => actor.name) || [],
    diretor: isMovie ? data.credits?.crew.find(person => person.job === 'Director')?.name : undefined,
    criadores: !isMovie ? (data as TMDBTVDetails).created_by.map(creator => creator.name) : undefined,
    generos: data.genres.map(genre => genre.name),
    ano_lancamento: isMovie ? 
      new Date(data.release_date).getFullYear().toString() : 
      new Date((data as TMDBTVDetails).first_air_date).getFullYear().toString()
  }
}

export { TMDBError }