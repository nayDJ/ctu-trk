import AdminLayout from '@/layouts/AdminLayout'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import { router, Link } from '@inertiajs/react'
import { formatDateTime } from '@/lib/date'

interface MessageShowProps {
  message: { id: number; name: string; email: string; subject: string; body: string; is_read: boolean; created_at: string }
  canManage: boolean
}

export default function MessageShow({ message, canManage }: MessageShowProps) {
  return (
    <AdminLayout title="Detail Pesan">
      <div className="max-w-2xl space-y-6">
        <BentoCard
          title={message.subject}
          description={`${message.name} · ${message.email} · ${formatDateTime(message.created_at)}`}
          icon={<span className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm ${message.is_read ? 'bg-success-bg text-primary' : 'bg-warning-bg text-foreground'}`}>
            {message.is_read ? 'Dibaca' : 'Belum Dibaca'}
          </span>}
        >
          <div className="border-t pt-4">
            <p className="text-base text-foreground whitespace-pre-wrap">{message.body}</p>
          </div>
        </BentoCard>

        <div className="flex gap-3">
          {canManage && (
            <button
              type="button"
              onClick={() => router.patch(`/admin/messages/${message.id}/read`)}
              className="bg-primary text-white px-6 py-2 rounded-lg text-base hover:bg-primary/90"
            >
              {message.is_read ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
            </button>
          )}
          <Link href="/admin/messages" className="bg-background text-foreground px-6 py-2 rounded-lg text-base hover:bg-border">Kembali</Link>
        </div>
      </div>
    </AdminLayout>
  )
}
