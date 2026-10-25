import AdminLayout from '@/layouts/AdminLayout'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import { router, useForm, usePage } from '@inertiajs/react'
import { useState, useCallback } from 'react'
import { PencilSquareIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import AdminSearch from '@/components/AdminSearch'
import Pagination from '@/components/Pagination'
import { AdminTable, AdminTh, AdminTr, AdminEmpty } from '@/components/ui/admin-table'

import EntityDrawer, { DrawerField, DrawerFooter } from '@/components/admin/EntityDrawer'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string | null
  body: string | null
  image: string | null
  is_published: boolean
  published_at: string
  author_id: number
  author: { name: string }
}

interface PostsProps {
  posts: { data: Post[]; links: any[]; total: number }
  filters?: { search?: string }
}

export default function PostsIndex({ posts, filters }: PostsProps) {
  const handleSearch = useCallback((q: string) => {
    router.get('/admin/posts', { search: q }, { preserveState: true, replace: true })
  }, [])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState<Post | null>(null)
  const [deleteItem, setDeleteItem] = useState<Post | null>(null)
  const userRole = (usePage().props.auth as any)?.user?.role as string
  const userId = (usePage().props.auth as any)?.user?.id as number
  const isSuperAdmin = userRole === 'super_admin'
  const canEdit = userRole === 'super_admin' || userRole === 'admin'

  const createForm = useForm({ title: '', excerpt: '', body: '', image: null as File | null, is_published: false })
  const editForm = useForm({ title: '', excerpt: '', body: '', image: null as File | null, is_published: false })
  const deleteForm = useForm({})

  const handleCreate = () => {
    createForm.post('/admin/posts', {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Berita berhasil ditambahkan')
        createForm.reset()
        setShowCreateModal(false)
      },
      onError: () => toast.error('Gagal menambahkan berita, periksa form.'),
    })
  }

  const handleEdit = () => {
    if (!editItem) return
    editForm.post(`/admin/posts/${editItem.id}?_method=PUT`, {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Berita berhasil diperbarui')
        setShowEditModal(false)
        setEditItem(null)
      },
      onError: () => toast.error('Gagal memperbarui berita, periksa form.'),
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return
    deleteForm.delete(`/admin/posts/${deleteItem.id}`, {
      onSuccess: () => {
        toast.success('Berita berhasil dihapus')
        setDeleteItem(null)
      },
      onError: () => toast.error('Gagal menghapus berita.'),
    })
  }

  const openEdit = (item: Post) => {
    setEditItem(item)
    editForm.setData({
      title: item.title,
      excerpt: item.excerpt ?? '',
      body: item.body ?? '',
      image: null,
      is_published: item.is_published,
    })
    setShowEditModal(true)
  }

  return (
    <AdminLayout title="Berita">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-[180px] max-w-sm flex-1">
          <AdminSearch onFilter={handleSearch} defaultValue={filters?.search ?? ''} placeholder="Cari berita..." />
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          + Tambah Berita
        </button>
      </div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Berita" description={`${posts.total} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <AdminTable>
          <thead className="bg-background border-b">
            <tr>
              <AdminTh>Gambar</AdminTh>
              <AdminTh>Judul</AdminTh>
              <AdminTh>Penulis</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh right>Aksi</AdminTh>
            </tr>
          </thead>
          <tbody>
            {posts.data.length === 0 ? (
              <AdminEmpty colSpan={5} />
            ) : posts.data.map((post, i) => (
              <AdminTr key={post.id}>
                <td className="px-4 py-3 align-middle">
                  {post.image ? (
                    <img src={`/storage/${post.image}`} alt="" className="h-20 w-20 rounded-lg object-cover border" />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-background flex items-center justify-center">
                      <PhotoIcon className="h-5 w-5 text-muted" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{post.title}</td>
                <td className="px-4 py-3 text-muted">{post.author?.name}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => router.patch(`/admin/posts/${post.id}/publish`, {}, { onSuccess: () => toast.success('Status diubah') })}
                    aria-pressed={post.is_published}
                    aria-label={`${post.is_published ? 'Jadikan draf' : 'Terbitkan'} ${post.title}`}
                    className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm ${post.is_published ? 'bg-success-bg text-foreground' : 'bg-background text-foreground'}`}
                  >
                    {post.is_published ? 'Terbit' : 'Draf'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  {(canEdit || post.author_id === userId) && (
                    <button type="button" onClick={() => openEdit(post)} className="inline-flex min-h-11 items-center gap-1 text-base text-primary hover:underline">
                      <PencilSquareIcon className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                    </button>
                  )}
                  {isSuperAdmin && (
                    <button type="button" onClick={() => setDeleteItem(post)} aria-label="Hapus berita" className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg">
                      <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </td>
              </AdminTr>
            ))}
          </tbody>
        </AdminTable>
        <Pagination data={posts} links={posts.links} />
          </div>
        </BentoCard>
      </BentoGrid>

      <EntityDrawer open={showCreateModal} onClose={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} title="Tambah Berita">
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Judul" required error={createForm.errors.title}>
            <input type="text" value={createForm.data.title} onChange={(e) => createForm.setData('title', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Judul berita" autoFocus />
          </DrawerField>
          <DrawerField label="Ringkasan" error={createForm.errors.excerpt}>
            <textarea value={createForm.data.excerpt} onChange={(e) => createForm.setData('excerpt', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={2} placeholder="Ringkasan singkat" />
          </DrawerField>
          <DrawerField label="Isi" error={createForm.errors.body}>
            <textarea value={createForm.data.body} onChange={(e) => createForm.setData('body', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={6} placeholder="Isi berita" />
          </DrawerField>
          <DrawerField label="Foto Sampul" error={createForm.errors.image}>
            <input type="file" accept="image/*" onChange={(e) => createForm.setData('image', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="create-published" checked={createForm.data.is_published} onChange={(e) => createForm.setData('is_published', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="create-published" className="text-base text-foreground">Publish</label>
          </div>
          <DrawerFooter onCancel={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} processing={createForm.processing} />
        </form>
      </EntityDrawer>

      <EntityDrawer open={showEditModal} onClose={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} title="Edit Berita">
        <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} encType="multipart/form-data" className="space-y-4">
          <DrawerField label="Judul" required error={editForm.errors.title}>
            <input type="text" value={editForm.data.title} onChange={(e) => editForm.setData('title', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
          </DrawerField>
          <DrawerField label="Ringkasan" error={editForm.errors.excerpt}>
            <textarea value={editForm.data.excerpt} onChange={(e) => editForm.setData('excerpt', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={2} />
          </DrawerField>
          <DrawerField label="Isi" error={editForm.errors.body}>
            <textarea value={editForm.data.body} onChange={(e) => editForm.setData('body', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" rows={6} />
          </DrawerField>
          <DrawerField label="Foto Sampul (kosongkan jika tidak diubah)" error={editForm.errors.image}>
            {editItem?.image && <p className="text-sm text-muted mb-1">Saat ini: {editItem.image}</p>}
            <input type="file" accept="image/*" onChange={(e) => editForm.setData('image', e.target.files?.[0] ?? null)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="edit-published" checked={editForm.data.is_published} onChange={(e) => editForm.setData('is_published', e.target.checked)} className="rounded border-border text-primary focus:ring-primary" />
            <label htmlFor="edit-published" className="text-base text-foreground">Publish</label>
          </div>
          <DrawerFooter onCancel={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} processing={editForm.processing} submitText="Perbarui" />
        </form>
      </EntityDrawer>

      <ConfirmDeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} processing={deleteForm.processing} title="Hapus Berita" message={`Berita "${deleteItem?.title}" akan dihapus permanen.`} />
    </AdminLayout>
  )
}
