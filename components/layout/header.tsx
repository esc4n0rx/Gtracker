// components/layout/header.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RetroLogo } from "@/components/ui/retro-logo"
import { RetroButton } from "@/components/ui/retro-button"
import { useAuth } from "@/contexts/auth-context"
import { UserAvatar } from '@/components/ui/user-avatar'
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
  const { user, logout } = useAuth()
  const canPost = user?.role?.name !== 'member' && user?.role?.name !== 'banned'

  const navItems = [
    { label: "Portal", href: "/dashboard", icon: Home },
    { label: "Fórum", href: "/forum", icon: MessageSquare },
    { label: "Regras", href: "/rules", icon: FileText },
    ...(canPost ? [{ label: "Postador", href: "/post/new", icon: Upload }] : []),
    { label: "Doação", href: "/donate", icon: Heart },
    { label: "Chat", href: "/chat", icon: MessageCircle },
  ]

  const handleLogout = () => {
    logout()
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
                  <UserAvatar 
                    userId={user?.id}
                    nickname={user?.nickname}
                    size="sm"
                    showStatus={true}
                  />
                  <span className="hidden md:block text-sm font-medium text-retro-text">
                    {user?.nickname || 'Usuário'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 retro-panel border-slate-600 bg-slate-800 text-retro-text"
              >
                <div className="px-3 py-2 border-b border-slate-600">
                  <p className="text-sm font-medium text-retro-text">{user?.nome}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                  <span 
                    className="inline-block mt-1 px-2 py-0.5 text-xs rounded" 
                    style={{ backgroundColor: user?.role.color, color: '#000' }}
                  >
                    {user?.role.display_name}
                  </span>
                </div>
                <Link href="/profile">
                  <DropdownMenuItem className="text-retro-text hover:bg-slate-700 cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Meu Perfil
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="text-retro-text hover:bg-slate-700 cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-600" />
                <DropdownMenuItem 
                  className="text-red-400 hover:bg-red-900/20 cursor-pointer" 
                  onClick={handleLogout}
                >
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