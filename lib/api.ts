// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.gtracker.space/api'

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  nickname: string
  email: string
  password: string
  nome: string
  codigo_convite?: string
}

export interface User {
  id: string
  nickname: string
  email: string
  nome: string
  role: {
    id: string
    name: string
    display_name: string
    nivel: number
    color: string
    permissions: Record<string, any>
  }
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Category {
  id: string
  name: string
  description?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  forums: Forum[]
}

export interface Forum {
  id: string
  name: string
  description?: string
  category_id: string
  parent_forum_id?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  total_topics?: number
  total_posts?: number
  last_post_at?: string | null
  last_post_user_id?: string | null
  topic_count?: number // manter para compatibilidade
  post_count?: number // manter para compatibilidade
  last_post?: {
    id: string
    title: string
    author: {
      id: string
      nickname: string
    }
    created_at: string
  }
  subforums?: Forum[]
}

export interface ForumStats {
  topic_count: number
  post_count: number
  last_post?: {
    id: string
    title: string
    author: {
      id: string
      nickname: string
    }
    created_at: string
  }
}

export interface CreatePostData {
  title: string
  content?: string
  forum_id: string
  post_type: string
  template_data?: Record<string, any>
}

export interface Post {
  id: string
  title: string
  content?: string
  slug: string
  post_type: string
  template_data?: Record<string, any>
  author: {
    id: string
    nickname: string
  }
  forum: {
    id: string
    name: string
  }
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
  is_pinned?: boolean
  is_locked?: boolean
  user_liked?: boolean
  last_activity_at?: string
}


class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: string[]
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Função para fazer requisições à API
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Adicionar token se estiver disponível
  const token = getStoredToken()
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.message || 'Erro na requisição',
        response.status,
        data.errors
      )
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Erro de conexão com o servidor', 500)
  }
}

// Funções de autenticação
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return response.data!
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await apiRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    return response.data!
  },

  verify: async (): Promise<User> => {
    const response = await apiRequest<{ user: User }>('/auth/verify')
    return response.data!.user
  },
}

// Funções para gerenciar o token no localStorage
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('gtracker_token')
}

export const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('gtracker_token', token)
}

export const removeStoredToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('gtracker_token')
}

export const categoriesApi = {
  getAll: async (includeInactive = false): Promise<Category[]> => {
    const response = await apiRequest<Category[]>(`/categories?include_inactive=${includeInactive}`)
    return response.data!
  },

  create: async (categoryData: {
    name: string
    description?: string
    display_order?: number
  }): Promise<Category> => {
    const response = await apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
    return response.data!
  },

  update: async (id: string, categoryData: {
    name?: string
    description?: string
    display_order?: number
    is_active?: boolean
  }): Promise<Category> => {
    const response = await apiRequest<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    })
    return response.data!
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    })
  },
}

