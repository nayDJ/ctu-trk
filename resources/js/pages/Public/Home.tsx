import PublicLayout from '@/layouts/PublicLayout'
import { Link } from '@inertiajs/react'
import { HeroSection } from '@/components/blocks/hero-section-1'
import { AnimatedGroup } from '@/components/ui/animated-group'
import ComplaintTestimonials from '@/components/ui/ComplaintTestimonials'
import CTABanner from '@/components/CTABanner'
import SectionBadge from '@/components/SectionBadge'
import { KAWUNG_GREEN } from '@/lib/batik'
import { formatDateShort } from '@/lib/date'
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  MapPinIcon,
  CubeIcon,
} from '@heroicons/react/24/outline'

interface HomeProps {
  settings: Record<string, string>
  sliders: Array<{ id: number; title: string; image: string; link_url: string }>
  services: Array<{ id: number; name: string; slug: string; description: string | null }>
  latestBerita: Array<{ id: number; title: string; slug: string; excerpt: string; published_at: string; image: string | null }>
  completedComplaints: Array<{ id: number; title: string; description: string; is_anonymous: boolean }>
  villages: Array<{ id: number; name: string }>
}

const PRIMARY_SLUGS = ['pengaduan-masyarakat', 'permohonan-informasi-publik']

const serviceIcons: Record<string, typeof ClipboardDocumentListIcon> = {
  'pengaduan-masyarakat': ClipboardDocumentListIcon,
  'permohonan-informasi-publik': DocumentTextIcon,
}

const fasilitas = [
  { icon: BuildingOfficeIcon, title: 'Kantor Utama', desc: 'Kantor pusat Kecamatan Tarakan Utara melayani masyarakat.' },
  { icon: ClipboardDocumentListIcon, title: 'Ruang Pelayanan Publik', desc: 'Layanan terpadu untuk masyarakat.' },
  { icon: ChatBubbleLeftRightIcon, title: 'Ruang Mediasi', desc: 'Ruang untuk mediasi dan penyelesaian keluhan.' },
  { icon: UsersIcon, title: 'Aula Pertemuan', desc: 'Aula untuk pertemuan dan kegiatan warga.' },
  { icon: MapPinIcon, title: 'Area Parkir Luas', desc: 'Parkir kendaraan roda dua dan empat.' },
  { icon: CubeIcon, title: 'Fasilitas Umum', desc: 'Fasilitas penunjang lainnya untuk kenyamanan.' },
]

const formatNumber = (value: string | number): string => {
  const digits = String(value).replace(/[^0-9]/g, '')
  return new Intl.NumberFormat('id-ID').format(Number(digits || 0))
}

