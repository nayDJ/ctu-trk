import { Head, Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import { patternForPage } from '@/lib/batik'

interface ErrorStateProps {
  code: string
  title: string
  description: string
  children: ReactNode
}

export default function ErrorState({ code, title, description, children }: ErrorStateProps) {
  const { url } = usePage()
  const isAdmin = url.startsWith('/admin')

  return (
    <>
      <Head title={`${code} - ${title}`} />
      <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: patternForPage(url) }} />
        <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <img src="/images/logo.png" alt="" className="h-8 w-auto" />
            <span className="text-sm font-semibold text-foreground">Kecamatan Tarakan Utara</span>
          </Link>
          <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            {isAdmin ? 'Panel admin' : 'Situs publik'}
          </span>
        </header>

        <main className="relative z-10 flex flex-1 items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-xl">
            <p className="text-sm font-semibold text-primary">Kode {code}</p>
            <div aria-hidden="true" className="mt-2 text-7xl font-bold leading-none tracking-tight text-primary/20 sm:text-8xl">
              {code}
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-md text-base leading-7 text-muted">{description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>
          </div>
        </main>

        <footer className="relative z-10 mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-4 text-sm text-muted sm:px-6 lg:px-8">
          <span>&copy; {new Date().getFullYear()} Kecamatan Tarakan Utara</span>
          <Link href="/kontak" className="inline-flex min-h-11 items-center rounded px-1 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Hubungi kami
          </Link>
        </footer>
      </div>
    </>
  )
}
