import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import { ArrowPathIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import EntityDrawer from '@/components/admin/EntityDrawer'
import { formatDateTime } from '@/lib/date'

interface MessageData {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  body: string
  is_read: boolean
  created_at: string
}

interface MessageDrawerProps {
  messageId: number | null
  onClose: () => void
}

export default function MessageDrawer({ messageId, onClose }: MessageDrawerProps) {
  const [message, setMessage] = useState<MessageData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!messageId) {
      setMessage(null)
      return
    }

    setLoading(true)
    fetch(`/admin/messages/${messageId}/json`)
      .then(res => res.json())
      .then(json => {
        setMessage(json.message)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [messageId])

  const toggleRead = () => {
    if (!message) return
    router.patch(`/admin/messages/${message.id}/read`, {}, {
      preserveState: true,
      onSuccess: () => {
        setMessage(prev => prev ? { ...prev, is_read: !prev.is_read } : prev)
      },
    })
  }

  const isOpen = messageId !== null

  return (
    <EntityDrawer
      open={isOpen}
      onClose={onClose}
      title={
        message ? (
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="break-words text-lg font-semibold text-foreground">{message.subject}</h2>
              <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                message.is_read
                  ? 'border-success/25 bg-success-bg text-foreground'
                  : 'border-warning/30 bg-warning-bg text-foreground'
              }`}>
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${message.is_read ? 'bg-success' : 'bg-warning'}`} />
                {message.is_read ? 'Dibaca' : 'Belum dibaca'}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">{message.name}</p>
            <p className="mt-0.5 text-sm text-muted">{formatDateTime(message.created_at)}</p>
          </div>
        ) : 'Detail pesan'
      }
      footer={
        message ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleRead}
              className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              {message.is_read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center rounded-lg border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-background"
            >
              Tutup
            </button>
          </div>
        ) : undefined
      }
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted" role="status">
          <ArrowPathIcon className="h-6 w-6 animate-spin" aria-hidden="true" />
          Memuat pesan...
        </div>
      ) : message ? (
        <div className="space-y-4">
          <section className="rounded-lg bg-background p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Kontak</h3>
            <div className="space-y-2 text-base">
              <div className="flex min-w-0 items-start gap-2">
                <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                <a href={`mailto:${message.email}`} className="min-w-0 break-all text-primary hover:underline">{message.email}</a>
              </div>
              {message.phone && (
                <div className="flex min-w-0 items-start gap-2">
                  <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  <a href={`https://wa.me/${message.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="min-w-0 break-all text-primary hover:underline">{message.phone}</a>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-lg bg-background p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Isi pesan</h3>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">{message.body}</p>
          </section>
        </div>
      ) : null}
    </EntityDrawer>
  )
}
