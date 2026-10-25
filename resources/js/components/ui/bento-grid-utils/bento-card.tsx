import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export interface BentoCardProps {
  title: string
  description?: string
  icon?: ReactNode
  colSpan?: 1 | 2 | 4
  className?: string
  children?: ReactNode
}

export function BentoCard({ title, description, icon, colSpan = 1, className, children }: BentoCardProps) {
  const spanClass =
    colSpan === 4 ? 'md:col-span-2 lg:col-span-4' : colSpan === 2 ? 'md:col-span-2' : ''

  return (
    <div
      className={cn(
        'bg-surface rounded-xl border border-border p-5 flex flex-col min-w-0 shadow-sm',
        spanClass,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
        </div>
        {icon && <div className="shrink-0">{icon}</div>}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

export default BentoCard
