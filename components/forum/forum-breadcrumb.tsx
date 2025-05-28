// components/forum/forum-breadcrumb.tsx
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface ForumBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function ForumBreadcrumb({ items }: ForumBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-400">
      <Link href="/forum" className="hover:text-retro-blue transition-colors">
        Fórum
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-3 h-3" />
          {item.href ? (
            <Link href={item.href} className="hover:text-retro-blue transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-retro-text">{item.label}</span>
          )}
        </div>
      ))}
    </div>
  )
}