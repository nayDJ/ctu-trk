import PublicLayout from '@/layouts/PublicLayout'
import PageHeader from '@/components/PageHeader'
import { useForm, usePage } from '@inertiajs/react'
import { useRef, useState, useEffect } from 'react'
import {
  ClipboardDocumentListIcon, DocumentTextIcon, MagnifyingGlassIcon,
  EyeIcon, ArrowPathIcon, ChevronDownIcon, ChevronUpIcon,
  MapPinIcon, EnvelopeIcon, ClockIcon, XMarkIcon,
} from '@heroicons/react/24/outline'

interface ComplaintCreateProps {
  categories: Array<{ id: number; name: string }>
}

const faqItems = [
  {
    q: 'Format tiket apa yang bisa dicek?',
    a: 'Pengaduan menggunakan format CTU-XXXXX (5 karakter). Permohonan informasi publik menggunakan format IFM-XXXXX (5 karakter). Anda akan menerima nomor tiket setelah berhasil mengirim.',
  },
  {
    q: 'Berapa lama proses pengaduan?',
    a: 'Pengaduan akan ditangani dalam waktu 3×24 jam untuk verifikasi, dan maksimal 14 hari kerja untuk penyelesaian tergantung kompleksitas permasalahan.',
  },
  {
    q: 'Bagaimana jika tiket tidak ditemukan?',
    a: 'Pastikan nomor tiket yang dimasukkan benar (termasuk huruf besar dan tanda hubung). Jika tetap tidak ditemukan, silakan hubungi kantor kecamatan pada jam layanan.',
  },
  {
    q: 'Apa yang harus dilakukan setelah status selesai?',
    a: 'Jika pengaduan Anda telah selesai ditangani, Anda dapat memberikan konfirmasi atau feedback melalui kontak yang tersedia. Untuk permohonan informasi, dokumen akan disiapkan sesuai ketentuan.',
  },
  {
    q: 'Bisakah mengecek lebih dari satu tiket sekaligus?',
    a: 'Saat ini pemeriksaan dilakukan satu tiket per permintaan. Anda dapat memasukkan tiket berikutnya setelah hasil sebelumnya ditampilkan.',
  },
]

const alurSteps = [
  { icon: MagnifyingGlassIcon, label: 'Masukkan Tiket', desc: 'Ketik nomor tiket CTU/IFM yang Anda terima.' },
  { icon: EyeIcon, label: 'Lihat Status', desc: 'Sistem akan menampilkan status terkini pengaduan atau permohonan Anda.' },
  { icon: ArrowPathIcon, label: 'Tindak Lanjut', desc: 'Hubungi kami jika ada pertanyaan lebih lanjut.' },
]

const fieldClass = 'w-full min-h-11 rounded-lg border border-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary'

const submitClass = 'inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50'

