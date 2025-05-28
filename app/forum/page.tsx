// app/forum/page.tsx
"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { RetroButton } from "@/components/ui/retro-button"
import { RetroInput } from "@/components/ui/retro-input"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { CategorySection } from "@/components/forum/category-section"
import { ForumLoading } from "@/components/forum/forum-loading"
import { useForums } from "@/hooks/use-forums"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/toast"
import {
  Search,
  Plus,
  MessageSquare,
  Eye,
  Pin,
  Star,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

function ForumContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const { categories, isLoading, error, refetch } = useForums()
  const { user } = useAuth()
  const { error: showError } = useToast()

  // Calcular estatísticas gerais
  const totalTopics = categories.reduce((sum, category) => 
    sum + category.forums.reduce((forumSum, forum) => forumSum + (forum.topic_count || 0), 0), 0
  )
  
  const totalPosts = categories.reduce((sum, category) => 
    sum + category.forums.reduce((forumSum, forum) => forumSum + (forum.post_count || 0), 0), 0
  )

  const onlineUsers = 127 // Este valor poderia vir de uma API específica

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Implementar busca - redirecionar para página de resultados
      console.log('Pesquisar por:', searchTerm)
    }
  }

  const handleRetry = () => {
    refetch()
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="retro-panel p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-retro-text mb-2">Erro ao carregar fóruns</h2>
            <p className="text-slate-400 mb-4">{error}</p>
            <RetroButton onClick={handleRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </RetroButton>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="retro-panel p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-retro-text mb-2">Fórum GTracker</h1>
              <p className="text-slate-400">Explore todas as categorias e encontre o que procura</p>
            </div>
            <div className="flex gap-3">
              {user?.role?.permissions?.pode_postar && (
                <Link href="/forum/new-topic">
                  <RetroButton>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Tópico
                  </RetroButton>
                </Link>
              )}
              <RetroButton variant="secondary" onClick={handleRetry}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </RetroButton>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="retro-panel p-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <RetroInput
                placeholder="Pesquisar tópicos, usuários ou conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
            </div>
            <RetroButton type="submit">Buscar</RetroButton>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Forum Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Forum Categories */}
            <div className="retro-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-retro-text">Categorias do Fórum</h2>
                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Carregando...</span>
                  </div>
                )}
              </div>

              {isLoading ? (
                <ForumLoading />
              ) : (
                <div className="space-y-4">
                  {categories.length > 0 ? (
                    categories
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((category) => (
                        <CategorySection 
                          key={category.id} 
                          category={category}
                          defaultExpanded={true}
                        />
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-retro-text mb-2">
                        Nenhuma categoria encontrada
                      </h3>
                      <p className="text-slate-400">
                        As categorias do fórum ainda não foram configuradas.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Forum Stats */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Estatísticas do Fórum</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total de Tópicos:</span>
                  <span className="text-retro-text font-bold">
                    {totalTopics.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total de Posts:</span>
                  <span className="text-retro-text font-bold">
                    {totalPosts.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Membros Ativos:</span>
                  <span className="text-green-400 font-bold">{onlineUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Categorias:</span>
                  <span className="text-retro-neon font-bold">{categories.length}</span>
                </div>
              </div>
            </div>

            {/* Online Users */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Usuários Online ({onlineUsers})
              </h3>
              <div className="space-y-2 text-sm">
                {["AdminMaster", "MovieFan2024", "SeriesLover", "GameCracker", "TechGuru"].map((userNick, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-retro-blue">{userNick}</span>
                  </div>
                ))}
                <div className="text-slate-400 text-xs mt-2">+ {onlineUsers - 5} outros usuários</div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Links Rápidos</h3>
              <div className="space-y-2">
                <Link href="/rules" className="block text-retro-blue hover:text-retro-neon transition-colors">
                  📋 Regras do Fórum
                </Link>
                <Link href="/help" className="block text-retro-blue hover:text-retro-neon transition-colors">
                  ❓ Central de Ajuda
                </Link>
                <Link href="/upload" className="block text-retro-blue hover:text-retro-neon transition-colors">
                  📤 Fazer Upload
                </Link>
                <Link href="/forum/search" className="block text-retro-blue hover:text-retro-neon transition-colors">
                  🔍 Busca Avançada
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Atividade Recente</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-slate-400">Novo tópico criado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Pin className="w-3 h-3 text-blue-500" />
                  <span className="text-slate-400">Tópico fixado</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3 h-3 text-green-500" />
                  <span className="text-slate-400">Nova resposta</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ForumPage() {
  return (
    <ProtectedRoute>
      <ForumContent />
    </ProtectedRoute>
  )
}