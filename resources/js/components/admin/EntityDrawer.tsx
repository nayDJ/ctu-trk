import { cloneElement, isValidElement, useEffect, useId, useRef, type ReactElement, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface EntityDrawerProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

// ponytail: single shared drawer shell for Complaint/InfoRequest/Message drawers
export default function EntityDrawer({ open, onClose, title, subtitle, children, footer }: EntityDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  const titleId = useId()
  const subtitleId = useId()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      closeRef.current && drawerRef.current?.querySelector<HTMLElement>('[data-drawer-close]')?.focus()
    }, 50)

    const getFocusable = () =>
      Array.from(drawerRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []).filter(
        (element) => element.offsetParent !== null,
      )

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeRef.current()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) {
        event.preventDefault()
        drawerRef.current?.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && (document.activeElement === first || document.activeElement === drawerRef.current)) {
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
      previouslyFocused?.focus?.()
    }
  }, [open])

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, damping: 30, stiffness: 300 }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-40 bg-foreground/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={subtitle ? subtitleId : undefined}
            tabIndex={-1}
            initial={{ x: reduceMotion ? 0 : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: reduceMotion ? 0 : '100%' }}
            transition={transition}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-surface text-foreground shadow-xl focus:outline-none"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <div id={titleId}>
                  {typeof title === 'string' ? (
                    <h2 className="text-xl font-semibold">{title}</h2>
                  ) : (
                    title
                  )}
                </div>
                {subtitle && <div id={subtitleId} className="mt-0.5">{subtitle}</div>}
              </div>
              <button
                type="button"
                onClick={onClose}
                data-drawer-close
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Tutup"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">{children}</div>
            {footer && <div className="shrink-0 border-t border-border px-5 py-4 sm:px-6">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function DrawerField({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  const fieldId = useId()
  const errorId = `${fieldId}-error`
  const isFormControl =
    isValidElement(children)
    && typeof children.type === 'string'
    && ['input', 'select', 'textarea'].includes(children.type)

  const control = isFormControl
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id: fieldId,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })
    : children

  return (
    <div className="space-y-1">
      <label htmlFor={isFormControl ? fieldId : undefined} className="block text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive" aria-hidden="true">*</span>}
      </label>
      {control}
      {error && <p id={errorId} role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export function DrawerFooter({
  onCancel,
  processing,
  processingText = 'Menyimpan...',
  submitText = 'Simpan',
}: {
  onCancel: () => void
  processing: boolean
  processingText?: string
  submitText?: string
}) {
  return (
    <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
      <button
        type="button"
        onClick={onCancel}
        disabled={processing}
        className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-background disabled:opacity-50"
      >
        Batal
      </button>
      <button
        type="submit"
        disabled={processing}
        className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
      >
        {processing ? processingText : submitText}
      </button>
    </div>
  )
}
