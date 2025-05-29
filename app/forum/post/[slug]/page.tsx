// app/forum/post/[slug]/page.tsx (atualizar)
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { RetroButton } from "@/components/ui/retro-button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ForumBreadcrumb } from "@/components/forum/forum-breadcrumb"
import { TMDBDisplay } from "@/components/post/tmdb-display"
import { TemplateDisplay } from "@/components/post/template-display"
import { CommentsSection } from "@/components/post/comments-section"
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
 const hasTmdbId = post.template_data?.tmdb_id
 const isMediaContent = post.post_type === 'filme' || post.post_type === 'série'

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
               <span className="px-3 py-1 text-xs rounded-full text-white bg-gradient-to-r from-retro-blue to-retro-purple">
                 {post.post_type.charAt(0).toUpperCase() + post.post_type.slice(1)}
               </span>
             </div>
             <h1 className="text-3xl font-bold text-retro-text mb-3">{post.title}</h1>
             <div className="flex items-center gap-6 text-sm text-slate-400">
               <span className="flex items-center gap-1">
                 <User className="w-4 h-4" />
                 por <span className="text-retro-blue font-medium">{post.author.nickname}</span>
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
         <div className="lg:col-span-3 space-y-6">
           {isMediaContent && hasTmdbId && (
             <TMDBDisplay
               tmdbId={post.template_data?.tmdb_id}
               mediaType={post.post_type === 'filme' ? 'movie' : 'tv'}
               title={post.title}
             />
           )}

           {/* Post Description */}
           {post.content && (
             <div className="retro-panel p-6">
               <h3 className="text-lg font-bold text-retro-text mb-4">Descrição</h3>
               <div className="prose prose-invert max-w-none">
                 <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                   {post.content}
                 </div>
               </div>
             </div>
           )}

           {/* Template Data Display */}
           {post.template_data && Object.keys(post.template_data).length > 0 && (
             <div className="retro-panel p-6">
               <TemplateDisplay
                 postType={post.post_type}
                 templateData={post.template_data}
               />
             </div>
           )}

           {/* Post Actions */}
           <div className="retro-panel p-6">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-6">
                 <button
                   onClick={handleLike}
                   disabled={isLiking}
                   className={`
                     flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                     ${(post as any).user_liked 
                       ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                       : 'bg-slate-700/30 text-slate-400 border border-slate-600 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                     }
                   `}
                 >
                   {isLiking ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                   ) : (
                     <Heart className={`w-5 h-5 ${(post as any).user_liked ? 'fill-current' : ''}`} />
                   )}
                   <span className="font-medium">{post.like_count}</span>
                   <span className="hidden sm:inline">
                     {(post as any).user_liked ? 'Curtido' : 'Curtir'}
                   </span>
                 </button>

                 <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-lg border border-slate-600">
                   <MessageSquare className="w-5 h-5 text-slate-400" />
                   <span className="font-medium text-retro-text">{post.comment_count}</span>
                   <span className="hidden sm:inline text-slate-400">comentários</span>
                 </div>
               </div>

               <div className="text-sm text-slate-400">
                 Última atualização: {formatRelativeTime(post.updated_at)}
               </div>
             </div>
           </div>

           {/* Comments Section */}
           <CommentsSection postId={post.id} />
         </div>

         {/* Sidebar */}
         <div className="space-y-6">
           {/* Author Info */}
           <div className="retro-panel p-6">
             <h3 className="text-lg font-bold text-retro-text mb-4">Autor</h3>
             <div className="text-center">
               <div className="w-16 h-16 bg-gradient-to-br from-retro-blue to-retro-purple rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                 {post.author.nickname.charAt(0).toUpperCase()}
               </div>
               <div className="font-bold text-retro-text text-lg">{post.author.nickname}</div>
               <div className="text-xs text-slate-400 mt-2">
                 Membro desde sempre
               </div>
               <div className="text-xs text-slate-400 mt-1">
                 Post criado em {new Date(post.created_at).toLocaleDateString('pt-BR')}
               </div>
             </div>
           </div>

           {/* Post Stats */}
           <div className="retro-panel p-6">
             <h3 className="text-lg font-bold text-retro-text mb-4">Estatísticas</h3>
             <div className="space-y-3">
               <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                 <div className="flex items-center gap-2">
                   <Eye className="w-4 h-4 text-blue-400" />
                   <span className="text-slate-400">Visualizações</span>
                 </div>
                 <span className="text-retro-text font-bold">{post.view_count}</span>
               </div>
               
               <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                 <div className="flex items-center gap-2">
                   <Heart className="w-4 h-4 text-red-400" />
                   <span className="text-slate-400">Curtidas</span>
                 </div>
                 <span className="text-retro-text font-bold">{post.like_count}</span>
               </div>
               
               <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                 <div className="flex items-center gap-2">
                   <MessageSquare className="w-4 h-4 text-green-400" />
                   <span className="text-slate-400">Comentários</span>
                 </div>
                 <span className="text-retro-text font-bold">{post.comment_count}</span>
               </div>
             </div>
           </div>

           {/* Share Options */}
           <div className="retro-panel p-6">
             <h3 className="text-lg font-bold text-retro-text mb-4">Compartilhar</h3>
             <div className="space-y-2">
               <button
                 onClick={() => {
                   navigator.clipboard.writeText(window.location.href)
                   success('Link copiado!', 'URL copiada para a área de transferência')
                 }}
                 className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700/30 transition-colors text-retro-blue"
               >
                 📋 Copiar Link
               </button>
               <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700/30 transition-colors text-retro-blue">
                 🔗 Compartilhar no Chat
               </button>
             </div>
           </div>

           {/* Quick Actions */}
           <div className="retro-panel p-6">
             <h3 className="text-lg font-bold text-retro-text mb-4">Ações Rápidas</h3>
             <div className="space-y-3">
               <Link href="/post/new" className="block">
                 <RetroButton size="sm" className="w-full">
                   Criar Novo Post
                 </RetroButton>
               </Link>
               <Link href={`/forum/${post.forum.id}`} className="block">
                 <RetroButton size="sm" variant="secondary" className="w-full">
                   Ver Mais Posts
                 </RetroButton>
               </Link>
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