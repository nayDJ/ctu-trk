import PublicLayout from '@/layouts/PublicLayout'
import FaqAccordion from '@/components/FaqAccordion'
import SectionBadge from '@/components/SectionBadge'
import { Link, usePage } from '@inertiajs/react'
import { patternForPage } from '@/lib/batik'
import { useState } from 'react'
import {
  ArrowTopRightOnSquareIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  EyeIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline'

const kenapaLapor = [
  { icon: EyeIcon, title: 'Transparan', desc: 'Proses penanganan dapat dipantau dan dipertanggungjawabkan.' },
  { icon: ClockIcon, title: 'Cepat', desc: 'Ditindaklanjuti sesuai SOP tanpa penundaan.' },
  { icon: CheckBadgeIcon, title: 'Akuntabel', desc: 'Penyelesaian sesuai peraturan perundang-undangan.' },
  { icon: PaperAirplaneIcon, title: 'Responsif', desc: 'Tanggapan cepat, proaktif, dan tepat sasaran.' },
]

const alurSteps = [
  { num: 1, label: 'Pengaduan', desc: 'Laporan diterima' },
  { num: 2, label: 'Verifikasi', desc: 'Pengecekan data' },
  { num: 3, label: 'Telaah', desc: 'Analisis masalah' },
  { num: 4, label: 'Tindak lanjut', desc: 'Penyelesaian' },
  { num: 5, label: 'Selesai', desc: 'Laporan ditutup' },
]

const langkahOnline = [
  { icon: GlobeAltIcon, title: 'Buka situs atau aplikasi', desc: 'Buka lapor.go.id atau aplikasi SP4N-LAPOR.' },
  { icon: CheckBadgeIcon, title: 'Masuk atau buat akun', desc: 'Masuk atau daftar akun terlebih dahulu.' },
  { icon: DocumentTextIcon, title: 'Tulis laporan', desc: 'Pilih kategori dan uraikan keluhan Anda.' },
  { icon: PaperClipIcon, title: 'Unggah bukti', desc: 'Lampirkan foto atau dokumen pendukung.' },
  { icon: PaperAirplaneIcon, title: 'Kirim dan catat tiket', desc: 'Laporan terkirim, catat nomor tiket.' },
  { icon: MagnifyingGlassIcon, title: 'Pantau status', desc: 'Lacak perkembangan tindak lanjut.' },
]

const langkahLangsung = [
  { icon: BuildingOffice2Icon, title: 'Datang ke kantor', desc: 'Hadir pada jam pelayanan kantor.' },
  { icon: ChatBubbleLeftIcon, title: 'Temui petugas', desc: 'Sampaikan maksud ke petugas layanan.' },
  { icon: DocumentTextIcon, title: 'Sampaikan laporan', desc: 'Uraikan keluhan secara lengkap.' },
  { icon: ClipboardDocumentListIcon, title: 'Verifikasi data', desc: 'Petugas memeriksa data dan bukti.' },
  { icon: CheckCircleIcon, title: 'Terima bukti lapor', desc: 'Dapatkan tanda terima laporan.' },
  { icon: ClockIcon, title: 'Tunggu notifikasi', desc: 'Pantau tindak lanjut melalui petugas.' },
]

const faq = [
  { q: 'Berapa lama laporan saya diproses?', a: 'Laporan akan diverifikasi dalam 1x24 jam dan ditindaklanjuti sesuai SOP yang berlaku. Waktu penyelesaian bervariasi tergantung kompleksitas masalah.' },
  { q: 'Apakah identitas pelapor dirahasiakan?', a: 'Ya, identitas pelapor dijamin kerahasiaannya sesuai dengan peraturan perundang-undangan yang berlaku.' },
  { q: 'Dokumen apa perlu disiapkan?', a: 'Siapkan bukti pendukung seperti foto, dokumen resmi, atau data pendukung lainnya yang relevan dengan laporan Anda.' },
]

export default function Sp4nLapor() {
  const { settings } = usePage().props as { settings?: Record<string, string> }
  const { url } = usePage()
  const email = settings?.email || 'kecamatan.tarakanutara@tarakan.go.id'

  return (
    <PublicLayout title="SP4N-LAPOR">
      <section className="relative py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <img src="/images/SP4N-Lapor.png" alt="SP4N-LAPOR" className="mx-auto mb-6 max-h-40 w-auto max-w-full object-contain" />
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Layanan Aspirasi dan Pengaduan Online Rakyat
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Sampaikan laporan Anda langsung kepada instansi pemerintah berwenang.
          </p>
        </div>
      </section>

      <div className="space-y-0">
        <section className="py-12" aria-labelledby="mengapa-lapor-title">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <SectionBadge>MENGAPA LAPOR</SectionBadge>
              <h2 id="mengapa-lapor-title" className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Mengapa Menyampaikan Pengaduan?
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {kenapaLapor.map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-surface p-6 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="mb-1 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="text-base leading-relaxed text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-12" aria-labelledby="jalur-title">
          <div aria-hidden className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: patternForPage(url) }} />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <SectionBadge>JALUR LAPOR</SectionBadge>
              <h2 id="jalur-title" className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Pilih Jalur Pengaduan
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <GlobeAltIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">SP4N-LAPOR</h3>
                </div>
                <p className="mb-6 text-base leading-relaxed text-muted">
                  Sistem nasional yang terintegrasi dengan seluruh kementerian, lembaga, dan pemerintah daerah. Lapor kapan saja, dari mana saja.
                </p>
                <a
                  href="https://lapor.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Buat laporan di SP4N-LAPOR
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BuildingOffice2Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Datang ke kantor</h3>
                </div>
                <p className="mb-6 text-base leading-relaxed text-muted">
                  Sampaikan pengaduan langsung kepada petugas layanan Kecamatan Tarakan Utara pada jam kerja. Bawa dokumen pendukung yang relevan.
                </p>
                <Link
                  href="/kontak"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Lihat informasi lokasi dan jam buka
                  <MapPinIcon className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12" aria-labelledby="alur-title">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <SectionBadge>ALUR PENANGANAN</SectionBadge>
              <h2 id="alur-title" className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Alur Penanganan Pengaduan
              </h2>
            </div>
            <div className="relative hidden items-start justify-between md:flex">
              <div className="absolute left-[10%] right-[10%] top-5 h-0.5 bg-primary/20" />
              {alurSteps.map((step) => (
                <div key={step.num} className="relative z-10 flex w-1/5 flex-col items-center text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-bold text-white">{step.num}</div>
                  <h3 className="text-lg font-semibold text-foreground">{step.label}</h3>
                  <p className="mt-1 text-base text-muted">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="relative ml-4 space-y-6 border-l-2 border-primary md:hidden">
              {alurSteps.map((step) => (
                <div key={step.num} className="relative pl-8">
                  <div className="absolute -left-[26px] top-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base font-bold text-white">{step.num}</div>
                  <h3 className="text-lg font-semibold text-foreground">{step.label}</h3>
                  <p className="mt-1 text-base text-muted">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-12" aria-labelledby="panduan-title">
          <div aria-hidden className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: patternForPage(url) }} />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <SectionBadge>PANDUAN LAPOR</SectionBadge>
              <h2 id="panduan-title" className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Panduan Detail Pelaporan
              </h2>
              <p className="mt-1 text-muted">Ikuti panduan sesuai jalur yang Anda pilih.</p>
            </div>
            <PanduanTabs />
          </div>
        </section>

        <section className="py-12" aria-labelledby="kontak-sp4n-title">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <SectionBadge>KONTAK</SectionBadge>
              <h2 id="kontak-sp4n-title" className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Kontak dan Jam Pelayanan
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <MapPinIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Alamat kantor</h3>
                </div>
                <p className="mb-3 text-base leading-relaxed text-muted">
                  {settings?.alamat || 'Jl. Raja Gibran, Karang Rejo, Kecamatan Tarakan Utara, Kota Tarakan, Kalimantan Utara'}
                </p>
                <a
                  href="https://www.google.com/maps?q=3.4176,117.5470"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Lihat lokasi di peta
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
              <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <EnvelopeIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Email</h3>
                </div>
                <p className="mb-3 break-words text-base text-muted">{email}</p>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Kirim email
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
              <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <ClockIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Jam pelayanan</h3>
                </div>
                <dl className="space-y-2 text-base">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Hari dan jam</dt>
                    <dd className="text-right font-medium text-foreground">{settings?.jam_layanan || 'Senin-Jumat, 08.00-16.00 WITA'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-12" aria-labelledby="faq-sp4n-title">
          <div aria-hidden className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: patternForPage(url) }} />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <SectionBadge>FAQ</SectionBadge>
              <h2 id="faq-sp4n-title" className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Pertanyaan Umum
              </h2>
            </div>
            <FaqAccordion items={faq} className="mx-auto max-w-3xl" />
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}

function PanduanTabs() {
  const [activeTab, setActiveTab] = useState<'online' | 'langsung'>('online')
  const steps = activeTab === 'online' ? langkahOnline : langkahLangsung

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Pilih jalur panduan">
        <button
          type="button"
          onClick={() => setActiveTab('online')}
          aria-pressed={activeTab === 'online'}
          className={`inline-flex min-h-11 items-center rounded-lg px-5 py-2.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            activeTab === 'online'
              ? 'bg-primary text-white'
              : 'border border-border bg-surface text-muted hover:border-primary/30 hover:text-primary'
          }`}
        >
          Pengaduan online
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('langsung')}
          aria-pressed={activeTab === 'langsung'}
          className={`inline-flex min-h-11 items-center rounded-lg px-5 py-2.5 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
            activeTab === 'langsung'
              ? 'bg-primary text-white'
              : 'border border-border bg-surface text-muted hover:border-primary/30 hover:text-primary'
          }`}
        >
          Pengaduan langsung
        </button>
      </div>

      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="region"
        aria-label={activeTab === 'online' ? 'Panduan pengaduan online' : 'Panduan pengaduan langsung'}
      >
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <step.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="mb-0.5 text-xs font-semibold text-primary">Langkah {index + 1}</p>
              <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
