import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

const linkClass = 'flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export default function Pagination<T>({ data, links }: { data: PaginatedData<T>; links: { url: string | null; label: string; active: boolean }[] }) {
    if (data.last_page <= 1) return null;

    const from = ((data.current_page - 1) * data.per_page) + 1;
    const to = Math.min(data.current_page * data.per_page, data.total);

    return (
        <nav
            aria-label="Navigasi halaman"
            className="mt-8 flex flex-col gap-3 border-t border-border pt-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between"
        >
            <p>Menampilkan {from}-{to} dari {data.total}</p>
            <div className="flex flex-wrap items-center gap-1">
                {links.map((link, i) => {
                    if (link.url === null) {
                        if (link.label.includes('Previous')) {
                            return (
                                <span key={i} className={`${linkClass} text-muted-foreground/50`} aria-disabled="true">
                                    <ChevronLeftIcon className="w-4 h-4" aria-hidden="true" />
                                </span>
                            );
                        }
                        if (link.label.includes('Next')) {
                            return (
                                <span key={i} className={`${linkClass} text-muted-foreground/50`} aria-disabled="true">
                                    <ChevronRightIcon className="w-4 h-4" aria-hidden="true" />
                                </span>
                            );
                        }
                        return null;
                    }

                    if (link.label.includes('Previous')) {
                        return (
                            <Link
                                key={i}
                                href={link.url}
                                className={`${linkClass} text-foreground/80 hover:bg-primary/5 hover:text-primary`}
                                preserveScroll
                                aria-label="Halaman sebelumnya"
                            >
                                <ChevronLeftIcon className="w-4 h-4" aria-hidden="true" />
                            </Link>
                        );
                    }
                    if (link.label.includes('Next')) {
                        return (
                            <Link
                                key={i}
                                href={link.url}
                                className={`${linkClass} text-foreground/80 hover:bg-primary/5 hover:text-primary`}
                                preserveScroll
                                aria-label="Halaman berikutnya"
                            >
                                <ChevronRightIcon className="w-4 h-4" aria-hidden="true" />
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={i}
                            href={link.url}
                            className={`${linkClass} px-3 text-sm ${
                                link.active
                                    ? 'bg-primary text-white'
                                    : 'text-foreground/80 hover:bg-primary/5 hover:text-primary'
                            }`}
                            preserveScroll
                            aria-current={link.active ? 'page' : undefined}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </nav>
    );
}
