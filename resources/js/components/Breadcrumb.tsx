import { Link, usePage } from '@inertiajs/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

export default function Breadcrumb() {
  const { url } = usePage()
  const segments = url.split('?')[0].split('/').filter(Boolean)

  if (segments.length <= 1) return null

  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/')
    const label = seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    return { href, label, isLast: i === segments.length - 1 }
  })

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-muted">
      <Link
        href="/admin"
        className="inline-flex min-h-11 items-center rounded px-0.5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Beranda
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRightIcon className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          {crumb.isLast ? (
            <span aria-current="page" className="inline-flex min-h-11 items-center font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="inline-flex min-h-11 items-center rounded px-0.5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
