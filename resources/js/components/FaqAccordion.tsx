import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export interface FaqItem {
  q: string
  a: string
}

interface FaqAccordionProps {
  items: FaqItem[]
  className?: string
}

export default function FaqAccordion({ items, className }: FaqAccordionProps) {
  const [openItem, setOpenItem] = useState<number | null>(null)

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-surface', className)}>
      {items.map((item, index) => {
        const isOpen = openItem === index
        const questionId = `faq-question-${index}`
        const answerId = `faq-answer-${index}`

        return (
          <div key={item.q} className="border-b border-border last:border-b-0">
            <h3>
              <button
                type="button"
                id={questionId}
                onClick={() => setOpenItem(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={answerId}
                className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
              >
                <span className="text-base font-medium text-foreground">{item.q}</span>
                <ChevronDownIcon
                  className={cn('h-5 w-5 shrink-0 text-muted transition-transform', isOpen && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              hidden={!isOpen}
              className="px-5 pb-5 text-base leading-relaxed text-muted"
            >
              {item.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}
