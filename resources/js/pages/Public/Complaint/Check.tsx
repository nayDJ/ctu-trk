import PublicLayout from '@/layouts/PublicLayout'
import PageHeader from '@/components/PageHeader'
import FaqAccordion from '@/components/FaqAccordion'
import { useForm, usePage } from '@inertiajs/react'
import type { FormEvent } from 'react'
import {
  ArrowPathIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

const faqItems = [
  {
    q: 'Format tiket apa yang bisa dicek?',
    a: 'Pengaduan menggunakan format CTU-XXXXX (5 karakter). Permohonan informasi publik menggunakan format IFM-XXXXX (5 karakter). Cukup masukkan nomor tiket yang Anda terima setelah berhasil mengirim.',
  },
  {
    q: 'Apakah cukup nomor tiket?',
    a: 'Ya. Cukup masukkan nomor tiket yang Anda terima saat mengirim pengaduan atau permohonan informasi.',
  },
  {
    q: 'Berapa lama proses pengaduan?',
    a: 'Pengaduan akan ditangani dalam waktu 3x24 jam untuk verifikasi, dan maksimal 14 hari kerja untuk penyelesaian tergantung kompleksitas permasalahan.',
  },
  {
    q: 'Bagaimana jika tiket tidak ditemukan?',
    a: 'Pastikan nomor tiket yang dimasukkan benar, termasuk huruf besar dan tanda hubung. Jika tetap tidak ditemukan, silakan hubungi kantor kecamatan pada jam layanan.',
  },
  {
    q: 'Apa yang harus dilakukan setelah status selesai?',
    a: 'Jika pengaduan Anda telah selesai ditangani, Anda dapat memberikan konfirmasi atau masukan melalui kontak yang tersedia. Untuk permohonan informasi, dokumen akan disiapkan sesuai ketentuan.',
  },
  {
    q: 'Bisakah mengecek lebih dari satu tiket sekaligus?',
    a: 'Saat ini pemeriksaan dilakukan satu tiket per permintaan. Anda dapat memasukkan tiket berikutnya setelah hasil sebelumnya ditampilkan.',
  },
]

const alurSteps = [
  { icon: MagnifyingGlassIcon, label: 'Masukkan tiket', desc: 'Ketik nomor tiket CTU atau IFM yang Anda terima.' },
  { icon: EyeIcon, label: 'Lihat status', desc: 'Sistem akan menampilkan status terkini pengaduan atau permohonan Anda.' },
  { icon: ArrowPathIcon, label: 'Tindak lanjut', desc: 'Hubungi kami jika ada pertanyaan lebih lanjut.' },
]

const ticketInputClass = 'min-h-11 w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-base uppercase tracking-wide text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary'

export default function ComplaintCheck() {
  const { settings } = usePage().props as { settings?: Record<string, string> }
  const complaint = useForm({ ticket: '' })
  const infoRequest = useForm({ ticket: '' })

  const submitComplaint = (event: FormEvent) => {
    event.preventDefault()
    complaint.post('/pengaduan/cek')
  }

  const submitInfoRequest = (event: FormEvent) => {
    event.preventDefault()
    infoRequest.post('/permohonan-info/cek')
  }

  return (
    <PublicLayout title="Cek Status">
      <PageHeader
        badge="CEK STATUS"
        title="Cek Status Layanan"
        description="Masukkan nomor tiket untuk melacak status pengaduan atau permohonan informasi Anda."
        icon={MagnifyingGlassIcon}
      />

      <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-16 grid gap-6 md:grid-cols-2">
          <section aria-labelledby="cek-pengaduan-title" className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardDocumentListIcon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 id="cek-pengaduan-title" className="text-lg font-semibold text-foreground">Pengaduan</h2>
                <p className="text-sm text-muted">CTU-XXXXX</p>
              </div>
            </div>
            <form onSubmit={submitComplaint} className="space-y-3">
              <div>
                <label htmlFor="cek-pengaduan-tiket" className="mb-1 block text-sm font-medium text-foreground">Nomor tiket pengaduan</label>
                <input
                  id="cek-pengaduan-tiket"
                  type="text"
                  value={complaint.data.ticket}
                  onChange={(event) => complaint.setData('ticket', event.target.value.toUpperCase())}
                  className={ticketInputClass}
                  placeholder="Contoh: CTU-A1B2C"
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={complaint.errors.ticket ? true : undefined}
                  aria-describedby={complaint.errors.ticket ? 'cek-pengaduan-tiket-error cek-pengaduan-tiket-help' : 'cek-pengaduan-tiket-help'}
                />
                <p id="cek-pengaduan-tiket-help" className="mt-1 text-sm text-muted">Nomor tiket diberikan setelah pengaduan berhasil dikirim.</p>
              </div>
              {complaint.errors.ticket && <p id="cek-pengaduan-tiket-error" role="alert" className="text-sm text-destructive">{complaint.errors.ticket}</p>}
              <button
                type="submit"
                disabled={complaint.processing}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                {complaint.processing ? 'Mencari...' : 'Cek status pengaduan'}
              </button>
            </form>
          </section>

          <section aria-labelledby="cek-info-title" className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <DocumentTextIcon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 id="cek-info-title" className="text-lg font-semibold text-foreground">Permohonan informasi</h2>
                <p className="text-sm text-muted">IFM-XXXXX</p>
              </div>
            </div>
            <form onSubmit={submitInfoRequest} className="space-y-3">
              <div>
                <label htmlFor="cek-info-tiket" className="mb-1 block text-sm font-medium text-foreground">Nomor tiket permohonan informasi</label>
                <input
                  id="cek-info-tiket"
                  type="text"
                  value={infoRequest.data.ticket}
                  onChange={(event) => infoRequest.setData('ticket', event.target.value.toUpperCase())}
                  className={ticketInputClass}
                  placeholder="Contoh: IFM-A1B2C"
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={infoRequest.errors.ticket ? true : undefined}
                  aria-describedby={infoRequest.errors.ticket ? 'cek-info-tiket-error cek-info-tiket-help' : 'cek-info-tiket-help'}
                />
                <p id="cek-info-tiket-help" className="mt-1 text-sm text-muted">Nomor tiket diberikan setelah permohonan berhasil dikirim.</p>
              </div>
              {infoRequest.errors.ticket && <p id="cek-info-tiket-error" role="alert" className="text-sm text-destructive">{infoRequest.errors.ticket}</p>}
              <button
                type="submit"
                disabled={infoRequest.processing}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                {infoRequest.processing ? 'Mencari...' : 'Cek status permohonan'}
              </button>
            </form>
          </section>
        </div>

        <section className="mb-16" aria-labelledby="cara-cek-title">
          <h2 id="cara-cek-title" className="mb-2 text-center text-2xl font-semibold tracking-tight text-foreground">Cara mengecek status</h2>
          <p className="mb-8 text-center text-muted">Ikuti langkah berikut untuk mengetahui status layanan Anda.</p>
          <div className="relative hidden items-start justify-between md:flex">
            <div className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-primary/20" />
            {alurSteps.map((step, index) => (
              <div key={step.label} className="relative z-10 flex w-1/3 flex-col items-center text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{index + 1}</div>
                <step.icon className="mb-2 h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-foreground">{step.label}</h3>
                <p className="mt-1 text-base text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="relative ml-4 space-y-6 border-l-2 border-primary md:hidden">
            {alurSteps.map((step, index) => (
              <div key={step.label} className="relative pl-8">
                <div className="absolute -left-[26px] top-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{index + 1}</div>
                <div className="mb-1 flex items-center gap-2">
                  <step.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-foreground">{step.label}</h3>
                </div>
                <p className="text-base text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16" aria-labelledby="faq-title">
          <h2 id="faq-title" className="mb-2 text-center text-2xl font-semibold tracking-tight text-foreground">Pertanyaan umum</h2>
          <p className="mb-8 text-center text-muted">Temukan jawaban atas pertanyaan yang sering diajukan.</p>
          <FaqAccordion items={faqItems} />
        </section>

        <section aria-labelledby="kontak-cek-title">
          <h2 id="kontak-cek-title" className="mb-8 text-center text-2xl font-semibold tracking-tight text-foreground">Kontak dan jam pelayanan</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MapPinIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Alamat</h3>
              </div>
              <p className="text-base leading-relaxed text-muted">{settings?.alamat || 'Jl. Raja Gibran, Karang Rejo, Kec. Tarakan Utara, Kota Tarakan'}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <EnvelopeIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Email</h3>
              </div>
              <a href={`mailto:${settings?.email || 'info@kecamatan-tarakan-utara.go.id'}`} className="min-w-0 break-all text-base text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {settings?.email || 'info@kecamatan-tarakan-utara.go.id'}
              </a>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ClockIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Jam pelayanan</h3>
              </div>
              <dl className="space-y-2 text-base">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Senin-Jumat</dt>
                  <dd className="font-medium text-foreground">08.00-16.00 WITA</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Sabtu, Minggu, dan libur</dt>
                  <dd className="font-medium text-destructive">Tutup</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
