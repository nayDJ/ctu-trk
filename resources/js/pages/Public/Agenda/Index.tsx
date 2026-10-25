import PublicLayout from '@/layouts/PublicLayout'
import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'
import { Link } from '@inertiajs/react'
import { CalendarDaysIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface Agenda {
  id: number
  title: string
  description: string | null
  starts_at: string
  ends_at: string | null
  location: string | null
  image_path: string | null
}

interface PaginatedAgendas {
  data: Agenda[]
  links: any[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface AgendaProps {
  upcomingAgendas: PaginatedAgendas
  pastAgendas: PaginatedAgendas
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

function EmptyAgenda({ message }: { message: string }) {
  return (
    <EmptyState
      icon={CalendarDaysIcon}
      title={message}
      description="Agenda kegiatan akan diumumkan di sini."
    />
  )
}

function AgendaGrid({ agendas, emptyMessage }: { agendas: Agenda[]; emptyMessage: string }) {
  if (agendas.length === 0) {
    return <EmptyAgenda message={emptyMessage} />
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {agendas.map((agenda) => (
        <Link
          key={agenda.id}
          href={`/informasi/agenda/${agenda.id}`}
          className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {agenda.image_path ? (
            <div className="aspect-video overflow-hidden bg-primary/5">
              <img
                src={`/storage/${agenda.image_path}`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center bg-primary/5">
              <CalendarDaysIcon className="h-12 w-12 text-primary/30" aria-hidden="true" />
            </div>
          )}

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDaysIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {dateFormatter.format(new Date(agenda.starts_at))}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {timeFormatter.format(new Date(agenda.starts_at))} WITA
              </span>
              {agenda.location && (
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <MapPinIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="break-words">{agenda.location}</span>
                </span>
              )}
            </div>

            <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
              {agenda.title}
            </h3>

            {agenda.description && (
              <p className="mt-2 line-clamp-3 text-base leading-relaxed text-muted">
                {agenda.description}
              </p>
            )}

            <span className="mt-auto pt-4 text-sm font-semibold text-primary">Lihat agenda</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

function AgendaSection({
  title,
  agendas,
  emptyMessage,
}: {
  title: string
  agendas: PaginatedAgendas
  emptyMessage: string
}) {
  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
      <AgendaGrid agendas={agendas.data} emptyMessage={emptyMessage} />
      <Pagination data={agendas} links={agendas.links} />
    </section>
  )
}

export default function AgendaIndex({ upcomingAgendas, pastAgendas }: AgendaProps) {
  return (
    <PublicLayout title="Agenda">
      <PageHeader
        badge="INFORMASI PUBLIK"
        title="Agenda Kegiatan"
        description="Jadwal kegiatan dan musyawarah Kecamatan Tarakan Utara."
        icon={CalendarDaysIcon}
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <AgendaSection
            title="Agenda Mendatang"
            agendas={upcomingAgendas}
            emptyMessage="Belum ada agenda mendatang"
          />
          <AgendaSection
            title="Agenda Sebelumnya"
            agendas={pastAgendas}
            emptyMessage="Belum ada agenda sebelumnya"
          />
        </div>
      </div>
    </PublicLayout>
  )
}
