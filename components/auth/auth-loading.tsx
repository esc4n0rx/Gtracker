// components/auth/auth-loading.tsx
import { Loader2 } from "lucide-react"
import { RetroLogo } from "@/components/ui/retro-logo"

export function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-retro-purple flex items-center justify-center">
      <div className="text-center space-y-4">
        <RetroLogo size="lg" />
        <div className="flex items-center gap-2 text-retro-text">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    </div>
  )
}