import AdminLayout from '@/layouts/AdminLayout'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import { Link, useForm, usePage } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import AdminSearch from '@/components/AdminSearch'
import Pagination from '@/components/Pagination'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'
import StatusPill from '@/components/admin/StatusPill'
import { AdminTable, AdminTh, AdminTr, AdminEmpty } from '@/components/ui/admin-table'

interface InfoRequestsProps {
  infoRequests: { data: Array<{ id: number; ticket: string; title: string; status: string }>; links: any[]; total: number }
}

export default function InfoRequestsIndex({ infoRequests }: InfoRequestsProps) {
  const [search, setSearch] = useState('')
  const [deleteItem, setDeleteItem] = useState<{ id: number; ticket: string } | null>(null)
  const deleteForm = useForm({})
  const userRole = (usePage().props.auth as any)?.user?.role as string
  const isSuperAdmin = userRole === 'super_admin'

  const filtered = useMemo(() => {
    if (!search) return infoRequests.data
    const q = search.toLowerCase()
    return infoRequests.data.filter(r =>
      r.ticket.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    )
  }, [search, infoRequests.data])

  const handleDelete = () => {
    if (!deleteItem) return
    deleteForm.delete(`/admin/info-requests/${deleteItem.id}`, {
      onSuccess: () => {
        toast.success('Permintaan informasi berhasil dihapus')
        setDeleteItem(null)
      },
    })
  }

  return (
    <AdminLayout title="Permintaan Informasi">
      <div className="mb-4 max-w-sm">
        <AdminSearch onFilter={setSearch} placeholder="Cari tiket, judul..." />
      </div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Permintaan Informasi" description={`${infoRequests.total} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <AdminTable>
          <thead className="border-b border-border bg-background/70">
            <tr>
              <AdminTh>Tiket</AdminTh>
              <AdminTh>Judul</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh right>Aksi</AdminTh>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <AdminEmpty colSpan={4} />
            ) : filtered.map((req) => (
              <AdminTr key={req.id}>
                <td className="px-4 py-3 font-medium">{req.ticket}</td>
                <td className="px-4 py-3">{req.title}</td>
                <td className="px-4 py-3"><StatusPill status={req.status} /></td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/info-requests/${req.id}`} className="inline-flex min-h-11 items-center text-base text-primary hover:underline">Detail</Link>
                  {isSuperAdmin && (
                    <button onClick={() => setDeleteItem({ id: req.id, ticket: req.ticket })} aria-label="Hapus permintaan informasi" className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg">
                      <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </td>
              </AdminTr>
            ))}
          </tbody>
        </AdminTable>
        <Pagination data={infoRequests} links={infoRequests.links} />
          </div>
        </BentoCard>
      </BentoGrid>

      <ConfirmDeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} processing={deleteForm.processing} title="Hapus Permintaan Informasi" message={`Permintaan informasi tiket "${deleteItem?.ticket}" akan dihapus permanen.`} />

    </AdminLayout>
  )
}
