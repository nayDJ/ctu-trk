import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import { CheckCircleIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'

interface TicketSuccessProps {
  title: string
  description: string
  ticket?: string
  kindLabel: string
  checkHref: string
  checkLabel: string
}

export default function TicketSuccess({
  title,
  description,
  ticket,
  kindLabel,
  checkHref,
  checkLabel,
}: TicketSuccessProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copyTicket = async () => {
    if (!ticket) return

    try {
      await navigator.clipboard.writeText(ticket)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = ticket
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    setCopied(true)
  }

  return (
    <div className="mx-auto max-w-xl px-4 pb-12 pt-12 text-center sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-success" aria-hidden="true">
        <CheckCircleIcon className="h-9 w-9" />
      </div>
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
      <p className="mb-8 text-base leading-relaxed text-muted">{description}</p>

      {ticket && (
        <div className="mb-6 rounded-xl border border-dashed border-border bg-surface p-6 text-left shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Nomor tiket</p>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{kindLabel}</span>
          </div>
          <p className="mt-3 break-all font-mono text-2xl font-bold tracking-wide text-primary sm:text-3xl">{ticket}</p>
          <div className="my-5 border-t border-dashed border-border" />
          <button
            type="button"
            onClick={copyTicket}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-base font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ClipboardDocumentIcon className="h-5 w-5" aria-hidden="true" />
            <span aria-live="polite">{copied ? 'Tiket tersalin' : 'Salin tiket'}</span>
          </button>
        </div>
      )}

      <div className="mb-8 rounded-lg border border-border bg-background p-4 text-left">
        <p className="text-sm leading-relaxed text-muted">
          <span className="font-semibold text-foreground">Jangan bagikan nomor tiket ini.</span>{' '}
          Siapa pun yang memilikinya dapat melihat status layanan.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href={checkHref}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {checkLabel}
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-surface px-6 py-3 font-medium text-foreground transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  )
}
