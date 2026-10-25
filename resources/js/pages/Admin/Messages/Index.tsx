import AdminLayout from '@/layouts/AdminLayout'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import { Link, router, useForm, usePage } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import AdminSearch from '@/components/AdminSearch'
import Pagination from '@/components/Pagination'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'

interface MessagesProps {
  messages: { data: Array<{ id: number; name: string; subject: string; is_read: boolean }>; links: any[]; total: number }
}

export default function MessagesIndex({ messages }: MessagesProps) {
  const [search, setSearch] = useState('')
  const [deleteItem, setDeleteItem] = useState<{ id: number; name: string } | null>(null)
  const deleteForm = useForm({})
  const userRole = (usePage().props.auth as any)?.user?.role as string
  const isSuperAdmin = userRole === 'super_admin'
  const filtered = useMemo(() => {
    if (!search) return messages.data
    const q = search.toLowerCase()
    return messages.data.filter(m => m.name.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q))
  }, [search, messages.data])

  const handleDelete = () => {
    if (!deleteItem) return
    deleteForm.delete(`/admin/messages/${deleteItem.id}`, {
      onSuccess: () => {
        toast.success('Pesan berhasil dihapus')
        setDeleteItem(null)
      },
    })
  }

  return (
    <AdminLayout title="Pesan Masuk">
      <div className="mb-4 max-w-sm">
        <AdminSearch onFilter={setSearch} placeholder="Cari pesan..." />
      </div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Pesan Masuk" description={`${messages.total} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-background border-b">
            <tr>
              <th className="text-left px-4 py-3">Nama</th>
              <th className="text-left px-4 py-3">Subjek</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">Tidak ada data</td></tr>
            ) : filtered.map((m) => (
              <tr key={m.id} className="border-b last:border-0 hover:bg-background transition-colors">
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3">{m.subject}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm ${m.is_read ? 'bg-success-bg text-primary' : 'bg-warning-bg text-foreground'}`}>
                    {m.is_read ? 'Dibaca' : 'Belum Dibaca'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/messages/${m.id}`} className="inline-flex min-h-11 items-center text-base text-primary hover:underline">Detail</Link>
                  {isSuperAdmin && (
                    <button type="button" onClick={() => setDeleteItem({ id: m.id, name: m.name })} aria-label={`Hapus pesan dari ${m.name}`} className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination data={messages} links={messages.links} />
          </div>
        </BentoCard>
      </BentoGrid>

      <ConfirmDeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} processing={deleteForm.processing} title="Hapus Pesan" message={`Pesan dari "${deleteItem?.name}" akan dihapus permanen.`} />

    </AdminLayout>
  )
}
