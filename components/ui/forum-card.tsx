"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ForumCardProps {
  title: string
  description: string
  icon: LucideIcon
  topicsCount: number
  postsCount: number
  lastPost?: {
    author: string
    time: string
  }
  className?: string
  onClick?: () => void
}

export function ForumCard({
  title,
  description,
  icon: Icon,
  topicsCount,
  postsCount,
  lastPost,
  className,
  onClick,
}: ForumCardProps) {
  return (
    <div className={cn("forum-card cursor-pointer", className)} onClick={onClick}>
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-retro-blue to-retro-purple rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-retro-text mb-1">{title}</h3>
          <p className="text-sm text-slate-400 mb-3">{description}</p>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex space-x-4">
              <span>{topicsCount} tópicos</span>
              <span>{postsCount} posts</span>
            </div>

            {lastPost && (
              <div className="text-right">
                <div className="text-retro-blue">{lastPost.author}</div>
                <div>{lastPost.time}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
