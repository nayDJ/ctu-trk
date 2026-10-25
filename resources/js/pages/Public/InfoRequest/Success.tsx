import PublicLayout from '@/layouts/PublicLayout'
import TicketSuccess from '@/components/TicketSuccess'

interface InfoRequestSuccessProps {
  ticket?: string
}

export default function InfoRequestSuccess({ ticket }: InfoRequestSuccessProps) {
  return (
    <PublicLayout title="Permohonan Berhasil">
      <TicketSuccess
        title="Permohonan berhasil dikirim"
        description="Simpan nomor tiket ini. Anda akan memerlukannya untuk mengecek status permohonan."
        ticket={ticket}
        kindLabel="Permohonan"
        checkHref="/permohonan-info/cek"
        checkLabel="Cek status permohonan"
      />
    </PublicLayout>
  )
}
