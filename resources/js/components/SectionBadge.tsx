import { type ReactNode } from 'react'

export default function SectionBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary${className ? ` ${className}` : ''}`}>
      <span aria-hidden className="h-px w-5 bg-primary/40" />
      {children}
    </span>
  )
}
