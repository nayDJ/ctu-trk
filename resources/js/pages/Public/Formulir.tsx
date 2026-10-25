import PublicLayout from '@/layouts/PublicLayout'
import PageHeader from '@/components/PageHeader'
import { Link } from '@inertiajs/react'
import { DocumentTextIcon, ClipboardDocumentListIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const onlineForms = [
  {
    title: 'Formulir Pengaduan & Permohonan Informasi',
    description: 'Gunakan formulir ini untuk menyampaikan pengaduan masyarakat atau mengajukan permohonan informasi publik secara online. Tidak perlu login.',
    icon: ClipboardDocumentListIcon,
    href: '/pengaduan/buat',
    cta: 'Buka Formulir',
  },
]

const downloadableForms = [
  { name: 'Formulir Pengaduan Masyarakat', size: 'PDF, 245 KB', href: '/storage/forms/formulir-pengaduan.pdf' },
  { name: 'Formulir Permohonan Informasi Publik', size: 'PDF, 198 KB', href: '/storage/forms/formulir-permohonan-informasi.pdf' },
  { name: 'Formulir Pendataan Penduduk', size: 'PDF, 156 KB', href: '/storage/forms/formulir-pendataan-penduduk.pdf' },
  { name: 'Formulir Surat Keterangan Domisili', size: 'PDF, 132 KB', href: '/storage/forms/formulir-domisili.pdf' },
]

export default function Formulir() {
  return (
    <PublicLayout title="Formulir">
      <PageHeader
        badge="LAYANAN PUBLIK"
        title="Formulir"
        description="Akses formulir online atau unduh formulir yang Anda butuhkan."
        icon={DocumentTextIcon}
      />

      <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Formulir Online</h2>
          <div className="grid gap-4">
            {onlineForms.map((form) => (
              <Link
                key={form.href}
                href={form.href}
                className="group flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-row sm:items-start sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <form.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                    {form.title}
                  </h3>
                  <p className="mt-1 text-base leading-relaxed text-muted">{form.description}</p>
                </div>
                <span className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary sm:w-auto sm:whitespace-nowrap">
                  {form.cta}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Cek Status</h2>
          <Link
            href="/pengaduan/cek"
            className="group flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-row sm:items-start sm:p-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MagnifyingGlassIcon className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                Cek Status Pengaduan & Permohonan
              </h3>
              <p className="mt-1 text-base leading-relaxed text-muted">Lacak status pengaduan atau permohonan informasi publik</p>
            </div>
            <span className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary sm:w-auto sm:whitespace-nowrap">
              Cek Status
            </span>
          </Link>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Formulir yang Dapat Diunduh</h2>
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {downloadableForms.map((form) => (
              <div
                key={form.href}
                className="flex flex-col gap-3 p-4 transition-colors hover:bg-primary/5 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive-bg">
                    <DocumentTextIcon className="h-5 w-5 text-destructive" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="break-words font-medium text-foreground">{form.name}</p>
                    <p className="text-sm text-muted">{form.size}</p>
                  </div>
                </div>
                <a
                  href={form.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Unduh ${form.name}`}
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-lg px-2 text-primary transition-colors hover:bg-primary/5 hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:self-auto"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-semibold">Unduh</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-border bg-primary-light/40 p-5 text-sm leading-relaxed text-foreground/80 sm:p-6">
          <p className="mb-2 font-heading font-semibold text-foreground">Catatan</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Formulir online dapat diakses tanpa login atau registrasi akun.</li>
            <li>Pastikan data yang diisi sudah benar sebelum mengirim.</li>
            <li>Anda akan mendapatkan nomor tiket setelah berhasil mengirim. Simpan nomor tersebut untuk mengecek status.</li>
            <li>Untuk bantuan lebih lanjut, silakan hubungi kantor kecamatan.</li>
          </ul>
        </div>
      </div>
    </PublicLayout>
  )
}
