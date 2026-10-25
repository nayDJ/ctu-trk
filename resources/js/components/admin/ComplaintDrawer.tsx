import { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { ChatBubbleLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import EntityDrawer from '@/components/admin/EntityDrawer'
import StatusPill from '@/components/admin/StatusPill'
import { formatDateTime } from '@/lib/date'

interface ComplaintFile {
  type: string; path: string; mime: string; size: number
}

interface ComplaintHistory {
  status: string; note: string; content_link: string | null; created_at: string; admin: { name: string } | null
}

interface ComplaintData {
  id: number; ticket: string; tracking_code: string; title: string; description: string; status: string
  is_anonymous: boolean
  reporter_name: string; reporter_phone: string; reporter_email: string; reporter_address: string; location: string
  category: { name: string } | null
  histories: ComplaintHistory[]
  files: ComplaintFile[]
}

interface ComplaintDrawerProps {
  complaintId: number | null
  onClose: () => void
}

const STATUS_OPTIONS = [
  { value: 'SUBMITTED', label: 'Diterima' },
  { value: 'VERIFIED', label: 'Diverifikasi' },
  { value: 'PROCESSING', label: 'Diproses' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'REJECTED', label: 'Ditolak' },
]

const inputClass = 'min-h-11 w-full rounded-lg border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary'

export default function ComplaintDrawer({ complaintId, onClose }: ComplaintDrawerProps) {
  const [complaint, setComplaint] = useState<ComplaintData | null>(null)
  const [canViewPii, setCanViewPii] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data, setData, post, processing, errors } = useForm({
    status: '', note: '', content_link: '', follow_up_files: [] as File[],
  })

  useEffect(() => {
    if (!complaintId) {
      setComplaint(null)
      setCanViewPii(false)
      return
    }

    setLoading(true)
    fetch(`/admin/complaints/${complaintId}/json`)
      .then(res => res.json())
      .then(json => {
        setComplaint(json.complaint)
        setCanViewPii(json.canViewPii ?? false)
        setData('status', json.complaint.status)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [complaintId])

  const handleSubmit = () => {
    if (!complaint) return
    post(`/admin/complaints/${complaint.id}/update`, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        onClose()
      },
    })
  }

  const isOpen = complaintId !== null
  const evidenceFiles = complaint?.files.filter(file => file.type === 'evidence') ?? []
  const followUpFiles = complaint?.files.filter(file => file.type === 'follow_up') ?? []

  return (
    <EntityDrawer
      open={isOpen}
      onClose={onClose}
      title={
        complaint ? (
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="break-words text-lg font-semibold text-foreground">{complaint.title}</h2>
              <StatusPill status={complaint.status} />
            </div>
            <p className="mt-1 text-sm text-muted">{complaint.ticket} &middot; {complaint.category?.name ?? '-'}</p>
            <p className="mt-0.5 text-sm text-muted">Kode tracking: {complaint.tracking_code}</p>
          </div>
        ) : 'Detail pengaduan'
      }
      footer={
        complaint ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={processing || !data.status}
              onClick={handleSubmit}
              className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : 'Simpan'}
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
          Memuat data...
        </div>
      ) : complaint ? (
        <div className="space-y-4">
          <section className="rounded-lg bg-background p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Detail</h3>
            <p className="whitespace-pre-wrap text-base text-foreground">{complaint.description}</p>
            {complaint.location && (
              <p className="mt-2 text-sm text-muted">Lokasi: {complaint.location}</p>
            )}
          </section>

          <section className="rounded-lg bg-background p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Data pelapor</h3>
            {complaint.is_anonymous ? (
              <p className="text-base italic text-muted">Pelapor memilih untuk anonim</p>
            ) : (
              <>
                <div className="grid gap-x-4 gap-y-1 text-base sm:grid-cols-2">
                  <div className="min-w-0"><span className="text-muted">Nama:</span> {complaint.reporter_name}</div>
                  <div className="min-w-0"><span className="text-muted">HP:</span> {complaint.reporter_phone}</div>
                  {complaint.reporter_email && <div className="min-w-0 break-words sm:col-span-2"><span className="text-muted">Email:</span> {complaint.reporter_email}</div>}
                  {complaint.reporter_address && <div className="min-w-0 sm:col-span-2"><span className="text-muted">Alamat:</span> {complaint.reporter_address}</div>}
                </div>
                {!canViewPii && (
                  <p className="mt-3 text-sm text-muted">
                    Data pelapor disamarkan. Hubungi admin atau super admin untuk melihat data lengkap.
                  </p>
                )}
                {canViewPii && complaint.reporter_phone && complaint.reporter_phone !== '-' && (
                  <a
                    href={`https://wa.me/${complaint.reporter_phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                  >
                    <ChatBubbleLeftIcon className="h-4 w-4" aria-hidden="true" />
                    WhatsApp
                  </a>
                )}
              </>
            )}
          </section>

          {evidenceFiles.length > 0 && (
            <section className="rounded-lg bg-background p-4">
              <h3 className="mb-2 text-sm font-semibold text-foreground">Bukti foto</h3>
              <div className="flex flex-wrap gap-2">
                {evidenceFiles.map((file, index) => (
                  <a key={index} href={`/storage/${file.path}`} target="_blank" rel="noopener" className="block">
                    {file.mime.startsWith('image/') ? (
                      <img src={`/storage/${file.path}`} alt="Bukti" className="h-20 rounded-lg border border-border" />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-border text-sm text-muted">PDF</div>
                    )}
                  </a>
                ))}
              </div>
            </section>
          )}

          {followUpFiles.length > 0 && (
            <section className="rounded-lg bg-background p-4">
              <h3 className="mb-2 text-sm font-semibold text-foreground">Bukti tindak lanjut</h3>
              <div className="flex flex-wrap gap-2">
                {followUpFiles.map((file, index) => (
                  <a key={index} href={`/storage/${file.path}`} target="_blank" rel="noopener" className="block">
                    {file.mime.startsWith('image/') ? (
                      <img src={`/storage/${file.path}`} alt="Tindak lanjut" className="h-20 rounded-lg border border-border" />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-border text-sm text-muted">PDF</div>
                    )}
                  </a>
                ))}
              </div>
            </section>
          )}

          {complaint.histories.length > 0 && (
            <section className="rounded-lg bg-background p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Riwayat status</h3>
              <div className="relative ml-3 space-y-3 border-l-2 border-border">
                {complaint.histories.map((history, index) => (
                  <div key={index} className="relative pl-5">
                    <div className={`absolute -left-[9px] top-1 h-3.5 w-3.5 rounded-full border-2 border-surface ${index === 0 ? 'bg-primary' : 'bg-border'}`} />
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={history.status} />
                      <span className="text-sm text-foreground">{history.note}</span>
                    </div>
                    {history.content_link && (
                      <a href={history.content_link} target="_blank" rel="noopener" className="mt-0.5 inline-block text-sm text-primary hover:underline">{history.content_link}</a>
                    )}
                    <p className="mt-0.5 text-xs text-muted">{history.admin?.name ?? 'Sistem'} &middot; {formatDateTime(history.created_at)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-3 rounded-lg bg-background p-4">
            <h3 className="text-sm font-semibold text-foreground">Update status</h3>
            <div className="space-y-1">
              <label htmlFor="complaint-status" className="block text-sm font-medium text-foreground">Status</label>
              <select
                id="complaint-status"
                value={data.status}
                onChange={event => setData('status', event.target.value)}
                className={inputClass}
                aria-invalid={errors.status ? true : undefined}
                aria-describedby={errors.status ? 'complaint-status-error' : undefined}
              >
                {STATUS_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              {errors.status && <p id="complaint-status-error" role="alert" className="text-sm text-destructive">{errors.status}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="complaint-note" className="block text-sm font-medium text-foreground">Catatan</label>
              <textarea
                id="complaint-note"
                value={data.note}
                onChange={event => setData('note', event.target.value)}
                rows={2}
                className={inputClass}
                placeholder="Tambahkan catatan..."
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="complaint-content-link" className="block text-sm font-medium text-foreground">Tautan konten</label>
              <input
                id="complaint-content-link"
                type="url"
                value={data.content_link}
                onChange={event => setData('content_link', event.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="complaint-files" className="block text-sm font-medium text-foreground">Upload bukti (maks 5 file)</label>
              <input
                id="complaint-files"
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={event => setData('follow_up_files', Array.from(event.target.files || []))}
                className="block w-full rounded-lg border border-border bg-surface p-2 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary"
              />
              {errors.follow_up_files && <p role="alert" className="text-sm text-destructive">{errors.follow_up_files}</p>}
            </div>
          </section>
        </div>
      ) : null}
    </EntityDrawer>
  )
}
