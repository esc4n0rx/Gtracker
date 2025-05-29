// components/post/comments-section.tsx
"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/toast'
import { RetroButton } from '@/components/ui/retro-button'
import { UserAvatar } from '@/components/ui/user-avatar'
import { RetroInput } from '@/components/ui/retro-input'
import { apiRequest } from '@/lib/api'
import { formatRelativeTime } from '@/lib/forum-utils'
import { 
  MessageSquare, 
  User, 
  Clock, 
  Heart, 
  Reply, 
  Send,
  Loader2,
  AlertCircle 
} from 'lucide-react'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    nickname: string
  }
  created_at: string
  updated_at: string
  like_count: number
  user_liked?: boolean
  parent_comment_id?: string
  replies?: Comment[]
}

interface CommentsSectionProps {
  postId: string
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { success, error: showError } = useToast()

  const fetchComments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiRequest<{
        comments: Comment[]
        pagination: any
      }>(`/comments/post/${postId}`)
      setComments(response.data?.comments || [])
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar comentários')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await apiRequest<Comment>('/comments', {
        method: 'POST',
        body: JSON.stringify({
          post_id: postId,
          content: newComment.trim()
        })
      })

      if (response.data) {
        setComments(prev => [response.data!, ...prev])
        setNewComment('')
        success('Comentário adicionado!', '')
      }
    } catch (err: any) {
      showError('Erro', err.message || 'Não foi possível adicionar o comentário')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault()
    if (!replyText.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await apiRequest<Comment>('/comments', {
        method: 'POST',
        body: JSON.stringify({
          post_id: postId,
          parent_comment_id: parentId,
          content: replyText.trim()
        })
      })

      if (response.data) {
        // Atualizar a lista de comentários
        fetchComments()
        setReplyText('')
        setReplyingTo(null)
        success('Resposta adicionada!', '')
      }
    } catch (err: any) {
      showError('Erro', err.message || 'Não foi possível adicionar a resposta')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await apiRequest<{ liked: boolean; like_count: number }>(`/comments/${commentId}/like`, {
        method: 'POST'
      })

      if (response.data) {
        setComments(prev => prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              like_count: response.data!.like_count,
              user_liked: response.data!.liked
            }
          }
          // Atualizar replies também
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId 
                  ? { ...reply, like_count: response.data!.like_count, user_liked: response.data!.liked }
                  : reply
              )
            }
          }
          return comment
        }))
      }
    } catch (err: any) {
      showError('Erro', 'Não foi possível curtir o comentário')
    }
  }

  if (isLoading) {
    return (
      <div className="retro-panel p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-retro-blue mr-3" />
          <span className="text-slate-400">Carregando comentários...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="retro-panel p-6 border-l-4 border-red-500">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-400 mb-1">Erro ao carregar comentários</h3>
            <p className="text-sm text-slate-400">{error}</p>
            <RetroButton size="sm" variant="secondary" onClick={fetchComments} className="mt-3">
              Tentar Novamente
            </RetroButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="retro-panel p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-retro-blue" />
        <h3 className="text-lg font-bold text-retro-text">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="space-y-3">
          <textarea
            className="retro-input w-full h-24 resize-none"
            placeholder="Escreva seu comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {newComment.length}/1000 caracteres
            </span>
            <RetroButton 
              type="submit" 
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Comentar
            </RetroButton>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h4 className="text-lg font-medium text-retro-text mb-2">
            Nenhum comentário ainda
          </h4>
          <p className="text-slate-400">
            Seja o primeiro a comentar neste post!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={handleLikeComment}
              onReply={(commentId) => setReplyingTo(commentId)}
              replyingTo={replyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmitReply={handleSubmitReply}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  onLike: (commentId: string) => void
  onReply: (commentId: string) => void
  replyingTo: string | null
  replyText: string
  setReplyText: (text: string) => void
  onSubmitReply: (e: React.FormEvent, parentId: string) => void
  isSubmitting: boolean
  level?: number
}

function CommentItem({ 
  comment, 
  onLike, 
  onReply, 
  replyingTo, 
  replyText, 
  setReplyText, 
  onSubmitReply, 
  isSubmitting,
  level = 0
}: CommentItemProps) {
  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-slate-600 pl-4' : ''}`}>
      <div className="bg-slate-800/30 rounded-lg p-4">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <UserAvatar 
              userId={comment.author.id}
              nickname={comment.author.nickname}
              size="sm"
              showStatus={false}
            />
            <div>
              <div className="font-medium text-retro-text">{comment.author.nickname}</div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(comment.created_at)}
              </div>
            </div>
          </div>
        </div>
        {/* Comment Content */}
        <div className="text-slate-300 mb-3 whitespace-pre-line">
          {comment.content}
        </div>

        {/* Comment Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(comment.id)}
            className={`
              flex items-center gap-1 text-sm transition-colors
              ${comment.user_liked 
                ? 'text-red-400 hover:text-red-300' 
                : 'text-slate-400 hover:text-red-400'
              }
            `}
          >
            <Heart className={`w-4 h-4 ${comment.user_liked ? 'fill-current' : ''}`} />
            {comment.like_count}
          </button>
          
          <button
            onClick={() => onReply(comment.id)}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-retro-blue transition-colors"
          >
            <Reply className="w-4 h-4" />
            Responder
          </button>
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <form 
            onSubmit={(e) => onSubmitReply(e, comment.id)} 
            className="mt-4 space-y-3"
          >
            <textarea
              className="retro-input w-full h-20 resize-none"
              placeholder="Escreva sua resposta..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={isSubmitting}
              maxLength={1000}
            />
            <div className="flex items-center gap-2">
              <RetroButton 
                type="submit" 
                size="sm"
                disabled={!replyText.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Responder'
                )}
              </RetroButton>
              <RetroButton 
                type="button" 
                size="sm" 
                variant="secondary"
                onClick={() => onReply('')}
              >
                Cancelar
              </RetroButton>
            </div>
          </form>
        )}
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              replyingTo={replyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmitReply={onSubmitReply}
              isSubmitting={isSubmitting}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}