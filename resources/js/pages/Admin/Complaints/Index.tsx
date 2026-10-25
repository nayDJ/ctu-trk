import AdminLayout from '@/layouts/AdminLayout'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import { Link, router, usePage } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import AdminSearch from '@/components/AdminSearch'
import Pagination from '@/components/Pagination'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'
import StatusPill from '@/components/admin/StatusPill'
import { toast } from 'sonner'
import { AdminTable, AdminTh, AdminTr, AdminEmpty } from '@/components/ui/admin-table'


interface ComplaintsProps {
  complaints: { data: Array<{ id: number; ticket: string; title: string; status: string; category: { name: string } | null }>; links: any[]; total: number }
}

export default function ComplaintsIndex({ complaints }: ComplaintsProps) {
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleteProcessing, setDeleteProcessing] = useState(false)
  const userRole = (usePage().props.auth as any)?.user?.role as string
  const isSuperAdmin = userRole === 'super_admin'

  const filtered = useMemo(() => {
    if (!search) return complaints.data
    const q = search.toLowerCase()
    return complaints.data.filter(c =>
      c.ticket.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      (c.category?.name ?? '').toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    )
  }, [search, complaints.data])

  const handleDelete = () => {
    if (!deleteId) return
    setDeleteProcessing(true)
    router.delete(`/admin/complaints/${deleteId}`, {
      onSuccess: () => toast.success('Pengaduan berhasil dihapus'),
      onError: () => toast.error('Gagal menghapus pengaduan.'),
      onFinish: () => {
        setDeleteProcessing(false)
        setDeleteId(null)
      },
    })
  }

  return (
    <AdminLayout title="Pengaduan">
      <div className="mb-4 max-w-sm">
        <AdminSearch onFilter={setSearch} placeholder="Filter halaman ini: tiket, judul, kategori..." />
      </div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Pengaduan" description={`${complaints.total} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <AdminTable>
          <thead className="border-b border-border bg-background/70">
            <tr>
              <AdminTh>Tiket</AdminTh>
              <AdminTh>Judul</AdminTh>
              <AdminTh>Kategori</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh right>Aksi</AdminTh>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <AdminEmpty colSpan={5} />
            ) : filtered.map((complaint) => (
              <AdminTr key={complaint.id}>
                <td className="px-4 py-3 font-medium">{complaint.ticket}</td>
                <td className="px-4 py-3">{complaint.title}</td>
                <td className="px-4 py-3 text-muted">{complaint.category?.name ?? '-'}</td>
                <td className="px-4 py-3"><StatusPill status={complaint.status} /></td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/complaints/${complaint.id}`} className="inline-flex min-h-11 items-center text-base text-primary hover:underline">Detail</Link>
                  {isSuperAdmin && (
                    <button onClick={() => setDeleteId(complaint.id)} aria-label="Hapus pengaduan" className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg">
                      <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </td>
              </AdminTr>
            ))}
          </tbody>
        </AdminTable>
        <Pagination data={complaints} links={complaints.links} />
          </div>
        </BentoCard>
      </BentoGrid>

      <ConfirmDeleteModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        processing={deleteProcessing}
        title="Hapus Pengaduan"
        message="Pengaduan yang dihapus tidak dapat dikembalikan."
      />

    </AdminLayout>
  )
}
