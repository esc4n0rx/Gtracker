// app/post/new/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PostForm } from '@/components/post/post-form'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/toast'
import { RetroButton } from '@/components/ui/retro-button'
import { ArrowLeft, AlertCircle, Lock } from 'lucide-react'
import Link from 'next/link'

function NewPostContent() {
  const { user } = useAuth()
  const router = useRouter()
  const { error } = useToast()
  const [canPost, setCanPost] = useState(false)

  useEffect(() => {
    if (user?.role) {
      // Verificar se a role é diferente de 'member' ou 'banned'
      const allowedToPost = user.role.name !== 'member' && user.role.name !== 'banned'
      setCanPost(allowedToPost)
      
      if (!allowedToPost) {
        error('Acesso negado', 'Você não tem permissão para criar posts')
      }
    }
  }, [user, error])

  if (!canPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="retro-panel p-8 text-center">
            <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-retro-text mb-4">Acesso Restrito</h2>
            <p className="text-slate-400 mb-6">
              Você não tem permissão para criar posts. Entre em contato com a administração 
              para solicitar permissões de postagem.
            </p>
            <div className="space-x-4">
              <Link href="/forum">
                <RetroButton variant="secondary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Fórum
                </RetroButton>
              </Link>
              <Link href="/chat">
                <RetroButton>
                  Contatar Suporte
                </RetroButton>
              </Link>
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
        {/* Header */}
        <div className="retro-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-retro-text mb-2">Criar Nova Postagem</h1>
              <p className="text-slate-400">
                Compartilhe conteúdo com a comunidade GTracker
              </p>
            </div>
            <Link href="/forum">
              <RetroButton variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Fórum
              </RetroButton>
            </Link>
          </div>
        </div>

        {/* Form */}
        <PostForm />
      </main>
    </div>
  )
}

export default function NewPostPage() {
  return (
    <ProtectedRoute>
      <NewPostContent />
    </ProtectedRoute>
  )
}