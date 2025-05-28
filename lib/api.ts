// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://nckgcgkssowk8soo4wgoc0k4.195.35.17.111.sslip.io/api'

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

export { ApiError }