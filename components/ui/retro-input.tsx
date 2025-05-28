import { type InputHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface RetroInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const RetroInput = forwardRef<HTMLInputElement, RetroInputProps>(({ className, label, error, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-retro-text">{label}</label>}
      <input
        className={cn(
          "retro-input w-full",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className,
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
})

RetroInput.displayName = "RetroInput"

export { RetroInput }
