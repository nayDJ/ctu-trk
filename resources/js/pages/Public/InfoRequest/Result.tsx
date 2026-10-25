import type { ComponentType, SVGProps } from 'react'
import PublicLayout from '@/layouts/PublicLayout'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Link } from '@inertiajs/react'
import { formatDateTime } from '@/lib/date'
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  InboxArrowDownIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

interface InfoRequestResultProps {
  infoRequest: {
    ticket: string
    title: string
    description: string
    status: string
    info_requested: string
    histories: Array<{ status: string; note: string; content_link: string | null; created_at: string }>
    files: Array<{ type: string; path: string; mime: string; size: number }>
  }
}

const statusLabels: Record<string, string> = {
  SUBMITTED: 'Diajukan',
  PROCESSING: 'Sedang diproses',
  COMPLETED: 'Selesai',
  REJECTED: 'Ditolak',
}

const statusSteps: Array<{ key: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }> = [
  { key: 'SUBMITTED', label: 'Diterima', icon: InboxArrowDownIcon },
  { key: 'PROCESSING', label: 'Diproses', icon: Cog6ToothIcon },
  { key: 'COMPLETED', label: 'Selesai', icon: CheckCircleIcon },
]

const statusPillClasses: Record<string, string> = {
  SUBMITTED: 'border-info/25 bg-info-bg text-foreground',
  PROCESSING: 'border-warning/25 bg-warning-bg text-foreground',
  COMPLETED: 'border-success/25 bg-success-bg text-foreground',
  REJECTED: 'border-destructive/25 bg-destructive-bg text-destructive',
}

const statusDotClasses: Record<string, string> = {
  SUBMITTED: 'bg-info',
  PROCESSING: 'bg-warning',
  COMPLETED: 'bg-success',
  REJECTED: 'bg-destructive',
}

export default function InfoRequestResult({ infoRequest }: InfoRequestResultProps) {
  const currentStep = statusSteps.findIndex((step) => step.key === infoRequest.status)
  const isRejected = infoRequest.status === 'REJECTED'
  const followUpFiles = infoRequest.files.filter((file) => file.type === 'follow_up')
  const progress = currentStep <= 0 ? 0 : (currentStep / (statusSteps.length - 1)) * 100

  return (
    <PublicLayout title="Status Permohonan">
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Beranda', href: '/' },
            { label: 'Cek Status', href: '/permohonan-info/cek' },
            { label: 'Status Permohonan' },
          ]}
        />

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Status Permohonan Informasi</h1>
          <p className="mt-1 text-base text-muted">Pantau perkembangan permohonan informasi Anda.</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-muted">Nomor tiket</p>
              <p className="break-all font-mono text-xl font-bold tracking-wide text-foreground">{infoRequest.ticket}</p>
            </div>
            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${
                statusPillClasses[infoRequest.status] || 'border-border bg-background text-foreground'
              }`}
            >
              <span aria-hidden className={`h-2 w-2 rounded-full ${statusDotClasses[infoRequest.status] || 'bg-muted-foreground'}`} />
              {statusLabels[infoRequest.status] || infoRequest.status}
            </span>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted">Judul</dt>
              <dd className="mt-0.5 font-medium text-foreground">{infoRequest.title}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted">Informasi yang diminta</dt>
              <dd className="mt-0.5 whitespace-pre-line text-base leading-relaxed text-foreground/80">{infoRequest.info_requested}</dd>
            </div>
            {infoRequest.description && (
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted">Deskripsi tambahan</dt>
                <dd className="mt-0.5 whitespace-pre-line text-base leading-relaxed text-foreground/80">{infoRequest.description}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8 border-t border-border pt-6">
            <h2 className="text-lg font-semibold text-foreground">Perkembangan permohonan</h2>
            {isRejected ? (
              <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive-bg p-4">
                <XCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
                <div>
                  <p className="font-medium text-destructive">Permohonan ditolak</p>
                  <p className="mt-1 text-sm text-muted">Silakan periksa riwayat penanganan untuk keterangan lebih lanjut.</p>
                </div>
              </div>
            ) : (
              <div className="relative mt-5">
                <div aria-hidden className="absolute left-[16.66%] right-[16.66%] top-5 hidden h-0.5 bg-border md:block">
                  <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
                <ol aria-label="Tahapan permohonan informasi" className="relative grid gap-4 md:grid-cols-3 md:gap-2">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = index <= currentStep
                    const isCurrent = index === currentStep

                    return (
                      <li
                        key={step.key}
                        className="flex items-start gap-3 md:flex-col md:items-center md:gap-2 md:text-center"
                        aria-current={isCurrent ? 'step' : undefined}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                            isActive
                              ? 'border-primary bg-primary text-white'
                              : 'border-border bg-surface text-muted-foreground'
                          } ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''}`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <p className={`pt-1.5 text-sm md:pt-0 ${isActive ? 'font-medium text-foreground' : 'text-muted'}`}>
                          {step.label}
                        </p>
                      </li>
                    )
                  })}
                </ol>
              </div>
            )}
          </div>

          {infoRequest.histories.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-foreground">Riwayat penanganan</h2>
              <ol className="relative ml-3 mt-4 border-l-2 border-border">
                {infoRequest.histories.map((history, index) => (
                  <li key={`${history.created_at}-${index}`} className="relative pb-6 pl-6 last:pb-0">
                    <span
                      aria-hidden
                      className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-surface ${
                        index === 0 ? 'bg-primary' : 'bg-muted-foreground'
                      }`}
                    />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{statusLabels[history.status] || history.status}</p>
                      <time dateTime={history.created_at} className="text-xs text-muted">
                        {formatDateTime(history.created_at)}
                      </time>
                    </div>
                    {history.note && (
                      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">{history.note}</p>
                    )}
                    {history.content_link && (
                      <a
                        href={history.content_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
                        Lihat tautan tindak lanjut
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {followUpFiles.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="text-lg font-semibold text-foreground">Bukti tindak lanjut</h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                {followUpFiles.map((file, index) => (
                  <li key={`${file.path}-${index}`}>
                    <a
                      href={`/storage/${file.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Buka lampiran tindak lanjut ${index + 1}`}
                      className="block rounded-lg border border-border bg-surface p-1 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      {file.mime.startsWith('image/') ? (
                        <img
                          src={`/storage/${file.path}`}
                          alt={`Lampiran tindak lanjut ${index + 1}`}
                          loading="lazy"
                          className="h-24 w-24 rounded object-cover"
                        />
                      ) : (
                        <span className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded bg-destructive-bg text-destructive">
                          <DocumentTextIcon className="h-6 w-6" aria-hidden="true" />
                          <span className="text-xs font-semibold">PDF</span>
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/permohonan-info/cek"
            className="inline-flex min-h-11 items-center gap-1.5 rounded text-base font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Cek permohonan lain
          </Link>
        </div>
      </div>
    </PublicLayout>
  )
}
