// app/register/page.tsx
"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RetroLogo } from "@/components/ui/retro-logo"
import { RetroButton } from "@/components/ui/retro-button"
import { RetroInput } from "@/components/ui/retro-input"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/toast"
import { registerSchema, RegisterFormData } from "@/lib/validations"
import { User, Mail, Eye, EyeOff, UserPlus, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register: registerUser } = useAuth()
  const { success, error } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    
    try {
      await registerUser(data)
      success('Conta criada com sucesso!', 'Você foi automaticamente conectado.')
      router.push('/dashboard')
    } catch (err) {
      error('Erro ao criar conta', err instanceof Error ? err.message : 'Tente novamente mais tarde')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-retro-purple flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Panel */}
        <div className="retro-panel p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <RetroLogo size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-retro-text">Junte-se ao GTracker!</h1>
              <p className="text-slate-400 text-sm">Crie sua conta e faça parte da comunidade</p>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <RetroInput
                {...register('nome')}
                type="text"
                placeholder="Digite seu nome completo"
                label="Nome Completo"
                error={errors.nome?.message}
                disabled={isLoading}
              />
              <User className="absolute right-3 top-9 w-4 h-4 text-slate-400" />
            </div>

            <div className="relative">
              <RetroInput
                {...register('nickname')}
                type="text"
                placeholder="Digite seu nome de usuário"
                label="Nome de Usuário"
                error={errors.nickname?.message}
                disabled={isLoading}
              />
              <User className="absolute right-3 top-9 w-4 h-4 text-slate-400" />
            </div>

            <div className="relative">
              <RetroInput
                {...register('email')}
                type="email"
                placeholder="Digite seu email"
                label="Email"
                error={errors.email?.message}
                disabled={isLoading}
              />
              <Mail className="absolute right-3 top-9 w-4 h-4 text-slate-400" />
            </div>

            <div className="relative">
              <RetroInput
                {...register('password')}
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                label="Senha"
                error={errors.password?.message}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-300"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <RetroInput
                {...register('confirmPassword')}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                label="Confirmar Senha"
                error={errors.confirmPassword?.message}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-300"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <RetroInput
                {...register('codigo_convite')}
                type="text"
                placeholder="Código de convite (opcional)"
                label="Código de Convite (Opcional)"
                error={errors.codigo_convite?.message}
                disabled={isLoading}
              />
            </div>

            <div className="text-sm">
              <label className="flex items-start space-x-2 text-slate-400">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-600 bg-slate-800 mt-1" 
                  required 
                  disabled={isLoading}
                />
                <span>
                  Eu concordo com os{" "}
                  <Link href="/terms" className="text-retro-blue hover:text-retro-neon transition-colors">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacy" className="text-retro-blue hover:text-retro-neon transition-colors">
                    Política de Privacidade
                  </Link>
                </span>
              </label>
            </div>

            <RetroButton type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Criar Conta
                </>
              )}
            </RetroButton>
          </form>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-slate-600">
            <p className="text-slate-400 text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-retro-blue hover:text-retro-neon transition-colors font-medium">
                Faça login aqui
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-slate-500">
          <p>© 2024 GTracker - Fórum Nostálgico</p>
          <p>Revivendo a era dourada dos fóruns</p>
        </div>
      </div>
    </div>
  )
}