import PublicLayout from '@/layouts/PublicLayout'
import PageHeader from '@/components/PageHeader'
import { Link, useForm } from '@inertiajs/react'
import { useEffect, type FormEvent } from 'react'
import { formatDateShort } from '@/lib/date'
import { isOfficeOpen } from '@/lib/office-hours'
import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  NewspaperIcon,
  PaperAirplaneIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline'

interface Post {
  id: number
  title: string
  slug: string
  image: string | null
  published_at: string
}

interface Agenda {
  id: number
  title: string
  description: string
  starts_at: string
}

interface ContactProps {
  settings: Record<string, string>
  recentPosts: Post[]
  recentAgendas: Agenda[]
}

const MAPS_LAT = 3.4176
const MAPS_LNG = 117.5470

const fieldClass = 'min-h-11 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary'
const labelClass = 'mb-1 block text-sm font-medium text-foreground'
const errorClass = 'mt-1 text-sm text-destructive'

const formatNumber = (value: string | number): string => {
  const digits = String(value).replace(/[^0-9]/g, '')
  return new Intl.NumberFormat('id-ID').format(Number(digits || 0))
}

export default function Contact({ settings, recentPosts, recentAgendas }: ContactProps) {
  const { data, setData, post, processing, errors, wasSuccessful, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    subject: '',
    body: '',
  })

  useEffect(() => {
    if (wasSuccessful) reset()
  }, [wasSuccessful, reset])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    post('/kontak')
  }

  const isOpen = isOfficeOpen()

  const phoneDigits = (settings.telepon || '05513191200').replace(/[^0-9]/g, '')
  const waNumber = phoneDigits.startsWith('62') ? phoneDigits : `62${phoneDigits.replace(/^0+/, '')}`
  const email = settings.email || 'kecamatan.tarakanutara@tarakan.go.id'
  const mapsUrl = `https://www.google.com/maps?q=${MAPS_LAT},${MAPS_LNG}`

  const contactItems = [
    {
      icon: MapPinIcon,
      label: 'Alamat kantor',
      value: settings.alamat || 'Jl. Raja Gibran, Karang Rejo, Kecamatan Tarakan Utara, Kota Tarakan, Kalimantan Utara',
    },
    {
      icon: PhoneIcon,
      label: 'Telepon atau faksimile',
      value: settings.telepon || '(0551) 2053600',
      href: `tel:${phoneDigits}`,
    },
    {
      icon: ChatBubbleLeftIcon,
      label: 'WhatsApp',
      value: settings.telepon || '(0551) 2053600',
      href: `https://wa.me/${waNumber}`,
    },
    {
      icon: EnvelopeIcon,
      label: 'Email resmi',
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: ClockIcon,
      label: 'Jam operasional',
      value: settings.jam_layanan || 'Senin-Jumat, 08.00-16.00 WITA',
    },
  ]

  return (
    <PublicLayout title="Kontak Kami">
      <PageHeader
        badge="HUBUNGI KAMI"
        title="Hubungi Kami"
        description="Ada pertanyaan? Kirim pesan atau hubungi kami langsung."
        icon={ChatBubbleLeftIcon}
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="min-w-0" aria-labelledby="informasi-kantor-title">
            <h2 id="informasi-kantor-title" className="mb-6 text-2xl font-semibold tracking-tight text-foreground">Informasi kantor dan layanan</h2>
            <div className="space-y-4">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className={`inline-flex min-h-11 max-w-full items-center text-base text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          item.label === 'Email resmi' ? 'break-all' : 'break-words'
                        }`}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="break-words text-base text-muted">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="min-w-0" aria-labelledby="kirim-pesan-title">
            <h2 id="kirim-pesan-title" className="mb-6 text-2xl font-semibold tracking-tight text-foreground">Kirim pesan atau pertanyaan</h2>
            <div className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6">
              {wasSuccessful && (
                <div role="status" className="mb-6 flex items-start gap-3 rounded-lg border border-success/20 bg-success-bg p-4 text-sm font-medium text-success">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  Pesan berhasil dikirim. Kami akan merespons segera.
                </div>
              )}

              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>Nama lengkap *</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={data.name}
                    onChange={(event) => setData('name', event.target.value)}
                    required
                    autoComplete="name"
                    className={fieldClass}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  />
                  {errors.name && <p id="contact-name-error" role="alert" className={errorClass}>{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="contact-email" className={labelClass}>Email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={data.email}
                    onChange={(event) => setData('email', event.target.value)}
                    required
                    autoComplete="email"
                    className={fieldClass}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  />
                  {errors.email && <p id="contact-email-error" role="alert" className={errorClass}>{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="contact-phone" className={labelClass}>Telepon</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    inputMode="tel"
                    value={data.phone}
                    onChange={(event) => setData('phone', event.target.value)}
                    autoComplete="tel"
                    className={fieldClass}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                  />
                  {errors.phone && <p id="contact-phone-error" role="alert" className={errorClass}>{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="contact-subject" className={labelClass}>Subjek *</label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={data.subject}
                    onChange={(event) => setData('subject', event.target.value)}
                    required
                    className={fieldClass}
                    aria-invalid={errors.subject ? true : undefined}
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  />
                  {errors.subject && <p id="contact-subject-error" role="alert" className={errorClass}>{errors.subject}</p>}
                </div>

                <div>
                  <label htmlFor="contact-body" className={labelClass}>Pesan atau pertanyaan *</label>
                  <textarea
                    id="contact-body"
                    value={data.body}
                    onChange={(event) => setData('body', event.target.value)}
                    rows={5}
                    required
                    className={`${fieldClass} resize-none`}
                    aria-invalid={errors.body ? true : undefined}
                    aria-describedby={errors.body ? 'contact-body-error' : undefined}
                  />
                  {errors.body && <p id="contact-body-error" role="alert" className={errorClass}>{errors.body}</p>}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
                  {processing ? 'Mengirim...' : 'Kirim pesan'}
                </button>
              </form>
            </div>
          </section>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col rounded-xl border border-primary/20 bg-primary/5 p-5">
            <div className="mb-2 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="text-base font-semibold text-foreground">Informasi penting</h2>
            </div>
            <p className="flex-1 text-sm leading-relaxed text-muted">
              Bagi masyarakat yang akan melakukan pengaduan atau permohonan informasi publik, mohon siapkan dokumen pendukung yang diperlukan.
            </p>
          </div>

          <div className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <ClockIcon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="text-base font-semibold text-foreground">Jam operasional dan pelayanan</h2>
            </div>
            <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${
              isOpen ? 'border-success/25 bg-success-bg text-success' : 'border-destructive/25 bg-destructive-bg text-destructive'
            }`}>
              <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-success' : 'bg-destructive'}`} />
              {isOpen ? 'Buka sekarang' : 'Tutup sekarang'}
            </span>
            <p className="mt-3 flex-1 text-sm text-muted">{settings.jam_layanan || 'Senin-Jumat, 08.00-16.00 WITA'}</p>
          </div>

          {recentAgendas.length > 0 && (
            <div className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <CalendarDaysIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="text-base font-semibold text-foreground">Agenda terbaru</h2>
              </div>
              <div className="flex-1 space-y-2">
                {recentAgendas.slice(0, 3).map((agenda) => (
                  <Link
                    key={agenda.id}
                    href={`/informasi/agenda/${agenda.id}`}
                    className="block rounded-sm border-b border-border py-2 transition-colors last:border-b-0 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <p className="line-clamp-2 text-sm font-medium text-foreground">{agenda.title}</p>
                    <p className="mt-1 text-xs text-muted">{formatDateShort(agenda.starts_at)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {recentPosts.length > 0 && (
            <div className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <NewspaperIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="text-base font-semibold text-foreground">Berita terkini</h2>
              </div>
              <div className="flex-1 space-y-2">
                {recentPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    href={`/informasi/berita/${post.slug}`}
                    className="block rounded-sm border-b border-border py-2 transition-colors last:border-b-0 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <p className="line-clamp-2 text-sm font-medium text-foreground">{post.title}</p>
                    <p className="mt-1 text-xs text-muted">{formatDateShort(post.published_at)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <ChartBarIcon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="text-base font-semibold text-foreground">Statistik wilayah</h2>
            </div>
            <dl className="flex-1 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Jumlah warga</dt>
                <dd className="font-semibold text-foreground">{formatNumber(settings.statistik_warga || 0)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Kepala keluarga</dt>
                <dd className="font-semibold text-foreground">{formatNumber(settings.statistik_kk || 0)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Jumlah RT</dt>
                <dd className="font-semibold text-foreground">{settings.statistik_rt ? formatNumber(settings.statistik_rt) : 'Belum diisi'}</dd>
              </div>
            </dl>
          </div>
        </div>

        <section aria-labelledby="peta-title" className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 id="peta-title" className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
                <MapPinIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                Peta lokasi kantor
              </h2>
              <p className="mt-1 text-sm text-muted">Petunjuk arah lokasi Kantor Kecamatan Tarakan Utara.</p>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-primary/20 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
              Buka di Google Maps
            </a>
          </div>
          <div className="h-80 w-full overflow-hidden rounded-lg bg-background">
            <iframe
              src={`https://maps.google.com/maps?q=${MAPS_LAT},${MAPS_LNG}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Kantor Kecamatan Tarakan Utara"
            />
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
