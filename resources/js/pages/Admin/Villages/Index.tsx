import AdminLayout from '@/layouts/AdminLayout'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import { router, useForm, usePage } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import { PencilSquareIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import AdminSearch from '@/components/AdminSearch'
import Pagination from '@/components/Pagination'
import EntityDrawer, { DrawerField, DrawerFooter } from '@/components/admin/EntityDrawer'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'

interface Village {
  id: number
  name: string
  leader_name: string
  photo: string | null
  is_published: boolean
}

interface VillagesProps {
  villages: { data: Village[]; links: any[] }
}

export default function VillagesIndex({ villages }: VillagesProps) {
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState<Village | null>(null)
  const [deleteItem, setDeleteItem] = useState<Village | null>(null)
  const userRole = (usePage().props.auth as any)?.user?.role as string
  const isSuperAdmin = userRole === 'super_admin'

  const createForm = useForm({ name: '', leader_name: '', description: '', image: null as File | null, sort_order: '0', is_published: false })
  const editForm = useForm({ name: '', leader_name: '', description: '', image: null as File | null, sort_order: '0', is_published: false })
  const deleteForm = useForm({})

  const filtered = useMemo(() => {
    if (!search) return villages.data
    const q = search.toLowerCase()
    return villages.data.filter(v => v.name.toLowerCase().includes(q) || v.leader_name.toLowerCase().includes(q))
  }, [search, villages.data])

  const handleCreate = () => {
    createForm.post('/admin/villages', {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Kelurahan berhasil ditambahkan')
        createForm.reset()
        setShowCreateModal(false)
      },
      onError: () => toast.error('Gagal menambahkan kelurahan, periksa form.'),
    })
  }

  const handleEdit = () => {
    if (!editItem) return
    editForm.post(`/admin/villages/${editItem.id}?_method=PUT`, {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Kelurahan berhasil diperbarui')
        setShowEditModal(false)
        setEditItem(null)
      },
      onError: () => toast.error('Gagal memperbarui kelurahan, periksa form.'),
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return
    deleteForm.delete(`/admin/villages/${deleteItem.id}`, {
      onSuccess: () => {
        toast.success('Kelurahan berhasil dihapus')
        setDeleteItem(null)
      },
      onError: () => toast.error('Gagal menghapus kelurahan.'),
    })
  }

  const openEdit = (item: Village) => {
    setEditItem(item)
    editForm.setData({ name: item.name, leader_name: item.leader_name, description: (item as any).description ?? '', image: null, sort_order: String((item as any).sort_order ?? '0'), is_published: item.is_published })
    setShowEditModal(true)
  }

  return (
    <AdminLayout title="Kelurahan">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-sm flex-1"><AdminSearch onFilter={setSearch} placeholder="Cari kelurahan..." /></div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark">+ Tambah Kelurahan</button>
      </div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Kelurahan" description={`${villages.data.length} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Gambar</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Nama</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Kepala Desa</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">Tidak ada data</td></tr> : filtered.map((v, i) => (
              <tr key={v.id} className={`border-b border-border last:border-0 hover:bg-background/50 transition-colors ${i % 2 === 1 ? 'bg-background/60' : ''}`}>
                <td className="px-4 py-3 align-middle">
                  {v.photo ? (
                    <img src={`/storage/${v.photo}`} alt="" className="h-20 w-20 rounded-lg object-cover border" />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-background flex items-center justify-center">
                      <PhotoIcon className="h-5 w-5 text-muted" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{v.name}</td>
                <td className="px-4 py-3 text-muted">{v.leader_name}</td>
                <td className="px-4 py-3">
                  <button onClick={() => router.patch(`/admin/villages/${v.id}/publish`, {}, { onSuccess: () => toast.success('Status diubah') })} className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm ${v.is_published ? 'bg-success-bg text-primary' : 'bg-background text-muted'}`}>
                    {v.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(v)} className="inline-flex min-h-11 items-center gap-1 text-base text-primary hover:underline">
                    <PencilSquareIcon className="h-3.5 w-3.5" /> Edit
                  </button>
                  {isSuperAdmin && (
                    <button type="button" onClick={() => setDeleteItem(v)} aria-label={`Hapus kelurahan ${v.name}`} className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination data={villages} links={villages.links} />
          </div>
        </BentoCard>
      </BentoGrid>

      <EntityDrawer open={showCreateModal} onClose={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} title="Tambah Kelurahan">
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Nama Kelurahan" required error={createForm.errors.name}>
            <input type="text" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nama kelurahan" autoFocus />
          </DrawerField>
          <DrawerField label="Kepala Desa" error={createForm.errors.leader_name}>
            <input type="text" value={createForm.data.leader_name} onChange={(e) => createForm.setData('leader_name', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nama kepala desa" />
          </DrawerField>
          <DrawerField label="Deskripsi" error={createForm.errors.description}>
            <textarea value={createForm.data.description} onChange={(e) => createForm.setData('description', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={3} placeholder="Deskripsi kelurahan" />
          </DrawerField>
          <DrawerField label="Foto" error={createForm.errors.image}>
            <input type="file" accept="image/*" onChange={(e) => createForm.setData('image', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Urutan" error={createForm.errors.sort_order}>
            <input type="number" value={createForm.data.sort_order} onChange={(e) => createForm.setData('sort_order', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="create-published" checked={createForm.data.is_published} onChange={(e) => createForm.setData('is_published', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="create-published" className="text-base text-foreground">Publish</label>
          </div>
          <DrawerFooter onCancel={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} processing={createForm.processing} />
        </form>
      </EntityDrawer>

      <EntityDrawer open={showEditModal} onClose={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} title="Edit Kelurahan">
        <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Nama Kelurahan" required error={editForm.errors.name}>
            <input type="text" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
          </DrawerField>
          <DrawerField label="Kepala Desa" error={editForm.errors.leader_name}>
            <input type="text" value={editForm.data.leader_name} onChange={(e) => editForm.setData('leader_name', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Deskripsi" error={editForm.errors.description}>
            <textarea value={editForm.data.description} onChange={(e) => editForm.setData('description', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={3} />
          </DrawerField>
          <DrawerField label="Foto (kosongkan jika tidak diubah)" error={editForm.errors.image}>
            {editItem?.photo && <p className="text-sm text-muted mb-1">Saat ini: {editItem.photo}</p>}
            <input type="file" accept="image/*" onChange={(e) => editForm.setData('image', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Urutan" error={editForm.errors.sort_order}>
            <input type="number" value={editForm.data.sort_order} onChange={(e) => editForm.setData('sort_order', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="edit-published" checked={editForm.data.is_published} onChange={(e) => editForm.setData('is_published', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="edit-published" className="text-base text-foreground">Publish</label>
          </div>
          <DrawerFooter onCancel={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} processing={editForm.processing} submitText="Perbarui" />
        </form>
      </EntityDrawer>

      <ConfirmDeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} processing={deleteForm.processing} title="Hapus Kelurahan" message={`Kelurahan "${deleteItem?.name}" akan dihapus permanen.`} />
    </AdminLayout>
  )
}
