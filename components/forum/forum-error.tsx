// components/forum/forum-error.tsx
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { RetroButton } from '@/components/ui/retro-button'
import Link from 'next/link'

interface ForumErrorProps {
  title?: string
  message: string
  showRetry?: boolean
  showBackToForum?: boolean
  onRetry?: () => void
}

export function ForumError({ 
  title = 'Erro',
  message, 
  showRetry = true, 
  showBackToForum = true,
  onRetry 
}: ForumErrorProps) {
  return (
    <div className="retro-panel p-8 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-retro-text mb-2">{title}</h2>
      <p className="text-slate-400 mb-6">{message}</p>
      <div className="flex items-center justify-center gap-3">
        {showBackToForum && (
          <Link href="/forum">
            <RetroButton variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Fórum
            </RetroButton>
          </Link>
        )}
        {showRetry && onRetry && (
          <RetroButton onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </RetroButton>
        )}
      </div>
    </div>
  )
}