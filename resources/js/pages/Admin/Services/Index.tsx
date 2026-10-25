import AdminLayout from '@/layouts/AdminLayout'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import { router, useForm, usePage } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import AdminSearch from '@/components/AdminSearch'
import Pagination from '@/components/Pagination'
import { AdminTable, AdminTh, AdminTr, AdminEmpty } from '@/components/ui/admin-table'

import EntityDrawer, { DrawerField, DrawerFooter } from '@/components/admin/EntityDrawer'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'

interface Service {
  id: number
  name: string
  description: string | null
  requirements: string | null
  estimated_time: string | null
  procedure: string | null
  is_published: boolean
  is_primary: boolean
}

interface ServicesProps {
  services: { data: Service[]; links: any[]; total: number }
}

export default function ServicesIndex({ services }: ServicesProps) {
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState<Service | null>(null)
  const [deleteItem, setDeleteItem] = useState<Service | null>(null)
  const userRole = (usePage().props.auth as any)?.user?.role as string
  const isSuperAdmin = userRole === 'super_admin'

  const createForm = useForm({ name: '', description: '', requirements: '', estimated_time: '', procedure: '', is_published: false, is_primary: false })
  const editForm = useForm({ name: '', description: '', requirements: '', estimated_time: '', procedure: '', is_published: false, is_primary: false })
  const deleteForm = useForm({})

  const filtered = useMemo(() => {
    if (!search) return services.data
    const q = search.toLowerCase()
    return services.data.filter(s => s.name.toLowerCase().includes(q))
  }, [search, services.data])

  const handleCreate = () => {
    createForm.post('/admin/services', {
      onSuccess: () => {
        toast.success('Layanan berhasil ditambahkan')
        createForm.reset()
        setShowCreateModal(false)
      },
      onError: () => toast.error('Gagal menambahkan layanan, periksa form.'),
    })
  }

  const handleEdit = () => {
    if (!editItem) return
    editForm.put(`/admin/services/${editItem.id}`, {
      onSuccess: () => {
        toast.success('Layanan berhasil diperbarui')
        setShowEditModal(false)
        setEditItem(null)
      },
      onError: () => toast.error('Gagal memperbarui layanan, periksa form.'),
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return
    deleteForm.delete(`/admin/services/${deleteItem.id}`, {
      onSuccess: () => {
        toast.success('Layanan berhasil dihapus')
        setDeleteItem(null)
      },
      onError: () => toast.error('Gagal menghapus layanan.'),
    })
  }

  const openEdit = (item: Service) => {
    setEditItem(item)
    editForm.setData({
      name: item.name,
      description: item.description ?? '',
      requirements: item.requirements ?? '',
      estimated_time: item.estimated_time ?? '',
      procedure: item.procedure ?? '',
      is_published: item.is_published,
      is_primary: item.is_primary,
    })
    setShowEditModal(true)
  }

  return (
    <AdminLayout title="Layanan">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-sm flex-1"><AdminSearch onFilter={setSearch} placeholder="Filter halaman ini: layanan..." /></div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark">+ Tambah Layanan</button>
      </div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Layanan" description={`${services.total} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <AdminTable>
          <thead className="bg-background border-b"><tr><AdminTh>Nama</AdminTh><AdminTh>Estimasi Waktu</AdminTh><AdminTh>Status</AdminTh><AdminTh right>Aksi</AdminTh></tr></thead>
          <tbody>
            {filtered.length === 0 ? <AdminEmpty colSpan={4} /> : filtered.map((s) => (
              <AdminTr key={s.id}>
                <td className="px-4 py-3 font-medium">
                  {s.name}
                  {s.is_primary && <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-medium">Utama</span>}
                </td>
                <td className="px-4 py-3 text-muted">{s.estimated_time}</td>
                <td className="px-4 py-3">
                  <button onClick={() => router.patch(`/admin/services/${s.id}/publish`, {}, { onSuccess: () => toast.success('Status diubah') })} className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm ${s.is_published ? 'bg-success-bg text-foreground' : 'bg-background text-foreground'}`}>
                    {s.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(s)} className="inline-flex min-h-11 items-center gap-1 text-base text-primary hover:underline">
                    <PencilSquareIcon className="h-3.5 w-3.5" /> Edit
                  </button>
                  {isSuperAdmin && (
                    <button onClick={() => setDeleteItem(s)} aria-label="Hapus layanan" className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </AdminTr>
            ))}
          </tbody>
        </AdminTable>
        <Pagination data={services} links={services.links} />
          </div>
        </BentoCard>
      </BentoGrid>

      <EntityDrawer open={showCreateModal} onClose={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} title="Tambah Layanan">
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="space-y-4">
          <DrawerField label="Nama Layanan" required error={createForm.errors.name}>
            <input type="text" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nama layanan" autoFocus />
          </DrawerField>
          <DrawerField label="Deskripsi" error={createForm.errors.description}>
            <textarea value={createForm.data.description} onChange={(e) => createForm.setData('description', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={3} placeholder="Deskripsi layanan" />
          </DrawerField>
          <DrawerField label="Persyaratan" error={createForm.errors.requirements}>
            <textarea value={createForm.data.requirements} onChange={(e) => createForm.setData('requirements', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={3} placeholder="Persyaratan layanan" />
          </DrawerField>
          <DrawerField label="Estimasi Waktu" error={createForm.errors.estimated_time}>
            <input type="text" value={createForm.data.estimated_time} onChange={(e) => createForm.setData('estimated_time', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Contoh: 3 hari kerja" />
          </DrawerField>
          <DrawerField label="Prosedur" error={createForm.errors.procedure}>
            <textarea value={createForm.data.procedure} onChange={(e) => createForm.setData('procedure', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={3} placeholder="Langkah-langkah pengajuan layanan" />
          </DrawerField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="create-published" checked={createForm.data.is_published} onChange={(e) => createForm.setData('is_published', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="create-published" className="text-base text-foreground">Publish</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="create-primary" checked={createForm.data.is_primary} onChange={(e) => createForm.setData('is_primary', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="create-primary" className="text-base text-foreground">Jadikan Layanan Utama</label>
          </div>
          <DrawerFooter onCancel={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} processing={createForm.processing} />
        </form>
      </EntityDrawer>

      <EntityDrawer open={showEditModal} onClose={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} title="Edit Layanan">
        <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="space-y-4">
          <DrawerField label="Nama Layanan" required error={editForm.errors.name}>
            <input type="text" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
          </DrawerField>
          <DrawerField label="Deskripsi" error={editForm.errors.description}>
            <textarea value={editForm.data.description} onChange={(e) => editForm.setData('description', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={3} />
          </DrawerField>
          <DrawerField label="Persyaratan" error={editForm.errors.requirements}>
            <textarea value={editForm.data.requirements} onChange={(e) => editForm.setData('requirements', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={3} />
          </DrawerField>
          <DrawerField label="Estimasi Waktu" error={editForm.errors.estimated_time}>
            <input type="text" value={editForm.data.estimated_time} onChange={(e) => editForm.setData('estimated_time', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Prosedur" error={editForm.errors.procedure}>
            <textarea value={editForm.data.procedure} onChange={(e) => editForm.setData('procedure', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={3} />
          </DrawerField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="edit-published" checked={editForm.data.is_published} onChange={(e) => editForm.setData('is_published', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="edit-published" className="text-base text-foreground">Publish</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="edit-primary" checked={editForm.data.is_primary} onChange={(e) => editForm.setData('is_primary', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="edit-primary" className="text-base text-foreground">Jadikan Layanan Utama</label>
          </div>
          <DrawerFooter onCancel={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} processing={editForm.processing} submitText="Perbarui" />
        </form>
      </EntityDrawer>

      <ConfirmDeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} processing={deleteForm.processing} title="Hapus Layanan" message={`Layanan "${deleteItem?.name}" akan dihapus permanen.`} />
    </AdminLayout>
  )
}
