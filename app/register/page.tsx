"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { RetroLogo } from "@/components/ui/retro-logo"
import { RetroButton } from "@/components/ui/retro-button"
import { RetroInput } from "@/components/ui/retro-input"
import { User, Mail, Eye, EyeOff, UserPlus } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock register - validação básica
    if (formData.username && formData.email && formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        alert("As senhas não coincidem")
        return
      }
      console.log("Registration successful:", formData)
      // Redireciona para o dashboard
      window.location.href = "/dashboard"
    } else {
      alert("Por favor, preencha todos os campos")
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <RetroInput
                type="text"
                placeholder="Digite seu nome de usuário"
                label="Nome de Usuário"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
              <User className="absolute right-3 top-9 w-4 h-4 text-slate-400" />
            </div>

            <div className="relative">
              <RetroInput
                type="email"
                placeholder="Digite seu email"
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Mail className="absolute right-3 top-9 w-4 h-4 text-slate-400" />
            </div>

            <div className="relative">
              <RetroInput
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                label="Senha"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <RetroInput
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                label="Confirmar Senha"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-300"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-sm">
              <label className="flex items-start space-x-2 text-slate-400">
                <input type="checkbox" className="rounded border-slate-600 bg-slate-800 mt-1" required />
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

            <RetroButton type="submit" className="w-full">
              <UserPlus className="w-4 h-4 mr-2" />
              Criar Conta
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
