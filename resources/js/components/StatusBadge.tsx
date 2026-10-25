import { isOfficeOpen } from '@/lib/office-hours'

export default function StatusBadge() {
  const isOpen = isOfficeOpen()

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${
        isOpen
          ? 'border-green-600/25 bg-green-600/10 text-green-800'
          : 'border-red-500/25 bg-red-500/10 text-red-700'
      }`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-green-600' : 'bg-red-500'}`} />
      {isOpen ? 'Buka' : 'Tutup'}
    </span>
  )
}
