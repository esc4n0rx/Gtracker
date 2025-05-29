// app/messages/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { messagesApi } from "@/lib/api";
import { UserAvatar } from "@/components/ui/user-avatar"; //
import { RetroButton } from "@/components/ui/retro-button"; //
import { useAuth } from "@/contexts/auth-context"; //
import { useRealtime } from "@/contexts/realtime-context"; // Para decrementar contagem ao abrir msg
import { Mail, Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, MessageSquareOff } from "lucide-react";
import { formatRelativeTime } from "@/lib/forum-utils";

// Interface alinhada com o chat.json para o endpoint GET /messages/conversations
interface Conversation {
  id: string; // ID da conversa (do backend)
  other_user: {
    id: string;
    nickname: string;
    nome: string;
    gtracker_profiles: {
      avatar_url: string | null;
    };
  };
  last_message: {
    id: string;
    content: string;
    created_at: string; // ISO_DATE
    sender_id: string;
  };
  last_message_at: string; // ISO_DATE
  // unread_count não está no payload do chat.json para esta rota,
  // viria de atualizações WebSocket ou outra chamada.
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function MessagesPage() {
  const { user: currentUser, isAuthenticated } = useAuth(); //
  const { decrementMessageCount, fetchInitialCounts: fetchHeaderCounts } = useRealtime();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const conversationsPerPage = 15;

  const fetchConversations = useCallback(async (page: number) => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await messagesApi.getConversations(page, conversationsPerPage); //
      if (response.success && response.data) {
        setConversations(response.data.conversations);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || "Falha ao carregar conversas");
        setConversations([]);
        setPagination(null);
      }
    } catch (err: any) {
      setError(err.message || "Erro ao buscar conversas");
      setConversations([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, conversationsPerPage]);

  useEffect(() => {
    fetchConversations(currentPage);
  }, [fetchConversations, currentPage]);
  
  // Atualizar contagem no header ao entrar na página
  useEffect(() => {
    if(isAuthenticated) {
        fetchHeaderCounts(); // Força a re-sincronização da contagem do header
    }
  }, [isAuthenticated, fetchHeaderCounts]);


  const handleConversationClick = (otherUserId: string) => {
    // Lógica para decrementar contagem pode ser mais precisa se o backend
    // retornar unread_count por conversa ou se o RealtimeProvider gerenciar isso.
    // Por ora, vamos apenas navegar e a página da conversa marcará como lida.
    // decrementMessageCount(); // Isso decrementaria o total, o que pode não ser o ideal aqui.
    router.push(`/messages/${otherUserId}`);
  };


  return (
    <div className="space-y-6">
      <div className="retro-panel p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-retro-text flex items-center gap-3">
            <Mail className="w-7 h-7 text-retro-blue" />
            Mensagens Privadas
          </h1>
          <div className="flex gap-3">
            <RetroButton variant="secondary" onClick={() => fetchConversations(currentPage)} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </RetroButton>
            {/* Botão para Nova Mensagem pode levar a um modal ou página de seleção de usuário */}
            {/* <RetroButton>
              <UserPlus className="w-4 h-4 mr-2" />
              Nova Mensagem
            </RetroButton> */}
          </div>
        </div>
      </div>

      {/* Futura barra de busca de conversas */}
      {/* <div className="retro-panel p-4">...</div> */}

      <div className="retro-panel">
        {isLoading && conversations.length === 0 && (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-retro-blue mx-auto" />
            <p className="mt-3 text-slate-400">Carregando suas conversas...</p>
          </div>
        )}
        {error && (
          <div className="p-12 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-400">{error}</p>
            <RetroButton onClick={() => fetchConversations(currentPage)} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2"/>
              Tentar Novamente
            </RetroButton>
          </div>
        )}
        {!isLoading && !error && conversations.length === 0 && (
          <div className="p-12 text-center">
            <MessageSquareOff className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Nenhuma conversa encontrada.</p>
            <p className="text-sm text-slate-500 mt-1">Comece uma nova conversa visitando o perfil de um usuário ou no chat público.</p>
          </div>
        )}
        {!isLoading && !error && conversations.length > 0 && (
          <>
            <ul className="divide-y divide-slate-700">
              {conversations
                .sort((a,b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
                .map((convo) => (
                <li key={convo.id} onClick={() => handleConversationClick(convo.other_user.id)}
                    className="block hover:bg-slate-700/30 transition-colors cursor-pointer"
                >
                  <div className="p-4 flex items-center gap-4">
                    <UserAvatar
                      userId={convo.other_user.id}
                      nickname={convo.other_user.nickname}
                      // Para usar o avatar_url, UserAvatar precisa ser ajustado para aceitá-lo,
                      // ou o useUserProfile precisa ser usado aqui, o que pode ser pesado para uma lista.
                      // Vamos assumir que o UserAvatar pode pegar o avatar de profileCache se disponível.
                      // Se gtracker_profiles.avatar_url for direto a URL, podemos passar:
                      // avatarUrl={convo.other_user.gtracker_profiles?.avatar_url}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-retro-text truncate">
                          {convo.other_user.nickname}
                        </h3>
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {formatRelativeTime(convo.last_message_at)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 truncate">
                        <strong className="text-slate-300">
                            {convo.last_message.sender_id === currentUser?.id ? "Você: " : ""}
                        </strong>
                        {convo.last_message.content}
                      </p>
                    </div>
                    {/* A contagem de não lidas por conversa não vem da API, precisaria ser gerenciada via WebSocket/Contexto */}
                    {/* {convo.unread_count && convo.unread_count > 0 && (
                      <span className="ml-auto bg-retro-neon text-retro-dark text-xs font-bold px-2 py-1 rounded-full">
                        {convo.unread_count}
                      </span>
                    )} */}
                  </div>
                </li>
              ))}
            </ul>
            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="p-4 border-t border-slate-700 flex items-center justify-between">
                <span className="text-sm text-slate-400">
                  Página {pagination.page} de {pagination.totalPages} (Total: {pagination.total} conversas)
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
          </>
        )}
      </div>
    </div>
  );
}