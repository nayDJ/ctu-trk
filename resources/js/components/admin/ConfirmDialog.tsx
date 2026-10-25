import { useEffect, useId, useRef, type ReactNode } from 'react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  processing: boolean
  title?: string
  message?: string
  confirmText?: string
  processingText?: string
  cancelText?: string
  tone?: 'danger' | 'primary'
  icon?: ReactNode
}

// ponytail: single shared confirm dialog (AdminLayout's own dialog stays as-is)
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  processing,
  title = 'Hapus Data',
  message = 'Data yang dihapus tidak dapat dikembalikan.',
  confirmText = 'Hapus',
  processingText = 'Menghapus...',
  cancelText = 'Batal',
  tone = 'danger',
  icon,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const messageId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const confirmClass =
    tone === 'danger'
      ? 'bg-destructive text-white hover:bg-destructive/90'
      : 'bg-primary text-white hover:bg-primary-dark'

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      className="w-[calc(100%-2rem)] max-w-sm rounded-xl border border-border bg-surface p-0 text-foreground shadow-xl backdrop:bg-foreground/50"
    >
      <div className="space-y-4 p-6">
        <div className="flex items-start gap-3">
          {icon}
          <div className="min-w-0">
            <h3 id={titleId} className="font-semibold text-foreground">{title}</h3>
            <p id={messageId} className="mt-1 text-base text-muted">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-background disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={processing}
            className={`inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-medium text-white transition-colors disabled:opacity-50 ${confirmClass}`}
          >
            {processing ? processingText : confirmText}
          </button>
        </div>
      </div>
    </dialog>
  )
}
