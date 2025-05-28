// components/forum/forum-loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function ForumLoading() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="retro-panel p-6">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-5 h-5 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 ml-auto" />
                  <Skeleton className="h-3 w-12 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}