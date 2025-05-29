// components/layout/header.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RetroLogo } from "@/components/ui/retro-logo"
import { RetroButton } from "@/components/ui/retro-button"
import { useAuth } from "@/contexts/auth-context"
import { UserAvatar } from '@/components/ui/user-avatar'
import { notificationsApi, ApiResponse } from "@/lib/api"
import { useRealtime } from "@/contexts/realtime-context" // Usar o novo contexto
import {
  Home,
  MessageSquare,
  FileText,
  Upload,
  Heart,
  MessageCircle,
  Mail,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Loader2,
  CheckCheck,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { formatRelativeTime } from "@/lib/forum-utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface NotificationItem { //
  id: string;
  type: string;
  title: string;
  message: string;
  action_url: string | null;
  is_read: boolean;
  created_at: string;
  related_user?: { id: string; nickname: string; nome: string };
}

export function Header() {
  // Usar contagens do contexto em tempo real
  const { 
    unreadMessagesCount, 
    unreadNotificationsCount, 
    fetchInitialCounts,
    decrementNotificationCount // Para usar ao marcar como lida
  } = useRealtime(); 
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const canPost = user?.role?.permissions?.pode_postar

  const navItems = [
    { label: "Portal", href: "/dashboard", icon: Home },
    { label: "Fórum", href: "/forum", icon: MessageSquare },
    { label: "Regras", href: "/rules", icon: FileText },
    ...(canPost ? [{ label: "Postador", href: "/post/new", icon: Upload }] : []),
    { label: "Doação", href: "/donate", icon: Heart },
    { label: "Chat", href: "/chat", icon: MessageCircle },
  ]

  useEffect(() => {
    // O RealtimeProvider agora cuida da busca inicial das contagens após a conexão.
    // Mas podemos chamar fetchInitialCounts se necessário em algum momento específico,
    // por exemplo, ao reabrir a aba do navegador.
    if (isAuthenticated) {
        fetchInitialCounts();
    }
  }, [isAuthenticated, fetchInitialCounts]);


  const fetchNotificationsDropdown = async () => {
    if (!isAuthenticated) return;
    setIsLoadingNotifications(true);
    try {
      // Buscar as 10 mais recentes, incluindo lidas, para preencher o dropdown
      const response = await notificationsApi.getNotifications(1, 10, false); //
      if (response.success && response.data) {
        setNotifications(response.data.notifications as NotificationItem[]);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Erro ao buscar notificações para dropdown:", error);
      setNotifications([]);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    const wasUnread = notification && !notification.is_read;

    try {
      await notificationsApi.markAsRead(notificationId); //
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
      if (wasUnread) {
        decrementNotificationCount(); // Decrementa a contagem global
      }
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };
  
  const handleMarkAllNotificationsAsRead = async () => {
    const unreadCountInDropdown = notifications.filter(n => !n.is_read).length;
    try {
      await notificationsApi.markAllAsRead(); //
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      decrementNotificationCount(unreadCountInDropdown); // Decrementa pelo número que estava no dropdown
      // Para ser mais preciso, deveria chamar fetchInitialCounts() para pegar o valor exato do backend
      fetchInitialCounts(); 
    } catch (error) {
      console.error("Erro ao marcar todas as notificações como lidas:", error);
    }
  };

  const handleLogout = () => {
    logout() // O RealtimeProvider deve detectar !isAuthenticated e desconectar o socket.
    router.push("/login")
  }
  
  const getNotificationTypeColor = (type: string) => {
    if (type.includes("like")) return "bg-pink-500";
    if (type.includes("reply")) return "bg-blue-500";
    if (type.includes("mention")) return "bg-purple-500";
    if (type.includes("private_message")) return "bg-teal-500";
    if (type.includes("role") || type.includes("administrative")) return "bg-orange-500";
    return "bg-slate-500";
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
            {/* Notifications Dropdown */}
            <DropdownMenu onOpenChange={(open) => { if (open) fetchNotificationsDropdown()}}>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 text-slate-400 hover:text-retro-neon transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 md:w-96 retro-panel border-slate-600 bg-slate-800 text-retro-text p-0"
              >
                <DropdownMenuLabel className="flex justify-between items-center p-3 border-b border-slate-600">
                  Notificações
                  {notifications.some(n => !n.is_read) && ( // Mostrar botão apenas se houver não lidas no dropdown
                    <RetroButton variant="secondary" size="sm" className="h-auto py-1 px-2 text-xs" onClick={handleMarkAllNotificationsAsRead}>
                        <CheckCheck className="w-3 h-3 mr-1" /> Marcar todas como lidas
                    </RetroButton>
                  )}
                </DropdownMenuLabel>
                <ScrollArea className="h-[300px] md:h-[400px]">
                  {isLoadingNotifications ? (
                    <div className="flex items-center justify-center h-full p-4">
                      <Loader2 className="w-6 h-6 animate-spin text-retro-blue" />
                      <span className="ml-2 text-slate-400">Carregando...</span>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center p-6 text-slate-400 text-sm">
                      Nenhuma notificação.
                    </div>
                  ) : (
                    <DropdownMenuGroup>
                      {notifications.map((notif) => (
                        <DropdownMenuItem
                          key={notif.id}
                          className={`cursor-pointer hover:bg-slate-700/50 p-3 border-b border-slate-700/50 last:border-b-0 ${!notif.is_read ? 'bg-slate-700/30' : ''}`}
                          onSelect={(e) => {
                            e.preventDefault();
                            if (notif.action_url) router.push(notif.action_url);
                            if (!notif.is_read) handleMarkNotificationAsRead(notif.id);
                          }}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.is_read ? getNotificationTypeColor(notif.type) : 'bg-slate-600'}`}></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                 <Badge
                                    variant="outline"
                                    className={`text-xs border-none text-white/90 mb-1 ${getNotificationTypeColor(notif.type)}`}
                                >
                                  {notif.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Badge>
                                <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                                  {formatRelativeTime(notif.created_at)}
                                </span>
                              </div>
                              <p className={`text-sm font-medium mb-0.5 ${!notif.is_read ? 'text-retro-text' : 'text-slate-400'}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-slate-400 truncate" title={notif.message}>
                                {notif.related_user?.nickname && <strong className="text-retro-blue">{notif.related_user.nickname}</strong>} {notif.message}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  )}
                </ScrollArea>
                 <DropdownMenuSeparator className="bg-slate-600 my-0" />
                <DropdownMenuItem
                    className="cursor-pointer hover:bg-slate-700/50 p-3 text-center text-sm text-retro-blue"
                    onSelect={() => router.push("/notificationsall")}
                >
                  Ver todas as notificações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Private Messages Link */}
            <Link href="/messages" passHref>
              <button className="relative p-2 text-slate-400 hover:text-retro-neon transition-colors">
                <Mail className="w-5 h-5" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-400 hover:text-retro-neon transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            {user && (
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
                  <Link href="/profile" passHref>
                    <DropdownMenuItem className="text-retro-text hover:bg-slate-700 cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Meu Perfil
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings" passHref>
                    <DropdownMenuItem className="text-retro-text hover:bg-slate-700 cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações
                    </DropdownMenuItem>
                  </Link>
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
            )}
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