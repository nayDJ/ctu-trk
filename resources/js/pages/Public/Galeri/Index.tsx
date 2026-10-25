import PublicLayout from '@/layouts/PublicLayout'
import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'
import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, PhotoIcon } from '@heroicons/react/24/outline'

interface GaleriProps {
  galleries: {
    data: Array<{ id: number; title: string; caption: string; credit: string; path: string }>
    links: any[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export default function GaleriIndex({ galleries }: GaleriProps) {
  const images = galleries.data
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const isLightboxOpen = lightbox !== null

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const openLightbox = useCallback((id: number) => {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setLightbox(id)
  }, [])

  useEffect(() => {
    if (!isLightboxOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      triggerRef.current?.focus()
    }
  }, [isLightboxOpen])

  useEffect(() => {
    if (!isLightboxOpen) return

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightbox(null)
        return
      }

      const itemIndex = images.findIndex(g => g.id === lightbox)
      if (itemIndex === -1 || images.length < 2) return

      if (e.key === 'ArrowLeft') {
        setLightbox(images[(itemIndex - 1 + images.length) % images.length].id)
      }
      if (e.key === 'ArrowRight') {
        setLightbox(images[(itemIndex + 1) % images.length].id)
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isLightboxOpen, lightbox, images])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <PublicLayout title="Galeri">
      <PageHeader
        badge="INFORMASI PUBLIK"
        title="Galeri Kegiatan"
        description="Dokumentasi kegiatan dan aktivitas Kecamatan Tarakan Utara."
        icon={PhotoIcon}
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {images.length === 0 ? (
          <EmptyState
            icon={PhotoIcon}
            title="Belum ada foto"
            description="Galeri kegiatan akan ditambahkan setelah dokumentasi tersedia."
          />
        ) : (
          <>
            <div className="relative mb-6">
              <div className="overflow-hidden rounded-xl border border-border bg-surface" ref={emblaRef}>
                <div className="flex">
                  {images.map((g, index) => (
                    <div
                      key={g.id}
                      role="button"
                      tabIndex={index === selectedIndex ? 0 : -1}
                      aria-hidden={index !== selectedIndex}
                      aria-label={`Buka ${g.title}`}
                      onClick={() => openLightbox(g.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          openLightbox(g.id)
                        }
                      }}
                      className="relative aspect-video min-w-0 flex-[0_0_100%] cursor-pointer bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                    >
                      {g.path ? (
                        <img src={`/storage/${g.path}`} alt={g.title} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-base text-foreground/80">Gambar belum tersedia</span>
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 sm:p-6">
                        <p className="text-lg font-semibold text-white sm:text-xl">{g.title}</p>
                        {g.caption && <p className="mt-1 text-sm text-white/90 sm:text-base">{g.caption}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={scrollPrev}
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/95 text-foreground shadow-sm transition-colors hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Gambar sebelumnya"
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/95 text-foreground shadow-sm transition-colors hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Gambar berikutnya"
              >
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="mt-4 flex flex-wrap justify-center gap-1">
                {images.map((image, i) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => emblaApi?.scrollTo(i)}
                    aria-label={`Lihat gambar ${i + 1}`}
                    aria-current={i === selectedIndex || undefined}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span
                      aria-hidden="true"
                      className={`block h-2 rounded-full transition-colors ${i === selectedIndex ? 'w-6 bg-primary' : 'w-2 bg-border'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((g, i) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => openLightbox(g.id)}
                  aria-label={`Buka ${g.title}`}
                  className={`group relative aspect-square overflow-hidden rounded-lg border bg-primary/5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    i === selectedIndex ? 'border-primary ring-2 ring-primary' : 'border-border'
                  }`}
                >
                  {g.path ? (
                    <img src={`/storage/${g.path}`} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-sm text-foreground/80">Gambar belum tersedia</span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-black/10 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <p className="truncate text-sm font-medium text-white">{g.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        <Pagination data={galleries} links={galleries.links} />
      </div>

      {lightbox !== null && (() => {
        const item = images.find(g => g.id === lightbox)
        if (!item) return null
        const itemIndex = images.findIndex(g => g.id === lightbox)

        return (
          <div
            className="fixed inset-0 z-50 flex flex-col bg-black/95"
            role="dialog"
            aria-modal="true"
            aria-label="Pratinjau galeri"
            onClick={() => setLightbox(null)}
          >
            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-14 py-14 sm:px-20">
              <button
                ref={closeButtonRef}
                type="button"
                className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white/80 transition-colors hover:bg-black/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                onClick={() => setLightbox(null)}
                aria-label="Tutup galeri"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox(images[(itemIndex - 1 + images.length) % images.length].id)
                }}
                className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white/80 transition-colors hover:bg-black/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label="Gambar sebelumnya"
              >
                <ChevronLeftIcon className="h-8 w-8" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox(images[(itemIndex + 1) % images.length].id)
                }}
                className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white/80 transition-colors hover:bg-black/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label="Gambar berikutnya"
              >
                <ChevronRightIcon className="h-8 w-8" aria-hidden="true" />
              </button>

              {item.path ? (
                <img
                  src={`/storage/${item.path}`}
                  alt={item.title}
                  className="max-h-full max-w-full rounded-lg object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div
                  className="flex h-64 w-full max-w-md items-center justify-center rounded-lg bg-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-base text-white/70">Gambar belum tersedia</span>
                </div>
              )}
            </div>

            <div className="shrink-0 px-4 pb-6 text-center" onClick={(e) => e.stopPropagation()}>
              <p className="text-lg font-semibold text-white">{item.title}</p>
              {item.caption && <p className="mt-1 text-base text-white/80">{item.caption}</p>}
              {item.credit && <p className="mt-1 text-sm text-white/60">&copy; {item.credit}</p>}
            </div>
          </div>
        )
      })()}
    </PublicLayout>
  )
}
