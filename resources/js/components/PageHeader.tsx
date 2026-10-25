import { type ComponentType, type SVGProps } from 'react'
import { AnimatedGroup } from '@/components/ui/animated-group'
import SectionBadge from '@/components/SectionBadge'
import { transitionVariants } from '@/lib/transition-variants'

interface PageHeaderProps {
  badge: string
  title: string
  description?: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

export default function PageHeader({ badge, title, description, icon: Icon }: PageHeaderProps) {
  return (
    <section className="relative py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <AnimatedGroup variants={transitionVariants}>
          {Icon && (
            <div className="mb-5 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
              </div>
            </div>
          )}
          {badge && badge.toLowerCase() !== title.toLowerCase() && <SectionBadge>{badge}</SectionBadge>}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">{title}</h1>
          {description && (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              {description}
            </p>
          )}
        </AnimatedGroup>
      </div>
    </section>
  )
}
