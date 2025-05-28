"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { RetroButton } from "@/components/ui/retro-button"
import {
  ArrowLeft,
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Quote,
  Flag,
  Share,
  Pin,
  Lock,
  Star,
  Calendar,
  User,
} from "lucide-react"
import Link from "next/link"

export default function TopicPage({ params }: { params: { id: string } }) {
  const [replyText, setReplyText] = useState("")

  const topic = {
    id: params.id,
    title: "🔥 MEGA PACK - Filmes 2024 Completo",
    category: "Filmes",
    author: "AdminMaster",
    createdAt: "15 de Janeiro, 2024",
    views: 5678,
    replies: 234,
    isPinned: true,
    isLocked: false,
  }

  const posts = [
    {
      id: 1,
      author: "AdminMaster",
      avatar: "AM",
      rank: "Administrador",
      joinDate: "Jan 2020",
      posts: 2847,
      reputation: 9999,
      content: `Pessoal, estou disponibilizando um mega pack com os melhores filmes de 2024!

**Conteúdo incluído:**
- Todos os lançamentos de 2024
- Qualidade 4K e 1080p
- Legendas em português
- Organizados por gênero

**Como baixar:**
1. Faça login no sistema
2. Clique no link abaixo
3. Use o password: gtracker2024

[DOWNLOAD AQUI] - Link protegido

**Importante:** Respeitem as regras do fórum e não compartilhem os links externamente.

Aproveitem! 🎬`,
      timestamp: "2h atrás",
      likes: 45,
      dislikes: 2,
    },
    {
      id: 2,
      author: "MovieFan2024",
      avatar: "MF",
      rank: "Membro VIP",
      joinDate: "Mar 2023",
      posts: 567,
      reputation: 1234,
      content: `Cara, muito obrigado pelo pack! 

Já baixei alguns filmes e a qualidade está perfeita. Os filmes de ação estão sensacionais, principalmente o novo filme do Marvel.

Uma pergunta: vocês vão atualizar com os lançamentos de fevereiro também?`,
      timestamp: "1h atrás",
      likes: 12,
      dislikes: 0,
    },
    {
      id: 3,
      author: "CinemaLover",
      avatar: "CL",
      rank: "Membro",
      joinDate: "Nov 2023",
      posts: 89,
      reputation: 234,
      content: `Excelente trabalho! 👏

A organização está impecável. Consegui encontrar tudo que estava procurando rapidamente.

Sugestão: que tal criar uma seção separada para documentários? Seria muito útil!`,
      timestamp: "45min atrás",
      likes: 8,
      dislikes: 1,
    },
  ]

  const handleReply = () => {
    if (replyText.trim()) {
      console.log("Nova resposta:", replyText)
      setReplyText("")
      alert("Resposta enviada com sucesso!")
    }
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
          <Link href="/forum/category/filmes" className="hover:text-retro-blue transition-colors">
            {topic.category}
          </Link>
          <span>›</span>
          <span className="text-retro-text">{topic.title}</span>
        </div>

        {/* Topic Header */}
        <div className="retro-panel p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {topic.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                {topic.isLocked && <Lock className="w-4 h-4 text-red-500" />}
                <span className="text-xs bg-retro-blue px-2 py-1 rounded text-white">{topic.category}</span>
              </div>
              <h1 className="text-2xl font-bold text-retro-text mb-2">{topic.title}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  por {topic.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {topic.createdAt}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {topic.views} visualizações
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {topic.replies} respostas
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <RetroButton size="sm" variant="secondary">
                <Share className="w-4 h-4" />
              </RetroButton>
              <RetroButton size="sm" variant="secondary">
                <Flag className="w-4 h-4" />
              </RetroButton>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/forum">
              <RetroButton variant="secondary" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Fórum
              </RetroButton>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Posts */}
          <div className="lg:col-span-3 space-y-4">
            {posts.map((post, index) => (
              <div key={post.id} className="retro-panel p-6">
                <div className="flex gap-4">
                  {/* User Info */}
                  <div className="flex-shrink-0 w-32">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-gradient-to-br from-retro-blue to-retro-purple rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto">
                        {post.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-retro-text">{post.author}</div>
                        <div className="text-xs text-retro-blue">{post.rank}</div>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>Membro desde: {post.joinDate}</div>
                        <div>Posts: {post.posts}</div>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {post.reputation}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-slate-400">#{index + 1}</span>
                      <span className="text-sm text-slate-400">{post.timestamp}</span>
                    </div>

                    <div className="prose prose-invert max-w-none mb-4">
                      <div className="text-retro-text whitespace-pre-line">{post.content}</div>
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-600">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-slate-400 hover:text-green-400 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1 text-sm text-slate-400 hover:text-red-400 transition-colors">
                          <ThumbsDown className="w-4 h-4" />
                          {post.dislikes}
                        </button>
                        <button className="flex items-center gap-1 text-sm text-slate-400 hover:text-retro-blue transition-colors">
                          <Quote className="w-4 h-4" />
                          Citar
                        </button>
                      </div>
                      <button className="text-sm text-slate-400 hover:text-red-400 transition-colors">
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Reply Form */}
            {!topic.isLocked && (
              <div className="retro-panel p-6">
                <h3 className="text-lg font-bold text-retro-text mb-4">Responder ao Tópico</h3>
                <div className="space-y-4">
                  <textarea
                    className="retro-input w-full h-32 resize-none"
                    placeholder="Digite sua resposta..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-between">
                    <div className="text-sm text-slate-400">Lembre-se de seguir as regras do fórum</div>
                    <RetroButton onClick={handleReply}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Enviar Resposta
                    </RetroButton>
                  </div>
                </div>
              </div>
            )}

            {topic.isLocked && (
              <div className="retro-panel p-6 text-center">
                <Lock className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-slate-400">Este tópico foi fechado para novas respostas.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Topic Stats */}
            <div className="retro-panel p-4">
              <h3 className="font-bold text-retro-text mb-3">Estatísticas</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Visualizações:</span>
                  <span className="text-retro-text">{topic.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Respostas:</span>
                  <span className="text-retro-text">{topic.replies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Participantes:</span>
                  <span className="text-retro-text">12</span>
                </div>
              </div>
            </div>

            {/* Similar Topics */}
            <div className="retro-panel p-4">
              <h3 className="font-bold text-retro-text mb-3">Tópicos Similares</h3>
              <div className="space-y-2">
                {["Filmes de Terror 2024", "Coletânea Marvel Completa", "Documentários Netflix"].map((title, index) => (
                  <Link
                    key={index}
                    href={`/forum/topic/${index + 10}`}
                    className="block text-sm text-retro-blue hover:text-retro-neon transition-colors"
                  >
                    {title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