export const forumsApi = {
  getById: async (id: string): Promise<Forum> => {
    const response = await apiRequest<Forum>(`/forums/${id}`)
    return response.data!
  },

  create: async (forumData: {
    name: string
    description?: string
    category_id: string
    parent_forum_id?: string
    display_order?: number
  }): Promise<Forum> => {
    const response = await apiRequest<Forum>('/forums', {
      method: 'POST',
      body: JSON.stringify(forumData),
    })
    return response.data!
  },

  update: async (id: string, forumData: {
    name?: string
    description?: string
    category_id?: string
    parent_forum_id?: string
    display_order?: number
    is_active?: boolean
  }): Promise<Forum> => {
    const response = await apiRequest<Forum>(`/forums/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(forumData),
    })
    return response.data!
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest(`/forums/${id}`, {
      method: 'DELETE',
    })
  },
}

export const postsApi = {
  create: async (postData: CreatePostData): Promise<Post> => {
    const response = await apiRequest<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    })
    return response.data!
  },

  getBySlug: async (slug: string): Promise<Post> => {
    const response = await apiRequest<Post>(`/posts/${slug}`)
    return response.data!
  },

  getByForum: async (forumId: string, page = 1, limit = 20): Promise<{
    posts: Post[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> => {
    const response = await apiRequest<{
      posts: Post[]
      pagination: any
    }>(`/posts/forum/${forumId}?page=${page}&limit=${limit}`)
    return response.data!
  },

  getTemplates: async (): Promise<any[]> => {
    const response = await apiRequest<any[]>('/posts/templates')
    return response.data!
  },

  update: async (id: string, postData: Partial<CreatePostData>): Promise<Post> => {
    const response = await apiRequest<Post>(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(postData),
    })
    return response.data!
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    })
  },

  toggleLike: async (id: string): Promise<{ liked: boolean; like_count: number }> => {
    const response = await apiRequest<{ liked: boolean; like_count: number }>(`/posts/${id}/like`, {
      method: 'POST',
    })
    return response.data!
  },

  movePost: async (id: string, forumId: string, reason?: string): Promise<void> => {
    await apiRequest(`/posts/${id}/move`, {
      method: 'PATCH',
      body: JSON.stringify({ forum_id: forumId, reason }),
    })
  }
}

export { ApiError, apiRequest }


// API para Mensagens Privadas (HTTP)
export const messagesApi = {
  getConversations: async (page = 1, limit = 20): Promise<ApiResponse<{ //
    conversations: Array<{
      id: string; // ID da conversa (pode não vir, backend pode usar other_user.id como chave)
      other_user: {
        id: string;
        nickname: string;
        nome: string;
        gtracker_profiles: { // Do chat.json, mas pode ser gtracker_roles para cor/avatar
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
      unread_count?: number; // Adicionar se o backend enviar
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>> => {
    return apiRequest(`/messages/conversations?page=${page}&limit=${limit}`);
  },

  getConversationMessages: async (otherUserId: string, page = 1, limit = 50): Promise<ApiResponse<{ //
    messages: Array<{
      id: string;
      content: string;
      is_read: boolean;
      read_at: string | null; // ISO_DATE
      reply_to: string | null;
      created_at: string; // ISO_DATE
      sender: {
        id: string;
        nickname: string;
        nome: string;
        gtracker_profiles: { // Do chat.json
          avatar_url: string | null;
        };
      };
      recipient: { // Do chat.json
        id: string;
        nickname: string;
        nome: string;
      };
    }>;
    pagination: any; // Definir melhor a paginação se necessário
  }>> => {
    return apiRequest(`/messages/conversations/${otherUserId}?page=${page}&limit=${limit}`);
  },

  sendMessage: async (recipientId: string, content: string, replyTo?: string | null): Promise<ApiResponse<{ //
    id: string;
    content: string;
    created_at: string; // ISO_DATE
    sender: any; // Definir melhor o tipo do sender se necessário
  }>> => {
    return apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify({ recipient_id: recipientId, content, reply_to: replyTo || null }),
    });
  },

  markMessageAsRead: async (messageId: string): Promise<ApiResponse<{ //
    id: string;
    is_read: boolean;
    read_at: string; // ISO_DATE
  }>> => {
    return apiRequest(`/messages/${messageId}/read`, {
      method: 'PATCH',
    });
  },

  markConversationAsRead: async (otherUserId: string): Promise<ApiResponse<null>> => { //
    return apiRequest(`/messages/conversations/${otherUserId}/read`, {
      method: 'PATCH',
    });
  },

  getUnreadCount: async (): Promise<ApiResponse<{ unread_count: number }>> => { //
    return apiRequest('/messages/unread-count');
  },
};

// API para Notificações (HTTP) - Estrutura básica baseada em notifications.json
export const notificationsApi = {
  getNotifications: async (page = 1, limit = 20, unreadOnly = false): Promise<ApiResponse<{ //
    notifications: Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      action_url: string | null;
      is_read: boolean;
      created_at: string; // ISO_DATE
      related_user?: { id: string; nickname: string; nome: string };
      related_post?: { id: string; title: string; slug: string };
      // ... outros campos related_... e metadata
    }>;
    pagination: any;
  }>> => {
    return apiRequest(`/notifications?page=${page}&limit=${limit}&unread_only=${unreadOnly}`);
  },

  getUnreadCount: async (): Promise<ApiResponse<{ unread_count: number }>> => { //
    return apiRequest('/notifications/unread-count');
  },

  markAsRead: async (notificationId: string): Promise<ApiResponse<{ id: string; is_read: boolean }>> => { //
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },

  markAllAsRead: async (): Promise<ApiResponse<null>> => { //
    return apiRequest('/notifications/mark-all-read', {
      method: 'PATCH',
    });
  },
  
  // getSettings e updateSettings podem ser adicionados depois se necessário
};


// API para Mensagens Privadas (HTTP) - Estrutura básica 
export const privateChatApi = {
  // Endpoint para buscar todos os usuários para o dropdown
  getUsers: async (): Promise<ApiResponse<User[]>> => { // Retorna uma lista de usuários
    return apiRequest<User[]>('/private/getusers'); // Ajustar endpoint conforme sua definição
  },

  // Endpoint para enviar uma mensagem privada
  sendMessage: async (recipientId: string, content: string): Promise<ApiResponse<any>> => { // O 'any' pode ser a mensagem enviada
    return apiRequest('/private/send', {
      method: 'POST',
      body: JSON.stringify({ recipient_id: recipientId, content }),
    });
  },

  // Endpoint para receber mensagens de uma conversa
  // Vamos assumir que otherUserId é o ID do usuário com quem a conversa está acontecendo
  // 'since' pode ser um timestamp ou ID da última mensagem recebida para paginação/atualização
  getConversationMessages: async (otherUserId: string, since?: string): Promise<ApiResponse<any[]>> => { // Retorna um array de mensagens
    let url = `/private/receive/${otherUserId}`; // Ajustar endpoint e parâmetros conforme sua definição
    if (since) {
      url += `?since=${since}`;
    }
    return apiRequest<any[]>(url);
  },

  // Endpoint para marcar mensagens como lidas (exemplo)
  // Pode ser um array de IDs ou um ID de conversa e um timestamp "até aqui"
  markMessagesAsRead: async (messageIds: string[] | string, conversationWith?: string): Promise<ApiResponse<any>> => {
    // A lógica exata dependerá de como o backend espera isso
    if (Array.isArray(messageIds)) {
      return apiRequest('/private/mark-read', { // Endpoint hipotético
        method: 'POST',
        body: JSON.stringify({ message_ids: messageIds }),
      });
    } else if (conversationWith) {
        return apiRequest(`/private/mark-conversation-read/${conversationWith}`, { // Endpoint hipotético
             method: 'POST',
             body: JSON.stringify({ last_message_id: messageIds }) // ou um timestamp
        });
    }
    throw new Error("Parâmetros inválidos para markMessagesAsRead");
  }
};