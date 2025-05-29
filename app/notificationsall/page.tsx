// app/notificationsall/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notificationsApi } from "@/lib/api"; //
import { RetroButton } from "@/components/ui/retro-button"; //
import { useAuth } from "@/contexts/auth-context"; //
import { useToast } from "@/components/ui/toast"; //
import { formatRelativeTime } from "@/lib/forum-utils"; //
import {
  Bell,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCheck,
  Eye,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge"; //

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

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function NotificationsAllPage() {
  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToast(); //
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [pagination, setPagination] = useState<PaginationState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 15; // Quantidade de notificações por página

  const fetchNotifications = useCallback(async (page: number) => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationsApi.getNotifications(page, notificationsPerPage); //
      if (response.success && response.data) {
        setNotifications(response.data.notifications as NotificationItem[]);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || "Falha ao carregar notificações");
        setNotifications([]);
        setPagination(null);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao buscar notificações");
      setNotifications([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, notificationsPerPage]);

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [fetchNotifications, currentPage]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await notificationsApi.markAsRead(notificationId); //
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
        );
        // Poderia atualizar a contagem no header aqui, mas isso será parte do refinamento do header
      } else {
        showError("Erro", response.message || "Não foi possível marcar como lida.");
      }
    } catch (err: any) {
      showError("Erro", err.message || "Erro ao marcar notificação como lida.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationsApi.markAllAsRead(); //
      if (response.success) {
        fetchNotifications(currentPage); // Recarrega para refletir o estado de lido
        success("Sucesso", "Todas as notificações foram marcadas como lidas.");
        // Atualizar contagem no header (parte do refinamento do header)
      } else {
        showError("Erro", response.message || "Não foi possível marcar todas como lidas.");
      }
    } catch (err: any) {
      showError("Erro", err.message || "Erro ao marcar todas as notificações como lidas.");
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.action_url) {
      router.push(notification.action_url);
    }
  };
  
  const getNotificationTypeColor = (type: string) => {
    if (type.includes("like")) return "bg-pink-500";
    if (type.includes("reply")) return "bg-blue-500";
    if (type.includes("mention")) return "bg-purple-500";
    if (type.includes("private_message")) return "bg-teal-500";
    if (type.includes("role") || type.includes("administrative")) return "bg-orange-500";
    return "bg-slate-500";
  };


  return (
    <div className="space-y-6">
      <div className="retro-panel p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-retro-text flex items-center gap-3">
            <Bell className="w-7 h-7 text-retro-blue" />
            Todas as Notificações
          </h1>
          <div className="flex gap-3">
            <Link href="/dashboard" passHref>
                <RetroButton variant="secondary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                </RetroButton>
            </Link>
            {notifications.some(n => !n.is_read) && (
              <RetroButton onClick={handleMarkAllAsRead} disabled={isLoading}>
                <CheckCheck className="w-4 h-4 mr-2" />
                Marcar todas como lidas
              </RetroButton>
            )}
          </div>
        </div>
      </div>

      <div className="retro-panel">
        {isLoading && notifications.length === 0 && (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-retro-blue mx-auto" />
            <p className="mt-3 text-slate-400">Carregando notificações...</p>
          </div>
        )}
        {error && (
          <div className="p-12 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-400">{error}</p>
            <RetroButton onClick={() => fetchNotifications(currentPage)} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2"/>
              Tentar Novamente
            </RetroButton>
          </div>
        )}
        {!isLoading && !error && notifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Você não tem nenhuma notificação no momento.</p>
          </div>
        )}
        {!isLoading && !error && notifications.length > 0 && (
          <ul className="divide-y divide-slate-700">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`p-4 hover:bg-slate-700/30 transition-colors cursor-pointer ${
                  !notif.is_read ? "bg-slate-700/20" : ""
                }`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start gap-4">
                    <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${!notif.is_read ? getNotificationTypeColor(notif.type) : 'bg-slate-600'}`}></div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                                <Badge 
                                    variant="outline" 
                                    className={`text-xs border-none text-white/90 ${getNotificationTypeColor(notif.type)}`}
                                >
                                    {notif.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Badge>
                                <h3 className={`font-medium ${!notif.is_read ? "text-retro-text" : "text-slate-400"}`}>
                                    {notif.title}
                                </h3>
                            </div>
                            <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                                {formatRelativeTime(notif.created_at)}
                            </span>
                        </div>
                        <p className={`text-sm ${!notif.is_read ? "text-slate-300" : "text-slate-500"} line-clamp-2`} title={notif.message}>
                            {notif.related_user?.nickname && <strong className="text-retro-blue">{notif.related_user.nickname}</strong> } {notif.message}
                        </p>
                        {notif.action_url && (
                            <div className="text-xs text-retro-blue hover:underline mt-1">
                                Ver detalhes
                            </div>
                        )}
                    </div>
                    {!notif.is_read && (
                         <button 
                            title="Marcar como lida"
                            onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notif.id); }}
                            className="p-1.5 text-slate-500 hover:text-green-400 transition-colors rounded-full hover:bg-slate-600/50"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    )}
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-700 flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Página {pagination.page} de {pagination.totalPages} (Total: {pagination.total} notificações)
            </span>
            <div className="flex gap-2">
              <RetroButton
                size="sm"
                variant="secondary"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage <= 1 || isLoading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </RetroButton>
              <RetroButton
                size="sm"
                variant="secondary"
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={currentPage >= pagination.totalPages || isLoading}
              >
                Próxima
                <ChevronRight className="w-4 h-4 ml-1" />
              </RetroButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}