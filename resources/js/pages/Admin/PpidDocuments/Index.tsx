import AdminLayout from '@/layouts/AdminLayout'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import { router, useForm, usePage } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import AdminSearch from '@/components/AdminSearch'
import Pagination from '@/components/Pagination'
import EntityDrawer, { DrawerField, DrawerFooter } from '@/components/admin/EntityDrawer'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'

interface PpidDocument {
  id: number
  title: string
  description: string | null
  category: string
  file_path: string
  is_published: boolean
}

interface PpidDocumentsProps {
  documents: { data: PpidDocument[]; links: any[] }
}

export default function PpidDocumentsIndex({ documents }: PpidDocumentsProps) {
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState<PpidDocument | null>(null)
  const [deleteItem, setDeleteItem] = useState<PpidDocument | null>(null)
  const userRole = (usePage().props.auth as any)?.user?.role as string
  const isSuperAdmin = userRole === 'super_admin'

  const createForm = useForm({ title: '', description: '', file_path: null as File | null, category: 'berkala', is_published: false })
  const editForm = useForm({ title: '', description: '', file_path: null as File | null, category: 'berkala', is_published: false })
  const deleteForm = useForm({})

  const filtered = useMemo(() => {
    if (!search) return documents.data
    const q = search.toLowerCase()
    return documents.data.filter(d => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q))
  }, [search, documents.data])

  const handleCreate = () => {
    createForm.post('/admin/ppid-documents', {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Dokumen berhasil ditambahkan')
        createForm.reset()
        setShowCreateModal(false)
      },
      onError: () => toast.error('Gagal menambahkan dokumen, periksa form.'),
    })
  }

  const handleEdit = () => {
    if (!editItem) return
    editForm.post(`/admin/ppid-documents/${editItem.id}?_method=PUT`, {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Dokumen berhasil diperbarui')
        setShowEditModal(false)
        setEditItem(null)
      },
      onError: () => toast.error('Gagal memperbarui dokumen, periksa form.'),
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return
    deleteForm.delete(`/admin/ppid-documents/${deleteItem.id}`, {
      onSuccess: () => {
        toast.success('Dokumen berhasil dihapus')
        setDeleteItem(null)
      },
      onError: () => toast.error('Gagal menghapus dokumen.'),
    })
  }

  const openEdit = (item: PpidDocument) => {
    setEditItem(item)
    editForm.setData({ title: item.title, description: item.description ?? '', file_path: null, category: item.category ?? '', is_published: item.is_published })
    setShowEditModal(true)
  }

  return (
    <AdminLayout title="Dokumen PPID">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-sm flex-1"><AdminSearch onFilter={setSearch} placeholder="Cari dokumen..." /></div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark">+ Tambah Dokumen</button>
      </div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Dokumen PPID" description={`${documents.data.length} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-background border-b"><tr><th className="text-left px-4 py-3">Judul</th><th className="text-left px-4 py-3">Kategori</th><th className="text-left px-4 py-3">Status</th><th className="text-right px-4 py-3">Aksi</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">Tidak ada data</td></tr> : filtered.map((d) => (
              <tr key={d.id} className="border-b last:border-0 hover:bg-background transition-colors">
                <td className="px-4 py-3 font-medium">{d.title}</td>
                <td className="px-4 py-3 text-muted">{d.category}</td>
                <td className="px-4 py-3">
                  <button onClick={() => router.patch(`/admin/ppid-documents/${d.id}/publish`, {}, { onSuccess: () => toast.success('Status diubah') })} className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm ${d.is_published ? 'bg-success-bg text-primary' : 'bg-background text-muted'}`}>
                    {d.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(d)} className="inline-flex min-h-11 items-center gap-1 text-base text-primary hover:underline">
                    <PencilSquareIcon className="h-3.5 w-3.5" /> Edit
                  </button>
                  {isSuperAdmin && (
                    <button type="button" onClick={() => setDeleteItem(d)} aria-label={`Hapus dokumen ${d.title}`} className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination data={documents} links={documents.links} />
          </div>
        </BentoCard>
      </BentoGrid>

      <EntityDrawer open={showCreateModal} onClose={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} title="Tambah Dokumen">
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Judul" required error={createForm.errors.title}>
            <input type="text" value={createForm.data.title} onChange={(e) => createForm.setData('title', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Judul dokumen" autoFocus />
          </DrawerField>
          <DrawerField label="Deskripsi" error={createForm.errors.description}>
            <textarea value={createForm.data.description} onChange={(e) => createForm.setData('description', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={3} placeholder="Deskripsi dokumen" />
          </DrawerField>
          <DrawerField label="File" required error={createForm.errors.file_path}>
            <input type="file" accept=".pdf,image/*" onChange={(e) => createForm.setData('file_path', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Kategori" error={createForm.errors.category}>
            <select value={createForm.data.category} onChange={(e) => createForm.setData('category', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="berkala">Berkala</option>
              <option value="serta_merta">Serta Merta</option>
              <option value="setiap_saat">Setiap Saat</option>
              <option value="dikecualikan">Dikecualikan</option>
            </select>
          </DrawerField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="create-published" checked={createForm.data.is_published} onChange={(e) => createForm.setData('is_published', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="create-published" className="text-base text-foreground">Publish</label>
          </div>
          <DrawerFooter onCancel={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} processing={createForm.processing} />
        </form>
      </EntityDrawer>

      <EntityDrawer open={showEditModal} onClose={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} title="Edit Dokumen">
        <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Judul" required error={editForm.errors.title}>
            <input type="text" value={editForm.data.title} onChange={(e) => editForm.setData('title', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
          </DrawerField>
          <DrawerField label="Deskripsi" error={editForm.errors.description}>
            <textarea value={editForm.data.description} onChange={(e) => editForm.setData('description', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={3} />
          </DrawerField>
          <DrawerField label="File (kosongkan jika tidak diubah)" error={editForm.errors.file_path}>
            <input type="file" accept=".pdf,image/*" onChange={(e) => editForm.setData('file_path', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Kategori" error={editForm.errors.category}>
            <select value={editForm.data.category} onChange={(e) => editForm.setData('category', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="berkala">Berkala</option>
              <option value="serta_merta">Serta Merta</option>
              <option value="setiap_saat">Setiap Saat</option>
              <option value="dikecualikan">Dikecualikan</option>
            </select>
          </DrawerField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="edit-published" checked={editForm.data.is_published} onChange={(e) => editForm.setData('is_published', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="edit-published" className="text-base text-foreground">Publish</label>
          </div>
          <DrawerFooter onCancel={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} processing={editForm.processing} submitText="Perbarui" />
        </form>
      </EntityDrawer>

      <ConfirmDeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} processing={deleteForm.processing} title="Hapus Dokumen" message={`Dokumen "${deleteItem?.title}" akan dihapus permanen.`} />
    </AdminLayout>
  )
}
