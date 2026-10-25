import PublicLayout from '@/layouts/PublicLayout'
import PageHeader from '@/components/PageHeader'
import { Link } from '@inertiajs/react'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { type ReactNode } from 'react'

function LegalSubsection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="text-base leading-relaxed text-muted">{children}</div>
    </div>
  )
}

export default function Privacy() {
  return (
    <PublicLayout title="Kebijakan Privasi">
      <PageHeader
        badge="KETENTUAN LAYANAN"
        title="Kebijakan Privasi & Ketentuan"
        description="Cara kami mengumpulkan, menggunakan, dan melindungi data yang Anda kirimkan."
        icon={ShieldCheckIcon}
      />

      <div className="mx-auto max-w-4xl space-y-8 px-4 pb-16 sm:px-6 lg:px-8">
        <section
          aria-labelledby="kebijakan-privasi"
          className="rounded-xl border border-border bg-surface p-5 sm:p-8"
        >
          <h2 id="kebijakan-privasi" className="text-xl font-semibold tracking-tight md:text-2xl">
            Kebijakan Privasi
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Website ini berkomitmen untuk melindungi privasi pengunjung. Kebijakan privasi ini menjelaskan bagaimana data pengunjung dikumpulkan dan digunakan.
          </p>

          <div className="mt-6 space-y-6">
            <LegalSubsection title="Informasi yang Dikumpulkan">
              <p>
                Informasi yang dikumpulkan melalui website ini terbatas pada data yang diberikan secara sukarela oleh pengunjung, seperti nama, email, dan nomor telepon saat mengirimkan pesan atau pengaduan.
              </p>
            </LegalSubsection>

            <LegalSubsection title="Penggunaan Informasi">
              <p>
                Informasi yang dikumpulkan digunakan semata-mata untuk keperluan pelayanan dan komunikasi terkait pengaduan atau permohonan informasi yang diajukan.
              </p>
            </LegalSubsection>

            <LegalSubsection title="Perlindungan Data">
              <p>
                Data pribadi pelapor tidak ditampilkan secara publik. Sistem menggunakan masking untuk melindungi identitas pelapor pada data yang ditampilkan kepada publik.
              </p>
            </LegalSubsection>

            <LegalSubsection title="Penyimpanan Data">
              <p>
                Data disimpan di server pemerintah dan hanya dapat diakses oleh petugas yang berwenang.
              </p>
            </LegalSubsection>
          </div>
        </section>

        <section
          aria-labelledby="syarat-ketentuan"
          className="rounded-xl border border-border bg-surface p-5 sm:p-8"
        >
          <h2 id="syarat-ketentuan" className="text-xl font-semibold tracking-tight md:text-2xl">
            Syarat dan Ketentuan
          </h2>

          <div className="mt-6 space-y-6">
            <LegalSubsection title="Penggunaan Website">
              <p>
                Website ini disediakan oleh Pemerintah Kecamatan Tarakan Utara sebagai kanal resmi pengaduan masyarakat dan layanan publik. Penggunaan website ini tunduk pada ketentuan yang berlaku.
              </p>
            </LegalSubsection>

            <LegalSubsection title="Kewajiban Pelapor">
              <ul className="list-disc space-y-2 pl-5 marker:text-primary">
                <li>Menyampaikan pengaduan dengan data yang benar dan lengkap.</li>
                <li>Tidak menyampaikan pengaduan yang bersifat fitnah, palsu, atau menyesatkan.</li>
                <li>Menghormati proses penanganan pengaduan oleh petugas.</li>
                <li>Tidak menyalahgunakan sistem untuk kepentingan pribadi yang merugikan orang lain.</li>
              </ul>
            </LegalSubsection>

            <LegalSubsection title="Batasan Tanggung Jawab">
              <p>
                Pemerintah Kecamatan Tarakan Utara tidak bertanggung jawab atas kerugian yang timbul akibat penyalahgunaan informasi atau layanan yang disediakan melalui website ini.
              </p>
            </LegalSubsection>

            <LegalSubsection title="Perubahan Ketentuan">
              <p>
                Ketentuan ini dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Perubahan akan berlaku segera setelah dipublikasikan di website ini.
              </p>
            </LegalSubsection>

            <LegalSubsection title="Hukum yang Berlaku">
              <p>
                Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia. Setiap sengketa akan diselesaikan melalui jalur hukum yang berlaku di wilayah Indonesia.
              </p>
            </LegalSubsection>
          </div>
        </section>

        <section aria-labelledby="pertanyaan" className="rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
          <h2 id="pertanyaan" className="text-lg font-semibold tracking-tight">
            Pertanyaan
          </h2>
          <p className="mt-2 text-base leading-relaxed text-foreground/80">
            Jika Anda memiliki pertanyaan tentang kebijakan ini atau layanan publik kami, silakan hubungi kantor kecamatan.
          </p>
          <Link
            href="/kontak"
            className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Buka Halaman Kontak
          </Link>
        </section>
      </div>
    </PublicLayout>
  )
}
