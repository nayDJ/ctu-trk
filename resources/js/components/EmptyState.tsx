import { type ComponentType, type SVGProps } from 'react'

interface EmptyStateProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-border bg-surface px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
        <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
      </div>
      <p className="text-lg font-semibold tracking-tight text-foreground">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-muted">{description}</p>
    </div>
  )
}
