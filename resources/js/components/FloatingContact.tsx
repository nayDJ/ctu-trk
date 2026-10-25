import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import { ChatBubbleLeftIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function FloatingContact() {
  const [open, setOpen] = useState(false)
  const { settings } = usePage().props as { settings?: Record<string, string> }

  const raw = settings?.telepon || '055131912'
  const digits = raw.replace(/[^0-9]/g, '')
  const phone = digits.startsWith('62') ? digits : `62${digits.replace(/^0+/, '')}`
  const email = settings?.email || 'kecamatan.tarakanutara@tarakan.go.id'
  const waMessage = encodeURIComponent('Halo Admin Kecamatan Tarakan Utara, saya ingin bertanya tentang layanan yang tersedia.')

  const options = [
    { icon: ChatBubbleLeftIcon, label: 'WhatsApp', href: `https://wa.me/${phone}?text=${waMessage}` },
    { icon: PhoneIcon, label: 'Telepon', href: `tel:${digits}` },
    { icon: EnvelopeIcon, label: 'Email', href: `mailto:${email}` },
    { icon: MapPinIcon, label: 'Lokasi', href: 'https://www.google.com/maps?q=3.4176,117.5470' },
    { icon: DocumentTextIcon, label: 'Formulir', href: '/kontak' },
  ]

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="floating-contact-options"
        aria-label={open ? 'Tutup kontak' : 'Hubungi kami'}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {open ? (
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <ChatBubbleLeftIcon className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div id="floating-contact-options" className="flex flex-col-reverse items-center gap-2">
          {options.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target={option.href.startsWith('http') ? '_blank' : undefined}
              rel={option.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-md transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={option.label}
            >
              <option.icon className="h-5 w-5" aria-hidden="true" />
              <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {option.label}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
