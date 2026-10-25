import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { KAWUNG_GREEN, KAWUNG_LIGHT } from '@/lib/batik';
import { cn } from '@/lib/utils';

const transitionVariants = {
  item: {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
  },
};

interface HeroSectionProps {
  settings?: Record<string, string>;
  sliders?: Array<{ id: number; title: string; image: string; link_url: string }>;
}

export function HeroSection({ sliders = [] }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  return (
    <div className="overflow-hidden">
      <section aria-labelledby="hero-title">
        <div className="relative pt-10 pb-12 md:pt-20 md:pb-16">
          <div aria-hidden className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: KAWUNG_GREEN }} />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              <AnimatedGroup variants={transitionVariants}>
                <h1 id="hero-title" className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                  Kecamatan{' '}
                  <span className="text-primary">Tarakan Utara</span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted md:text-xl">
                  Portal layanan publik digital yang cepat, transparan, dan mudah diakses oleh seluruh masyarakat Kecamatan Tarakan Utara, Kota Tarakan, Kalimantan Utara.
                </p>
              </AnimatedGroup>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.2,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-10 flex flex-col items-stretch justify-center gap-3 md:flex-row md:items-center"
              >
                <Button asChild size="lg" className="w-full rounded-xl px-6 text-lg md:w-auto">
                  <Link href="/pengaduan/buat">
                    <span className="text-nowrap">Ajukan Pengaduan</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 rounded-xl border-primary/30 px-6 text-lg text-primary hover:bg-primary/5 hover:text-primary md:w-auto"
                >
                  <Link href="/pengaduan/cek">
                    <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="text-nowrap">Cek Status</span>
                  </Link>
                </Button>
              </AnimatedGroup>

              <div className="mt-4 text-center">
                <Link
                  href="/layanan"
                  className="group inline-flex min-h-11 items-center gap-1.5 rounded px-2 text-base font-medium text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Lihat Layanan
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {sliders.length > 0 && (
            <div className="relative mt-10 px-4 sm:mt-12 sm:px-6">
              <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border bg-surface shadow-md">
                <div className="relative aspect-[4/3] sm:aspect-[16/7]" role="region" aria-label="Sorotan kegiatan">
                  {sliders.map((slide, i) => (
                    <div
                      key={slide.id}
                      aria-hidden={i !== currentSlide}
                      className={cn(
                        'absolute inset-0 transition-opacity duration-500',
                        i === currentSlide ? 'opacity-100' : 'pointer-events-none opacity-0'
                      )}
                    >
                      <Link
                        href={slide.link_url || '/'}
                        tabIndex={i === currentSlide ? undefined : -1}
                        aria-label={slide.title}
                        className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                      >
                        {slide.image ? (
                          <img
                            src={`/storage/${slide.image}`}
                            alt={slide.title}
                            loading={i === 0 ? 'eager' : 'lazy'}
                            fetchPriority={i === 0 ? 'high' : undefined}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-background">
                            <span className="px-4 text-center text-base text-muted">Gambar sorotan belum tersedia</span>
                          </div>
                        )}
                      </Link>
                    </div>
                  ))}
                  <div aria-hidden className="absolute inset-0 z-10 opacity-[0.08] pointer-events-none" style={{ backgroundImage: KAWUNG_LIGHT }} />
                  {sliders.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-0 rounded-full bg-foreground/20 p-1 backdrop-blur-sm" role="group" aria-label="Pilih sorotan">
                      {sliders.map((slide, i) => (
                        <button
                          key={slide.id}
                          type="button"
                          onClick={() => setCurrentSlide(i)}
                          aria-label={`Tampilkan sorotan ${i + 1}: ${slide.title}`}
                          aria-current={i === currentSlide ? 'true' : undefined}
                          className="group flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                          <span
                            className={cn(
                              'block h-2 rounded-full transition-all duration-300',
                              i === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/60 group-hover:bg-white/85'
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HeroSection;
