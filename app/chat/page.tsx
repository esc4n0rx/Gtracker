"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react" // Adicionado useMemo
import { Header } from "@/components/layout/header"
import { RetroButton } from "@/components/ui/retro-button"
import { Send, Smile, Users, Settings, Volume2, VolumeX, Minimize2, Maximize2, MessageCircle, AlertCircle } from "lucide-react"
import { PrivateMessageSender } from "@/components/chat/private-message-sender"; 
import { useAuth } from "@/contexts/auth-context" //
import { getStoredToken } from "@/lib/api"
import { useToast } from "@/components/ui/toast" //
import {
  chatService,
  ChatMessageEventPayload,
  ChatMessageDeletedPayload,
  OnlineUser as ApiOnlineUser,
  UserEventPayload,
  DisplayMessage
} from "@/lib/chat"
import router from "next/router"

type OnlineUser = ApiOnlineUser;

export default function ChatPage() {
  const { user: currentUser } = useAuth() //
  const { success, error: showError, info } = useToast() //

  const [isConnected, setIsConnected] = useState(false)
  const [socketError, setSocketError] = useState<string | null>(null)

  const [message, setMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handlers para eventos do WebSocket
  const handleConnect = useCallback(() => {
    setIsConnected(true)
    setSocketError(null)
    info("Conectado ao Chat", "Você está online!")
    chatService.getOnlineUsers()
  }, [info]) // info de useToast deve ser estável

  const handleDisconnect = useCallback((reason: string) => {
    setIsConnected(false)
    // Não mostrar toast de erro se foi uma desconexão intencional (limpeza do useEffect)
    if (reason !== "io client disconnect") {
        showError("Desconectado do Chat", `Motivo: ${reason}`);
    } else {
        console.log("Chat desconectado intencionalmente (client disconnect)");
    }
  }, [showError]) // showError de useToast deve ser estável


  const handlePrivateMessageSent = (recipientId: string) => {
    // Você pode querer fazer algo aqui, como:
    // - Abrir a página de mensagens com este usuário: router.push(`/messages/${recipientId}`)
    // - Atualizar uma lista de "conversas recentes" se tiver uma.
    console.log(`Mensagem privada enviada para ${recipientId}. Redirecionando para /messages...`);
    // router.push(`/messages/${recipientId}`); // Opcional: redirecionar após enviar
  };

  const handleSocketError = useCallback((err: Error) => {
    setSocketError(err.message || "Erro na conexão com o chat.")
    showError("Erro no Chat", err.message || "Não foi possível conectar ao chat.")
  }, [showError]) // showError de useToast deve ser estável

  const handleNewChatMessage = useCallback((payload: ChatMessageEventPayload) => {
    const displayMsg: DisplayMessage = {
      id: payload.id,
      content: payload.content,
      authorNickname: payload.author.nickname,
      authorColor: payload.author.gtracker_roles.color || '#FFFFFF',
      authorId: payload.author.id,
      timestamp: new Date(payload.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      type: payload.message_type === 'text' ? 'message' : payload.message_type,
      replyTo: payload.reply_to,
      replyMessageContent: payload.reply_message?.content,
      replyMessageAuthor: payload.reply_message?.gtracker_users.nickname,
      isSystem: payload.message_type !== 'text'
    }
    setMessages((prevMessages) => [...prevMessages, displayMsg])
  }, []) // Sem dependências externas além de setMessages, que é estável

  const handleChatMessageDeleted = useCallback((data: ChatMessageDeletedPayload) => {
    setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== data.message_id));
    info("Mensagem Deletada", `A mensagem foi removida.`);
  }, [info]); // info de useToast deve ser estável

  const handleOnlineUsers = useCallback((users: ApiOnlineUser[]) => {
    setOnlineUsers(users)
  }, []) // Sem dependências externas além de setOnlineUsers, que é estável

  const handleUserJoined = useCallback((data: UserEventPayload) => {
    setOnlineUsers(prev => [...prev.filter(u => u.id !== data.user.id), data.user]);
    const joinMessage: DisplayMessage = {
        id: `system-join-${data.user.id}-${Date.now()}`,
        authorId: 'system',
        authorNickname: 'Sistema',
        authorColor: '#ff6b6b',
        content: `${data.user.nickname} entrou no chat`,
        timestamp: new Date(data.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        type: 'join',
        isSystem: true,
    };
    setMessages(prev => [...prev, joinMessage]);
  }, []) // Sem dependências externas além de setOnlineUsers e setMessages

  const handleUserLeft = useCallback((data: UserEventPayload) => {
    setOnlineUsers(prev => prev.filter(u => u.id !== data.user.id));
    const leaveMessage: DisplayMessage = {
        id: `system-leave-${data.user.id}-${Date.now()}`,
        authorId: 'system',
        authorNickname: 'Sistema',
        authorColor: '#ff6b6b',
        content: `${data.user.nickname} saiu do chat`,
        timestamp: new Date(data.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        type: 'leave',
        isSystem: true,
    };
    setMessages(prev => [...prev, leaveMessage]);
  }, []) // Sem dependências externas além de setOnlineUsers e setMessages

  // Memoizar o objeto de handlers
  const memoizedHandlers = useMemo(() => ({
    connect: handleConnect,
    disconnect: handleDisconnect,
    error: handleSocketError,
    new_chat_message: handleNewChatMessage,
    chat_message_deleted: handleChatMessageDeleted,
    online_users: handleOnlineUsers,
    user_joined: handleUserJoined,
    user_left: handleUserLeft,
  }), [
    handleConnect, 
    handleDisconnect, 
    handleSocketError, 
    handleNewChatMessage, 
    handleChatMessageDeleted,
    handleOnlineUsers,
    handleUserJoined,
    handleUserLeft
  ]);

  useEffect(() => {
    const token = getStoredToken()
    if (!token || !currentUser) {
      if (currentUser !== null) { // Evitar toast se o usuário ainda está carregando
          showError("Autenticação necessária", "Você precisa estar logado para acessar o chat.")
      }
      setIsConnected(false)
      return
    }

    // Passar o objeto memoizedHandlers
    chatService.connect(token, memoizedHandlers)

    return () => {
      chatService.disconnect()
    }
  }, [currentUser, memoizedHandlers, showError]) // Depender de currentUser e do objeto de handlers memoizado


  const sendMessage = () => {
    if (message.trim() && currentUser) {
      chatService.sendChatMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getMessageStyle = (msg: DisplayMessage) => {
    switch (msg.type) {
      case "system":
        return "text-center text-retro-neon bg-retro-blue/20 rounded p-2"
      case "join":
        return "text-center text-green-400 bg-green-900/20 rounded p-2"
      case "leave":
        return "text-center text-red-400 bg-red-900/20 rounded p-2"
      default: // 'message'
        return ""
    }
  }

  const getStatusIcon = (status?: "online" | "away" | "busy") => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {!currentUser && (
            <div className="retro-panel p-6 text-center border-l-4 border-yellow-500">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-yellow-400 mb-2">Acesso Negado</h2>
                <p className="text-slate-300">Você precisa estar logado para usar o chat.</p>
            </div>
        )}

        {currentUser && !isConnected && !socketError && (
            <div className="retro-panel p-6 text-center">
                <MessageCircle className="w-12 h-12 text-retro-blue mx-auto mb-4 animate-pulse" />
                <p className="text-slate-300">Conectando ao chat...</p>
            </div>
        )}
        {currentUser && socketError && (
             <div className="retro-panel p-6 text-center border-l-4 border-red-500">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-red-400 mb-2">Erro de Conexão</h2>
                <p className="text-slate-300 mb-4">{socketError}</p>
                <p className="text-xs text-slate-500">Verifique sua conexão ou tente recarregar a página.</p>
            </div>
        )}

        {currentUser && isConnected && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="retro-panel h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-600 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-retro-text">Chat Geral</h2>
                  <p className="text-sm text-slate-400">{onlineUsers.length} usuários online</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 text-slate-400 hover:text-retro-blue transition-colors"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 text-slate-400 hover:text-retro-blue transition-colors"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  <button className="p-2 text-slate-400 hover:text-retro-blue transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/50">
                    {messages.map((msg) => (
                      <div key={msg.id} className={getMessageStyle(msg)}>
                        {msg.type === "message" ? (
                          <div className="flex items-start gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                              style={{ backgroundColor: msg.authorColor }}
                            >
                              {msg.authorNickname.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold" style={{color: msg.authorColor}}>
                                  {msg.authorNickname}
                                </span>
                                <span className="text-xs text-slate-500">{msg.timestamp}</span>
                              </div>
                              {/* Mostrar mensagem respondida se houver */}
                              {msg.replyTo && msg.replyMessageAuthor && msg.replyMessageContent && (
                                <div className="mb-1 p-2 bg-slate-700/50 rounded-md border-l-2 border-slate-500">
                                  <div className="text-xs text-slate-400">
                                    Respondendo a <span className="font-medium">{msg.replyMessageAuthor}</span>:
                                  </div>
                                  <div className="text-xs text-slate-300 truncate">
                                    {msg.replyMessageContent}
                                  </div>
                                </div>
                              )}
                              <div className="text-slate-300 break-words">{msg.content}</div>
                            </div>
                          </div>
                        ) : (
                          // Mensagens de sistema, join, leave
                          <div className="text-sm">
                            <span className="font-bold" style={{ color: msg.authorColor }}>
                              {msg.authorNickname}
                            </span>{" "}
                            {msg.content} <span className="text-slate-500">({msg.timestamp})</span>
                          </div>
                        )}
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
                          placeholder="Digite sua mensagem..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          maxLength={1000}
                          disabled={!isConnected}
                        />
                        <button className="absolute right-3 top-3 text-slate-400 hover:text-retro-blue transition-colors">
                          <Smile className="w-4 h-4" />
                        </button>
                      </div>
                      <RetroButton onClick={sendMessage} disabled={!message.trim() || !isConnected}>
                        <Send className="w-4 h-4" />
                      </RetroButton>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">{message.length}/1000 caracteres</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Users Sidebar */}
           <div className="flex flex-col gap-6"> {/* Envolve a sidebar em um flex-col */}
            {/* Users Online Card (pode ser necessário compactá-lo) */}
            <div className="retro-panel p-4"> {/* Manter height flexível ou definir um max-height com scroll */}
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-retro-blue" />
                <h3 className="font-bold text-retro-text">Usuários Online ({onlineUsers.length})</h3>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1"> {/* Adicionado max-h e scroll */}
                {onlineUsers.map((onlineUser) => (
                  <div
                    key={onlineUser.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-slate-700/50 transition-colors cursor-pointer"
                    title={`Iniciar conversa com ${onlineUser.nickname}`}
                    onClick={() => router.push(`/messages/${onlineUser.id}`)} // Link para página de conversa
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-retro-blue to-retro-purple rounded-full flex items-center justify-center text-white text-sm font-bold"
                           style={{ backgroundColor: onlineUser.role.color || '#60A5FA' }}
                      >
                        {onlineUser.nickname.charAt(0).toUpperCase()}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusIcon(onlineUser.status)} rounded-full border-2 border-slate-800`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate`} style={{color: onlineUser.role.color || 'text-retro-blue'}}>
                          {onlineUser.nickname}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">{onlineUser.role.display_name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Private Message Sender Card */}
            <PrivateMessageSender onMessageSent={handlePrivateMessageSent} /> {/* Adicionado aqui */}
            
            {/* Chat Rules Card (permanece igual) */}
            <div className="retro-panel p-4 mt-auto"> {/* Use mt-auto para empurrar para baixo se houver espaço */}
              <h4 className="font-bold text-retro-text mb-2 text-sm">Regras do Chat</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Seja respeitoso com todos</li>
                <li>• Não faça spam</li>
                <li>• Sem links externos</li>
                <li>• Use linguagem adequada</li>
              </ul>
            </div>
          </div>
        </div>
        )}
      </main>
    </div>
  )
}