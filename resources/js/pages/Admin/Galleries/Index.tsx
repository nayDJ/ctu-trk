import AdminLayout from '@/layouts/AdminLayout'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import { router, useForm, usePage } from '@inertiajs/react'
import { useState, useCallback } from 'react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import AdminSearch from '@/components/AdminSearch'
import Pagination from '@/components/Pagination'
import EntityDrawer, { DrawerField, DrawerFooter } from '@/components/admin/EntityDrawer'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'

interface Gallery {
  id: number
  title: string
  caption: string | null
  credit: string | null
  path: string
  is_published: boolean
  created_by: number | null
}

interface GalleriesProps {
  galleries: { data: Gallery[]; links: any[]; total: number }
  filters?: { search?: string }
}

export default function GalleriesIndex({ galleries, filters }: GalleriesProps) {
  const handleSearch = useCallback((q: string) => {
    router.get('/admin/galleries', { search: q }, { preserveState: true, replace: true })
  }, [])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState<Gallery | null>(null)
  const [deleteItem, setDeleteItem] = useState<Gallery | null>(null)
  const userRole = (usePage().props.auth as any)?.user?.role as string
  const userId = (usePage().props.auth as any)?.user?.id as number
  const isSuperAdmin = userRole === 'super_admin'
  const canEdit = userRole === 'super_admin' || userRole === 'admin'

  const createForm = useForm({ title: '', caption: '', credit: '', path: null as File | null, is_published: false })
  const editForm = useForm({ title: '', caption: '', credit: '', path: null as File | null, is_published: false })
  const deleteForm = useForm({})

  const handleCreate = () => {
    createForm.post('/admin/galleries', {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Galeri berhasil ditambahkan')
        createForm.reset()
        setShowCreateModal(false)
      },
      onError: () => toast.error('Gagal menambahkan galeri, periksa form.'),
    })
  }

  const handleEdit = () => {
    if (!editItem) return
    editForm.post(`/admin/galleries/${editItem.id}?_method=PUT`, {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Galeri berhasil diperbarui')
        setShowEditModal(false)
        setEditItem(null)
      },
      onError: () => toast.error('Gagal memperbarui galeri, periksa form.'),
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return
    deleteForm.delete(`/admin/galleries/${deleteItem.id}`, {
      onSuccess: () => {
        toast.success('Galeri berhasil dihapus')
        setDeleteItem(null)
      },
      onError: () => toast.error('Gagal menghapus galeri.'),
    })
  }

  const openEdit = (item: Gallery) => {
    setEditItem(item)
    editForm.setData({ title: item.title, caption: item.caption ?? '', credit: item.credit ?? '', path: null, is_published: item.is_published })
    setShowEditModal(true)
  }

  return (
    <AdminLayout title="Galeri">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-sm flex-1"><AdminSearch onFilter={handleSearch} defaultValue={filters?.search ?? ''} placeholder="Cari galeri..." /></div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark">+ Tambah Galeri</button>
      </div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Galeri" description={`${galleries.total} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-background border-b"><tr><th className="text-left px-4 py-3">Gambar</th><th className="text-left px-4 py-3">Judul</th><th className="text-left px-4 py-3">Status</th><th className="text-right px-4 py-3">Aksi</th></tr></thead>
          <tbody>
            {galleries.data.length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">Tidak ada data</td></tr> : galleries.data.map((g) => (
              <tr key={g.id} className="border-b last:border-0 hover:bg-background transition-colors">
                <td className="px-4 py-3">
                  {g.path ? (
                    <img src={`/storage/${g.path}`} alt={g.title} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-background flex items-center justify-center">
                      <span className="text-muted text-xs">N/A</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{g.title}</td>
                <td className="px-4 py-3">
                  <button onClick={() => router.patch(`/admin/galleries/${g.id}/publish`, {}, { onSuccess: () => toast.success('Status diubah') })} className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm ${g.is_published ? 'bg-success-bg text-primary' : 'bg-background text-muted'}`}>
                    {g.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  {(canEdit || g.created_by === userId) && (
                    <button onClick={() => openEdit(g)} className="inline-flex min-h-11 items-center gap-1 text-base text-primary hover:underline">
                      <PencilSquareIcon className="h-3.5 w-3.5" /> Edit
                    </button>
                  )}
                  {isSuperAdmin && (
                    <button type="button" onClick={() => setDeleteItem(g)} aria-label={`Hapus galeri ${g.title}`} className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination data={galleries} links={galleries.links} />
          </div>
        </BentoCard>
      </BentoGrid>

      <EntityDrawer open={showCreateModal} onClose={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} title="Tambah Galeri">
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Judul" required error={createForm.errors.title}>
            <input type="text" value={createForm.data.title} onChange={(e) => createForm.setData('title', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Judul galeri" autoFocus />
          </DrawerField>
          <DrawerField label="Caption" error={createForm.errors.caption}>
            <textarea value={createForm.data.caption} onChange={(e) => createForm.setData('caption', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={2} placeholder="Caption gambar" />
          </DrawerField>
          <DrawerField label="Kredit" error={createForm.errors.credit}>
            <input type="text" value={createForm.data.credit} onChange={(e) => createForm.setData('credit', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Kredit foto" />
          </DrawerField>
          <DrawerField label="Gambar" required error={createForm.errors.path}>
            <input type="file" accept="image/*" onChange={(e) => createForm.setData('path', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="create-published" checked={createForm.data.is_published} onChange={(e) => createForm.setData('is_published', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="create-published" className="text-base text-foreground">Publish</label>
          </div>
          <DrawerFooter onCancel={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} processing={createForm.processing} />
        </form>
      </EntityDrawer>

      <EntityDrawer open={showEditModal} onClose={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} title="Edit Galeri">
        <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Judul" required error={editForm.errors.title}>
            <input type="text" value={editForm.data.title} onChange={(e) => editForm.setData('title', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
          </DrawerField>
          <DrawerField label="Caption" error={editForm.errors.caption}>
            <textarea value={editForm.data.caption} onChange={(e) => editForm.setData('caption', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={2} />
          </DrawerField>
          <DrawerField label="Kredit" error={editForm.errors.credit}>
            <input type="text" value={editForm.data.credit} onChange={(e) => editForm.setData('credit', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Gambar (kosongkan jika tidak diubah)" error={editForm.errors.path}>
            <input type="file" accept="image/*" onChange={(e) => editForm.setData('path', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="edit-published" checked={editForm.data.is_published} onChange={(e) => editForm.setData('is_published', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="edit-published" className="text-base text-foreground">Publish</label>
          </div>
          <DrawerFooter onCancel={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} processing={editForm.processing} submitText="Perbarui" />
        </form>
      </EntityDrawer>

      <ConfirmDeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} processing={deleteForm.processing} title="Hapus Galeri" message={`Galeri "${deleteItem?.title}" akan dihapus permanen.`} />
    </AdminLayout>
  )
}
