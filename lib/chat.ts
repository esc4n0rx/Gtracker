// lib/chat.ts
import { io, Socket } from "socket.io-client";
// getStoredToken já está em lib/api.ts, mas não é usado diretamente aqui, é usado na página ao chamar connect.

const CHAT_SERVER_URL = "ws://api.gtracker.space";

// --- INTERFACES DE PAYLOAD DE EVENTOS (já definidas anteriormente, verificar e adicionar as de msg privada) ---

// Payload para new_private_message
export interface NewPrivateMessagePayload {
  id: string;
  content: string;
  reply_to: string | null;
  created_at: string; // ISO_DATE
  sender: {
    id: string;
    nickname: string;
    nome: string;
    gtracker_profiles: { // Supondo que roles/avatar venham daqui ou de um get_user_profile
      avatar_url: string | null;
    };
  };
  // Se o backend enviar recipient_id também, adicionar aqui. Pelo chat.json, não envia.
}

// Payload para private_message_sent
export interface PrivateMessageSentPayload {
  id: string;
  content: string;
  created_at: string; // ISO_DATE
  recipient_id: string;
}

// Payload para message_marked_read
export interface MessageMarkedReadPayload {
    message_id: string;
}

// Payload para message_read (alguém leu sua mensagem)
export interface MessageReadPayload {
    message_id: string;
    read_by: string; // uuid do usuário que leu
}

// Payload para conversation_marked_read
export interface ConversationMarkedReadPayload {
    other_user_id: string;
}


// --- FIM DAS INTERFACES DE PAYLOAD ---


// Reutilizando de antes, ajustar se necessário
export interface ChatMessageEventPayload {
  id: string
  content: string
  message_type: "text" | "system" | "join" | "leave"
  mentions?: string[]
  reply_to?: string | null
  created_at: string // ISO_DATE
  author: {
    id: string
    nickname: string
    nome: string
    gtracker_roles: {
      name: string
      display_name: string
      color: string
    }
  }
  reply_message?: {
    id: string
    content: string
    gtracker_users: {
      nickname: string
    }
  }
}
export interface ChatMessageDeletedPayload {
  message_id: string
  deleted_by: string
}
export interface OnlineUser {
  id: string;
  nickname: string;
  role: {
    name: string;
    display_name: string;
    color: string;
  };
  status?: "online" | "away" | "busy";
}
export interface UserEventPayload {
  user: OnlineUser
  timestamp: string
}
export interface NewNotificationPayload {
  id: string;
  type: string;
  title: string;
  message: string;
  action_url: string | null;
  created_at: string; // ISO_DATE
}


let socket: Socket | null = null;

interface ChatEventMap {
  connect: () => void;
  disconnect: (reason: string) => void;
  error: (error: Error) => void;
  new_chat_message: (message: ChatMessageEventPayload) => void;
  chat_message_deleted: (data: ChatMessageDeletedPayload) => void;
  online_users: (users: OnlineUser[]) => void;
  user_joined: (data: UserEventPayload) => void;
  user_left: (data: UserEventPayload) => void;
  user_typing: (data: { user: { id: string; nickname: string }; typing: boolean }) => void;
  user_status_changed: (data: { user_id: string; status: "online" | "away" | "busy" | "offline" }) => void;
  new_private_message: (message: NewPrivateMessagePayload) => void; // Novo
  new_notification?: (notification: NewNotificationPayload) => void;
  private_message_sent: (message: PrivateMessageSentPayload) => void; // Novo
  message_marked_read: (data: MessageMarkedReadPayload) => void; // Novo
  message_read: (data: MessageReadPayload) => void; // Novo
  conversation_marked_read: (data: ConversationMarkedReadPayload) => void; // Novo
  server_error: (data: { message: string }) => void; // Evento 'error' do chat.json
  pong: () => void; //
}

