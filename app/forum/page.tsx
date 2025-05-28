"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { RetroButton } from "@/components/ui/retro-button"
import { RetroInput } from "@/components/ui/retro-input"
import {
  Film,
  Tv,
  Gamepad2,
  Monitor,
  FileText,
  Music,
  Search,
  Plus,
  MessageSquare,
  Eye,
  ChevronDown,
  ChevronRight,
  Pin,
  Lock,
  Star,
} from "lucide-react"
import Link from "next/link"

export default function ForumPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["http", "especiais"])

  const forumCategories = [
    {
      id: "http",
      title: "HTTP Downloads",
      icon: Monitor,
      subcategories: [
        {
          name: "Filmes",
          icon: Film,
          topics: 1247,
          posts: 8934,
          lastPost: { author: "MovieMaster", topic: "Novos lançamentos 2024", time: "5min atrás" },
        },
        {
          name: "Séries",
          icon: Tv,
          topics: 892,
          posts: 5621,
          lastPost: { author: "SeriesFan", topic: "Breaking Bad Completo", time: "15min atrás" },
        },
        {
          name: "Jogos",
          icon: Gamepad2,
          topics: 634,
          posts: 3456,
          lastPost: { author: "GamerPro", topic: "FIFA 2024 Crackeado", time: "1h atrás" },
        },
        {
          name: "Software",
          icon: Monitor,
          topics: 445,
          posts: 2134,
          lastPost: { author: "TechGuru", topic: "Adobe CC 2024", time: "2h atrás" },
        },
        {
          name: "Documentários",
          icon: FileText,
          topics: 234,
          posts: 1567,
          lastPost: { author: "DocLover", topic: "National Geographic", time: "3h atrás" },
        },
        {
          name: "Animes",
          icon: Star,
          topics: 567,
          posts: 4321,
          lastPost: { author: "OtakuMaster", topic: "One Piece Episódios", time: "30min atrás" },
        },
        {
          name: "Música",
          icon: Music,
          topics: 789,
          posts: 3245,
          lastPost: { author: "MusicFan", topic: "Top Hits 2024", time: "45min atrás" },
        },
      ],
    },
    {
      id: "especiais",
      title: "Seções Especiais",
      icon: Star,
      subcategories: [
        {
          name: "Big Brother Brasil",
          icon: Tv,
          topics: 156,
          posts: 2341,
          lastPost: { author: "BBBFan", topic: "BBB 24 Episódios", time: "1h atrás" },
        },
        {
          name: "Natal 2024",
          icon: Star,
          topics: 45,
          posts: 234,
          lastPost: { author: "ChristmasLover", topic: "Filmes de Natal", time: "2d atrás" },
        },
      ],
    },
  ]

  const featuredTopics = [
    {
      id: 1,
      title: "🔥 MEGA PACK - Filmes 2024 Completo",
      author: "AdminMaster",
      replies: 234,
      views: 5678,
      lastReply: "2min atrás",
      isPinned: true,
      isLocked: false,
      category: "Filmes",
    },
    {
      id: 2,
      title: "📺 Séries Netflix Atualizadas Diariamente",
      author: "SeriesBot",
      replies: 156,
      views: 3421,
      lastReply: "10min atrás",
      isPinned: true,
      isLocked: false,
      category: "Séries",
    },
    {
      id: 3,
      title: "🎮 Jogos PC Crackeados - Lista Atualizada",
      author: "GameCracker",
      replies: 89,
      views: 2134,
      lastReply: "1h atrás",
      isPinned: false,
      isLocked: true,
      category: "Jogos",
    },
  ]

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
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
              <RetroButton>
                <Plus className="w-4 h-4 mr-2" />
                Novo Tópico
              </RetroButton>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="retro-panel p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <RetroInput
                placeholder="Pesquisar tópicos, usuários ou conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
            </div>
            <RetroButton>Buscar</RetroButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Forum Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Topics */}
            <div className="retro-panel p-6">
              <h2 className="text-xl font-bold text-retro-text mb-4 flex items-center gap-2">
                <Pin className="w-5 h-5 text-yellow-500" />
                Tópicos em Destaque
              </h2>
              <div className="space-y-3">
                {featuredTopics.map((topic) => (
                  <Link key={topic.id} href={`/forum/topic/${topic.id}`}>
                    <div className="forum-card p-4 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {topic.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                            {topic.isLocked && <Lock className="w-4 h-4 text-red-500" />}
                            <span className="text-xs bg-retro-blue px-2 py-1 rounded text-white">{topic.category}</span>
                          </div>
                          <h3 className="text-retro-text font-medium mb-1">{topic.title}</h3>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>por {topic.author}</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {topic.replies}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {topic.views}
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-xs text-slate-400">
                          <div>Última resposta</div>
                          <div className="text-retro-blue">{topic.lastReply}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Forum Categories */}
            <div className="retro-panel p-6">
              <h2 className="text-xl font-bold text-retro-text mb-6">Categorias do Fórum</h2>
              <div className="space-y-4">
                {forumCategories.map((category) => (
                  <div key={category.id} className="border border-slate-600 rounded-lg overflow-hidden">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full p-4 bg-gradient-to-r from-retro-blue/20 to-retro-purple/20 hover:from-retro-blue/30 hover:to-retro-purple/30 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className="w-6 h-6 text-retro-blue" />
                        <span className="text-lg font-bold text-retro-text">{category.title}</span>
                      </div>
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    {/* Subcategories */}
                    {expandedCategories.includes(category.id) && (
                      <div className="bg-slate-800/50">
                        {category.subcategories.map((sub, index) => (
                          <Link key={index} href={`/forum/category/${sub.name.toLowerCase()}`}>
                            <div className="p-4 border-t border-slate-600 hover:bg-slate-700/50 transition-colors cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <sub.icon className="w-5 h-5 text-retro-blue" />
                                  <div>
                                    <h3 className="font-medium text-retro-text">{sub.name}</h3>
                                    <div className="text-xs text-slate-400">
                                      {sub.topics} tópicos • {sub.posts} posts
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right text-xs text-slate-400">
                                  <div className="text-retro-blue">{sub.lastPost.author}</div>
                                  <div>"{sub.lastPost.topic}"</div>
                                  <div>{sub.lastPost.time}</div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                  <span className="text-retro-text font-bold">4,567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total de Posts:</span>
                  <span className="text-retro-text font-bold">28,934</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Membros Ativos:</span>
                  <span className="text-green-400 font-bold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Novos Hoje:</span>
                  <span className="text-retro-neon font-bold">+47</span>
                </div>
              </div>
            </div>

            {/* Online Users */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Usuários Online (127)
              </h3>
              <div className="space-y-2 text-sm">
                {["AdminMaster", "MovieFan2024", "SeriesLover", "GameCracker", "TechGuru"].map((user, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-retro-blue">{user}</span>
                  </div>
                ))}
                <div className="text-slate-400 text-xs mt-2">+ 122 outros usuários</div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Links Rápidos</h3>
              <div className="space-y-2">
                <Link href="/forum/rules" className="block text-retro-blue hover:text-retro-neon transition-colors">
                  📋 Regras do Fórum
                </Link>
                <Link href="/forum/help" className="block text-retro-blue hover:text-retro-neon transition-colors">
                  ❓ Central de Ajuda
                </Link>
                <Link href="/upload" className="block text-retro-blue hover:text-retro-neon transition-colors">
                  📤 Fazer Upload
                </Link>
                <Link href="/requests" className="block text-retro-blue hover:text-retro-neon transition-colors">
                  🔍 Fazer Pedido
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
