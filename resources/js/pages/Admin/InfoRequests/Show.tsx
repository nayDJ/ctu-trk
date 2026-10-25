import AdminLayout from '@/layouts/AdminLayout'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import { useForm, Link } from '@inertiajs/react'
import { useRef } from 'react'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { formatDateTime } from '@/lib/date'
import StatusPill from '@/components/admin/StatusPill'

interface InfoRequestShowProps {
  infoRequest: {
    id: number; ticket: string; tracking_code: string; title: string; description: string; status: string;
    requester_name: string; requester_phone: string; requester_email: string; requester_address: string;
    info_requested: string;
    histories: Array<{ status: string; note: string; content_link: string | null; created_at: string; admin: { name: string } | null }>;
    files: Array<{ type: string; path: string; mime: string; size: number }>;
  }
  canViewPii: boolean
  canManage: boolean
}

const STATUS_OPTIONS = [
  { value: 'SUBMITTED', label: 'Diterima' },
  { value: 'PROCESSING', label: 'Diproses' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'REJECTED', label: 'Ditolak' },
]

export default function InfoRequestShow({ infoRequest, canViewPii, canManage }: InfoRequestShowProps) {
  const { data, setData, post, processing, errors } = useForm({
    status: infoRequest.status, note: '', content_link: '', follow_up_files: [] as File[],
  })
  const fileRef = useRef<HTMLInputElement>(null)

  const submit = () => {
    post(`/admin/info-requests/${infoRequest.id}/update`, { forceFormData: true })
  }

  const followUpFiles = infoRequest.files.filter(f => f.type === 'follow_up')

  return (
    <AdminLayout title={`Permintaan Informasi ${infoRequest.ticket}`}>
      <div className="max-w-3xl space-y-6">
        {/* Detail */}
        <BentoCard
          title={infoRequest.title}
          description={infoRequest.ticket}
          icon={<StatusPill status={infoRequest.status} />}
        >
          <div className="space-y-3">
            <p className="whitespace-pre-wrap text-base text-foreground">{infoRequest.description}</p>
            {infoRequest.info_requested && (
              <div className="rounded-lg bg-background p-3">
                <p className="text-sm text-muted">Informasi yang Diminta</p>
                <p className="text-base text-foreground">{infoRequest.info_requested}</p>
              </div>
            )}
          </div>
        </BentoCard>

        {/* Requester Info */}
        <BentoCard title="Data Pemohon">
          <div className="grid gap-3 text-base md:grid-cols-2">
            <div><span className="text-muted">Nama:</span> {infoRequest.requester_name}</div>
            <div><span className="text-muted">HP:</span> {infoRequest.requester_phone}</div>
            {infoRequest.requester_email && <div><span className="text-muted">Email:</span> {infoRequest.requester_email}</div>}
            {infoRequest.requester_address && <div><span className="text-muted">Alamat:</span> {infoRequest.requester_address}</div>}
          </div>
          {!canViewPii && (
            <p className="mt-3 text-sm text-muted">
              Data pemohon disamarkan. Hubungi admin atau super admin untuk melihat data lengkap.
            </p>
          )}
          {canViewPii && infoRequest.requester_phone && (
            <a
              href={`https://wa.me/${infoRequest.requester_phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-base text-white transition-colors hover:bg-primary-dark"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Hubungi via WhatsApp
            </a>
          )}
        </BentoCard>

        {/* Follow-up Files */}
        {followUpFiles.length > 0 && (
          <BentoCard title="Bukti Tindak Lanjut">
            <div className="flex flex-wrap gap-3">
              {followUpFiles.map((f, i) => (
                <a key={i} href={`/storage/${f.path}`} target="_blank" rel="noopener" className="block">
                  {f.mime.startsWith('image/') ? (
                    <img src={`/storage/${f.path}`} alt="Tindak Lanjut" className="h-24 rounded-lg border" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-border text-sm text-muted">PDF</div>
                  )}
                </a>
              ))}
            </div>
          </BentoCard>
        )}

        {/* History */}
        {infoRequest.histories.length > 0 && (
          <BentoCard title="Riwayat Status">
            <div className="relative ml-3 space-y-4 border-l-2 border-border">
              {infoRequest.histories.map((h, i) => (
                <div key={i} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-surface ${
                    i === 0 ? 'bg-primary' : 'bg-border'
                  }`} />
                  <div className="flex flex-wrap items-center gap-2 text-base">
                    <StatusPill status={h.status} />
                    <span className="text-foreground">{h.note}</span>
                  </div>
                  {h.content_link && (
                    <a href={h.content_link} target="_blank" rel="noopener" className="mt-1 inline-block text-sm text-primary hover:underline">{h.content_link}</a>
                  )}
                  <p className="mt-1 text-sm text-muted">{h.admin?.name ?? 'Sistem'} &middot; {formatDateTime(h.created_at)}</p>
                </div>
              ))}
            </div>
          </BentoCard>
        )}

        {/* Update Form */}
        {canManage && (
        <BentoCard title="Update Status">
          <div className="space-y-4">
            <div>
              <label className="block text-base font-medium mb-1">Status</label>
              <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="min-h-11 w-full rounded-lg border px-3 py-2">
                {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {errors.status && <p className="text-destructive text-sm mt-1">{errors.status}</p>}
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Catatan</label>
              <textarea value={data.note} onChange={(e) => setData('note', e.target.value)} rows={3} className="min-h-11 w-full rounded-lg border px-3 py-2" placeholder="Tambahkan catatan..." />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Content Link (URL)</label>
              <input type="url" value={data.content_link} onChange={(e) => setData('content_link', e.target.value)} className="min-h-11 w-full rounded-lg border px-3 py-2" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-base font-medium mb-1">Upload Bukti Tindak Lanjut (maks 5 file)</label>
              <input ref={fileRef} type="file" accept="image/*,.pdf" multiple onChange={(e) => setData('follow_up_files', Array.from(e.target.files || []))} className="min-h-11 w-full rounded-lg border px-3 py-2 text-base" />
              {errors.follow_up_files && <p className="text-destructive text-sm mt-1">{errors.follow_up_files}</p>}
            </div>
            <div className="flex gap-3">
              <button type="button" disabled={processing || !data.status} onClick={submit} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50">
                {processing ? 'Menyimpan...' : 'Simpan'}
              </button>
              <Link href="/admin/info-requests" className="bg-background text-foreground px-6 py-2 rounded-lg text-base hover:bg-border">Kembali</Link>
            </div>
          </div>
        </BentoCard>
        )}
      </div>
    </AdminLayout>
  )
}
