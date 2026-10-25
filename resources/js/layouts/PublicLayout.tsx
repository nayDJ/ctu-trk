import { type ReactNode, useState, useEffect, useRef } from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import { NavigationMenu } from '@/components/ui/motion-navigation-menu'
import FloatingContact from '@/components/FloatingContact'
import ScrollToTop from '@/components/ScrollToTop'
import { patternForPage } from '@/lib/batik'

const footerLinkClass = 'inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12544F]'

export default function PublicLayout({ children, title }: { children: ReactNode; title?: string }) {
  const { url } = usePage()
  const { menus, settings, villages } = usePage().props as {
    menus?: any[]
    settings?: Record<string, string>
    villages?: Array<{ id: number; name: string; description: string | null }>
  }

  const announcementItems = settings?.marquee_text
    ? settings.marquee_text.split('|').map((text, i) => ({ id: i, name: text.trim() })).filter(item => item.name)
    : villages ?? []

  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const announcementRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(128)
  const announcementHeight = announcementItems.length > 0 && announcementVisible
    ? announcementRef.current?.offsetHeight ?? 40
    : 0

  useEffect(() => {
    const onScroll = () => setAnnouncementVisible(window.scrollY <= 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const measure = () => {
      const header = document.querySelector('header')
      const announcementHeight = announcementItems.length > 0 && announcementVisible
        ? announcementRef.current?.offsetHeight ?? 40
        : 0
      setOffset((header?.offsetHeight ?? 88) + announcementHeight + 8)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [announcementVisible, announcementItems.length])

  return (
    <>
      <Head title={title ? `${title} - Kecamatan Tarakan Utara` : 'Kecamatan Tarakan Utara'} />

      {announcementItems.length > 0 && (
        <div
          ref={announcementRef}
          role="region"
          aria-label="Pengumuman"
          className={`fixed top-0 left-0 right-0 z-[60] overflow-hidden bg-primary text-white transition-transform duration-300 ${announcementVisible ? 'translate-y-0' : '-translate-y-full'}`}
        >
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
            <span className="shrink-0 rounded bg-white/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">Info</span>
            <div className="flex flex-1 items-center gap-5 overflow-x-auto whitespace-nowrap text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {announcementItems.map((item) => (
                <span key={item.id} className="inline-flex shrink-0 items-center gap-2 text-white/85">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white/50" />
                  <span className="font-semibold text-white">{item.name}</span>
                  {item.description && <span className="text-white/75">- {item.description}</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <NavigationMenu
        menus={menus}
        marqueeVisible={announcementHeight > 0}
        marqueeOffset={announcementHeight}
      />
      <main className="relative min-h-screen" style={{ paddingTop: offset }}>
        {url !== '/' && (
          <div aria-hidden className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: patternForPage(url) }} />
        )}
        <div className="relative">{children}</div>
      </main>
      <footer className="relative overflow-hidden bg-gradient-to-b from-[#12544F] to-[#092328] py-12 text-white">
        <div aria-hidden className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: patternForPage(url, 'light') }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-xl font-semibold">Tentang instansi</h3>
              <p className="mb-3 text-base text-white/80">
                {settings?.kecamatan_name || 'Kecamatan Tarakan Utara'}
              </p>
              <p className="text-base leading-relaxed text-white/80">
                Portal layanan publik digital Kecamatan Tarakan Utara. Cepat, transparan, dan mudah diakses oleh seluruh masyarakat.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-semibold">Tautan</h3>
              <ul className="space-y-1 text-base text-white/80">
                <li><a href="https://tarakankota.go.id" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>Pemerintah Kota Tarakan</a></li>
                <li><a href="https://diskominfo.tarakankota.go.id" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>Diskominfo Tarakan</a></li>
                <li><a href="https://lapor.go.id" target="_blank" rel="noopener noreferrer" className={footerLinkClass}>SP4N-LAPOR</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-semibold">Layanan unggulan</h3>
              <ul className="space-y-1 text-base text-white/80">
                <li><Link href="/pengaduan/buat" className={footerLinkClass}>Pengaduan Masyarakat</Link></li>
                <li><Link href="/permohonan-info/buat" className={footerLinkClass}>Permohonan Informasi Publik</Link></li>
                <li><Link href="/layanan" className={footerLinkClass}>Semua Layanan</Link></li>
                <li><Link href="/informasi/dokumen" className={footerLinkClass}>Dokumen PPID</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-semibold">Kontak dan lokasi</h3>
              <div className="space-y-2 text-base text-white/80">
                <p>{settings?.alamat || 'Jl. Pangeran Aji Iskandar RT 018, Kel. Juata Laut'}</p>
                <p>
                  <a href={`tel:${(settings?.telepon || '05512053600').replace(/[^0-9+]/g, '')}`} className={footerLinkClass}>
                    {settings?.telepon || '(0551) 2053600'}
                  </a>
                </p>
                {settings?.email && (
                  <p>
                    <a href={`mailto:${settings.email}`} className={`${footerLinkClass} break-all`}>
                      {settings.email}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 md:flex-row">
            <p className="text-base text-white/80">
              &copy; {new Date().getFullYear()} {settings?.kecamatan_name || 'Kecamatan Tarakan Utara'}. Hak cipta dilindungi.
            </p>
            <nav aria-label="Tautan footer" className="flex flex-wrap justify-center gap-x-4 gap-y-0 text-base text-white/80 md:justify-end">
              <Link href="/pengaduan/cek" className={footerLinkClass}>Cek Pengaduan</Link>
              <Link href="/permohonan-info/cek" className={footerLinkClass}>Cek Permohonan</Link>
              <Link href="/formulir" className={footerLinkClass}>Formulir</Link>
              <Link href="/privasi" className={footerLinkClass}>Kebijakan Privasi</Link>
              <Link href="/kontak" className={footerLinkClass}>Kontak</Link>
            </nav>
          </div>
        </div>
      </footer>
      <FloatingContact />
      <ScrollToTop />
    </>
  )
}
