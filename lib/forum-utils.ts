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