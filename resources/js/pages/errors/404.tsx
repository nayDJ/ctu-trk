import { Link, usePage } from '@inertiajs/react'
import { HomeIcon } from '@heroicons/react/24/outline'
import ErrorState from '@/components/ErrorState'

export default function NotFound() {
  const { url } = usePage()
  const isAdmin = url.startsWith('/admin')

  return (
    <ErrorState
      code="404"
      title="Halaman tidak ditemukan"
      description="Alamat ini tidak tersedia atau halaman sudah dipindahkan. Periksa kembali tautan yang Anda gunakan."
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
