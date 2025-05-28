// app/forum/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { RetroButton } from "@/components/ui/retro-button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ForumLoading } from "@/components/forum/forum-loading"
import { forumsApi, Forum, ApiError } from "@/lib/api"
import { useToast } from "@/components/ui/toast"
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

function ForumDetailContent() {
  const params = useParams()
  const forumId = params.id as string
  const [forum, setForum] = useState<Forum | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { error: showError } = useToast()

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
          <div className="retro-panel p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-retro-text mb-2">Fórum não encontrado</h2>
            <p className="text-slate-400 mb-4">{error || 'Este fórum não existe ou foi removido'}</p>
            <div className="space-x-3">
              <Link href="/forum">
                <RetroButton variant="secondary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Fórum
                </RetroButton>
              </Link>
              <RetroButton onClick={fetchForum}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </RetroButton>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/forum" className="hover:text-retro-blue transition-colors">
            Fórum
          </Link>
          <span>›</span>
          <span className="text-retro-text">{forum.name}</span>
        </div>

        {/* Forum Header */}
        <div className="retro-panel p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-retro-text mb-2">{forum.name}</h1>
              {forum.description && (
                <p className="text-slate-400">{forum.description}</p>
              )}
             <div className="flex items-center gap-4 text-sm text-slate-400 mt-2">
            <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {forum.topic_count || 0} tópicos
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {forum.post_count || 0} posts
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/forum">
                <RetroButton variant="secondary" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </RetroButton>
              </Link>
              <Link href={`/forum/${forum.id}/new-topic`}>
                <RetroButton size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Tópico
                </RetroButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Topics List - Por enquanto uma mensagem, depois implementaremos */}
        <div className="retro-panel p-6 text-center">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-retro-text mb-2">
            Lista de Tópicos
          </h3>
          <p className="text-slate-400">
            A listagem de tópicos será implementada na próxima etapa.
          </p>
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