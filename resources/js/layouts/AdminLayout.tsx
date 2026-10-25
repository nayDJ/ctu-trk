import { type ReactNode, useState, useEffect, useRef } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { Bars3Icon, ArrowRightStartOnRectangleIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import { iconMap } from '@/lib/iconMap'
import { formatDate } from '@/lib/date'
import Breadcrumb from '@/components/Breadcrumb'
import { Clock } from '@/components/ui/sliding-number'
import type { ComponentType } from 'react'

interface SidebarMenuItem {
  id: number
  label: string
  href: string
  icon: string | null
  role: string | null
  sort_order: number
  is_active: boolean
}

const adminOnlyMenuPrefixes = [
  '/admin/categories',
  '/admin/services',
  '/admin/officials',
  '/admin/villages',
  '/admin/ppid-documents',
  '/admin/audit-logs',
]

const superAdminOnlyMenuPrefixes = [
  '/admin/users',
  '/admin/menus',
  '/admin/profil',
  '/admin/settings',
]

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function matchesPrefix(href: string, prefix: string): boolean {
  return href === prefix || href.startsWith(`${prefix}/`)
}

function isSidebarMenuVisible(menu: SidebarMenuItem, role?: string): boolean {
  if (!menu.is_active) return false
  if (menu.role && !menu.role.split(',').includes(role ?? '')) return false

  if (role === 'super_admin') return true
  if (superAdminOnlyMenuPrefixes.some((prefix) => matchesPrefix(menu.href, prefix))) return false
  if (role !== 'admin' && adminOnlyMenuPrefixes.some((prefix) => matchesPrefix(menu.href, prefix))) return false

  return true
}

export default function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const { url, props } = usePage()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    if (typeof window === 'undefined') return false

    return window.localStorage.getItem('admin.sidebar.expanded') === '1'
  })
  const sidebarRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const logoutDialogRef = useRef<HTMLDialogElement>(null)
  const [sidebarTooltip, setSidebarTooltip] = useState<{ label: string; top: number } | null>(null)

  const isExpanded = isDesktop ? sidebarExpanded : sidebarOpen

  const showSidebarTooltip = (label: string, el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    setSidebarTooltip({ label, top: rect.top + rect.height / 2 })
  }
  const hideSidebarTooltip = () => setSidebarTooltip(null)

  useEffect(() => {
    try {
      window.localStorage.setItem('admin.sidebar.expanded', sidebarExpanded ? '1' : '0')
    } catch {
      // localStorage bisa diblokir (mode privat), abaikan: state tetap jalan di sesi ini
    }
  }, [sidebarExpanded])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const syncDesktop = () => {
      setIsDesktop(media.matches)
      if (media.matches) setSidebarOpen(false)
    }

    syncDesktop()
    media.addEventListener('change', syncDesktop)
    return () => media.removeEventListener('change', syncDesktop)
  }, [])

  const sidebarMenus = (props.sidebarMenus ?? []) as SidebarMenuItem[]
  const settings = (props.settings ?? {}) as Record<string, string>
  const logoText = settings.sidebar_logo_text || 'Admin'
  const userRole = (props.auth as any)?.user?.role
  const unreadMessages = Number(props.unreadMessages ?? 0)

  const sidebarLinks = sidebarMenus
    .filter((menu) => isSidebarMenuVisible(menu, userRole))
    .map((menu) => ({
      ...menu,
      badge: menu.href === '/admin/messages' ? unreadMessages : 0,
      icon: (iconMap[menu.icon ?? ''] ?? iconMap.ChartBarIcon) as ComponentType<{ className?: string }>,
    }))

  useEffect(() => {
    setSidebarOpen(false)
  }, [url])

  useEffect(() => {
    if (isDesktop || !sidebarOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 50)

    const getFocusable = () =>
      Array.from(sidebarRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []).filter(
        (element) => element.offsetParent !== null,
      )

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setSidebarOpen(false)
        hamburgerRef.current?.focus()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) {
        event.preventDefault()
        sidebarRef.current?.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && (document.activeElement === first || document.activeElement === sidebarRef.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (previouslyFocused && document.contains(previouslyFocused) && previouslyFocused.offsetParent !== null) {
        previouslyFocused.focus()
      }
    }
  }, [isDesktop, sidebarOpen])

  const flash = (props.flash ?? {}) as Record<string, string | undefined>
  useEffect(() => {
    if (flash.success) toast.success(flash.success)
    if (flash.error) toast.error(flash.error)
  }, [flash.success, flash.error])

  const handleLogout = () => {
    logoutDialogRef.current?.close()
    router.post('/logout')
  }

  const userName = (props.auth as any)?.user?.name || 'Admin'
  const userInitials = userName.split(' ').map((word: string) => word[0]).slice(0, 2).join('').toUpperCase()
  const roleLabel = userRole ? userRole.replace(/_/g, ' ').replace(/\b\w/g, (character: string) => character.toUpperCase()) : ''
  const topTabs = [
    { label: 'Dashboard', href: '/admin', exact: true },
    { label: 'Pengaduan', href: '/admin/complaints', exact: false },
    { label: 'Statistik', href: '/admin/statistik', exact: false },
  ]

  return (
    <>
      <Head title={`${title} - Admin`} />
      <div className="admin-scope flex min-h-dvh bg-background">
        {!isDesktop && sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-foreground/50"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <div
          className={`fixed inset-y-0 left-0 z-50 flex items-start transition-transform duration-300 ease-out motion-reduce:transition-none lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <aside
            ref={sidebarRef}
            id="admin-sidebar"
            role={isDesktop ? undefined : 'dialog'}
            aria-modal={isDesktop ? undefined : true}
            aria-label={isDesktop ? 'Navigasi utama' : 'Menu navigasi'}
            aria-hidden={!isDesktop && !sidebarOpen ? true : undefined}
            inert={!isDesktop && !sidebarOpen}
            tabIndex={-1}
            className={`my-2 ml-2 flex h-fit max-h-[calc(100dvh-1rem)] lg:max-h-[calc(100dvh-108px)] flex-col overflow-hidden rounded-[14px] bg-primary-dark shadow-lg transition-[width] duration-200 ease-out motion-reduce:transition-none lg:mb-4 lg:ml-2 lg:mt-[92px] ${
              isExpanded ? 'w-[232px]' : 'w-[58px]'
            }`}
          >
            {!isDesktop && (
              <div className="flex items-center justify-between gap-3 px-2 pt-1">
                <span className="pl-2 text-xs font-semibold tracking-wide text-white/70">Menu</span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => {
                    setSidebarOpen(false)
                    hamburgerRef.current?.focus()
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-surface/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="Tutup menu"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}

            <nav className="w-full overflow-x-hidden overflow-y-auto px-1.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {sidebarLinks.map((link) => {
                const isActive = url === link.href || (link.href !== '/admin' && url.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    onMouseEnter={(event) => showSidebarTooltip(link.label, event.currentTarget)}
                    onMouseLeave={hideSidebarTooltip}
                    onFocus={(event) => showSidebarTooltip(link.label, event.currentTarget)}
                    onBlur={hideSidebarTooltip}
                    className={`group relative flex h-10 items-center rounded-[9px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                      isExpanded ? 'gap-3 px-3' : 'justify-center px-0'
                    } ${
                      isActive
                        ? 'bg-primary font-semibold text-white'
                        : 'text-[#B8D1C5] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <link.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className={isExpanded ? 'truncate text-sm' : 'sr-only'}>{link.label}</span>
                    {link.badge > 0 && (
                      isExpanded ? (
                        <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1.5 text-[11px] font-semibold text-white">
                          {link.badge > 99 ? '99+' : link.badge}
                        </span>
                      ) : (
                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-primary-dark" aria-hidden="true" />
                      )
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="w-full px-1.5 pb-1.5 pt-1">
              {isExpanded ? (
                <button
                  type="button"
                  onClick={() => logoutDialogRef.current?.showModal()}
                  title="Keluar"
                  aria-label="Keluar"
                  className="flex h-10 w-full items-center gap-3 rounded-[9px] px-3 text-[#F1B0B0] transition-colors hover:bg-red-500/15 hover:text-[#FFD6D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <ArrowRightStartOnRectangleIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="text-sm">Keluar</span>
                </button>
              ) : (
                <div className="flex w-full justify-center">
                  <button
                    type="button"
                    onClick={() => logoutDialogRef.current?.showModal()}
                    aria-label="Keluar"
                    onMouseEnter={(event) => showSidebarTooltip('Keluar', event.currentTarget)}
                    onMouseLeave={hideSidebarTooltip}
                    onFocus={(event) => showSidebarTooltip('Keluar', event.currentTarget)}
                    onBlur={hideSidebarTooltip}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-[#F1B0B0] transition-colors hover:bg-red-500/15 hover:text-[#FFD6D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <ArrowRightStartOnRectangleIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </aside>

          {!isExpanded && sidebarTooltip && (
            <div
              role="tooltip"
              className="pointer-events-none fixed left-[74px] z-[60] -translate-y-1/2 whitespace-nowrap rounded-md bg-[#0B241C] px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
              style={{ top: sidebarTooltip.top }}
            >
              {sidebarTooltip.label}
            </div>
          )}
        </div>

        <div
          className={`min-w-0 flex-1 p-4 transition-[margin-left] duration-200 ease-out motion-reduce:transition-none lg:p-6 ${
            sidebarExpanded ? 'lg:ml-[248px]' : 'lg:ml-[74px]'
          }`}
        >
          <header className="mb-4 flex min-h-16 items-center gap-2 rounded-2xl border border-border bg-surface px-3 shadow-sm sm:gap-3 sm:px-4">
            <Link href="/admin" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`Dashboard ${logoText}`}>
              <img src="/images/logo.png" alt="" className="h-8 w-8 object-contain" />
            </Link>
            <button
              type="button"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:inline-flex"
              aria-expanded={sidebarExpanded}
              aria-controls="admin-sidebar"
              aria-label={sidebarExpanded ? 'Ciutkan sidebar' : 'Lebarkan sidebar'}
              title={sidebarExpanded ? 'Ciutkan sidebar' : 'Lebarkan sidebar'}
            >
              {sidebarExpanded ? <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" /> : <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />}
            </button>
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
              aria-label={sidebarOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={sidebarOpen}
              aria-controls="admin-sidebar"
            >
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            </button>
            <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">{title}</h1>
            <nav className="ml-2 hidden items-center gap-1 xl:flex" aria-label="Navigasi cepat">
              {topTabs.map((tab) => {
                const active = tab.exact ? url === tab.href : url.startsWith(tab.href)
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    aria-current={active ? 'page' : undefined}
                    className={`inline-flex min-h-11 items-center rounded-lg px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      active ? 'bg-primary/10 font-medium text-primary' : 'text-muted hover:bg-background hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </Link>
                )
              })}
            </nav>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 border-l border-border pl-3 text-sm text-muted sm:flex">
                <Clock />
                <span className="text-muted-foreground" aria-hidden="true">·</span>
                <span className="hidden text-muted-foreground md:inline">
                  {formatDate(new Date(), { weekday: 'long' })}
                </span>
              </div>
              <Link
                href="/admin/akun"
                className="flex min-h-11 items-center gap-2 rounded-full border border-border py-1 pl-1.5 pr-3 transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white ring-2 ring-primary">
                  {userInitials}
                </div>
                <span className="hidden max-w-32 truncate text-sm font-medium text-foreground md:block">{userName}</span>
                {roleLabel && (
                  <span className="hidden rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary md:block">{roleLabel}</span>
                )}
              </Link>
            </div>
          </header>
          <main id="admin-content">
            <Breadcrumb />
            {children}
          </main>
        </div>
      </div>

      <dialog
        ref={logoutDialogRef}
        aria-labelledby="logout-title"
        aria-describedby="logout-description"
        className="w-[calc(100%-2rem)] max-w-sm rounded-xl border border-border bg-surface p-0 text-foreground shadow-xl backdrop:bg-foreground/50"
      >
        <div className="space-y-4 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive-bg">
              <ArrowRightStartOnRectangleIcon className="h-5 w-5 text-destructive" aria-hidden="true" />
            </div>
            <div>
              <h2 id="logout-title" className="font-semibold text-foreground">Konfirmasi keluar</h2>
              <p id="logout-description" className="mt-1 text-base text-muted">Apakah Anda yakin ingin keluar dari panel admin?</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => logoutDialogRef.current?.close()}
              className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-background"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-11 items-center rounded-lg bg-destructive px-4 text-sm font-medium text-white transition-colors hover:bg-destructive/90"
            >
              Keluar
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
