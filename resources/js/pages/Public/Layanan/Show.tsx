import PublicLayout from '@/layouts/PublicLayout'
import Breadcrumbs from '@/components/Breadcrumbs'
import SectionBadge from '@/components/SectionBadge'
import { Link, usePage } from '@inertiajs/react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  MapPinIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline'

interface LayananShowProps {
  service: {
    name: string
    slug: string
    description: string | null
    requirements: string | null
    estimated_time: string | null
    procedure: string | null
  }
}

export default function LayananShow({ service }: LayananShowProps) {
  const { settings } = usePage().props as { settings?: Record<string, string> }

  const action = service.slug === 'pengaduan-masyarakat'
    ? { href: '/pengaduan/buat', label: 'Buat pengaduan' }
    : service.slug === 'permohonan-informasi-publik'
      ? { href: '/permohonan-info/buat', label: 'Ajukan permohonan informasi' }
      : { href: '/kontak', label: 'Hubungi kami' }

  return (
    <PublicLayout title={service.name}>
      <section className="relative py-10 md:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Beranda', href: '/' },
              { label: 'Layanan', href: '/layanan' },
              { label: service.name },
            ]}
          />
          <Link
            href="/layanan"
            className="mb-4 inline-flex min-h-11 items-center gap-1.5 rounded text-base font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Kembali ke layanan
          </Link>
          <div>
            <SectionBadge>LAYANAN KAMI</SectionBadge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{service.name}</h1>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {service.description && (
              <article className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8">
                <h2 className="mb-4 text-xl font-semibold text-foreground">Deskripsi</h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-muted">{service.description}</p>
              </article>
            )}

            {service.requirements && (
              <article className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8">
                <h2 className="mb-4 text-xl font-semibold text-foreground">Persyaratan</h2>
                <div className="whitespace-pre-line text-base leading-relaxed text-muted">{service.requirements}</div>
              </article>
            )}

            {service.procedure && (
              <article className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8">
                <h2 className="mb-4 text-xl font-semibold text-foreground">Prosedur</h2>
                <div className="whitespace-pre-line text-base leading-relaxed text-muted">{service.procedure}</div>
              </article>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <PaperAirplaneIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Ajukan layanan</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted">
                Siapkan dokumen yang diperlukan, lalu lanjutkan ke formulir layanan.
              </p>
              <Link
                href={action.href}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-center font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {action.label}
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {service.estimated_time && (
              <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ClockIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Informasi pelayanan</h2>
                </div>
                <dl className="space-y-2 text-base">
                  <div>
                    <dt className="text-sm text-muted">Estimasi waktu</dt>
                    <dd className="font-medium text-foreground">{service.estimated_time}</dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Kontak kami</h2>
              <div className="space-y-4 text-base">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-muted">{settings?.alamat || 'Jl. Raja Gibran, Karang Rejo, Kec. Tarakan Utara, Kota Tarakan'}</p>
                </div>
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <a href={`mailto:${settings?.email || 'info@kecamatan-tarakan-utara.go.id'}`} className="break-all text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    {settings?.email || 'info@kecamatan-tarakan-utara.go.id'}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-muted">{settings?.jam_layanan || 'Senin-Jumat, 08.00-16.00 WITA'}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PublicLayout>
  )
}
