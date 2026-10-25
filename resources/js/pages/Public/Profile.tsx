import { useEffect } from 'react'
import PublicLayout from '@/layouts/PublicLayout'
import AnimatedCounter from '@/components/AnimatedCounter'
import PageHeader from '@/components/PageHeader'
import TeamShowcase from '@/components/ui/team-showcase'
import ElegantCarousel from '@/components/ui/elegant-carousel'
import { BuildingOffice2Icon } from '@heroicons/react/24/outline'
import type { Official } from '@/components/ui/team-showcase'

interface ProfileProps {
  settings: Record<string, string>
  villages: Array<{ id: number; name: string; leader_name: string; description: string; photo: string }>
  officials: Official[]
  section: string
}

function splitSettingLines(value: string): string[] {
  return value
    .split(/\r?\n|\\n/)
    .map((line) => line.trim().replace(/^\d+[.)]\s*/, ''))
    .filter(Boolean)
}

export default function Profile({ settings, villages, officials, section }: ProfileProps) {
  useEffect(() => {
    const id = section === 'tentang-kami' ? 'tentang' : section
    const isDeepLink = window.location.pathname !== '/profil' || window.location.hash.length > 0
    if (!id || !isDeepLink) return

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [section])

  return (
    <PublicLayout title="Profil">
      <PageHeader
        badge="TENTANG KAMI"
        title="Profil Kecamatan"
        description={settings.kecamatan_name || 'Kecamatan Tarakan Utara'}
        icon={BuildingOffice2Icon}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Tentang Kecamatan */}
        <section className="scroll-mt-24" id="tentang">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Tentang Kecamatan</h2>
          <p className="text-xl text-muted leading-relaxed">
            {settings.kecamatan_name || 'Kecamatan Tarakan Utara'} adalah salah satu kecamatan di {settings.kota_name || 'Kota Tarakan'}, {settings.provinsi_name || 'Kalimantan Utara'}.
          </p>
        </section>

        {/* Sambutan Camat */}
        {settings.camat_greeting && (
          <section className="scroll-mt-24" id="sambutan">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Sambutan Camat</h2>
            <blockquote className="text-xl italic text-muted border-l-4 border-primary pl-8 py-4 bg-primary/5 rounded-r-xl">
              &ldquo;{settings.camat_greeting}&rdquo;
              <footer className="mt-4 text-sm text-muted not-italic">- {settings.camat_name || 'Camat Tarakan Utara'}</footer>
            </blockquote>
          </section>
        )}

        {/* Pejabat Kecamatan */}
        {officials.length > 0 && (
          <section className="scroll-mt-24" id="pejabat">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Pejabat Kecamatan</h2>
            <TeamShowcase members={officials} />
          </section>
        )}

        {/* Maklumat Pelayanan */}
        {settings.maklumat_pelayanan && (
          <section className="scroll-mt-24" id="maklumat">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Maklumat Pelayanan</h2>
            <blockquote className="text-lg text-muted border-l-4 border-primary pl-8 py-4 bg-primary/5 rounded-r-xl">
              {settings.maklumat_pelayanan}
            </blockquote>
          </section>
        )}

        {/* Tupoksi */}
        {settings.tupoksi && (
          <section className="scroll-mt-24" id="tupoksi">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Tugas Pokok & Fungsi</h2>
            <ul className="space-y-3">
              {splitSettingLines(settings.tupoksi).map((item, i) => (
                <li key={i} className="flex gap-4 text-lg text-muted leading-relaxed">
                  <span className="font-semibold text-primary shrink-0">{i + 1}.</span>
                  <span>{item.trim()}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Statistik Warga */}
        <section className="scroll-mt-24" id="statistik">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight mb-8">Statistik Warga</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-6 text-center md:p-8">
              <p className="font-heading text-4xl font-bold tabular-nums text-primary md:text-5xl">
                <AnimatedCounter end={parseInt(settings.statistik_warga || '0')} />
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted md:text-sm">Total Warga</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6 text-center md:p-8">
              <p className="font-heading text-4xl font-bold tabular-nums text-primary md:text-5xl">
                <AnimatedCounter end={parseInt(settings.statistik_rt || '0')} />
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted md:text-sm">Rukun Tetangga</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6 text-center md:p-8">
              <p className="font-heading text-4xl font-bold tabular-nums text-primary md:text-5xl">
                <AnimatedCounter end={parseInt(settings.statistik_kk || '0')} />
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted md:text-sm">Kartu Keluarga</p>
            </div>
          </div>
        </section>

        {/* Visi & Misi */}
        {settings.visi && (
          <section className="scroll-mt-24" id="visi-misi">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Visi & Misi</h2>
            <blockquote className="text-xl italic text-muted border-l-4 border-primary pl-8 py-4 bg-primary/5 rounded-r-xl mb-8">
              &ldquo;{settings.visi}&rdquo;
            </blockquote>
            {settings.misi && (
              <ol className="space-y-4">
                {splitSettingLines(settings.misi).map((m, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-semibold text-primary shrink-0 text-lg">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-lg text-muted leading-relaxed">{m.trim()}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}

        {/* Struktur Organisasi */}
        <section className="scroll-mt-24" id="struktur">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Struktur Organisasi</h2>
          {settings.struktur_organisasi_image ? (
            <img src={`/storage/${settings.struktur_organisasi_image}`} alt="Struktur Organisasi" className="w-full rounded-xl border border-border" />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-border bg-surface">
              <span className="text-lg text-muted">Gambar belum tersedia</span>
            </div>
          )}
        </section>

        {/* Daftar Kelurahan */}
        {villages.length > 0 && (
          <section className="scroll-mt-24" id="kelurahan">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Daftar Kelurahan</h2>
            <ElegantCarousel villages={villages} />
          </section>
        )}
      </div>
    </PublicLayout>
  )
}
