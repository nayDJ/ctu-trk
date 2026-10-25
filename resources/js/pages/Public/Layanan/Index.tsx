import PublicLayout from '@/layouts/PublicLayout'
import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'
import { Link } from '@inertiajs/react'
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'

interface ServiceData {
  id: number
  name: string
  slug: string
  description: string
  estimated_time: string
  is_primary: boolean
}

interface LayananProps {
  services: {
    data: ServiceData[]
    links: { url: string | null; label: string; active: boolean }[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

const primaryIcons: Record<string, typeof ClipboardDocumentListIcon> = {
  'pengaduan-masyarakat': ClipboardDocumentListIcon,
  'permohonan-informasi-publik': DocumentTextIcon,
}

export default function LayananIndex({ services }: LayananProps) {
  const primaryServices = services.data.filter(service => service.is_primary)
  const regularServices = services.data.filter(service => !service.is_primary)

  return (
    <PublicLayout title="Layanan">
      <PageHeader
        badge="LAYANAN KAMI"
        title="Layanan Kecamatan Tarakan Utara"
        description="Berbagai layanan publik untuk masyarakat. Cepat, transparan, dan mudah diakses."
        icon={WrenchScrewdriverIcon}
      />

      <div className="mx-auto max-w-7xl space-y-16 px-4 pb-12 sm:px-6 lg:px-8">
        {primaryServices.length > 0 && (
          <section aria-labelledby="layanan-utama-title">
            <div className="mb-8">
              <h2 id="layanan-utama-title" className="text-2xl font-semibold tracking-tight text-foreground">Layanan Utama</h2>
              <p className="mt-1 text-muted">Layanan unggulan untuk masyarakat.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {primaryServices.map((service) => {
                const Icon = primaryIcons[service.slug] || ClipboardDocumentListIcon
                return (
                  <Link
                    key={service.id}
                    href={`/layanan/${service.slug}`}
                    className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-8"
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">{service.name}</h3>
                    {service.description && (
                      <p className="mt-2 line-clamp-3 text-base leading-relaxed text-muted">{service.description}</p>
                    )}
                    {service.estimated_time && (
                      <p className="mt-3 text-sm text-muted">Estimasi waktu: {service.estimated_time}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                      <span className="text-sm font-medium text-primary">Lihat detail layanan</span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {regularServices.length > 0 && (
          <section aria-labelledby="layanan-lainnya-title">
            <div className="mb-8">
              <h2 id="layanan-lainnya-title" className="text-2xl font-semibold tracking-tight text-foreground">Layanan Lainnya</h2>
              <p className="mt-1 text-muted">Layanan pendukung untuk masyarakat.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/layanan/${service.slug}`}
                  className="group rounded-xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">{service.name}</h3>
                  {service.description && (
                    <p className="mt-2 line-clamp-3 text-base leading-relaxed text-muted">{service.description}</p>
                  )}
                  <div className="mt-4 flex items-center gap-1.5 text-base font-medium text-primary">
                    Pelajari
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {services.data.length === 0 && (
          <EmptyState
            icon={WrenchScrewdriverIcon}
            title="Belum ada layanan"
            description="Layanan publik sedang disiapkan. Silakan kembali lagi nanti."
          />
        )}

        <Pagination data={services} links={services.links} />
      </div>
    </PublicLayout>
  )
}
