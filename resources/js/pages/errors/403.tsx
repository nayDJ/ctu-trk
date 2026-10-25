import { Link, usePage } from '@inertiajs/react'
import { HomeIcon } from '@heroicons/react/24/outline'
import ErrorState from '@/components/ErrorState'

export default function Forbidden() {
  const { url } = usePage()
  const isAdmin = url.startsWith('/admin')

  return (
    <ErrorState
      code="403"
      title="Akses ditolak"
      description="Akun Anda tidak memiliki izin untuk membuka halaman ini. Hubungi administrator bila akses ini diperlukan."
    >
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
