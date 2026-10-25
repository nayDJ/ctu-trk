import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

export interface SparkItem {
    id: string | number;
    imageSrc: string | null;
    title: string;
    meta?: string;
    href?: string;
}

export interface SparksCarouselProps {
    title: string;
    subtitle?: string;
    viewAllHref?: string;
    viewAllLabel?: string;
    items: SparkItem[];
    emptyMessage?: string;
}

function ItemMedia({ item }: { item: SparkItem }) {
    if (item.imageSrc) {
        return (
            <div className="aspect-video overflow-hidden bg-background">
                <img
                    alt={item.title}
                    className="h-full w-full object-cover"
                    src={item.imageSrc}
                    loading="lazy"
                />
            </div>
        );
    }

    return (
        <div className="flex aspect-video items-center justify-center bg-background">
            <span className="px-3 text-center text-sm text-muted">Belum ada gambar</span>
        </div>
    );
}

function ItemBody({ item }: { item: SparkItem }) {
    return (
        <div className="p-4">
            <h3 className="line-clamp-2 text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                {item.title}
            </h3>
            {item.meta && (
                <p className="mt-2 text-xs font-medium text-muted">{item.meta}</p>
            )}
        </div>
    );
}

export const SparksCarousel = React.forwardRef<HTMLDivElement, SparksCarouselProps>(
    ({ title, subtitle, viewAllHref, viewAllLabel = 'Lihat semua', items, emptyMessage }, ref) => {
        const carouselRef = React.useRef<HTMLDivElement>(null);
        const [isAtStart, setIsAtStart] = React.useState(true);
        const [isAtEnd, setIsAtEnd] = React.useState(false);
        const headingId = `sparks-${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;

        const scroll = (direction: 'left' | 'right') => {
            if (carouselRef.current) {
                const { scrollLeft, clientWidth } = carouselRef.current;
                const scrollAmount = clientWidth * 0.8;
                const newScrollLeft = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
                carouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
            }
        };

        React.useEffect(() => {
            const checkScrollPosition = () => {
                if (carouselRef.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                    setIsAtStart(scrollLeft < 10);
                    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
                }
            };

            const currentRef = carouselRef.current;
            if (currentRef) {
                checkScrollPosition();
                currentRef.addEventListener('scroll', checkScrollPosition);
            }
            window.addEventListener('resize', checkScrollPosition);

            return () => {
                if (currentRef) {
                    currentRef.removeEventListener('scroll', checkScrollPosition);
                }
                window.removeEventListener('resize', checkScrollPosition);
            };
        }, [items.length]);

        return (
            <section ref={ref} className="w-full py-6" aria-labelledby={headingId}>
                <div className="mx-auto">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h2 id={headingId} className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                {viewAllHref ? (
                                    <Link
                                        href={viewAllHref}
                                        className="inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                    >
                                        {title}
                                        <ChevronRightIcon className="ml-1 h-5 w-5 text-muted" aria-hidden="true" />
                                    </Link>
                                ) : (
                                    title
                                )}
                            </h2>
                            {subtitle && <p className="mt-1 text-base text-muted">{subtitle}</p>}
                        </div>
                        {viewAllHref && (
                            <Link
                                href={viewAllHref}
                                className="hidden min-h-11 items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
                            >
                                {viewAllLabel}
                                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-muted">
                            {emptyMessage ?? 'Belum ada data.'}
                        </div>
                    ) : (
                        <div className="relative">
                            <div
                                ref={carouselRef}
                                className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            >
                                {items.map((item) => (
                                    <div key={item.id} className="w-[280px] flex-shrink-0 snap-start">
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className="group block overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                            >
                                                <ItemMedia item={item} />
                                                <ItemBody item={item} />
                                            </Link>
                                        ) : (
                                            <div className="group block overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                                                <ItemMedia item={item} />
                                                <ItemBody item={item} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {!isAtStart && (
                                <button
                                    type="button"
                                    onClick={() => scroll('left')}
                                    className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/90 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:flex"
                                    aria-label={`Geser ${title} ke kiri`}
                                >
                                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            )}
                            {!isAtEnd && (
                                <button
                                    type="button"
                                    onClick={() => scroll('right')}
                                    className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/90 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:flex"
                                    aria-label={`Geser ${title} ke kanan`}
                                >
                                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        );
    },
);

SparksCarousel.displayName = 'SparksCarousel';
