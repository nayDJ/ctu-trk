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

interface Slider {
  id: number
  title: string
  sort_order: number
  is_published: boolean
  created_by: number | null
}

interface SlidersProps {
  sliders: { data: Slider[]; links: any[]; total: number }
}

export default function SlidersIndex({ sliders }: SlidersProps) {
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState<Slider | null>(null)
  const [deleteItem, setDeleteItem] = useState<Slider | null>(null)
  const userRole = (usePage().props.auth as any)?.user?.role as string
  const userId = (usePage().props.auth as any)?.user?.id as number
  const isSuperAdmin = userRole === 'super_admin'
  const canEdit = userRole === 'super_admin' || userRole === 'admin'

  const createForm = useForm({ title: '', image: null as File | null, link_url: '', sort_order: '0', is_published: false })
  const editForm = useForm({ title: '', image: null as File | null, link_url: '', sort_order: '0', is_published: false })
  const deleteForm = useForm({})

  const filtered = useMemo(() => {
    if (!search) return sliders.data
    const q = search.toLowerCase()
    return sliders.data.filter(s => s.title.toLowerCase().includes(q))
  }, [search, sliders.data])

  const handleCreate = () => {
    createForm.post('/admin/sliders', {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Slider berhasil ditambahkan')
        createForm.reset()
        setShowCreateModal(false)
      },
      onError: () => toast.error('Gagal menambahkan slider, periksa form.'),
    })
  }

  const handleEdit = () => {
    if (!editItem) return
    editForm.post(`/admin/sliders/${editItem.id}?_method=PUT`, {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Slider berhasil diperbarui')
        setShowEditModal(false)
        setEditItem(null)
      },
      onError: () => toast.error('Gagal memperbarui slider, periksa form.'),
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return
    deleteForm.delete(`/admin/sliders/${deleteItem.id}`, {
      onSuccess: () => {
        toast.success('Slider berhasil dihapus')
        setDeleteItem(null)
      },
      onError: () => toast.error('Gagal menghapus slider.'),
    })
  }

  const openEdit = (item: Slider) => {
    setEditItem(item)
    editForm.setData({ title: item.title, image: null, link_url: (item as any).link_url ?? '', sort_order: String(item.sort_order), is_published: item.is_published })
    setShowEditModal(true)
  }

  return (
    <AdminLayout title="Slider Banner">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-sm flex-1"><AdminSearch onFilter={setSearch} placeholder="Cari slider..." /></div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark">+ Tambah Slider</button>
      </div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Slider Banner" description={`${sliders.total} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Gambar</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Judul</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Urutan</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-muted">Tidak ada data</td></tr> : filtered.map((s, i) => (
              <tr key={s.id} className={`border-b border-border last:border-0 hover:bg-background/50 transition-colors ${i % 2 === 1 ? 'bg-background/60' : ''}`}>
                <td className="px-4 py-3 align-middle">
                  {(s as any).image ? (
                    <img src={`/storage/${(s as any).image}`} alt="" className="h-20 w-20 rounded-lg object-cover border" />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-background flex items-center justify-center">
                      <PhotoIcon className="h-5 w-5 text-muted" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{s.title}</td>
                <td className="px-4 py-3 text-muted">{s.sort_order}</td>
                <td className="px-4 py-3">
                  <button onClick={() => router.patch(`/admin/sliders/${s.id}/publish`, {}, { onSuccess: () => toast.success('Status diubah') })} className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm ${s.is_published ? 'bg-success-bg text-primary' : 'bg-background text-muted'}`}>
                    {s.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  {(canEdit || s.created_by === userId) && (
                    <button onClick={() => openEdit(s)} className="inline-flex min-h-11 items-center gap-1 text-base text-primary hover:underline">
                      <PencilSquareIcon className="h-3.5 w-3.5" /> Edit
                    </button>
                  )}
                  {isSuperAdmin && (
                    <button type="button" onClick={() => setDeleteItem(s)} aria-label={`Hapus slider ${s.title}`} className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination data={sliders} links={sliders.links} />
          </div>
        </BentoCard>
      </BentoGrid>

      <EntityDrawer open={showCreateModal} onClose={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} title="Tambah Slider">
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Judul" required error={createForm.errors.title}>
            <input type="text" value={createForm.data.title} onChange={(e) => createForm.setData('title', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Judul slider" autoFocus />
          </DrawerField>
          <DrawerField label="Gambar" required error={createForm.errors.image}>
            <input type="file" accept="image/*" onChange={(e) => createForm.setData('image', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Link URL" error={createForm.errors.link_url}>
            <input type="text" value={createForm.data.link_url} onChange={(e) => createForm.setData('link_url', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="https://..." />
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

      <EntityDrawer open={showEditModal} onClose={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} title="Edit Slider">
        <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Judul" required error={editForm.errors.title}>
            <input type="text" value={editForm.data.title} onChange={(e) => editForm.setData('title', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
          </DrawerField>
          <DrawerField label="Gambar (kosongkan jika tidak diubah)" error={editForm.errors.image}>
            <input type="file" accept="image/*" onChange={(e) => editForm.setData('image', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Link URL" error={editForm.errors.link_url}>
            <input type="text" value={editForm.data.link_url} onChange={(e) => editForm.setData('link_url', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
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

      <ConfirmDeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} processing={deleteForm.processing} title="Hapus Slider" message={`Slider "${deleteItem?.title}" akan dihapus permanen.`} />
    </AdminLayout>
  )
}
