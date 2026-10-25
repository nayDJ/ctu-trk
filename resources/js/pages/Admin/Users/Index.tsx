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

interface User {
  id: number
  name: string
  email: string
  role: string
  created_at: string
}

interface UsersProps {
  users: { data: User[]; links: any[]; total: number }
}

export default function UsersIndex({ users }: UsersProps) {
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState<User | null>(null)
  const [deleteItem, setDeleteItem] = useState<User | null>(null)
  const userRole = (usePage().props.auth as any)?.user?.role as string
  const isSuperAdmin = userRole === 'super_admin'

  const createForm = useForm({ name: '', email: '', password: '', role: 'user' })
  const editForm = useForm({ name: '', email: '', password: '', role: 'user' })
  const deleteForm = useForm({})

  const filtered = useMemo(() => {
    if (!search) return users.data
    const q = search.toLowerCase()
    return users.data.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    )
  }, [search, users.data])

  const handleCreate = () => {
    createForm.post('/admin/users', {
      onSuccess: () => {
        toast.success('User berhasil ditambahkan')
        createForm.reset()
        setShowCreateModal(false)
      },
      onError: () => toast.error('Gagal menambahkan user, periksa form.'),
    })
  }

  const handleEdit = () => {
    if (!editItem) return
    const data: Record<string, any> = {
      name: editForm.data.name,
      email: editForm.data.email,
      role: editForm.data.role,
    }
    if (editForm.data.password) {
      data.password = editForm.data.password
    }
    editForm.put(`/admin/users/${editItem.id}`, {
      data,
      onSuccess: () => {
        toast.success('User berhasil diperbarui')
        setShowEditModal(false)
        setEditItem(null)
      },
      onError: () => toast.error('Gagal memperbarui user, periksa form.'),
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return
    deleteForm.delete(`/admin/users/${deleteItem.id}`, {
      onSuccess: () => {
        toast.success('User berhasil dihapus')
        setDeleteItem(null)
      },
      onError: () => toast.error('Gagal menghapus user.'),
    })
  }

  const openEdit = (item: User) => {
    setEditItem(item)
    editForm.setData({ name: item.name, email: item.email, password: '', role: item.role })
    setShowEditModal(true)
  }

  return (
    <AdminLayout title="Users">
      <div className="flex justify-between items-center mb-4">
        <div className="max-w-sm flex-1">
          <AdminSearch onFilter={setSearch} placeholder="Filter halaman ini: nama, email..." />
        </div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark">+ Tambah User</button>
      </div>
      <BentoGrid className="max-w-none">
        <BentoCard title="Users" description={`${users.total} data`} colSpan={4}>
          <div className="overflow-x-auto">
        <AdminTable>
          <thead className="bg-background border-b">
            <tr>
              <AdminTh>Nama</AdminTh>
              <AdminTh>Email</AdminTh>
              <AdminTh>Role</AdminTh>
              <AdminTh right>Aksi</AdminTh>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <AdminEmpty colSpan={4} />
            ) : filtered.map((user) => (
              <AdminTr key={user.id}>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3 text-muted">{user.email}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-sm bg-primary/10 text-primary">{user.role}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(user)} className="inline-flex min-h-11 items-center gap-1 text-base text-primary hover:underline">
                    <PencilSquareIcon className="h-3.5 w-3.5" /> Edit
                  </button>
                  {isSuperAdmin && (
                    <button onClick={() => setDeleteItem(user)} aria-label="Hapus user" className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </AdminTr>
            ))}
          </tbody>
        </AdminTable>
        <Pagination data={users} links={users.links} />
          </div>
        </BentoCard>
      </BentoGrid>

      <EntityDrawer open={showCreateModal} onClose={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} title="Tambah User">
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="space-y-4">
          <DrawerField label="Nama" required error={createForm.errors.name}>
            <input type="text" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nama lengkap" autoFocus />
          </DrawerField>
          <DrawerField label="Email" required error={createForm.errors.email}>
            <input type="email" value={createForm.data.email} onChange={(e) => createForm.setData('email', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="email@contoh.com" />
          </DrawerField>
          <DrawerField label="Password" required error={createForm.errors.password}>
            <input type="password" value={createForm.data.password} onChange={(e) => createForm.setData('password', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Minimal 8 karakter" />
          </DrawerField>
          <DrawerField label="Role" required error={createForm.errors.role}>
            <select value={createForm.data.role} onChange={(e) => createForm.setData('role', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </DrawerField>
          <DrawerFooter onCancel={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} processing={createForm.processing} />
        </form>
      </EntityDrawer>

      <EntityDrawer open={showEditModal} onClose={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} title="Edit User">
        <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="space-y-4">
          <DrawerField label="Nama" required error={editForm.errors.name}>
            <input type="text" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
          </DrawerField>
          <DrawerField label="Email" required error={editForm.errors.email}>
            <input type="email" value={editForm.data.email} onChange={(e) => editForm.setData('email', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" />
          </DrawerField>
          <DrawerField label="Password (kosongkan jika tidak diubah)" error={editForm.errors.password}>
            <input type="password" value={editForm.data.password} onChange={(e) => editForm.setData('password', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Kosongkan jika tidak diubah" />
          </DrawerField>
          <DrawerField label="Role" required error={editForm.errors.role}>
            <select value={editForm.data.role} onChange={(e) => editForm.setData('role', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </DrawerField>
          <DrawerFooter onCancel={() => { setShowEditModal(false); setEditItem(null); editForm.reset(); editForm.clearErrors(); }} processing={editForm.processing} submitText="Perbarui" />
        </form>
      </EntityDrawer>

      <ConfirmDeleteModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} processing={deleteForm.processing} title="Hapus User" message={`User "${deleteItem?.name}" akan dihapus permanen.`} />
    </AdminLayout>
  )
}
