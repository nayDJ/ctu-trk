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

interface Category {
  id: number
  name: string
  is_active: boolean
}

interface CategoriesProps {
  categories: { data: Category[]; links: any[] }
}

export default function CategoriesIndex({ categories }: CategoriesProps) {
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState<Category | null>(null)
  const [deleteItem, setDeleteItem] = useState<Category | null>(null)
  const userRole = (usePage().props.auth as any)?.user?.role as string
  const isSuperAdmin = userRole === 'super_admin'

  const createForm = useForm({ name: '' })
  const editForm = useForm({ name: '' })
  const deleteForm = useForm({})

  const filtered = useMemo(() => {
    if (!search) return categories.data
    const q = search.toLowerCase()
    return categories.data.filter(c => c.name.toLowerCase().includes(q))
  }, [search, categories.data])

  const handleCreate = () => {
    createForm.post('/admin/categories', {
      onSuccess: () => {
        toast.success('Kategori berhasil ditambahkan')
        createForm.reset()
        setShowCreateModal(false)
      },
      onError: () => toast.error('Gagal menambahkan kategori, periksa form.'),
    })
  }

  const handleEdit = () => {
    if (!editItem) return
    editForm.put(`/admin/categories/${editItem.id}`, {
      onSuccess: () => {
        toast.success('Kategori berhasil diperbarui')
        setShowEditModal(false)
        setEditItem(null)
      },
      onError: () => toast.error('Gagal memperbarui kategori, periksa form.'),
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return
    deleteForm.delete(`/admin/categories/${deleteItem.id}`, {
      onSuccess: () => {
        toast.success('Kategori berhasil dihapus')
        setDeleteItem(null)
      },
      onError: (errors) => toast.error(errors.category ?? 'Gagal menghapus kategori.'),
    })
  }

  const openEdit = (item: Category) => {
    setEditItem(item)
    editForm.setData('name', item.name)
    setShowEditModal(true)
  }

  return (
    <AdminLayout title="Kategori">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-sm flex-1"><AdminSearch onFilter={setSearch} placeholder="Cari kategori..." /></div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark">+ Tambah Kategori</button>
      </div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Kategori" description={`${categories.data.length} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-background border-b"><tr><th className="text-left px-4 py-3">Nama</th><th className="text-left px-4 py-3">Status</th><th className="text-right px-4 py-3">Aksi</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={3} className="px-4 py-8 text-center text-muted">Tidak ada data</td></tr> : filtered.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-background transition-colors">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">
                  <button onClick={() => router.patch(`/admin/categories/${c.id}/toggle`, {}, { onSuccess: () => toast.success('Status diubah') })} className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm ${c.is_active ? 'bg-success-bg text-primary' : 'bg-background text-muted'}`}>
                    {c.is_active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(c)} className="inline-flex min-h-11 items-center gap-1 text-base text-primary hover:underline">
                    <PencilSquareIcon className="h-3.5 w-3.5" /> Edit
                  </button>
                  {isSuperAdmin && (
                    <button type="button" onClick={() => setDeleteItem(c)} aria-label={`Hapus kategori ${c.name}`} className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination data={categories} links={categories.links} />
          </div>
        </BentoCard>
      </BentoGrid>

      <EntityDrawer open={showCreateModal} onClose={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} title="Tambah Kategori">
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="space-y-4">
          <DrawerField label="Nama Kategori" required error={createForm.errors.name}>
            <input type="text" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Masukkan nama kategori" autoFocus />
          </DrawerField>
          <DrawerFooter onCancel={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} processing={createForm.processing} />
        </form>
      </EntityDrawer>

      <EntityDrawer open={showEditModal} onClose={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} title="Edit Kategori">
        <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="space-y-4">
          <DrawerField label="Nama Kategori" required error={editForm.errors.name}>
            <input type="text" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Masukkan nama kategori" autoFocus />
          </DrawerField>
          <DrawerFooter onCancel={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} processing={editForm.processing} submitText="Perbarui" />
        </form>
      </EntityDrawer>

      <ConfirmDeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} processing={deleteForm.processing} title="Hapus Kategori" message={`Kategori "${deleteItem?.name}" akan dihapus permanen.`} />
    </AdminLayout>
  )
}
