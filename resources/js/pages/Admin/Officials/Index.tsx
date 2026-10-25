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

interface Official {
  id: number
  name: string
  position: string
  village: { name: string } | null
}

interface OfficialsProps {
  officials: { data: Official[]; links: any[] }
  villages: Array<{ id: number; name: string }>
}

export default function OfficialsIndex({ officials, villages }: OfficialsProps) {
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState<Official | null>(null)
  const [deleteItem, setDeleteItem] = useState<Official | null>(null)
  const userRole = (usePage().props.auth as any)?.user?.role as string
  const isSuperAdmin = userRole === 'super_admin'

  const createForm = useForm({ name: '', position: '', village_id: '', sort_order: '0', photo: null as File | null })
  const editForm = useForm({ name: '', position: '', village_id: '', sort_order: '0', photo: null as File | null })
  const deleteForm = useForm({})

  const filtered = useMemo(() => {
    if (!search) return officials.data
    const q = search.toLowerCase()
    return officials.data.filter(o => o.name.toLowerCase().includes(q) || o.position.toLowerCase().includes(q) || (o.village?.name ?? '').toLowerCase().includes(q))
  }, [search, officials.data])

  const handleCreate = () => {
    createForm.post('/admin/officials', {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Pejabat berhasil ditambahkan')
        createForm.reset()
        setShowCreateModal(false)
      },
      onError: () => toast.error('Gagal menambahkan pejabat, periksa form.'),
    })
  }

  const handleEdit = () => {
    if (!editItem) return
    editForm.post(`/admin/officials/${editItem.id}?_method=PUT`, {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Pejabat berhasil diperbarui')
        setShowEditModal(false)
        setEditItem(null)
      },
      onError: () => toast.error('Gagal memperbarui pejabat, periksa form.'),
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return
    deleteForm.delete(`/admin/officials/${deleteItem.id}`, {
      onSuccess: () => {
        toast.success('Pejabat berhasil dihapus')
        setDeleteItem(null)
      },
      onError: () => toast.error('Gagal menghapus pejabat.'),
    })
  }

  const openEdit = (item: Official) => {
    setEditItem(item)
    editForm.setData({
      name: item.name,
      position: item.position,
      village_id: String((item as any).village_id ?? ''),
      sort_order: String((item as any).sort_order ?? '0'),
      photo: null,
    })
    setShowEditModal(true)
  }

  return (
    <AdminLayout title="Pejabat">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-sm flex-1"><AdminSearch onFilter={setSearch} placeholder="Cari pejabat..." /></div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark">+ Tambah Pejabat</button>
      </div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Pejabat" description={`${officials.data.length} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Foto</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Nama</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Jabatan</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Desa</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">Tidak ada data</td></tr> : filtered.map((o, i) => (
              <tr key={o.id} className={`border-b border-border last:border-0 hover:bg-background/50 transition-colors ${i % 2 === 1 ? 'bg-background/60' : ''}`}>
                <td className="px-4 py-3 align-middle">
                  {(o as any).photo ? (
                    <img src={`/storage/${(o as any).photo}`} alt="" className="h-20 w-20 rounded-lg object-cover border" />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-background flex items-center justify-center">
                      <PhotoIcon className="h-5 w-5 text-muted" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{o.name}</td>
                <td className="px-4 py-3 text-muted">{o.position}</td>
                <td className="px-4 py-3 text-muted">{o.village?.name ?? '-'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(o)} className="inline-flex min-h-11 items-center gap-1 text-base text-primary hover:underline">
                    <PencilSquareIcon className="h-3.5 w-3.5" /> Edit
                  </button>
                  {isSuperAdmin && (
                    <button type="button" onClick={() => setDeleteItem(o)} aria-label={`Hapus pejabat ${o.name}`} className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination data={officials} links={officials.links} />
          </div>
        </BentoCard>
      </BentoGrid>

      <EntityDrawer open={showCreateModal} onClose={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} title="Tambah Pejabat">
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Nama" required error={createForm.errors.name}>
            <input type="text" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nama pejabat" autoFocus />
          </DrawerField>
          <DrawerField label="Jabatan" required error={createForm.errors.position}>
            <input type="text" value={createForm.data.position} onChange={(e) => createForm.setData('position', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Jabatan" />
          </DrawerField>
          <DrawerField label="Desa" error={createForm.errors.village_id}>
            <select value={createForm.data.village_id} onChange={(e) => createForm.setData('village_id', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Pilih Desa</option>
              {villages.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </DrawerField>
          <DrawerField label="Urutan" error={createForm.errors.sort_order}>
            <input type="number" value={createForm.data.sort_order} onChange={(e) => createForm.setData('sort_order', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Foto" error={createForm.errors.photo}>
            <input type="file" accept="image/*" onChange={(e) => createForm.setData('photo', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerFooter onCancel={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} processing={createForm.processing} />
        </form>
      </EntityDrawer>

      <EntityDrawer open={showEditModal} onClose={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} title="Edit Pejabat">
        <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Nama" required error={editForm.errors.name}>
            <input type="text" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
          </DrawerField>
          <DrawerField label="Jabatan" required error={editForm.errors.position}>
            <input type="text" value={editForm.data.position} onChange={(e) => editForm.setData('position', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Desa" error={editForm.errors.village_id}>
            <select value={editForm.data.village_id} onChange={(e) => editForm.setData('village_id', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Pilih Desa</option>
              {villages.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </DrawerField>
          <DrawerField label="Urutan" error={editForm.errors.sort_order}>
            <input type="number" value={editForm.data.sort_order} onChange={(e) => editForm.setData('sort_order', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Foto (kosongkan jika tidak diubah)" error={editForm.errors.photo}>
            <input type="file" accept="image/*" onChange={(e) => editForm.setData('photo', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerFooter onCancel={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} processing={editForm.processing} submitText="Perbarui" />
        </form>
      </EntityDrawer>

      <ConfirmDeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} processing={deleteForm.processing} title="Hapus Pejabat" message={`Pejabat "${deleteItem?.name}" akan dihapus permanen.`} />
    </AdminLayout>
  )
}
