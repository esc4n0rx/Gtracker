"use client"

import { UserInfo } from '@/components/ui/user-info'

interface PostAuthorProps {
  author: {
    id: string
    nickname: string
  }
  showExtended?: boolean
  showSignature?: boolean
  showStats?: boolean
  className?: string
}

export function PostAuthor({ 
  author, 
  showExtended = false,
  showSignature = false,
  showStats = false,
  className = '' 
}: PostAuthorProps) {
  return (
    <UserInfo
      author={author}
      showExtended={showExtended}
      showSignature={showSignature}
      showStats={showStats}
      className={className}
    />
  )
}