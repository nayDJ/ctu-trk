import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Highlight, HighlightItem } from '@/components/unlumen-ui/primitives/effects/highlight';
import FontSizeWidget from '@/components/FontSizeWidget';
import StatusBadge from '@/components/StatusBadge';

type MenuItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

type RawMenu = {
  id: number;
  label: string;
  href: string;
  icon: string | null;
  parent_id: number | null;
  sort_order: number;
};

const hardcodedMenus: MenuItem[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Profil', href: '/profil' },
  { label: 'Layanan', href: '/layanan' },
  {
    label: 'Informasi',
    href: '/informasi',
    children: [
      { label: 'Berita', href: '/informasi/berita' },
      { label: 'Agenda', href: '/informasi/agenda' },
      { label: 'Galeri', href: '/informasi/galeri' },
      { label: 'Dokumen', href: '/informasi/dokumen' },
    ],
  },
  {
    label: 'PPID',
    href: '/ppid',
    children: [
      { label: 'Profil PPID', href: '/ppid' },
      { label: 'Dokumen PPID', href: '/ppid/dokumen' },
    ],
  },
  { label: 'SP4N-LAPOR', href: '/sp4n' },
  { label: 'Kontak', href: '/kontak' },
];

function buildMenuTree(raw: RawMenu[]): MenuItem[] {
  const byId = new Map(raw.map((m) => [m.id, m]));
  const children = new Map<number, RawMenu[]>();
  const roots: RawMenu[] = [];

  for (const m of raw) {
    if (m.parent_id && byId.has(m.parent_id)) {
      children.get(m.parent_id)?.push(m) ?? children.set(m.parent_id, [m]);
    } else {
      roots.push(m);
    }
  }

  return roots.map((r) => ({
    label: r.label,
    href: r.href,
    children: children.get(r.id)
      ?.sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => ({ label: c.label, href: c.href })),
  }));
}

export function NavigationMenu({ menus, marqueeVisible = true, marqueeOffset = 40 }: { menus?: RawMenu[]; marqueeVisible?: boolean; marqueeOffset?: number }) {
  const items = menus && menus.length > 0 ? buildMenuTree(menus) : hardcodedMenus;
  const { url } = usePage();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileExpanded, setMobileExpanded] = React.useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{ top: marqueeVisible ? marqueeOffset : 0 }} className="fixed left-0 right-0 z-50 px-2 transition-[top] duration-300">
      <div
        className={cn(
          'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
          isScrolled && 'bg-background/80 max-w-5xl rounded-2xl border border-border backdrop-blur-lg lg:px-5 shadow-sm'
        )}
      >
        <div className="relative flex items-center py-3 lg:py-4">
          {/* Logo */}
          <Link href="/" className="z-20 inline-flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Beranda Kecamatan Tarakan Utara">
            <img
              loading="eager"
              src="/images/logotarakan.png"
              alt="Logo Kecamatan Tarakan Utara"
              className="h-10 w-10 object-contain"
            />
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative -mr-4 ml-auto flex h-11 w-11 cursor-pointer flex-col items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
            aria-label={mobileOpen ? 'Tutup Menu' : 'Buka Menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <motion.span
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }}
              className="block h-0.5 w-6 bg-foreground"
            />
            <motion.span
              animate={{ opacity: mobileOpen ? 0 : 1 }}
              className="mt-1 block h-0.5 w-6 bg-foreground"
            />
            <motion.span
              animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }}
              className="mt-1 block h-0.5 w-6 bg-foreground"
            />
          </button>

          {/* Desktop nav - centered */}
          <nav aria-label="Navigasi utama" className="mx-auto hidden lg:block">
            <Highlight
              mode="parent"
              hover
              className="pointer-events-none rounded-md bg-black/5"
              containerClassName="relative"
            >
              <ul className="relative z-10 flex gap-1 list-none items-center">
                {items.map((item) => (
                  <li
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => item.children && setActiveDropdown(item.href)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    onFocus={() => item.children && setActiveDropdown(item.href)}
                    onBlur={() => setActiveDropdown(null)}
                    onKeyDown={(e) => { if (e.key === 'Escape') setActiveDropdown(null) }}
                  >
                    <HighlightItem asChild active={url === item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'inline-flex h-9 items-center whitespace-nowrap rounded-md px-4 py-2 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                          url === item.href
                            ? 'text-accent-foreground'
                            : 'text-muted-foreground hover:text-accent-foreground'
                        )}
                        aria-haspopup={item.children ? 'true' : undefined}
                        aria-expanded={item.children ? activeDropdown === item.href : undefined}
                      >
                        {item.label}
                        {item.children && (
                          <motion.span
                            animate={{ rotate: activeDropdown === item.href ? 180 : 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="ml-1.5 inline-flex"
                          >
                            <ChevronDownIcon className="size-3.5" aria-hidden="true" />
                          </motion.span>
                        )}
                      </Link>
                    </HighlightItem>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {item.children && activeDropdown === item.href && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-border bg-background/90 p-1.5 shadow-lg backdrop-blur-md space-y-1"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'block rounded-lg px-3 py-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                url === child.href
                                  ? 'bg-accent text-accent-foreground font-medium'
                                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ul>
            </Highlight>
          </nav>

          {/* Desktop right widgets */}
          <div className="ml-2 hidden shrink-0 items-center gap-2 lg:flex">
            <StatusBadge />
            <FontSizeWidget />
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                id="mobile-navigation"
                role="navigation"
                aria-label="Navigasi seluler"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden absolute top-full -mx-2 left-0 right-0 z-30 mt-1 max-h-[calc(100dvh-7rem)] overflow-x-hidden overflow-y-auto overscroll-contain rounded-xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur-md"
              >
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.href}>
                      {item.children ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setMobileExpanded(mobileExpanded === item.href ? null : item.href)}
                            aria-expanded={mobileExpanded === item.href}
                            aria-controls={`mobile-submenu-${item.label.replace(/\s+/g, '-').toLowerCase()}`}
                            className={cn(
                              'flex w-full items-center justify-between rounded-lg px-3 py-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                              url === item.href
                                ? 'bg-accent text-accent-foreground font-medium'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                          >
                            {item.label}
                            <motion.span
                              animate={{ rotate: mobileExpanded === item.href ? 180 : 0 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            >
                              <ChevronDownIcon className="size-3.5" aria-hidden="true" />
                            </motion.span>
                          </button>
                          <AnimatePresence>
                            {mobileExpanded === item.href && (
                              <motion.ul
                                id={`mobile-submenu-${item.label.replace(/\s+/g, '-').toLowerCase()}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-4 mt-1 space-y-1 overflow-hidden border-l border-border pl-3"
                              >
                                {item.children.map((child) => (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      className={cn(
                                        'block rounded-lg px-3 py-1.5 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                        url === child.href
                                          ? 'text-primary font-medium'
                                          : 'text-muted-foreground hover:text-foreground'
                                      )}
                                      onClick={() => setMobileOpen(false)}
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            'block rounded-lg px-3 py-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                            url === item.href
                              ? 'bg-accent text-accent-foreground font-medium'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default NavigationMenu;
