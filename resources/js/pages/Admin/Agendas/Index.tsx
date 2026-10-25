import AdminLayout from '@/layouts/AdminLayout'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import { router, useForm, usePage } from '@inertiajs/react'
import { useState, useCallback } from 'react'
import { PencilSquareIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import AdminSearch from '@/components/AdminSearch'
import Pagination from '@/components/Pagination'
import EntityDrawer, { DrawerField, DrawerFooter } from '@/components/admin/EntityDrawer'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'

interface Agenda {
  id: number
  title: string
  description: string | null
  starts_at: string
  ends_at: string | null
  location: string | null
  image_path: string | null
  is_published: boolean
  created_by: number | null
}

interface AgendasProps {
  agendas: { data: Agenda[]; links: any[]; total: number }
  filters?: { search?: string }
}

const toDateTimeLocal = (value: string | null): string => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Makassar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? ''

  return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`
}

const formatDateTime = (value: string | null): string => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Makassar',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default function AgendasIndex({ agendas, filters }: AgendasProps) {
  const handleSearch = useCallback((q: string) => {
    router.get('/admin/agendas', { search: q }, { preserveState: true, replace: true })
  }, [])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState<Agenda | null>(null)
  const [deleteItem, setDeleteItem] = useState<Agenda | null>(null)
  const userRole = (usePage().props.auth as any)?.user?.role as string
  const userId = (usePage().props.auth as any)?.user?.id as number
  const isSuperAdmin = userRole === 'super_admin'
  const canEdit = userRole === 'super_admin' || userRole === 'admin'

  const createForm = useForm({ title: '', description: '', starts_at: '', ends_at: '', location: '', image: null as File | null, is_published: false })
  const editForm = useForm({ title: '', description: '', starts_at: '', ends_at: '', location: '', image: null as File | null, is_published: false })
  const deleteForm = useForm({})

  const handleCreate = () => {
    createForm.post('/admin/agendas', {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Agenda berhasil ditambahkan')
        createForm.reset()
        setShowCreateModal(false)
      },
      onError: () => toast.error('Gagal menambahkan agenda, periksa form.'),
    })
  }

  const handleEdit = () => {
    if (!editItem) return
    editForm.post(`/admin/agendas/${editItem.id}?_method=PUT`, {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Agenda berhasil diperbarui')
        setShowEditModal(false)
        setEditItem(null)
      },
      onError: () => toast.error('Gagal memperbarui agenda, periksa form.'),
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return
    deleteForm.delete(`/admin/agendas/${deleteItem.id}`, {
      onSuccess: () => {
        toast.success('Agenda berhasil dihapus')
        setDeleteItem(null)
      },
      onError: () => toast.error('Gagal menghapus agenda.'),
    })
  }

  const openEdit = (item: Agenda) => {
    setEditItem(item)
    editForm.setData({
      title: item.title,
      description: item.description ?? '',
      starts_at: toDateTimeLocal(item.starts_at),
      ends_at: toDateTimeLocal(item.ends_at),
      location: item.location ?? '',
      image: null,
      is_published: item.is_published,
    })
    setShowEditModal(true)
  }

  return (
    <AdminLayout title="Agenda">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-sm flex-1"><AdminSearch onFilter={handleSearch} defaultValue={filters?.search ?? ''} placeholder="Cari agenda..." /></div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark">+ Tambah Agenda</button>
      </div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Agenda" description={`${agendas.total} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Gambar</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Judul</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Waktu</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Lokasi</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {agendas.data.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">Tidak ada data</td></tr> : agendas.data.map((a, i) => (
              <tr key={a.id} className={`border-b border-border last:border-0 hover:bg-background/50 transition-colors ${i % 2 === 1 ? 'bg-background/60' : ''}`}>
                <td className="px-4 py-3 align-middle">
                  {a.image_path ? (
                    <img src={`/storage/${a.image_path}`} alt="" className="h-20 w-20 rounded-lg object-cover border" />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-background flex items-center justify-center">
                      <PhotoIcon className="h-5 w-5 text-muted" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3 text-muted">{formatDateTime(a.starts_at)}</td>
                <td className="px-4 py-3 text-muted">{a.location}</td>
                <td className="px-4 py-3">
                  <button onClick={() => router.patch(`/admin/agendas/${a.id}/publish`, {}, { onSuccess: () => toast.success('Status diubah') })} className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm ${a.is_published ? 'bg-success-bg text-primary' : 'bg-background text-muted'}`}>
                    {a.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  {(canEdit || a.created_by === userId) && (
                    <button onClick={() => openEdit(a)} className="inline-flex min-h-11 items-center gap-1 text-base text-primary hover:underline">
                      <PencilSquareIcon className="h-3.5 w-3.5" /> Edit
                    </button>
                  )}
                  {isSuperAdmin && (
                    <button type="button" onClick={() => setDeleteItem(a)} aria-label={`Hapus agenda ${a.title}`} className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination data={agendas} links={agendas.links} />
          </div>
        </BentoCard>
      </BentoGrid>

      <EntityDrawer open={showCreateModal} onClose={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} title="Tambah Agenda">
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Judul" required error={createForm.errors.title}>
            <input type="text" value={createForm.data.title} onChange={(e) => createForm.setData('title', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Judul agenda" autoFocus />
          </DrawerField>
          <DrawerField label="Deskripsi" error={createForm.errors.description}>
            <textarea value={createForm.data.description} onChange={(e) => createForm.setData('description', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={3} placeholder="Deskripsi agenda" />
          </DrawerField>
          <DrawerField label="Waktu Mulai (WITA)" required error={createForm.errors.starts_at}>
            <input type="datetime-local" value={createForm.data.starts_at} onChange={(e) => createForm.setData('starts_at', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Waktu Selesai (WITA)" error={createForm.errors.ends_at}>
            <input type="datetime-local" value={createForm.data.ends_at} onChange={(e) => createForm.setData('ends_at', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Lokasi" error={createForm.errors.location}>
            <input type="text" value={createForm.data.location} onChange={(e) => createForm.setData('location', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Lokasi kegiatan" />
          </DrawerField>
          <DrawerField label="Foto" error={createForm.errors.image}>
            <input type="file" accept="image/*" onChange={(e) => createForm.setData('image', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="create-published" checked={createForm.data.is_published} onChange={(e) => createForm.setData('is_published', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="create-published" className="text-base text-foreground">Publish</label>
          </div>
          <DrawerFooter onCancel={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} processing={createForm.processing} />
        </form>
      </EntityDrawer>

      <EntityDrawer open={showEditModal} onClose={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} title="Edit Agenda">
        <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Judul" required error={editForm.errors.title}>
            <input type="text" value={editForm.data.title} onChange={(e) => editForm.setData('title', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
          </DrawerField>
          <DrawerField label="Deskripsi" error={editForm.errors.description}>
            <textarea value={editForm.data.description} onChange={(e) => editForm.setData('description', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={3} />
          </DrawerField>
          <DrawerField label="Waktu Mulai (WITA)" required error={editForm.errors.starts_at}>
            <input type="datetime-local" value={editForm.data.starts_at} onChange={(e) => editForm.setData('starts_at', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Waktu Selesai (WITA)" error={editForm.errors.ends_at}>
            <input type="datetime-local" value={editForm.data.ends_at} onChange={(e) => editForm.setData('ends_at', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Lokasi" error={editForm.errors.location}>
            <input type="text" value={editForm.data.location} onChange={(e) => editForm.setData('location', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Foto (kosongkan jika tidak diubah)" error={editForm.errors.image}>
            {editItem?.image_path && <p className="text-sm text-muted mb-1">Saat ini: {editItem.image_path}</p>}
            <input type="file" accept="image/*" onChange={(e) => editForm.setData('image', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="edit-published" checked={editForm.data.is_published} onChange={(e) => editForm.setData('is_published', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="edit-published" className="text-base text-foreground">Publish</label>
          </div>
          <DrawerFooter onCancel={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} processing={editForm.processing} submitText="Perbarui" />
        </form>
      </EntityDrawer>

      <ConfirmDeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} processing={deleteForm.processing} title="Hapus Agenda" message={`Agenda "${deleteItem?.title}" akan dihapus permanen.`} />
    </AdminLayout>
  )
}