export default function Home({ settings, sliders, services, latestBerita, completedComplaints, villages }: HomeProps) {
  return (
    <PublicLayout>
      <HeroSection settings={settings} sliders={sliders} />

      {services.length > 0 && (
        <section className="relative overflow-hidden py-16 md:py-20" aria-labelledby="layanan-title">
          <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: KAWUNG_GREEN }} />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-center justify-between gap-4">
              <div>
                <AnimatedGroup mode="scroll">
                  <SectionBadge>LAYANAN KAMI</SectionBadge>
                  <h2 id="layanan-title" className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    Layanan Publik untuk Masyarakat
                  </h2>
                  <p className="mt-1 text-muted">Pilihan layanan lengkap untuk masyarakat dan instansi.</p>
                </AnimatedGroup>
              </div>
              <Link
                href="/layanan"
                className="hidden min-h-11 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:inline-flex"
              >
                Jelajahi Layanan <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = serviceIcons[service.slug] || ClipboardDocumentListIcon
                const isPrimary = PRIMARY_SLUGS.includes(service.slug)
                return (
                  <Link
                    key={service.id}
                    href={`/layanan/${service.slug}`}
                    className="group rounded-xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {isPrimary ? 'Layanan utama' : 'Layanan lainnya'}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">{service.name}</h3>
                    {service.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{service.description}</p>
                    )}
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                      Selengkapnya
                      <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="mt-6 text-center md:hidden">
              <Link
                href="/layanan"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Jelajahi Layanan <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {latestBerita.length > 0 && (
        <section className="relative overflow-hidden py-16 md:py-20" aria-labelledby="berita-title">
          <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: KAWUNG_GREEN }} />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-center justify-between gap-4">
              <div>
                <AnimatedGroup mode="scroll">
                  <SectionBadge>BERITA TERKINI</SectionBadge>
                  <h2 id="berita-title" className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    Informasi dan Publikasi Terbaru
                  </h2>
                  <p className="mt-1 text-muted">Kabar terkini mengenai kegiatan dan pelayanan di wilayah.</p>
                </AnimatedGroup>
              </div>
              <Link
                href="/informasi/berita"
                className="hidden min-h-11 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:inline-flex"
              >
                Baca Berita Lainnya <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestBerita.map((post) => (
                <Link
                  key={post.id}
                  href={`/informasi/berita/${post.slug}`}
                  className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow group-hover:shadow-md">
                    <div className="relative aspect-video">
                      {post.image ? (
                        <img src={`/storage/${post.image}`} alt={post.title} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-background">
                          <span className="px-3 text-center text-sm text-muted">Gambar belum tersedia</span>
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-white">
                        Berita
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="mb-2 flex items-center gap-1 text-xs text-muted">
                        <CalendarDaysIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDateShort(post.published_at)}
                      </p>
                      <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">{post.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                      <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                        Baca selengkapnya
                        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center md:hidden">
              <Link
                href="/informasi/berita"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Baca Berita Lainnya <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {completedComplaints.length > 0 && (
        <section className="relative overflow-hidden py-16 md:py-20" aria-labelledby="pengaduan-selesai-title">
          <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: KAWUNG_GREEN }} />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatedGroup mode="scroll">
              <div className="mx-auto mb-4 flex max-w-[560px] flex-col items-center justify-center">
                <h2 id="pengaduan-selesai-title" className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  Pengaduan yang Sudah Selesai
                </h2>
                <p className="mt-1 text-center text-muted">
                  Ringkasan pengaduan masyarakat yang telah ditindaklanjuti hingga selesai.
                </p>
              </div>
            </AnimatedGroup>
            <ComplaintTestimonials complaints={completedComplaints} />
          </div>
        </section>
      )}

      <section className="relative overflow-hidden py-16 md:py-20" aria-labelledby="fasilitas-title">
        <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: KAWUNG_GREEN }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <AnimatedGroup mode="scroll">
              <SectionBadge>FASILITAS KANTOR</SectionBadge>
              <h2 id="fasilitas-title" className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Fasilitas dan Ruang Pelayanan
              </h2>
              <p className="mt-1 text-muted">Dukungan fasilitas kantor untuk pelayanan prima.</p>
            </AnimatedGroup>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fasilitas.map((item) => (
              <div key={item.title} className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <item.icon className="h-12 w-12 text-primary/60" aria-hidden="true" />
                </div>
                <div className="p-5">
                  <h3 className="mb-2 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />

      <section className="relative overflow-hidden py-16 md:py-20" aria-labelledby="statistik-title">
        <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: KAWUNG_GREEN }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedGroup mode="scroll">
            <div className="mb-12 text-center">
              <SectionBadge>STATISTIK WARGA</SectionBadge>
              <h2 id="statistik-title" className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Data Kependudukan dan Wilayah
              </h2>
            </div>
          </AnimatedGroup>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-border">
            <div className="px-4 text-center">
              <p className="text-4xl font-bold text-primary md:text-5xl">{formatNumber(settings.statistik_warga || 0)}</p>
              <p className="mt-3 text-sm font-medium uppercase tracking-wider text-muted">Total Warga</p>
            </div>
            <div className="px-4 text-center">
              <p className="text-4xl font-bold text-primary md:text-5xl">{formatNumber(settings.statistik_kk || 0)}</p>
              <p className="mt-3 text-sm font-medium uppercase tracking-wider text-muted">Kepala Keluarga</p>
            </div>
            <div className="px-4 text-center">
              <p className="text-4xl font-bold text-primary md:text-5xl">{formatNumber(settings.statistik_rt || 0)}</p>
              <p className="mt-3 text-sm font-medium uppercase tracking-wider text-muted">Rukun Tetangga</p>
            </div>
            <div className="px-4 text-center">
              <p className="text-4xl font-bold text-primary md:text-5xl">{formatNumber(villages.length)}</p>
              <p className="mt-3 text-sm font-medium uppercase tracking-wider text-muted">Kelurahan</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
