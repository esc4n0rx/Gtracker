// app/dashboard/page.tsx
"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Header } from "@/components/layout/header"
import { ForumCard } from "@/components/ui/forum-card"
import { RetroButton } from "@/components/ui/retro-button"
import { useAuth } from "@/contexts/auth-context"
import {
  FileText,
  Megaphone,
  Lightbulb,
  UserPlus,
  Download,
  Users,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  Activity,
} from "lucide-react"

function DashboardContent() {
  const { user } = useAuth()

  const forumSections = [
    {
      title: "Regras e Diretrizes",
      description: "Leia as regras antes de participar do fórum",
      icon: FileText,
      topicsCount: 5,
      postsCount: 23,
      lastPost: { author: "Admin", time: "2h atrás" },
    },
    {
      title: "Anúncios Oficiais",
      description: "Novidades e atualizações importantes",
      icon: Megaphone,
      topicsCount: 12,
      postsCount: 156,
      lastPost: { author: "Moderador", time: "1d atrás" },
    },
    {
      title: "Sugestões",
      description: "Compartilhe suas ideias para melhorar o fórum",
      icon: Lightbulb,
      topicsCount: 34,
      postsCount: 287,
      lastPost: { author: "UserXYZ", time: "3h atrás" },
    },
    {
      title: "Candidaturas",
      description: "Candidate-se para moderador ou outras posições",
      icon: UserPlus,
      topicsCount: 8,
      postsCount: 45,
      lastPost: { author: "NewUser", time: "5h atrás" },
    },
    {
      title: "Pedidos de Arquivos",
      description: "Solicite conteúdo específico da comunidade",
      icon: Download,
      topicsCount: 89,
      postsCount: 432,
      lastPost: { author: "Seeker123", time: "30min atrás" },
    },
    {
      title: "Apresente-se",
      description: "Novos membros, apresentem-se aqui!",
      icon: Users,
      topicsCount: 156,
      postsCount: 298,
      lastPost: { author: "Newbie2024", time: "1h atrás" },
    },
  ]

  const recentActivity = [
    { user: "TechMaster", action: "postou em", topic: "Novo software de edição", time: "5min" },
    { user: "MovieFan", action: "criou tópico", topic: "Filmes de 2024", time: "15min" },
    { user: "GameLover", action: "respondeu em", topic: "Jogos retrô", time: "23min" },
    { user: "SeriesAddict", action: "curtiu post em", topic: "Séries Netflix", time: "1h" },
  ]

  const topUploaders = [
    { name: "UploadKing", uploads: 1247, rank: 1 },
    { name: "ContentMaster", uploads: 892, rank: 2 },
    { name: "ShareLord", uploads: 756, rank: 3 },
    { name: "FileMaster", uploads: 634, rank: 4 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Banner */}
        <div className="retro-panel p-6 bg-gradient-to-r from-retro-blue/20 to-retro-purple/20 border-retro-blue">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-retro-text mb-2">
                Bem-vindo, {user?.nome}! 🎮
              </h1>
              <p className="text-slate-300">A nostalgia dos fóruns dos anos 2000 com tecnologia moderna</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-slate-400">Cargo:</span>
                <span 
                  className="px-2 py-1 text-xs rounded font-medium"
                  style={{ backgroundColor: user?.role.color, color: '#000' }}
                >
                  {user?.role.display_name}
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <RetroButton>
                <TrendingUp className="w-4 h-4 mr-2" />
                Ver Estatísticas
              </RetroButton>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Forum Sections */}
            <div className="retro-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-retro-text flex items-center gap-2">
                  <Activity className="w-5 h-5 text-retro-blue" />
                  Seções do Fórum
                </h2>
                <RetroButton size="sm" variant="secondary">
                  Ver Todas
                  <ChevronRight className="w-4 h-4 ml-1" />
                </RetroButton>
              </div>

              <div className="grid gap-4">
                {forumSections.map((section, index) => (
                  <ForumCard forum={section as any} key={index} {...section} onClick={() => console.log(`Navigate to ${section.title}`)} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-retro-blue" />
                Atividade Recente
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="text-sm">
                    <div className="text-retro-blue font-medium">{activity.user}</div>
                    <div className="text-slate-400">
                      {activity.action} <span className="text-retro-text">"{activity.topic}"</span>
                    </div>
                    <div className="text-xs text-slate-500">{activity.time} atrás</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Uploaders */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-retro-blue" />
                Top Uploaders
              </h3>
              <div className="space-y-3">
                {topUploaders.map((uploader, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          uploader.rank === 1
                            ? "bg-yellow-500 text-black"
                            : uploader.rank === 2
                              ? "bg-gray-400 text-black"
                              : uploader.rank === 3
                                ? "bg-orange-600 text-white"
                                : "bg-slate-600 text-white"
                        }`}
                      >
                        {uploader.rank}
                      </div>
                      <span className="text-retro-text font-medium">{uploader.name}</span>
                    </div>
                    <span className="text-sm text-slate-400">{uploader.uploads}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Estatísticas</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Membros Online:</span>
                  <span className="text-retro-neon font-bold">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total de Tópicos:</span>
                  <span className="text-retro-text">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total de Posts:</span>
                  <span className="text-retro-text">18,392</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Novos Hoje:</span>
                  <span className="text-green-400">+23</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}