export const chatService = {
  connect: (
    token: string,
    handlers: Partial<ChatEventMap>
  ): Socket | null => {
    if (socket && socket.connected) {
      return socket;
    }

    const newSocket = io(CHAT_SERVER_URL, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    if (handlers.connect) newSocket.on("connect", handlers.connect);
    if (handlers.disconnect) newSocket.on("disconnect", handlers.disconnect);
    // O evento 'error' do socket.io é para erros de transporte/conexão.
    // O evento 'error' definido no chat.json (payload: {message: string}) é um evento customizado do servidor.
    newSocket.on("connect_error", (err) => {
        console.error("ChatService: Erro de conexão Connect_Error -", err);
        handlers.error?.(err); // Para erros de baixo nível do socket.io
    });
    if (handlers.server_error) newSocket.on("error", handlers.server_error); // Para erros customizados da app


    // Registrar todos os handlers passados
    if (handlers.new_chat_message) newSocket.on("new_chat_message", handlers.new_chat_message);
    if (handlers.chat_message_deleted) newSocket.on("chat_message_deleted", handlers.chat_message_deleted);
    if (handlers.online_users) newSocket.on("online_users", (data: OnlineUser[]) => handlers.online_users?.(data));
    if (handlers.user_joined) newSocket.on("user_joined", handlers.user_joined);
    if (handlers.user_left) newSocket.on("user_left", handlers.user_left);
    if (handlers.user_typing) newSocket.on("user_typing", handlers.user_typing);
    if (handlers.user_status_changed) newSocket.on("user_status_changed", handlers.user_status_changed);
    if (handlers.new_private_message) newSocket.on("new_private_message", handlers.new_private_message); //
    if (handlers.private_message_sent) newSocket.on("private_message_sent", handlers.private_message_sent); //
    if (handlers.message_marked_read) newSocket.on("message_marked_read", handlers.message_marked_read); //
    if (handlers.message_read) newSocket.on("message_read", handlers.message_read); //
    if (handlers.conversation_marked_read) newSocket.on("conversation_marked_read", handlers.conversation_marked_read); //
    if (handlers.pong) newSocket.on("pong", handlers.pong); //


    socket = newSocket;
    return newSocket;
  },

  disconnect: () => {
    if (socket) {
      console.log("ChatService: Desconectando...");
      socket.disconnect();
      socket = null;
    }
  },

  sendChatMessage: (content: string, replyTo?: string | null) => {
    if (socket && socket.connected) {
      socket.emit("chat_message", { content, reply_to: replyTo || null }); //
    } else {
      console.warn("ChatService: Socket não conectado para enviar mensagem de chat.");
    }
  },

  deleteChatMessage: (messageId: string) => {
    if (socket && socket.connected) {
      socket.emit("delete_chat_message", { message_id: messageId }); //
    }
  },

  sendPrivateMessage: (recipientId: string, content: string, replyTo?: string | null) => {
    if (socket && socket.connected) {
      socket.emit("private_message", { recipient_id: recipientId, content, reply_to: replyTo || null }); //
    } else {
      console.warn("ChatService: Socket não conectado para enviar mensagem privada.");
    }
  },
  
  markMessageAsRead: (messageId: string) => {
    if (socket && socket.connected) {
      socket.emit("mark_message_read", { message_id: messageId }); //
    }
  },

  markConversationAsRead: (otherUserId: string) => {
    if (socket && socket.connected) {
      socket.emit("mark_conversation_read", { other_user_id: otherUserId }); //
    }
  },

  sendTypingStart: () => {
    if (socket && socket.connected) {
      socket.emit("typing_start", {}); //
    }
  },

  sendTypingStop: () => {
    if (socket && socket.connected) {
      socket.emit("typing_stop", {}); //
    }
  },

  updateStatus: (status: "online" | "away" | "busy") => {
    if (socket && socket.connected) {
      socket.emit("update_status", { status }); //
    }
  },

  getOnlineUsers: () => {
    if (socket && socket.connected) {
      socket.emit("get_online_users", {}); //
    }
  },

  sendPing: () => { //
    if (socket && socket.connected) {
      socket.emit("ping", {});
    }
  }
};

// Interface para mensagens privadas na UI (pode ser expandida)
export interface DisplayPrivateMessage {
  id: string;
  content: string;
  senderId: string;
  senderNickname: string;
  senderAvatar?: string | null;
  timestamp: string; // Já formatado
  isOwnMessage: boolean; // Para alinhar na UI
  replyTo?: string | null;
  // adicionar mais campos conforme necessário para exibição
}

export interface DisplayMessage { // Mantida para chat público
  id: string;
  content: string;
  authorNickname: string;
  authorColor: string;
  authorId: string;
  timestamp: string;
  type: "message" | "join" | "leave" | "system";
  replyTo?: string | null;
  replyMessageContent?: string;
  replyMessageAuthor?: string;
  isSystem: boolean;
}