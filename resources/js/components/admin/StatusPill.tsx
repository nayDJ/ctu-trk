import { STATUS_BADGE_CLASSES, STATUS_DOT_CLASSES, STATUS_LABELS } from '@/lib/statusColors'

interface StatusPillProps {
  status: string
  className?: string
}

export default function StatusPill({ status, className = '' }: StatusPillProps) {
  const label = STATUS_LABELS[status] || status
  const tone = STATUS_BADGE_CLASSES[status] || 'border-border bg-background text-foreground'
  const dot = STATUS_DOT_CLASSES[status] || 'bg-muted-foreground'

  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone} ${className}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
