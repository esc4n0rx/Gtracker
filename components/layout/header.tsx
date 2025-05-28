"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RetroLogo } from "@/components/ui/retro-logo"
import { RetroButton } from "@/components/ui/retro-button"
import {
  Home,
  MessageSquare,
  FileText,
  Upload,
  Heart,
  MessageCircle,
  Bell,
  Mail,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [notifications] = useState(3)
  const [messages] = useState(7)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const navItems = [
    { label: "Portal", href: "/dashboard", icon: Home },
    { label: "Fórum", href: "/forum", icon: MessageSquare },
    { label: "Regras", href: "/rules", icon: FileText },
    { label: "Postador", href: "/upload", icon: Upload },
    { label: "Doação", href: "/donate", icon: Heart },
    { label: "Chat", href: "/chat", icon: MessageCircle },
  ]

  const handleLogout = () => {
    // Simular logout
    router.push("/login")
  }

  return (
    <header className="retro-panel border-b-4 border-retro-blue shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="hover:scale-105 transition-transform">
            <RetroLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <RetroButton variant="secondary" size="sm" className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </RetroButton>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-retro-neon transition-colors">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </button>

            {/* Messages */}
            <button className="relative p-2 text-slate-400 hover:text-retro-neon transition-colors">
              <Mail className="w-5 h-5" />
              {messages > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {messages}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-400 hover:text-retro-neon transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-700 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-retro-blue to-retro-purple rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-retro-text">Admin</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 retro-panel border-slate-600">
                <DropdownMenuItem className="text-retro-text hover:bg-slate-700">
                  <User className="w-4 h-4 mr-2" />
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="text-retro-text hover:bg-slate-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-600" />
                <DropdownMenuItem className="text-red-400 hover:bg-red-900/20" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-600">
            <nav className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <RetroButton variant="secondary" size="sm" className="w-full flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </RetroButton>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
