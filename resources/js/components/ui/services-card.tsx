"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"

export interface Service {
  number: string
  title: string
  description: string
  icon: React.ElementType
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const bgVariant = index % 2 === 0 ? "bg-primary/5" : "bg-primary/10"

  return (
    <div className={cn(
      "relative flex h-[350px] w-full flex-col justify-between overflow-hidden rounded-xl p-8",
      bgVariant
    )}>
      <div className="flex flex-col items-start text-left">
        <service.icon className="h-10 w-10 text-primary" />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold uppercase tracking-wider text-foreground">
          {service.title}
        </h3>
        <p className="text-sm text-foreground/70 line-clamp-3">{service.description}</p>
      </div>
    </div>
  )
}

export function ServiceCarousel({ services }: { services: Service[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  })
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  React.useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setCanScrollNext(emblaApi.canScrollNext())
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {services.map((service, index) => (
              <div
                key={index}
                className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 pl-4 first:pl-0"
              >
                <div className="p-1">
                  <ServiceCard service={service} index={index} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollNext}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10",
            "h-10 w-10 rounded-full bg-foreground/10 border-0 hover:bg-foreground/20",
            "flex items-center justify-center text-foreground transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          disabled={!canScrollNext}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
          <span className="sr-only">Next slide</span>
        </button>
      </div>
    </div>
  )
}
