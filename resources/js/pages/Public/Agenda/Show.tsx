import PublicLayout from '@/layouts/PublicLayout'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Link } from '@inertiajs/react'
import { ArrowLeftIcon, CalendarDaysIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface AgendaShowProps {
  agenda: {
    id: number
    title: string
    description: string | null
    starts_at: string
    ends_at: string | null
    location: string | null
    image_path: string | null
  }
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Makassar',
})

const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Makassar',
})

export default function AgendaShow({ agenda }: AgendaShowProps) {
  const startsAt = new Date(agenda.starts_at)
  const endsAt = agenda.ends_at ? new Date(agenda.ends_at) : null
  const endsOnSameDay = endsAt !== null && dateFormatter.format(startsAt) === dateFormatter.format(endsAt)

  return (
    <PublicLayout title={agenda.title}>
      <article className="mx-auto max-w-4xl px-4 pb-12 pt-8 sm:px-6 md:pt-10 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Beranda', href: '/' },
            { label: 'Agenda', href: '/informasi/agenda' },
            { label: agenda.title },
          ]}
        />

        <Link
          href="/informasi/agenda"
          className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Kembali ke Agenda
        </Link>

        <h1 className="max-w-3xl break-words text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {agenda.title}
        </h1>

        <div className="mt-6 grid gap-4 rounded-xl border border-border bg-surface p-5 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <CalendarDaysIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-medium text-foreground">Tanggal</p>
              <time dateTime={agenda.starts_at} className="text-muted">{dateFormatter.format(startsAt)}</time>
              {endsAt && !endsOnSameDay && (
                <p className="text-muted">
                  s.d. <time dateTime={agenda.ends_at || undefined}>{dateFormatter.format(endsAt)}</time>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">Waktu</p>
              <p className="text-muted">
                {timeFormatter.format(startsAt)}
                {endsOnSameDay && endsAt ? ` - ${timeFormatter.format(endsAt)}` : ''} WITA
              </p>
            </div>
          </div>

          {agenda.location && (
            <div className="flex items-start gap-3 sm:col-span-2">
              <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0">
                <p className="font-medium text-foreground">Lokasi</p>
                <p className="break-words text-muted">{agenda.location}</p>
              </div>
            </div>
          )}
        </div>

        {agenda.image_path && (
          <div className="mt-8 aspect-video overflow-hidden rounded-xl border border-border bg-primary/5">
            <img
              src={`/storage/${agenda.image_path}`}
              alt={agenda.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="mt-8 border-t border-border pt-8">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Deskripsi Agenda</h2>
          {agenda.description ? (
            <div className="max-w-[68ch] whitespace-pre-line text-base leading-relaxed text-foreground/80 md:text-lg">
              {agenda.description}
            </div>
          ) : (
            <p className="text-base text-muted">Deskripsi agenda belum tersedia.</p>
          )}
        </div>
      </article>
    </PublicLayout>
  )
}
