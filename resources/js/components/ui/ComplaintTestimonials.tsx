import { CheckBadgeIcon } from '@heroicons/react/24/outline'

interface Complaint {
  id: number
  title: string
  description: string
  is_anonymous: boolean
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function ComplaintCard({ complaint }: { complaint: Complaint }) {
  const name = complaint.is_anonymous ? 'Anonim' : 'Masyarakat'

  return (
    <li className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-1.5">
        <CheckBadgeIcon className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide text-success">Selesai</span>
      </div>
      <p className="line-clamp-4 break-words font-medium leading-relaxed text-foreground">
        {complaint.title}
      </p>
      {complaint.description && (
        <p className="mt-2 line-clamp-3 break-words text-sm leading-relaxed text-muted">
          {complaint.description}
        </p>
      )}
      <footer className="mt-auto flex items-center gap-3 pt-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary" aria-hidden="true">
          {getInitials(name)}
        </div>
        <cite className="break-words text-sm font-semibold not-italic tracking-tight text-foreground">
          {name}
        </cite>
      </footer>
    </li>
  )
}

export default function ComplaintTestimonials({ complaints }: { complaints: Complaint[] }) {
  if (complaints.length === 0) return null

  return (
    <div className="mt-10" role="region" aria-label="Pengaduan selesai">
      <ul className="grid list-none gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
        {complaints.slice(0, 6).map((complaint) => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
      </ul>
    </div>
  )
}
