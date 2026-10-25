import { Link, usePage } from '@inertiajs/react'
import { ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline'
import ErrorState from '@/components/ErrorState'

export default function ServerError() {
  const { url } = usePage()
  const isAdmin = url.startsWith('/admin')

  return (
    <ErrorState
      code="500"
      title="Terjadi kesalahan"
      description="Permintaan tidak dapat diproses saat ini. Coba muat ulang halaman. Jika masih gagal, hubungi administrator."
    >
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
      >
        <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
        Muat ulang
      </button>
      <Link
        href={isAdmin ? '/admin' : '/'}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
      >
        <HomeIcon className="h-5 w-5" aria-hidden="true" />
        {isAdmin ? 'Kembali ke dashboard' : 'Kembali ke beranda'}
      </Link>
    </ErrorState>
  )
}
