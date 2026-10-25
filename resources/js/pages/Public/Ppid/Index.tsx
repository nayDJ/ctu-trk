import PublicLayout from '@/layouts/PublicLayout'
import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'
import SectionBadge from '@/components/SectionBadge'
import { Link, useForm, usePage } from '@inertiajs/react'
import { patternForPage } from '@/lib/batik'
import { useEffect, useMemo, type FormEvent, type ReactNode } from 'react'
import { formatDate } from '@/lib/date'
import {
  ArrowDownTrayIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline'

interface PpidProps {
  settings: Record<string, string>
  documents: {
    data: Array<{ id: number; title: string; description: string | null; file_path: string; category: string; created_at: string }>
    links: { url: string | null; label: string; active: boolean }[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
  activeCategory: string
  documentCounts: Record<string, number>
}

const CATEGORIES = [
  { key: 'berkala', label: 'Berkala' },
  { key: 'serta_merta', label: 'Serta Merta' },
  { key: 'setiap_saat', label: 'Setiap Saat' },
  { key: 'dikecualikan', label: 'Dikecualikan' },
]

const SECTION_LINKS = [
  { href: '#profil', label: 'Profil PPID' },
  { href: '#tugas', label: 'Tugas dan wewenang' },
  { href: '#struktur', label: 'Struktur, visi, misi' },
  { href: '#standar', label: 'Standar layanan' },
  { href: '#pengumuman', label: 'Pengumuman' },
  { href: '#dokumen', label: 'Dokumen' },
  { href: '#permohonan', label: 'Permohonan informasi' },
]

const fieldClass = 'min-h-11 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary'
const labelClass = 'mb-1 block text-sm font-medium text-foreground'
const errorClass = 'mt-1 text-sm text-destructive'

function normalizeMisiLine(line: string): string {
  return line.replace(/^\s*\d+[.)]\s*/, '').trim()
}

export default function PpidIndex({ settings, documents, activeCategory, documentCounts }: PpidProps) {
  const { url } = usePage()

  const ppidTugasLines = useMemo(() => {
    if (!settings.ppid_tugas_wewenang) return []
    return settings.ppid_tugas_wewenang
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  }, [settings.ppid_tugas_wewenang])

  const ppidMisiLines = useMemo(() => {
    if (!settings.ppid_misi) return []
    return settings.ppid_misi
      .split('\n')
      .map(normalizeMisiLine)
      .filter(Boolean)
  }, [settings.ppid_misi])

  const contactEmail = settings.email || 'kecamatan.tarakanutara@tarakan.go.id'

  return (
    <PublicLayout title="PPID">
      <PageHeader
        badge="PPID"
        title="Pejabat Pengelola Informasi dan Dokumentasi"
        description={settings.ppid_deskripsi || 'Akses informasi publik sesuai UU Keterbukaan Informasi Publik.'}
        icon={DocumentTextIcon}
      />

      <nav aria-label="Bagian halaman PPID" className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 pb-2">
          {SECTION_LINKS.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium text-muted transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="profil" className="scroll-mt-36 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl">
            <SectionHeader badge="PROFIL PPID" title="Tentang PPID" />
            <div className="border-t border-border pt-6">
              <p className="max-w-[68ch] whitespace-pre-line text-base leading-7 text-muted">
                {settings.ppid_profil || 'PPID adalah kepanjangan dari Pejabat Pengelola Informasi dan Dokumentasi, di mana PPID berfungsi sebagai pengelola dan penyampai dokumen yang dimiliki oleh badan publik sesuai dengan amanat Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="tugas" className="relative scroll-mt-36 overflow-hidden py-12">
        <div aria-hidden className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: patternForPage(url) }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl">
            <SectionHeader badge="TUGAS, WEWENANG, DAN SK" title="Tugas, Wewenang, dan SK Penetapan" />
            {ppidTugasLines.length > 0 ? (
              <div className={`grid gap-8 ${ppidTugasLines.length > 1 ? 'md:grid-cols-2' : ''}`}>
                {ppidTugasLines.map((line, index) => (
                  <div key={line} className="border-t border-border pt-4">
                    {ppidTugasLines.length === 2 && (
                      <h3 className="text-sm font-semibold text-foreground">
                        {index === 0 ? 'Dasar hukum' : 'Tugas dan wewenang'}
                      </h3>
                    )}
                    <p className={`text-base leading-7 text-muted ${ppidTugasLines.length === 2 ? 'mt-2' : ''}`}>
                      {line}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted">Data tugas dan wewenang akan dilengkapi.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="struktur" className="scroll-mt-36 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="STRUKTUR, VISI, DAN MISI" title="Struktur Organisasi, Visi, dan Misi PPID" />
          <Card>
            <div className="mb-8">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Struktur organisasi</h3>
              {settings.ppid_struktur_image ? (
                <div className="mx-auto max-w-[720px] rounded-lg bg-background p-4 sm:p-6">
                  <a
                    href={`/storage/${settings.ppid_struktur_image}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Buka gambar Struktur Organisasi PPID ukuran penuh"
                    className="mx-auto block max-w-[670px] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <img
                      src={`/storage/${settings.ppid_struktur_image}`}
                      alt="Struktur Organisasi PPID"
                      width={670}
                      height={688}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full rounded-lg object-contain"
                    />
                  </a>
                  <p className="mt-2 text-center text-sm text-muted">Klik gambar untuk melihat ukuran penuh.</p>
                </div>
              ) : (
                <div className="rounded-lg bg-background p-6 text-center">
                  <BuildingOfficeIcon className="mx-auto mb-3 h-16 w-16 text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm text-muted">Struktur Organisasi PPID</p>
                </div>
              )}
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div>
                <p className="text-sm font-semibold text-primary">Visi</p>
                <p className="mt-2 max-w-[46ch] border-l-4 border-primary pl-4 text-xl font-medium leading-relaxed text-foreground">
                  {settings.ppid_visi || 'Terwujudnya pelayanan informasi yang transparan dan akuntabel untuk memenuhi hak pemohon informasi sesuai dengan ketentuan peraturan perundang-undangan secara cepat, tepat, murah dan sederhana.'}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-primary">Misi</p>
                {ppidMisiLines.length > 0 ? (
                  <ol className="mt-3 space-y-3.5">
                    {ppidMisiLines.map((line, index) => (
                      <li key={line} className="flex gap-3 text-base leading-7 text-muted">
                        <span className="text-sm font-semibold leading-7 text-primary tabular-nums">{index + 1}.</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-sm text-muted">Data misi akan dilengkapi.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="standar" className="relative scroll-mt-36 overflow-hidden py-12">
        <div aria-hidden className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: patternForPage(url) }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl">
            <SectionHeader badge="STANDAR LAYANAN" title={settings.ppid_standar_layanan_judul || 'Standar Layanan PPID'} />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
              <div className="border-t border-border pt-4">
                <p className="max-w-[68ch] whitespace-pre-line text-base leading-7 text-muted">
                  {settings.ppid_standar_layanan_deskripsi || 'Standar Layanan PPID dapat diakses pada file berikut: Standar Layanan (lampiran Perwali no 19 tahun 2017). Seluruh layanan permintaan Informasi tidak dipungut biaya, namun penggandaan, perekaman, dan pengiriman informasi yang timbul atas permohonan tersebut ditanggung oleh pemohon.'}
                </p>
              </div>
              {settings.ppid_standar_layanan_image ? (
                <figure className="border-t border-border pt-4">
                  <img src={`/storage/${settings.ppid_standar_layanan_image}`} alt="Lampiran Standar Layanan PPID" className="w-full rounded-lg border border-border object-contain" />
                  <figcaption className="mt-2 text-sm text-muted">Lampiran Standar Layanan PPID</figcaption>
                </figure>
              ) : (
                <figure className="border-t border-border pt-4">
                  <DocumentTextIcon className="h-8 w-8 text-primary/70" aria-hidden="true" />
                  <figcaption className="mt-3 text-sm font-semibold text-foreground">Lampiran standar layanan</figcaption>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    Belum ada lampiran yang diunggah. Hubungi PPID di{' '}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="font-medium text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {contactEmail}
                    </a>{' '}
                    untuk memperoleh salinan.
                  </p>
                </figure>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="pengumuman" className="scroll-mt-36 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl">
            <SectionHeader badge="PENGUMUMAN" title="Pengumuman Informasi Publik" />
            <EditorialNote>
              <p className="max-w-[68ch] whitespace-pre-line text-base leading-7 text-muted">
                {settings.ppid_pengumuman || 'PPID dibentuk sebagai wujud Implementasi pasal 20, 21, 28F, dan pasal 28J Undang-undang Dasar Negara Republik Indonesia tahun 1945, yang menjadi dasar Undang-undang nomor 14 tahun 2008 tentang Keterbukaan Informasi Publik.'}
              </p>
            </EditorialNote>
          </div>
        </div>
      </section>

      <section id="dokumen" className="relative scroll-mt-36 overflow-hidden py-12">
        <div aria-hidden className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: patternForPage(url) }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="DOKUMEN PUBLIK"
            title="Daftar Dokumen PPID"
            subtitle="Informasi publik yang dikelola oleh Pejabat Pengelola Informasi dan Dokumentasi Kecamatan Tarakan Utara."
          />

          <nav aria-label="Kategori dokumen PPID" className="mb-6 flex flex-wrap gap-2 border-b border-border pb-3">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.key
              return (
                <Link
                  key={category.key}
                  href={`/ppid?category=${category.key}`}
                  preserveScroll
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'border border-border bg-surface text-muted hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  {category.label}
                  <span className={`ml-1.5 text-xs ${isActive ? 'text-white' : 'text-muted'}`}>
                    {documentCounts[category.key] ?? 0}
                  </span>
                </Link>
              )
            })}
          </nav>

          {documents.data.length === 0 ? (
            <EmptyState
              icon={DocumentTextIcon}
              title="Belum ada dokumen"
              description="Dokumen untuk kategori ini akan tersedia segera."
            />
          ) : (
            <>
              <ul className="space-y-3 md:hidden">
                {documents.data.map((doc, index) => (
                  <li key={doc.id} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <DocumentTextIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">{doc.title}</p>
                        {doc.description && (
                          <p className="mt-1 text-sm leading-relaxed text-muted">{doc.description}</p>
                        )}
                        <p className="mt-2 text-sm text-muted">
                          {(documents.from ?? 1) + index}. {formatDate(doc.created_at, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`/storage/${doc.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Unduh ${doc.title}`}
                      className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-primary/10 px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
                      Unduh dokumen
                    </a>
                  </li>
                ))}
              </ul>

              <div className="hidden overflow-hidden rounded-xl border border-border bg-surface shadow-sm md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <caption className="sr-only">Daftar dokumen PPID kategori {activeCategory}</caption>
                    <thead>
                      <tr className="bg-primary text-white">
                        <th scope="col" className="w-12 px-4 py-3 text-left">No.</th>
                        <th scope="col" className="px-4 py-3 text-left">Judul Dokumen</th>
                        <th scope="col" className="w-40 px-4 py-3 text-left">Tanggal Terbit</th>
                        <th scope="col" className="w-32 px-4 py-3 text-center">Unduhan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {documents.data.map((doc, index) => (
                        <tr key={doc.id} className="transition-colors hover:bg-primary/5">
                          <td className="px-4 py-3 text-muted">{(documents.from ?? 1) + index}</td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-foreground">{doc.title}</p>
                            {doc.description && (
                              <p className="mt-0.5 text-sm text-muted">{doc.description}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted">
                            {formatDate(doc.created_at, { day: '2-digit', month: 'short' })}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <a
                              href={`/storage/${doc.file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Unduh ${doc.title}`}
                              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-primary/10 px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                              <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
                              Unduh
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {documents.last_page > 1 && (
            <div className="mt-6">
              <Pagination data={documents} links={documents.links} />
            </div>
          )}
        </div>
      </section>

      <section id="permohonan" className="scroll-mt-36 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="PERMOHONAN INFORMASI"
            title="Ajukan Permohonan Informasi Publik"
            subtitle="Ajukan permohonan informasi publik sesuai Undang-Undang Keterbukaan Informasi Publik (UU KIP)."
          />
          <InfoRequestForm />
        </div>
      </section>
    </PublicLayout>
  )
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8">
      {children}
    </div>
  )
}

function EditorialNote({ children }: { children: ReactNode }) {
  return <div className="border-l-4 border-primary bg-primary/5 px-5 py-4">{children}</div>
}

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <SectionBadge>{badge}</SectionBadge>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
    </div>
  )
}

function InfoRequestForm() {
  const { data, setData, post, processing, errors, wasSuccessful, reset } = useForm({
    requester_name: '',
    requester_phone: '',
    requester_email: '',
    requester_address: '',
    title: '',
    description: '',
    info_requested: '',
    website: '',
  })

  useEffect(() => {
    if (wasSuccessful) reset()
  }, [wasSuccessful, reset])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    post('/permohonan-info')
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-8">
      {wasSuccessful && (
        <div role="status" className="mb-6 flex items-start gap-3 rounded-lg border border-success/20 bg-success-bg p-4 text-sm font-medium text-success">
          <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          Permohonan informasi berhasil dikirim. Silakan cek status permohonan Anda.
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        <input type="text" value={data.website} onChange={(event) => setData('website', event.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="requester-name" className={labelClass}>Nama lengkap *</label>
            <input
              id="requester-name"
              type="text"
              value={data.requester_name}
              onChange={(event) => setData('requester_name', event.target.value)}
              required
              autoComplete="name"
              className={fieldClass}
              aria-invalid={errors.requester_name ? true : undefined}
              aria-describedby={errors.requester_name ? 'requester-name-error' : undefined}
            />
            {errors.requester_name && <p id="requester-name-error" role="alert" className={errorClass}>{errors.requester_name}</p>}
          </div>
          <div>
            <label htmlFor="requester-phone" className={labelClass}>Nomor telepon *</label>
            <input
              id="requester-phone"
              type="tel"
              inputMode="tel"
              value={data.requester_phone}
              onChange={(event) => setData('requester_phone', event.target.value)}
              required
              autoComplete="tel"
              className={fieldClass}
              placeholder="08xxx"
              aria-invalid={errors.requester_phone ? true : undefined}
              aria-describedby={errors.requester_phone ? 'requester-phone-error' : undefined}
            />
            {errors.requester_phone && <p id="requester-phone-error" role="alert" className={errorClass}>{errors.requester_phone}</p>}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="requester-email" className={labelClass}>Email</label>
            <input
              id="requester-email"
              type="email"
              value={data.requester_email}
              onChange={(event) => setData('requester_email', event.target.value)}
              autoComplete="email"
              className={fieldClass}
              placeholder="email@contoh.com"
              aria-invalid={errors.requester_email ? true : undefined}
              aria-describedby={errors.requester_email ? 'requester-email-error' : undefined}
            />
            {errors.requester_email && <p id="requester-email-error" role="alert" className={errorClass}>{errors.requester_email}</p>}
          </div>
          <div>
            <label htmlFor="requester-address" className={labelClass}>Alamat</label>
            <input
              id="requester-address"
              type="text"
              value={data.requester_address}
              onChange={(event) => setData('requester_address', event.target.value)}
              autoComplete="street-address"
              className={fieldClass}
              placeholder="Alamat lengkap"
              aria-invalid={errors.requester_address ? true : undefined}
              aria-describedby={errors.requester_address ? 'requester-address-error' : undefined}
            />
            {errors.requester_address && <p id="requester-address-error" role="alert" className={errorClass}>{errors.requester_address}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="request-title" className={labelClass}>Judul *</label>
          <input
            id="request-title"
            type="text"
            value={data.title}
            onChange={(event) => setData('title', event.target.value)}
            required
            className={fieldClass}
            placeholder="Ringkasan permohonan"
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? 'request-title-error' : undefined}
          />
          {errors.title && <p id="request-title-error" role="alert" className={errorClass}>{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="info-requested" className={labelClass}>Informasi yang diminta *</label>
          <textarea
            id="info-requested"
            value={data.info_requested}
            onChange={(event) => setData('info_requested', event.target.value)}
            rows={3}
            required
            className={`${fieldClass} resize-none`}
            placeholder="Jelaskan informasi yang Anda butuhkan"
            aria-invalid={errors.info_requested ? true : undefined}
            aria-describedby={errors.info_requested ? 'info-requested-error' : undefined}
          />
          {errors.info_requested && <p id="info-requested-error" role="alert" className={errorClass}>{errors.info_requested}</p>}
        </div>

        <div>
          <label htmlFor="request-description" className={labelClass}>Deskripsi tambahan</label>
          <textarea
            id="request-description"
            value={data.description}
            onChange={(event) => setData('description', event.target.value)}
            rows={4}
            className={`${fieldClass} resize-none`}
            placeholder="Detail tambahan jika diperlukan"
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={errors.description ? 'request-description-error' : undefined}
          />
          {errors.description && <p id="request-description-error" role="alert" className={errorClass}>{errors.description}</p>}
        </div>

        <button
          type="submit"
          disabled={processing}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
          {processing ? 'Mengirim...' : 'Kirim permohonan'}
        </button>
      </form>
    </div>
  )
}
