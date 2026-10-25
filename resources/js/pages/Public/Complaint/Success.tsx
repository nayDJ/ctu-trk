import PublicLayout from '@/layouts/PublicLayout'
import TicketSuccess from '@/components/TicketSuccess'

interface ComplaintSuccessProps {
  ticket?: string
}

export default function ComplaintSuccess({ ticket }: ComplaintSuccessProps) {
  return (
    <PublicLayout title="Pengaduan Berhasil">
      <TicketSuccess
        title="Pengaduan berhasil dikirim"
        description="Simpan nomor tiket ini. Anda akan memerlukannya untuk mengecek status pengaduan."
        ticket={ticket}
        kindLabel="Pengaduan"
        checkHref="/pengaduan/cek"
        checkLabel="Cek status pengaduan"
      />
    </PublicLayout>
  )
}
