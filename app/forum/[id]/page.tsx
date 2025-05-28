// app/forum/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { RetroButton } from "@/components/ui/retro-button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ForumLoading } from "@/components/forum/forum-loading"
import { ForumError } from "@/components/forum/forum-error"
import { PostList } from "@/components/forum/post-list"
import { ForumBreadcrumb } from "@/components/forum/forum-breadcrumb"
import { forumsApi, Forum, ApiError } from "@/lib/api"
import { useForumPosts } from "@/hooks/use-forum-posts"
import { useToast } from "@/components/ui/toast"
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  RefreshCw,
  AlertCircle,
  Users,
  Eye,
  Calendar,
} from "lucide-react"
import Link from "next/link"

function ForumDetailContent() {
  const params = useParams()
  const forumId = params.id as string
  const [forum, setForum] = useState<Forum | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { error: showError } = useToast()

  // Hook para carregar posts do fórum
  const { 
    posts, 
    pagination, 
    isLoading: loadingPosts, 
    error: postsError,
    refetch: refetchPosts,
    loadPage
  } = useForumPosts(forumId)

  const fetchForum = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await forumsApi.getById(forumId)
      setForum(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao carregar fórum')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (forumId) {
      fetchForum()
    }
  }, [forumId])

  const handleRefresh = () => {
    fetchForum()
    refetchPosts()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <ForumLoading />
        </main>
      </div>
    )
  }

  if (error || !forum) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <ForumError
            title="Fórum não encontrado"
            message={error || 'Este fórum não existe ou foi removido'}
            onRetry={fetchForum}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumb */}
        <ForumBreadcrumb 
          items={[
            { label: forum.name }
          ]} 
        />

        {/* Forum Header */}
        <div className="retro-panel p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-retro-text mb-2">{forum.name}</h1>
              {forum.description && (
                <p className="text-slate-400 mb-4">{forum.description}</p>
              )}
              
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {forum.total_topics || 0} tópicos
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {forum.total_posts || 0} posts
                </span>
                {forum.last_post_at && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Último post: {new Date(forum.last_post_at).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link href="/forum">
                <RetroButton variant="secondary" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </RetroButton>
              </Link>
              <RetroButton size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </RetroButton>
              <Link href="/post/new">
                <RetroButton size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Post
                </RetroButton>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Posts List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Posts Header */}
            <div className="retro-panel p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-retro-text">
                  Posts do Fórum
                </h2>
               <div className="text-sm text-slate-400">
                 {pagination ? `${pagination.total} posts encontrados` : ''}
               </div>
             </div>
           </div>

           {/* Error loading posts */}
           {postsError && (
             <div className="retro-panel p-6 border-l-4 border-red-500">
               <div className="flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                 <div>
                   <h3 className="font-medium text-red-400 mb-1">Erro ao carregar posts</h3>
                   <p className="text-sm text-slate-400">{postsError}</p>
                   <RetroButton 
                     size="sm" 
                     variant="secondary" 
                     onClick={refetchPosts}
                     className="mt-3"
                   >
                     <RefreshCw className="w-4 h-4 mr-2" />
                     Tentar Novamente
                   </RetroButton>
                 </div>
               </div>
             </div>
           )}

           {/* Posts List */}
           <PostList posts={posts} isLoading={loadingPosts} />

           {/* Pagination */}
           {pagination && pagination.totalPages > 1 && (
             <div className="retro-panel p-4">
               <div className="flex items-center justify-between">
                 <div className="text-sm text-slate-400">
                   Página {pagination.page} de {pagination.totalPages}
                 </div>
                 <div className="flex gap-2">
                   <RetroButton
                     size="sm"
                     variant="secondary"
                     disabled={pagination.page <= 1}
                     onClick={() => loadPage(pagination.page - 1)}
                   >
                     Anterior
                   </RetroButton>
                   <RetroButton
                     size="sm"
                     variant="secondary"
                     disabled={pagination.page >= pagination.totalPages}
                     onClick={() => loadPage(pagination.page + 1)}
                   >
                     Próxima
                   </RetroButton>
                 </div>
               </div>
             </div>
           )}
         </div>

         {/* Sidebar */}
         <div className="space-y-6">
           {/* Forum Stats */}
           <div className="retro-panel p-6">
             <h3 className="text-lg font-bold text-retro-text mb-4">Estatísticas</h3>
             <div className="space-y-3 text-sm">
               <div className="flex justify-between">
                 <span className="text-slate-400">Total de Tópicos:</span>
                 <span className="text-retro-text font-bold">{forum.total_topics || 0}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-400">Total de Posts:</span>
                 <span className="text-retro-text font-bold">{forum.total_posts || 0}</span>
               </div>
               {forum.last_post_at && (
                 <div className="flex justify-between">
                   <span className="text-slate-400">Último Post:</span>
                   <span className="text-retro-blue text-xs">
                     {new Date(forum.last_post_at).toLocaleDateString('pt-BR')}
                   </span>
                 </div>
               )}
             </div>
           </div>

           {/* Quick Actions */}
           <div className="retro-panel p-6">
             <h3 className="text-lg font-bold text-retro-text mb-4">Ações Rápidas</h3>
             <div className="space-y-3">
               <Link href="/post/new" className="block">
                 <RetroButton className="w-full">
                   <Plus className="w-4 h-4 mr-2" />
                   Criar Novo Post
                 </RetroButton>
               </Link>
               <Link href="/forum" className="block">
                 <RetroButton variant="secondary" className="w-full">
                   <ArrowLeft className="w-4 h-4 mr-2" />
                   Voltar ao Fórum
                 </RetroButton>
               </Link>
             </div>
           </div>

           {/* Forum Rules */}
           <div className="retro-panel p-6">
             <h3 className="text-lg font-bold text-retro-text mb-4">Regras do Fórum</h3>
             <div className="space-y-2 text-sm text-slate-400">
               <p>• Mantenha as postagens na categoria correta</p>
               <p>• Use títulos descritivos</p>
               <p>• Não faça postagens duplicadas</p>
               <p>• Seja respeitoso com outros membros</p>
               <p>• Siga as regras gerais do fórum</p>
             </div>
           </div>

           {/* Recent Activity */}
           <div className="retro-panel p-6">
             <h3 className="text-lg font-bold text-retro-text mb-4">Atividade Recente</h3>
             {posts.length > 0 ? (
               <div className="space-y-3">
                 {posts.slice(0, 3).map((post) => (
                   <Link key={post.id} href={`/forum/post/${post.slug}`}>
                     <div className="text-sm hover:bg-slate-700/30 p-2 rounded transition-colors">
                       <div className="text-retro-blue font-medium truncate">
                         {post.title}
                       </div>
                       <div className="text-xs text-slate-400 mt-1">
                         por {post.author.nickname} • {new Date(post.created_at).toLocaleDateString('pt-BR')}
                       </div>
                     </div>
                   </Link>
                 ))}
               </div>
             ) : (
               <div className="text-sm text-slate-400">
                 Nenhuma atividade recente
               </div>
             )}
           </div>
         </div>
       </div>
     </main>
   </div>
 )
}

export default function ForumDetailPage() {
 return (
   <ProtectedRoute>
     <ForumDetailContent />
   </ProtectedRoute>
 )
}