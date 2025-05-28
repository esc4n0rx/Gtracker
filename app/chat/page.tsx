"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { RetroButton } from "@/components/ui/retro-button"
import { Send, Smile, Users, Settings, Volume2, VolumeX, Minimize2, Maximize2 } from "lucide-react"

interface ChatMessage {
  id: number
  user: string
  message: string
  timestamp: string
  type: "message" | "join" | "leave" | "system"
  userColor: string
}

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      user: "Sistema",
      message: "Bem-vindo ao chat do GTracker! 🎮",
      timestamp: "14:30",
      type: "system",
      userColor: "#ff6b6b",
    },
    {
      id: 2,
      user: "AdminMaster",
      message: "Pessoal, novo pack de filmes disponível no fórum!",
      timestamp: "14:32",
      type: "message",
      userColor: "#4ecdc4",
    },
    {
      id: 3,
      user: "MovieFan2024",
      message: "Obrigado admin! Já vou conferir 😄",
      timestamp: "14:33",
      type: "message",
      userColor: "#45b7d1",
    },
    {
      id: 4,
      user: "GameLover",
      message: "Alguém tem o novo FIFA 2024?",
      timestamp: "14:35",
      type: "message",
      userColor: "#96ceb4",
    },
    {
      id: 5,
      user: "TechGuru",
      message: "entrou no chat",
      timestamp: "14:36",
      type: "join",
      userColor: "#feca57",
    },
    {
      id: 6,
      user: "TechGuru",
      message: "Oi pessoal! Como estão?",
      timestamp: "14:36",
      type: "message",
      userColor: "#feca57",
    },
  ])

  const [onlineUsers] = useState([
    { name: "AdminMaster", status: "online", role: "admin" },
    { name: "MovieFan2024", status: "online", role: "vip" },
    { name: "GameLover", status: "online", role: "member" },
    { name: "TechGuru", status: "online", role: "member" },
    { name: "SeriesAddict", status: "away", role: "member" },
    { name: "MusicLover", status: "online", role: "member" },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: messages.length + 1,
        user: "Você",
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        type: "message",
        userColor: "#e74c3c",
      }
      setMessages([...messages, newMessage])
      setMessage("")

      // Simular resposta automática
      setTimeout(() => {
        const responses = [
          "Legal! 👍",
          "Concordo totalmente!",
          "Obrigado pela dica!",
          "Vou conferir isso!",
          "Muito bom! 🔥",
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        const botMessage: ChatMessage = {
          id: messages.length + 2,
          user: "ChatBot",
          message: randomResponse,
          timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          type: "message",
          userColor: "#9b59b6",
        }
        setMessages((prev) => [...prev, botMessage])
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getMessageStyle = (msg: ChatMessage) => {
    switch (msg.type) {
      case "system":
        return "text-center text-retro-neon bg-retro-blue/20 rounded p-2"
      case "join":
        return "text-center text-green-400 bg-green-900/20 rounded p-2"
      case "leave":
        return "text-center text-red-400 bg-red-900/20 rounded p-2"
      default:
        return ""
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "text-red-400"
      case "vip":
        return "text-yellow-400"
      default:
        return "text-retro-blue"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-6">
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
                              style={{ backgroundColor: msg.userColor }}
                            >
                              {msg.user.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-retro-text">{msg.user}</span>
                                <span className="text-xs text-slate-500">{msg.timestamp}</span>
                              </div>
                              <div className="text-slate-300 break-words">{msg.message}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm">
                            <span className="font-bold" style={{ color: msg.userColor }}>
                              {msg.user}
                            </span>{" "}
                            {msg.message} <span className="text-slate-500">({msg.timestamp})</span>
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
                          maxLength={500}
                        />
                        <button className="absolute right-3 top-3 text-slate-400 hover:text-retro-blue transition-colors">
                          <Smile className="w-4 h-4" />
                        </button>
                      </div>
                      <RetroButton onClick={sendMessage} disabled={!message.trim()}>
                        <Send className="w-4 h-4" />
                      </RetroButton>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">{message.length}/500 caracteres</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Users Sidebar */}
          <div className="retro-panel p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-retro-blue" />
              <h3 className="font-bold text-retro-text">Usuários Online</h3>
            </div>

            <div className="space-y-2">
              {onlineUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded hover:bg-slate-700/50 transition-colors"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-retro-blue to-retro-purple rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusIcon(user.status)} rounded-full border-2 border-slate-800`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate ${getRoleColor(user.role)}`}>{user.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Rules */}
            <div className="mt-6 p-3 bg-slate-800/50 rounded">
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
      </main>
    </div>
  )
}
