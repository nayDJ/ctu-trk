import { Link } from '@inertiajs/react'
import { PaperAirplaneIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { PARANG_LIGHT, KAWUNG_GREEN } from '@/lib/batik'

export default function CTABanner() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div aria-hidden className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: KAWUNG_GREEN }} />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#12544F] to-[#2A835F] p-6 sm:p-10 md:p-14 text-center text-white">
          <div aria-hidden className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: PARANG_LIGHT }} />
          <div className="relative">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Sampaikan Aspirasi atau Hubungi Kami</h2>
          <p className="text-white text-lg mb-8 max-w-xl mx-auto">
            Kami siap membantu menangani aspirasi dan pengaduan masyarakat Kecamatan Tarakan Utara.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/kontak"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-lg font-semibold text-[#12544F] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#12544F] sm:w-auto"
            >
              <PaperAirplaneIcon className="h-4 w-4" aria-hidden="true" /> Kirim Pesan atau Kontak
            </Link>
            <a
              href="https://wa.me/6285247377100"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#12544F] sm:w-auto"
            >
              <ChatBubbleLeftIcon className="h-4 w-4" aria-hidden="true" /> WhatsApp Call Center
            </a>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