export default function ComplaintCreate({ categories }: ComplaintCreateProps) {
  const { settings } = usePage().props as { settings?: Record<string, string> }

  // Complaint form
  const complaint = useForm({
    category_id: '', reporter_name: '', reporter_phone: '', reporter_email: '',
    reporter_address: '', is_anonymous: false, title: '', description: '',
    location: '', evidence: null as File | null, website: '',
  })
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  // Info request form
  const infoRequest = useForm({
    requester_name: '', requester_phone: '', requester_email: '', requester_address: '',
    title: '', description: '', info_requested: '', website: '',
  })

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])

  const submitComplaint = (e: React.FormEvent) => {
    e.preventDefault()
    complaint.post('/pengaduan', { forceFormData: true })
  }

  const submitInfoRequest = (e: React.FormEvent) => {
    e.preventDefault()
    infoRequest.post('/permohonan-info', { forceFormData: true })
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      complaint.setData('evidence', file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const removeEvidence = () => {
    complaint.setData('evidence', null)
    setPreview(null)
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  return (
    <PublicLayout title="Pengaduan & Permohonan Informasi">
      <PageHeader
        badge="LAYANAN PUBLIK"
        title="Pengaduan & Permohonan Informasi"
        description="Sampaikan pengaduan masyarakat atau ajukan permohonan informasi publik secara online."
        icon={ClipboardDocumentListIcon}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Formulir Lapor */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* Lapor Pengaduan */}
            <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Lapor Pengaduan</h2>
                  <p className="text-sm text-muted">Sampaikan pengaduan masyarakat</p>
                </div>
              </div>
              <form onSubmit={submitComplaint} className="space-y-3">
                <input type="text" value={complaint.data.website} onChange={(e) => complaint.setData('website', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <div>
                  <label htmlFor="complaint-category_id" className="block text-sm font-medium mb-1">Kategori *</label>
                  <select id="complaint-category_id" value={complaint.data.category_id} onChange={(e) => complaint.setData('category_id', e.target.value)} className={fieldClass} aria-invalid={complaint.errors.category_id ? true : undefined} aria-describedby={complaint.errors.category_id ? 'complaint-category_id-error' : undefined}>
                    <option value="">Pilih kategori</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {complaint.errors.category_id && <p id="complaint-category_id-error" role="alert" className="text-destructive text-sm mt-1">{complaint.errors.category_id}</p>}
                </div>
                <label htmlFor="is_anonymous" className="flex min-h-11 cursor-pointer items-center gap-2 py-1">
                  <input type="checkbox" id="is_anonymous" checked={complaint.data.is_anonymous} onChange={(e) => complaint.setData('is_anonymous', e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-base">Kirim sebagai anonim</span>
                </label>
                {!complaint.data.is_anonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="complaint-reporter_name" className="block text-sm font-medium mb-1">Nama *</label>
                      <input id="complaint-reporter_name" type="text" value={complaint.data.reporter_name} onChange={(e) => complaint.setData('reporter_name', e.target.value)} className={fieldClass} aria-invalid={complaint.errors.reporter_name ? true : undefined} aria-describedby={complaint.errors.reporter_name ? 'complaint-reporter_name-error' : undefined} />
                      {complaint.errors.reporter_name && <p id="complaint-reporter_name-error" role="alert" className="text-destructive text-sm mt-1">{complaint.errors.reporter_name}</p>}
                    </div>
                    <div>
                      <label htmlFor="complaint-reporter_phone" className="block text-sm font-medium mb-1">Telepon *</label>
                      <input id="complaint-reporter_phone" type="tel" value={complaint.data.reporter_phone} onChange={(e) => complaint.setData('reporter_phone', e.target.value)} className={fieldClass} placeholder="08xxx" aria-invalid={complaint.errors.reporter_phone ? true : undefined} aria-describedby={complaint.errors.reporter_phone ? 'complaint-reporter_phone-error' : undefined} />
                      {complaint.errors.reporter_phone && <p id="complaint-reporter_phone-error" role="alert" className="text-destructive text-sm mt-1">{complaint.errors.reporter_phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="complaint-reporter_email" className="block text-sm font-medium mb-1">Email</label>
                      <input id="complaint-reporter_email" type="email" value={complaint.data.reporter_email} onChange={(e) => complaint.setData('reporter_email', e.target.value)} className={fieldClass} placeholder="email@contoh.com" />
                    </div>
                    <div>
                      <label htmlFor="complaint-reporter_address" className="block text-sm font-medium mb-1">Alamat</label>
                      <input id="complaint-reporter_address" type="text" value={complaint.data.reporter_address} onChange={(e) => complaint.setData('reporter_address', e.target.value)} className={fieldClass} />
                    </div>
                  </div>
                )}
                <div>
                  <label htmlFor="complaint-title" className="block text-sm font-medium mb-1">Judul *</label>
                  <input id="complaint-title" type="text" value={complaint.data.title} onChange={(e) => complaint.setData('title', e.target.value)} className={fieldClass} placeholder="Ringkasan singkat" aria-invalid={complaint.errors.title ? true : undefined} aria-describedby={complaint.errors.title ? 'complaint-title-error' : undefined} />
                  {complaint.errors.title && <p id="complaint-title-error" role="alert" className="text-destructive text-sm mt-1">{complaint.errors.title}</p>}
                </div>
                <div>
                  <label htmlFor="complaint-description" className="block text-sm font-medium mb-1">Deskripsi *</label>
                  <textarea id="complaint-description" value={complaint.data.description} onChange={(e) => complaint.setData('description', e.target.value)} rows={3} className={fieldClass} placeholder="Jelaskan pengaduan" aria-invalid={complaint.errors.description ? true : undefined} aria-describedby={complaint.errors.description ? 'complaint-description-error' : undefined} />
                  {complaint.errors.description && <p id="complaint-description-error" role="alert" className="text-destructive text-sm mt-1">{complaint.errors.description}</p>}
                </div>
                <div>
                  <label htmlFor="complaint-location" className="block text-sm font-medium mb-1">Lokasi</label>
                  <input id="complaint-location" type="text" value={complaint.data.location} onChange={(e) => complaint.setData('location', e.target.value)} className={fieldClass} placeholder="Contoh: Jl. Raja Gibran" />
                </div>
                <div>
                  <label htmlFor="complaint-evidence" className="block text-sm font-medium mb-1">Bukti Foto</label>
                  <input ref={fileRef} id="complaint-evidence" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={handleFile} className="hidden" />
                  <div className="rounded-lg border-2 border-dashed border-border bg-background/50 p-4">
                    {preview ? (
                      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                        <img src={preview} alt="Preview bukti foto" loading="lazy" className="max-h-28 rounded-lg border border-border object-contain" />
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            aria-describedby={complaint.errors.evidence ? 'complaint-evidence-error' : undefined}
                            className="inline-flex min-h-11 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          >
                            Ganti foto
                          </button>
                          <button
                            type="button"
                            onClick={removeEvidence}
                            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-destructive/30 bg-destructive-bg px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          >
                            <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        aria-describedby={complaint.errors.evidence ? 'complaint-evidence-error' : undefined}
                        className="flex min-h-24 w-full flex-col items-center justify-center gap-1 rounded-md px-4 py-5 text-center transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                      >
                        <span className="text-sm font-medium text-foreground">Klik untuk unggah foto</span>
                        <span className="text-xs text-muted">JPG, PNG, atau PDF</span>
                      </button>
                    )}
                  </div>
                  {complaint.errors.evidence && <p id="complaint-evidence-error" role="alert" className="text-destructive text-sm mt-1">{complaint.errors.evidence}</p>}
                </div>
                <button type="submit" disabled={complaint.processing} className={submitClass}>
                  {complaint.processing ? 'Mengirim...' : 'Kirim Pengaduan'}
                </button>
              </form>
            </div>

            {/* Permohonan Informasi */}
            <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DocumentTextIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Permohonan Informasi</h2>
                  <p className="text-sm text-muted">Ajukan permohonan informasi publik</p>
                </div>
              </div>
              <form onSubmit={submitInfoRequest} className="space-y-3">
                <input type="text" value={infoRequest.data.website} onChange={(e) => infoRequest.setData('website', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="info-requester_name" className="block text-sm font-medium mb-1">Nama Lengkap *</label>
                    <input id="info-requester_name" type="text" value={infoRequest.data.requester_name} onChange={(e) => infoRequest.setData('requester_name', e.target.value)} className={fieldClass} aria-invalid={infoRequest.errors.requester_name ? true : undefined} aria-describedby={infoRequest.errors.requester_name ? 'info-requester_name-error' : undefined} />
                    {infoRequest.errors.requester_name && <p id="info-requester_name-error" role="alert" className="text-destructive text-sm mt-1">{infoRequest.errors.requester_name}</p>}
                  </div>
                  <div>
                    <label htmlFor="info-requester_phone" className="block text-sm font-medium mb-1">No. Telepon *</label>
                    <input id="info-requester_phone" type="tel" value={infoRequest.data.requester_phone} onChange={(e) => infoRequest.setData('requester_phone', e.target.value)} className={fieldClass} placeholder="08xxx" aria-invalid={infoRequest.errors.requester_phone ? true : undefined} aria-describedby={infoRequest.errors.requester_phone ? 'info-requester_phone-error' : undefined} />
                    {infoRequest.errors.requester_phone && <p id="info-requester_phone-error" role="alert" className="text-destructive text-sm mt-1">{infoRequest.errors.requester_phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="info-requester_email" className="block text-sm font-medium mb-1">Email</label>
                    <input id="info-requester_email" type="email" value={infoRequest.data.requester_email} onChange={(e) => infoRequest.setData('requester_email', e.target.value)} className={fieldClass} placeholder="email@contoh.com" />
                  </div>
                  <div>
                    <label htmlFor="info-requester_address" className="block text-sm font-medium mb-1">Alamat</label>
                    <input id="info-requester_address" type="text" value={infoRequest.data.requester_address} onChange={(e) => infoRequest.setData('requester_address', e.target.value)} className={fieldClass} />
                  </div>
                </div>
                <div>
                  <label htmlFor="info-title" className="block text-sm font-medium mb-1">Judul Permohonan *</label>
                  <input id="info-title" type="text" value={infoRequest.data.title} onChange={(e) => infoRequest.setData('title', e.target.value)} className={fieldClass} placeholder="Ringkasan singkat" aria-invalid={infoRequest.errors.title ? true : undefined} aria-describedby={infoRequest.errors.title ? 'info-title-error' : undefined} />
                  {infoRequest.errors.title && <p id="info-title-error" role="alert" className="text-destructive text-sm mt-1">{infoRequest.errors.title}</p>}
                </div>
                <div>
                  <label htmlFor="info-description" className="block text-sm font-medium mb-1">Deskripsi</label>
                  <textarea id="info-description" value={infoRequest.data.description} onChange={(e) => infoRequest.setData('description', e.target.value)} rows={3} className={fieldClass} placeholder="Jelaskan informasi yang dibutuhkan" />
                </div>
                <div>
                  <label htmlFor="info-info_requested" className="block text-sm font-medium mb-1">Informasi yang Diminta *</label>
                  <textarea id="info-info_requested" value={infoRequest.data.info_requested} onChange={(e) => infoRequest.setData('info_requested', e.target.value)} rows={2} className={fieldClass} placeholder="Sebutkan informasi spesifik yang Anda butuhkan" aria-invalid={infoRequest.errors.info_requested ? true : undefined} aria-describedby={infoRequest.errors.info_requested ? 'info-info_requested-error' : undefined} />
                  {infoRequest.errors.info_requested && <p id="info-info_requested-error" role="alert" className="text-destructive text-sm mt-1">{infoRequest.errors.info_requested}</p>}
                </div>
                <button type="submit" disabled={infoRequest.processing} className={submitClass}>
                  {infoRequest.processing ? 'Mengirim...' : 'Kirim Permohonan'}
                </button>
              </form>
            </div>
          </div>

        {/* Alur Cek Status */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-2">Cara Mengecek Status</h2>
          <p className="text-muted text-center mb-8">Ikuti langkah berikut untuk mengetahui status layanan Anda.</p>
          <div className="hidden md:flex items-start justify-between relative">
            <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-primary/20" />
            {alurSteps.map((s, i) => (
              <div key={i} className="relative flex flex-col items-center text-center z-10 w-1/3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-3">{i + 1}</div>
                <s.icon className="w-6 h-6 text-primary mb-2" />
                <h4 className="font-semibold text-lg">{s.label}</h4>
                <p className="text-muted text-base mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="md:hidden relative ml-4 border-l-2 border-primary space-y-6">
            {alurSteps.map((s, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute -left-[26px] top-0 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">{i + 1}</div>
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-lg">{s.label}</h4>
                </div>
                <p className="text-muted text-base">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pertanyaan Umum */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-2">Pertanyaan Umum</h2>
          <p className="text-muted text-center mb-8">Temukan jawaban atas pertanyaan yang sering diajukan.</p>
          <div className="divide-y divide-border rounded-xl border border-border bg-surface">
            {faqItems.map((item, i) => (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-${i}`}
                  className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:px-6"
                >
                  <span className="pr-4 text-lg font-medium">{item.q}</span>
                  {openFaq === i
                    ? <ChevronUpIcon className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    : <ChevronDownIcon className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  }
                </button>
                <div id={`faq-${i}`} hidden={openFaq !== i} className="px-4 pb-4 text-base leading-relaxed text-muted sm:px-6">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Kontak & Jam Pelayanan */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-8">Kontak &amp; Jam Pelayanan</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPinIcon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Alamat</h3>
              </div>
              <p className="text-muted text-base">{settings?.alamat || 'Jl. Raja Gibran, Karang Rejo, Kec. Tarakan Utara, Kota Tarakan'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <EnvelopeIcon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Email</h3>
              </div>
              <p className="text-muted text-base break-all min-w-0">{settings?.email || 'info@kecamatan-tarakan-utara.go.id'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Jam Pelayanan</h3>
              </div>
              <div className="space-y-3 text-base">
                <div>
                  <p className="text-muted">Senin - Jumat</p>
                  <p className="font-medium">08.00 - 16.00 WITA</p>
                </div>
                <div>
                  <p className="text-muted">Sabtu, Minggu &amp; Libur</p>
                  <p className="font-medium text-destructive">Tutup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
