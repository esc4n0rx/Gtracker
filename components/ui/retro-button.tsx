import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"
  size?: "sm" | "md" | "lg"
}

const RetroButton = forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseClasses =
      "font-bold rounded border shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"

    const variantClasses = {
      primary:
        "bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white border-blue-800",
      secondary:
        "bg-gradient-to-b from-slate-500 to-slate-700 hover:from-slate-400 hover:to-slate-600 text-white border-slate-800",
      danger: "bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white border-red-800",
    }

    const sizeClasses = {
      sm: "py-1 px-3 text-sm",
      md: "py-2 px-4 text-base",
      lg: "py-3 px-6 text-lg",
    }

    return (
      <button
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        ref={ref}
        style={{
          boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 0 rgba(0,0,0,0.3)",
        }}
        {...props}
      >
        {children}
      </button>
    )
  },
)

RetroButton.displayName = "RetroButton"

export { RetroButton }
