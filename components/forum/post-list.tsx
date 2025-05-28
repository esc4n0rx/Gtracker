// components/forum/post-list.tsx
"use client"

import Link from 'next/link'
import { Post } from '@/lib/api'
import { formatRelativeTime } from '@/lib/forum-utils'
import { 
  MessageSquare, 
  Eye, 
  Heart, 
  Pin, 
  Lock, 
  User,
  Calendar,
  ArrowRight
} from 'lucide-react'

interface PostListProps {
  posts: Post[]
  isLoading: boolean
}

export function PostList({ posts, isLoading }: PostListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="retro-panel p-4 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                <div className="flex gap-4">
                  <div className="h-3 bg-slate-700 rounded w-16"></div>
                  <div className="h-3 bg-slate-700 rounded w-16"></div>
                  <div className="h-3 bg-slate-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="retro-panel p-8 text-center">
        <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-retro-text mb-2">
          Nenhum post encontrado
        </h3>
        <p className="text-slate-400">
          Este fórum ainda não possui posts. Seja o primeiro a criar um!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  )
}

function PostItem({ post }: { post: Post }) {
  const getPostTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'filme': 'Filme',
      'série': 'Série',
      'jogo': 'Jogo',
      'software': 'Software',
      'anuncio_oficial': 'Anúncio',
      'sugestao': 'Sugestão',
      'general': 'Geral'
    }
    return labels[type] || type
  }

  const getPostTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'filme': 'bg-blue-500',
      'série': 'bg-purple-500',
      'jogo': 'bg-green-500',
      'software': 'bg-orange-500',
      'anuncio_oficial': 'bg-red-500',
      'sugestao': 'bg-yellow-500',
      'general': 'bg-slate-500'
    }
    return colors[type] || 'bg-slate-500'
  }

  // Verificar se o post é fixado ou bloqueado (assumindo que virá da API futuramente)
  const isPinned = (post as any).is_pinned || false
  const isLocked = (post as any).is_locked || false

  return (
    <Link href={`/forum/post/${post.slug}`}>
      <div className="retro-panel p-4 hover:bg-slate-700/30 transition-all cursor-pointer group">
        <div className="flex items-start gap-4">
          {/* Post Type Icon */}
          <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
            ${getPostTypeColor(post.post_type)}
          `}>
            <MessageSquare className="w-6 h-6 text-white" />
          </div>

          {/* Post Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Badges */}
            <div className="flex items-start gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                {isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                {isLocked && <Lock className="w-4 h-4 text-red-500" />}
                
                <h3 className="font-bold text-retro-text group-hover:text-retro-neon transition-colors">
                  {post.title}
                </h3>
              </div>
            </div>

            {/* Post Meta */}
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="text-retro-blue">{post.author.nickname}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatRelativeTime(post.created_at)}</span>
              </div>

              <span className={`
                px-2 py-0.5 text-xs rounded-full text-white
                ${getPostTypeColor(post.post_type)}
              `}>
                {getPostTypeLabel(post.post_type)}
              </span>
            </div>

            {/* Post Stats */}
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{post.view_count} visualizações</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{post.like_count} curtidas</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>{post.comment_count} comentários</span>
              </div>
            </div>

            {/* Template Data Preview (se houver) */}
            {post.template_data && Object.keys(post.template_data).length > 0 && (
              <div className="mt-2 text-xs text-slate-400">
                {post.post_type === 'filme' && post.template_data.qualidade && (
                  <span className="bg-slate-700 px-2 py-0.5 rounded mr-2">
                    {post.template_data.qualidade}
                  </span>
                )}
                {post.template_data.formato && (
                  <span className="bg-slate-700 px-2 py-0.5 rounded mr-2">
                    {post.template_data.formato}
                  </span>
                )}
                {post.template_data.idioma && (
                  <span className="bg-slate-700 px-2 py-0.5 rounded">
                    {post.template_data.idioma}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0">
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-retro-blue transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}