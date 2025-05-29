// components/ui/user-signature.tsx
"use client"

import { useUserProfile } from '@/hooks/use-user-profile'

interface UserSignatureProps {
  userId: string
  className?: string
}

export function UserSignature({ userId, className = '' }: UserSignatureProps) {
  const { profile } = useUserProfile(userId)

  if (!profile?.signature) {
    return null
  }

  return (
    <div className={`pt-3 mt-3 border-t border-slate-700 ${className}`}>
      <div className="text-xs text-slate-500 italic leading-relaxed">
        {profile.signature}
      </div>
    </div>
  )
}