import { Monitor } from "lucide-react"

interface RetroLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function RetroLogo({ size = "md", showText = true }: RetroLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br from-retro-blue to-retro-purple rounded-lg flex items-center justify-center shadow-lg`}
      >
        <Monitor className="w-2/3 h-2/3 text-white" />
      </div>
      {showText && (
        <span
          className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-retro-blue to-retro-neon bg-clip-text text-transparent glow-text`}
        >
          GTracker
        </span>
      )}
    </div>
  )
}
