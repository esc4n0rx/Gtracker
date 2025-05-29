// app/messages/[conversationId]/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter }
from "next/navigation";
import { messagesApi } from "@/lib/api"; //
import { chatService, NewPrivateMessagePayload, DisplayPrivateMessage } from "@/lib/chat";
import { useAuth } from "@/contexts/auth-context"; //
import { UserAvatar } from "@/components/ui/user-avatar"; //
import { RetroButton } from "@/components/ui/retro-button"; //
import { Send, ArrowLeft, Loader2, AlertCircle, RefreshCw, Smile } from "lucide-react";
import { formatRelativeTime } from "@/lib/forum-utils"; //
import Link from "next/link";


export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationUserId = params.conversationId as string;
  const { user: currentUser } = useAuth(); //

  const [messages, setMessages] = useState<DisplayPrivateMessage[]>([]);
  const [otherUser, setOtherUser] = useState<{ id: string; nickname: string; avatar_url: string | null } | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: "smooth" | "auto" = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const transformBackendMessageToDisplay = useCallback((msg: any, currentUserId: string | undefined): DisplayPrivateMessage => {
    return {
      id: msg.id,
      content: msg.content,
      senderId: msg.sender.id,
      senderNickname: msg.sender.nickname,
      senderAvatar: msg.sender.gtracker_profiles?.avatar_url,
      timestamp: formatRelativeTime(msg.created_at),
      isOwnMessage: msg.sender.id === currentUserId,
      replyTo: msg.reply_to,
    };
  }, []);


  const fetchMessages = useCallback(async () => {
    if (!conversationUserId || !currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await messagesApi.getConversationMessages(conversationUserId); //
      if (response.success && response.data) {
        const fetchedMessages = response.data.messages
            .map(msg => transformBackendMessageToDisplay(msg, currentUser.id))
            .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // Ordenar por data
        
        setMessages(fetchedMessages);
        
        // Tenta definir otherUser com base na primeira mensagem, se não for do currentUser
        if (response.data.messages.length > 0) {
            const firstMsg = response.data.messages[0];
            if (firstMsg.sender.id !== currentUser.id) {
                setOtherUser({ id: firstMsg.sender.id, nickname: firstMsg.sender.nickname, avatar_url: firstMsg.sender.gtracker_profiles?.avatar_url || null });
            } else if (firstMsg.recipient.id !== currentUser.id) {
                 setOtherUser({ id: firstMsg.recipient.id, nickname: firstMsg.recipient.nickname, avatar_url: null }); // Avatar do recipiente não vem no payload da mensagem
            }
        }
        // Marcar conversa como lida
        await messagesApi.markConversationAsRead(conversationUserId); //
        chatService.markConversationAsRead(conversationUserId); // Também via WebSocket

      } else {
        setError(response.message || "Falha ao carregar mensagens da conversa");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao buscar mensagens");
    } finally {
      setIsLoading(false);
    }
  }, [conversationUserId, currentUser, transformBackendMessageToDisplay]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom("auto");
  }, [messages]);
  
  // Listener para novas mensagens privadas em tempo real
  const handleNewPrivateMessage = useCallback((payload: NewPrivateMessagePayload) => {
    if (!currentUser) return;
    // Adicionar mensagem apenas se pertencer a esta conversa (enviada por otherUser ou por currentUser para otherUser)
    if ((payload.sender.id === conversationUserId && currentUser.id !== payload.sender.id) || 
        (payload.sender.id === currentUser.id && conversationUserId !== currentUser.id /* idealmente o recipient_id estaria aqui */ )) {
      
      // Para ter certeza que otherUser está definido se a primeira mensagem recebida for do outro usuário
      if (!otherUser && payload.sender.id === conversationUserId) {
        setOtherUser({ id: payload.sender.id, nickname: payload.sender.nickname, avatar_url: payload.sender.gtracker_profiles?.avatar_url || null });
      }

      const displayMsg = transformBackendMessageToDisplay({
        ...payload,
        // O payload de `new_private_message` já tem a estrutura do sender.
        // Se precisasse do recipient, teria que adaptar.
      }, currentUser.id);
      setMessages(prev => [...prev, displayMsg]);
      
      // Marcar como lida se a mensagem não for minha
      if (payload.sender.id !== currentUser.id) {
        chatService.markMessageAsRead(payload.id); //
      }
    }
  }, [currentUser, conversationUserId, otherUser, transformBackendMessageToDisplay]);

  useEffect(() => {
    // Assumindo que chatService.connect foi chamado em outro lugar (ex: _app ou layout global)
    // e está disponível. Para um sistema mais robusto, usar um Contexto de Chat.
    const currentSocket = (chatService as any).getSocketInstance?.(); // Método hipotético
    if (currentSocket) {
        currentSocket.on("new_private_message", handleNewPrivateMessage);
        return () => {
            currentSocket.off("new_private_message", handleNewPrivateMessage);
        };
    } else {
        // Tentar conectar se não estiver conectado, mas isso pode causar problemas de múltiplas conexões
        // Melhor garantir que a conexão é estabelecida uma vez globalmente.
        console.warn("Socket não disponível no ConversationPage para ouvir new_private_message");
    }
  }, [handleNewPrivateMessage]);


  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationUserId || !currentUser) return;
    setIsSending(true);
    try {
      // Enviar via WebSocket
      chatService.sendPrivateMessage(conversationUserId, newMessage.trim()); //

      // Adicionar mensagem à UI localmente para feedback rápido (opcional, mas bom para UX)
      // O evento 'private_message_sent' pode ser usado para confirmar e obter o ID real e created_at do servidor.
      const localTimestamp = new Date().toISOString();
      const tempId = `temp-${Date.now()}`;
      const displayMsg: DisplayPrivateMessage = {
        id: tempId,
        content: newMessage.trim(),
        senderId: currentUser.id,
        senderNickname: currentUser.nickname,
        senderAvatar: null, // TODO: Obter avatar do currentUser.profile
        timestamp: formatRelativeTime(localTimestamp),
        isOwnMessage: true,
      };
      setMessages(prev => [...prev, displayMsg]);
      setNewMessage("");
      
      // Scroll to bottom após enviar
      setTimeout(() => scrollToBottom(), 0);

    } catch (err: any) {
      setError(err.message || "Erro ao enviar mensagem");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading && messages.length === 0) { // Mostrar loading só se não houver mensagens antigas
    return (
      <div className="retro-panel p-8 text-center h-[calc(100vh-250px)] flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-retro-blue mx-auto" />
        <p className="mt-2 text-slate-400">Carregando conversa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="retro-panel p-8 text-center h-[calc(100vh-250px)] flex flex-col justify-center items-center">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
        <p className="text-red-400">{error}</p>
        <RetroButton onClick={fetchMessages} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2"/>
          Tentar Novamente
        </RetroButton>
      </div>
    );
  }
  
  const pageTitle = otherUser ? `Conversa com ${otherUser.nickname}` : "Carregando...";


  return (
    <div className="retro-panel h-[calc(100vh-150px)] flex flex-col">
      {/* Conversation Header */}
      <div className="p-4 border-b border-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/messages" passHref>
            <RetroButton variant="secondary" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </RetroButton>
          </Link>
          {otherUser && (
            <UserAvatar
              userId={otherUser.id}
              nickname={otherUser.nickname}
              // avatarUrl={otherUser.avatar_url}
              size="sm"
            />
          )}
          <h2 className="text-lg font-bold text-retro-text">{pageTitle}</h2>
        </div>
        {/* Pode adicionar ações como bloquear usuário, etc. */}
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-start gap-2 max-w-[70%] p-3 rounded-xl ${
                msg.isOwnMessage
                  ? "bg-retro-blue/80 text-white rounded-br-none"
                  : "bg-slate-700 text-slate-200 rounded-bl-none"
              }`}
            >
              {!msg.isOwnMessage && msg.senderAvatar && (
                <UserAvatar userId={msg.senderId} nickname={msg.senderNickname} size="xs" />
              )}
               {!msg.isOwnMessage && !msg.senderAvatar && (
                 <div className="w-6 h-6 rounded-full bg-slate-500 flex items-center justify-center text-xs text-white flex-shrink-0">
                    {msg.senderNickname.charAt(0).toUpperCase()}
                 </div>
                )}
              <div className="min-w-0">
                {!msg.isOwnMessage && (
                    <p className="text-xs font-medium mb-0.5" style={{color: msg.senderId === currentUser?.id ? currentUser?.role.color : '#AAA' /* Cor para o outro usuário */ }}>
                        {msg.senderNickname}
                    </p>
                )}
                <p className="text-sm break-words whitespace-pre-line">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.isOwnMessage ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-slate-600">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              className="retro-input w-full pr-10"
              placeholder="Digite sua mensagem privada..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              disabled={isSending || !currentUser}
              maxLength={5000} //
            />
             <button className="absolute right-3 top-3 text-slate-400 hover:text-retro-blue transition-colors">
                <Smile className="w-4 h-4" />
            </button>
          </div>
          <RetroButton onClick={handleSendMessage} disabled={!newMessage.trim() || isSending || !currentUser}>
            {isSending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4" />}
          </RetroButton>
        </div>
      </div>
    </div>
  );
}