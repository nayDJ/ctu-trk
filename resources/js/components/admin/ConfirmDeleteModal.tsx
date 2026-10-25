import ConfirmDialog from './ConfirmDialog'
import { TrashIcon } from '@heroicons/react/24/outline'

interface ConfirmDeleteModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  processing: boolean
  title?: string
  message?: string
}

// ponytail: thin wrapper so existing usages get the shared ConfirmDialog for free
export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  processing,
  title = 'Hapus Data',
  message = 'Data yang dihapus tidak dapat dikembalikan.',
}: ConfirmDeleteModalProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      processing={processing}
      title={title}
      message={message}
      icon={
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive-bg">
          <TrashIcon className="h-5 w-5 text-destructive" aria-hidden="true" />
        </div>
      }
    />
  )
}
