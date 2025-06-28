// lib/forum-utils.ts
import { Category, Forum } from './api'

export function sortCategoriesByOrder(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => a.display_order - b.display_order)
}

export function sortForumsByOrder(forums: Forum[]): Forum[] {
  return [...forums].sort((a, b) => a.display_order - b.display_order)
}

export function organizeForumsWithSubforums(forums: Forum[]): Forum[] {
  // Separar fóruns principais dos subfóruns
  const mainForums = forums.filter(forum => !forum.parent_forum_id)
  
  // Adicionar subfóruns aos fóruns principais
  return mainForums.map(forum => ({
    ...forum,
    subforums: forums.filter(subforum => subforum.parent_forum_id === forum.id)
  }))
}

/**
 * Verifica se um fórum pode receber postagens diretas
 * Regra: Se um fórum possui subfóruns, as postagens devem ser feitas nos subfóruns
 */
export function canPostInForum(forum: Forum): boolean {
  // Se tem subfóruns, não pode postar diretamente no fórum principal
  // Só pode postar em fóruns que não possuem subfóruns ou são subfóruns
  return !forum.subforums || forum.subforums.length === 0
}

/**
 * Verifica se uma seleção de fórum é válida para postagem
 */
export function validateForumSelection(forumId: string, forums: Forum[]): {
  isValid: boolean
  reason?: string
} {
  const selectedForum = forums.find(f => f.id === forumId)
  
  if (!selectedForum) {
    return { isValid: false, reason: 'Fórum não encontrado' }
  }
  
  if (!canPostInForum(selectedForum)) {
    return { 
      isValid: false, 
      reason: 'Este fórum possui subfóruns. Você deve postar em um dos subfóruns específicos.' 
    }
  }
  
  return { isValid: true }
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  const diffWeeks = Math.floor(diffMs / 604800000)
  const diffMonths = Math.floor(diffMs / 2629746000)

  if (diffMins < 1) {
    return 'Agora'
  } else if (diffMins < 60) {
    return `${diffMins}min atrás`
  } else if (diffHours < 24) {
    return `${diffHours}h atrás`
  } else if (diffDays < 7) {
    return `${diffDays}d atrás`
  } else if (diffWeeks < 4) {
    return `${diffWeeks}sem atrás`
  } else if (diffMonths < 12) {
    return `${diffMonths}mes atrás`
  } else {
    return date.toLocaleDateString('pt-BR')
  }
}

export function getForumIconByName(name: string) {
  const nameLower = name.toLowerCase()
  
  // Mapeamento de palavras-chave para tipos de ícone
  const iconMap: Record<string, string> = {
    'filme': 'film',
    'movie': 'film',
    'cinema': 'film',
    'série': 'tv',
    'series': 'tv',
    'tv': 'tv',
    'jogo': 'gamepad',
    'game': 'gamepad',
    'gaming': 'gamepad',
    'software': 'monitor',
    'programa': 'monitor',
    'app': 'monitor',
    'música': 'music',
    'music': 'music',
    'som': 'music',
    'documento': 'file-text',
    'ebook': 'file-text',
    'livro': 'file-text',
    'anime': 'star',
    'manga': 'star',
    'admin': 'settings',
    'moderação': 'settings',
    'suporte': 'settings',
    'apresentação': 'users',
    'membro': 'users',
    'comunidade': 'users',
  }

  for (const [keyword, iconType] of Object.entries(iconMap)) {
    if (nameLower.includes(keyword)) {
      return iconType
    }
  }

  return 'message-square' // ícone padrão
}