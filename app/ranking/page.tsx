// app/ranking/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { RetroButton } from '@/components/ui/retro-button'
import { LevelBadge } from '@/components/ui/level-badge'
import { UserAvatar } from '@/components/ui/user-avatar'
import { useLevels } from '@/hooks/use-levels'
import { useAuth } from '@/contexts/auth-context'
import {
  Trophy,
  Medal,
  Award,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  Crown,
  Star,
  Loader2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

function RankingContent() {
  const { user } = useAuth()
  const { ranking, rankingPagination, myLevel, isLoading, error, fetchRanking, fetchMyLevel } = useLevels()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchRanking(currentPage, 20)
    fetchMyLevel()
  }, [currentPage, fetchRanking, fetchMyLevel])

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-slate-400">#{position}</span>
    }
  }

  const getRankBgColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-600/20 border-gray-400/30'
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-800/20 border-amber-600/30'
      default:
        return 'bg-slate-800/30 border-slate-600/30'
    }
  }

  const myPosition = ranking.find(u => u.id === user?.id)?.position

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="retro-panel p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-retro-text mb-2">Erro ao carregar ranking</h2>
            <p className="text-slate-400 mb-4">{error}</p>
            <RetroButton onClick={() => fetchRanking(currentPage, 20)}>
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
        {/* Header */}
        <div className="retro-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-retro-text mb-2 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                Ranking de XP
              </h1>
              <p className="text-slate-400">
                Os membros mais ativos da comunidade GTracker
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <RetroButton variant="secondary">
                  Voltar ao Dashboard
                </RetroButton>
              </Link>
              <RetroButton onClick={() => fetchRanking(currentPage, 20)} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </RetroButton>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ranking List */}
          <div className="lg:col-span-2 space-y-4">
            {/* My Position Card */}
            {myLevel && (
              <div className="retro-panel p-6 border-l-4 border-retro-blue">
                <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-retro-blue" />
                  Sua Posição
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {myPosition ? getRankIcon(myPosition) : <span className="text-slate-400">N/A</span>}
                    <UserAvatar userId={user?.id || ''} nickname={user?.nickname || ''} size="md" />
                    <div>
                      <div className="font-bold text-retro-text">{user?.nickname}</div>
                      <div className="text-sm text-slate-400">
                        {myLevel.total_xp.toLocaleString('pt-BR')} XP
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <LevelBadge level={myLevel.level_details} showName size="md" />
                  </div>
                </div>
              </div>
            )}

            {/* Ranking Cards */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-6">Top Usuários</h3>
              
              {isLoading && ranking.length === 0 ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-retro-blue mx-auto mb-4" />
                  <p className="text-slate-400">Carregando ranking...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ranking.map((rankedUser) => (
                    <div
                      key={rankedUser.id}
                      className={`
                        p-4 rounded-lg border transition-all hover:scale-[1.02]
                        ${getRankBgColor(rankedUser.position)}
                        ${rankedUser.id === user?.id ? 'ring-2 ring-retro-blue' : ''}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          {getRankIcon(rankedUser.position)}
                          <UserAvatar 
                            userId={rankedUser.id} 
                            nickname={rankedUser.nickname} 
                            size="md"
                          />
                          <div className="flex-1">
                            <div className="font-bold text-retro-text flex items-center gap-2">
                              {rankedUser.nickname}
                              {rankedUser.id === user?.id && (
                                <span className="text-xs bg-retro-blue px-2 py-0.5 rounded-full text-white">
                                  Você
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-slate-400">
                              {rankedUser.nome}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-retro-text">
                            {rankedUser.total_xp.toLocaleString('pt-BR')} XP
                          </div>
                          <div className="text-sm" style={{ color: rankedUser.level_info.color }}>
                            {rankedUser.level_info.emoji} {rankedUser.level_info.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {rankingPagination && rankingPagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-600">
                  <div className="text-sm text-slate-400">
                    Página {rankingPagination.page} de {rankingPagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <RetroButton
                      size="sm"
                      variant="secondary"
                      disabled={currentPage <= 1 || isLoading}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Anterior
                    </RetroButton>
                    <RetroButton
                      size="sm"
                      variant="secondary"
                      disabled={currentPage >= rankingPagination.totalPages || isLoading}
                      onClick={() => setCurrentPage(prev => Math.min(rankingPagination.totalPages, prev + 1))}
                    >
                      Próxima
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </RetroButton>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top 3 Podium */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Pódio
              </h3>
              <div className="space-y-4">
                {ranking.slice(0, 3).map((topUser, index) => (
                  <div key={topUser.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    <UserAvatar userId={topUser.id} nickname={topUser.nickname} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-retro-text truncate">
                        {topUser.nickname}
                      </div>
                      <div className="text-xs text-slate-400">
                        {topUser.total_xp.toLocaleString('pt-BR')} XP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* XP Stats */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-retro-blue" />
                Estatísticas
              </h3>
              <div className="space-y-3 text-sm">
                {rankingPagination && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total de Usuários:</span>
                      <span className="text-retro-text font-bold">
                        {rankingPagination.total.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    
                    {ranking.length > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Maior XP:</span>
                          <span className="text-retro-neon font-bold">
                            {ranking[0]?.total_xp.toLocaleString('pt-BR')} XP
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-slate-400">Líder Atual:</span>
                          <span className="text-yellow-500 font-bold">
                            {ranking[0]?.nickname}
                          </span>
                        </div>
                      </>
                    )}
                    
                    {myPosition && (
                      <div className="flex justify-between pt-2 border-t border-slate-600">
                        <span className="text-slate-400">Sua Posição:</span>
                        <span className="text-retro-blue font-bold">
                          #{myPosition}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* How to Gain XP */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Como Ganhar XP</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Criar Post:</span>
                  <span className="text-green-400 font-medium">+50 XP</span>
                </div>
                <div className="flex justify-between">
                  <span>Criar Comentário:</span>
                  <span className="text-green-400 font-medium">+20 XP</span>
                </div>
                <div className="flex justify-between">
                  <span>Dar Like:</span>
                  <span className="text-green-400 font-medium">+5 XP</span>
                </div>
                <div className="flex justify-between">
                  <span>Receber Like:</span>
                  <span className="text-green-400 font-medium">+10 XP</span>
                </div>
                <div className="flex justify-between">
                  <span>Post Fixado:</span>
                  <span className="text-green-400 font-medium">+100 XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function RankingPage() {
  return (
    <ProtectedRoute>
      <RankingContent />
    </ProtectedRoute>
  )
}