// app/forum/post/[slug]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { RetroButton } from "@/components/ui/retro-button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ForumBreadcrumb } from "@/components/forum/forum-breadcrumb"
import { postsApi, Post, ApiError } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/toast"
import { formatRelativeTime } from "@/lib/forum-utils"
import {
  ArrowLeft,
  Eye,
  Heart,
  MessageSquare,
  User,
  Calendar,
  Pin,
  Lock,
  Share,
  Flag,
  Edit,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

function PostDetailContent() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLiking, setIsLiking] = useState(false)
  const { user } = useAuth()
  const { success, error: showError } = useToast()

  const fetchPost = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await postsApi.getBySlug(slug)
      setPost(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao carregar post')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const handleLike = async () => {
    if (!post || isLiking) return

    setIsLiking(true)
    try {
      const result = await postsApi.toggleLike(post.id)
      setPost(prev => prev ? {
        ...prev,
        like_count: result.like_count,
        // Assumindo que a API retornará se o usuário curtiu
        user_liked: result.liked
      } : null)
      
      success(
        result.liked ? 'Post curtido!' : 'Curtida removida',
        ''
      )
    } catch (err) {
      showError('Erro', 'Não foi possível curtir o post')
    } finally {
      setIsLiking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="retro-panel p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-retro-blue mx-auto mb-4" />
            <p className="text-slate-400">Carregando post...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="retro-panel p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-retro-text mb-2">Post não encontrado</h2>
            <p className="text-slate-400 mb-4">{error || 'Este post não existe ou foi removido'}</p>
            <div className="space-x-3">
              <Link href="/forum">
                <RetroButton variant="secondary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Fórum
                </RetroButton>
              </Link>
              <RetroButton onClick={fetchPost}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </RetroButton>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const isPinned = (post as any).is_pinned || false
  const isLocked = (post as any).is_locked || false
  const canEdit = user?.id === post.author.id

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumb */}
        <ForumBreadcrumb 
          items={[
            { label: post.forum.name, href: `/forum/${post.forum.id}` },
            { label: post.title }
          ]} 
        />

        {/* Post Header */}
        <div className="retro-panel p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                {isLocked && <Lock className="w-4 h-4 text-red-500" />}
                <span className="text-xs bg-retro-blue px-2 py-1 rounded text-white">
                  {post.post_type}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-retro-text mb-2">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  por <span className="text-retro-blue">{post.author.nickname}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatRelativeTime(post.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.view_count} visualizações
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <RetroButton size="sm" variant="secondary">
                  <Edit className="w-4 h-4" />
                </RetroButton>
              )}
              <RetroButton size="sm" variant="secondary">
                <Share className="w-4 h-4" />
              </RetroButton>
              <RetroButton size="sm" variant="secondary">
                <Flag className="w-4 h-4" />
              </RetroButton>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href={`/forum/${post.forum.id}`}>
              <RetroButton variant="secondary" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Fórum
              </RetroButton>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Post Content */}
          <div className="lg:col-span-3">
            <div className="retro-panel p-6">
              {/* Post Content */}
              {post.content && (
                <div className="prose prose-invert max-w-none mb-6">
                  <div className="text-retro-text whitespace-pre-line">{post.content}</div>
                </div>
              )}

              {/* Template Data */}
              {post.template_data && Object.keys(post.template_data).length > 0 && (
                <div className="border-t border-slate-600 pt-6 mt-6">
                  <h3 className="text-lg font-bold text-retro-text mb-4">Informações do {post.post_type}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(post.template_data).map(([key, value]) => (
                      <div key={key} className="bg-slate-800/50 p-3 rounded">
                        <div className="text-sm font-medium text-retro-blue mb-1">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-slate-300">
                          {typeof value === 'string' && value.length > 100 ? (
                            <div>
                              {value.substring(0, 100)}...
                              <button className="text-retro-blue ml-2 hover:underline">
                                Ver mais
                              </button>
                            </div>
                          ) : (
                            String(value)
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-600 mt-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`
                      flex items-center gap-1 text-sm transition-colors
                      ${(post as any).user_liked 
                        ? 'text-red-400 hover:text-red-300' 
                        : 'text-slate-400 hover:text-red-400'
                      }
                    `}
                  >
                    {isLiking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Heart className={`w-4 h-4 ${(post as any).user_liked ? 'fill-current' : ''}`} />
                    )}
                    {post.like_count}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-slate-400 hover:text-retro-blue transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    {post.comment_count} comentários
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="retro-panel p-6 text-center">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-retro-text mb-2">
                Seção de Comentários
              </h3>
              <p className="text-slate-400">
                A funcionalidade de comentários será implementada em breve.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Autor</h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-retro-blue to-retro-purple rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  {post.author.nickname.charAt(0).toUpperCase()}
                </div>
                <div className="font-bold text-retro-text">{post.author.nickname}</div>
                <div className="text-xs text-slate-400 mt-2">
                  Post criado em {new Date(post.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            {/* Post Stats */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Estatísticas</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Visualizações:</span>
                  <span className="text-retro-text">{post.view_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Curtidas:</span>
                  <span className="text-retro-text">{post.like_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Comentários:</span>
                  <span className="text-retro-text">{post.comment_count}</span>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Posts Relacionados</h3>
              <div className="text-center text-slate-400 text-sm">
                Funcionalidade em desenvolvimento
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PostDetailPage() {
  return (
    <ProtectedRoute>
      <PostDetailContent />
    </ProtectedRoute>
  )
}