import { cloneElement, isValidElement, useEffect, useId, useRef, type ReactElement, type ReactNode } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface EntityModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function EntityModal({ open, onClose, title, children }: EntityModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby={titleId}
      className="w-[calc(100%-2rem)] max-w-xl rounded-xl border border-border bg-surface p-0 text-foreground shadow-xl backdrop:bg-foreground/50"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
        <h2 id={titleId} className="text-xl font-semibold text-foreground">{title}</h2>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Tutup"
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </dialog>
  )
}

export function ModalField({
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

export function ModalFooter({
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
