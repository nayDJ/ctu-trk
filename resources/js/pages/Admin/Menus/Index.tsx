import AdminLayout from '@/layouts/AdminLayout'
import { BentoGrid } from '@/components/ui/bento-grid'
import { BentoCard } from '@/components/ui/bento-grid-utils/bento-card'
import { router, useForm, usePage } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PlusIcon, TrashIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import { iconMap } from '@/lib/iconMap'
import AdminSearch from '@/components/AdminSearch'
import EntityModal, { ModalField, ModalFooter } from '@/components/admin/EntityModal'
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal'
import SidebarItemRow from '@/components/admin/SidebarItemRow'

interface Menu {
  id: number
  label: string
  href: string
  icon: string | null
  context: string
  sort_order: number
  is_active: boolean
  visibility: string
  children?: Menu[]
}

interface SidebarItem {
  id: number
  label: string
  href: string
  icon: string | null
  role: string | null
  sort_order: number
  is_active: boolean
}

interface MenusProps {
  menus: Menu[]
  parentMenus: Menu[]
  sidebarMenus: SidebarItem[]
  sidebarLogoText: string
}

const ALL_ROLES = ['super_admin', 'admin', 'user'] as const
const ROLE_LABELS: Record<string, string> = { super_admin: 'Super Admin', admin: 'Admin', user: 'User' }

function PublicMenuRow({ menu, onToggle, onDelete }: { menu: Menu; onToggle: (id: number, active: boolean) => void; onDelete: (id: number) => void }) {
  return (
    <tr className="border-b last:border-0 hover:bg-background/50 transition-colors">
      <td className="px-4 py-3">
        <Bars3BottomLeftIcon className="h-4 w-4 text-muted" />
      </td>
      <td className="px-4 py-3 font-medium text-sm">{menu.label}</td>
      <td className="px-4 py-3 text-muted text-sm">{menu.href}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggle(menu.id, !menu.is_active)}
            aria-pressed={menu.is_active}
            aria-label={`${menu.is_active ? 'Nonaktifkan' : 'Aktifkan'} ${menu.label}`}
            className={`inline-flex min-h-11 items-center rounded-full px-3 text-xs ${menu.is_active ? 'bg-success-bg text-primary' : 'bg-background text-muted'}`}
          >
            {menu.is_active ? 'Aktif' : 'Nonaktif'}
          </button>
          <button
            type="button"
            onClick={() => onDelete(menu.id)}
            aria-label={`Hapus ${menu.label}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg"
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function MenusIndex({ menus: initialMenus, parentMenus, sidebarMenus: initialSidebar, sidebarLogoText }: MenusProps) {
  const [menus, setMenus] = useState(initialMenus)
  const [sidebarMenus, setSidebarMenus] = useState(initialSidebar)
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCreateSidebarModal, setShowCreateSidebarModal] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Menu | SidebarItem | null>(null)
  const [deleteType, setDeleteType] = useState<'public' | 'sidebar'>('public')
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))
  const isSuperAdmin = (usePage().props.auth as any)?.user?.role === 'super_admin'

  const createForm = useForm({ label: '', href: '', icon: '', parent_id: '', context: 'public', visibility: '' })
  const createSidebarForm = useForm({ label: '', href: '', icon: 'ChartBarIcon', role: '' })
  const sidebarSettingsForm = useForm({ sidebar_logo_text: sidebarLogoText })
  const deleteForm = useForm({})
  const sidebarUpdateForm = useForm({ sidebarMenus: [] as any[] })

  const filtered = useMemo(() => {
    if (!search) return menus
    const q = search.toLowerCase()
    return menus.filter(m => m.label.toLowerCase().includes(q) || m.href.toLowerCase().includes(q))
  }, [search, menus])

  const handleCreate = () => {
    createForm.post('/admin/menus', {
      onSuccess: () => {
        toast.success('Menu berhasil ditambahkan')
        createForm.reset()
        setShowCreateModal(false)
      },
      onError: () => toast.error('Gagal menambahkan menu'),
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return
    const url = deleteType === 'sidebar' ? `/admin/menus/sidebar/${deleteItem.id}` : `/admin/menus/${deleteItem.id}`
    deleteForm.delete(url, {
      onSuccess: () => {
        toast.success(deleteType === 'sidebar' ? 'Item sidebar berhasil dihapus' : 'Menu berhasil dihapus')
        setDeleteItem(null)
      },
      onError: () => toast.error('Gagal menghapus menu.'),
    })
  }

  const handleSidebarToggle = (id: number, active: boolean) => {
    setSidebarMenus(prev => prev.map(m => m.id === id ? { ...m, is_active: active } : m))
    router.put('/admin/menus', { sidebarMenus: [{ id, is_active: active }] }, { preserveState: true, onSuccess: () => toast.success('Status diubah'), onError: () => toast.error('Gagal mengubah status.') })
  }

  const handleSidebarIconChange = (id: number, icon: string) => {
    setSidebarMenus(prev => prev.map(m => m.id === id ? { ...m, icon } : m))
    router.put('/admin/menus', { sidebarMenus: [{ id, icon }] }, { preserveState: true, onSuccess: () => toast.success('Icon tersimpan'), onError: () => toast.error('Gagal menyimpan icon.') })
  }

  const handleSidebarRoleChange = (id: number, role: string | null) => {
    setSidebarMenus(prev => prev.map(m => m.id === id ? { ...m, role } : m))
    router.put('/admin/menus', { sidebarMenus: [{ id, role }] }, { preserveState: true, onSuccess: () => toast.success('Akses tersimpan'), onError: () => toast.error('Gagal menyimpan akses.') })
  }

  const handleSidebarDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sidebarMenus.findIndex(m => m.id === active.id)
    const newIndex = sidebarMenus.findIndex(m => m.id === over.id)
    const reordered = arrayMove(sidebarMenus, oldIndex, newIndex)
    setSidebarMenus(reordered)

    router.put('/admin/menus', { sidebarMenus: reordered.map((m, i) => ({ id: m.id, sort_order: i + 1 })) }, { preserveState: true, onSuccess: () => toast.success('Urutan tersimpan'), onError: () => toast.error('Gagal menyimpan urutan.') })
  }

  const handleCreateSidebar = () => {
    createSidebarForm.post('/admin/menus/sidebar', {
      onSuccess: () => {
        toast.success('Item sidebar berhasil ditambahkan')
        createSidebarForm.reset()
        setShowCreateSidebarModal(false)
      },
      onError: () => toast.error('Gagal menambahkan item sidebar'),
    })
  }

  const handleSaveSidebarSettings = () => {
    router.put('/admin/menus/sidebar/settings', sidebarSettingsForm.data, {
      onSuccess: () => toast.success('Pengaturan sidebar tersimpan'),
      onError: () => toast.error('Gagal menyimpan pengaturan sidebar'),
    })
  }

  return (
    <AdminLayout title="Menu Navigasi">
      <BentoGrid className="max-w-none md:grid-cols-1 lg:grid-cols-2">
        {/* KIRI: Menu Navigasi Publik */}
        <BentoCard
          title="Menu Navigasi Publik"
          description={`${menus.length} menu`}
          icon={isSuperAdmin ? (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              aria-label="Tambah menu publik"
              className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary px-4 text-sm text-white transition-colors hover:bg-primary-dark"
            >
              <PlusIcon className="h-4 w-4" aria-hidden="true" /> Tambah
            </button>
          ) : undefined}
        >
          <div className="mb-3 max-w-xs"><AdminSearch onFilter={setSearch} placeholder="Cari menu..." /></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="border-b border-border bg-background">
                <tr>
                  <th className="relative w-12 px-4 py-2"><span className="sr-only">Urutan</span></th>
                  <th className="text-left px-4 py-2">Label</th>
                  <th className="text-left px-4 py-2">URL</th>
                  <th className="text-left px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">Tidak ada data</td></tr>
                ) : filtered.map((menu) => (
                  <PublicMenuRow
                    key={menu.id}
                    menu={menu}
                    onToggle={(id, active) => {
                      setMenus(prev => prev.map(m => m.id === id ? { ...m, is_active: active } : m))
                      router.put('/admin/menus', { menus: [{ id, is_active: active }] }, { preserveState: true, onSuccess: () => toast.success('Status diubah'), onError: () => toast.error('Gagal mengubah status.') })
                    }}
                    onDelete={(id) => {
                      const item = menus.find(m => m.id === id)
                      if (item) { setDeleteItem(item); setDeleteType('public') }
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </BentoCard>

        {/* KANAN: Sidebar Admin */}
        <div className="min-w-0 space-y-6">
          {/* Pengaturan Sidebar */}
          <BentoCard title="Pengaturan Sidebar">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <label htmlFor="sidebar-logo-text" className="mb-1 block text-sm font-medium text-foreground">Teks logo</label>
                <input
                  id="sidebar-logo-text"
                  type="text"
                  value={sidebarSettingsForm.data.sidebar_logo_text}
                  onChange={(e) => sidebarSettingsForm.setData('sidebar_logo_text', e.target.value)}
                  className="min-h-11 w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Teks di samping logo"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveSidebarSettings}
                disabled={sidebarSettingsForm.processing}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
              >
                {sidebarSettingsForm.processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </BentoCard>

          {/* Daftar Item Sidebar */}
          <BentoCard
            title="Item Sidebar"
            description={`${sidebarMenus.length} item`}
            icon={isSuperAdmin ? (
              <button
                type="button"
                onClick={() => setShowCreateSidebarModal(true)}
                aria-label="Tambah item sidebar"
                className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary px-4 text-sm text-white transition-colors hover:bg-primary-dark"
              >
                <PlusIcon className="h-4 w-4" aria-hidden="true" /> Tambah
              </button>
            ) : undefined}
          >
            <p className="text-xs text-muted mb-3">Seret untuk mengubah urutan. Klik status untuk aktifkan/nonaktifkan.</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-sm">
                <thead className="border-b border-border bg-background">
                  <tr>
                    <th className="relative w-12 px-3 py-2"><span className="sr-only">Urutan</span></th>
                    <th className="text-left px-3 py-2">Icon</th>
                    <th className="text-left px-3 py-2">Label</th>
                    <th className="text-left px-3 py-2">URL</th>
                    <th className="text-left px-3 py-2">Status</th>
                    <th className="text-left px-3 py-2">Akses</th>
                    <th className="relative w-12 px-3 py-2"><span className="sr-only">Aksi</span></th>
                  </tr>
                </thead>
                <tbody>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSidebarDragEnd}>
                    <SortableContext items={sidebarMenus.map(m => m.id)} strategy={verticalListSortingStrategy}>
                      {sidebarMenus.map((menu) => (
                        <SidebarItemRow
                          key={menu.id}
                          menu={menu}
                          onToggle={handleSidebarToggle}
                          onDelete={(id) => {
                            const item = sidebarMenus.find(m => m.id === id)
                            if (item) { setDeleteItem(item); setDeleteType('sidebar') }
                          }}
                          onIconChange={handleSidebarIconChange}
                          onRoleChange={handleSidebarRoleChange}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </tbody>
              </table>
            </div>
          </BentoCard>
        </div>
      </BentoGrid>

      {/* Modal: Tambah Menu Publik */}
      <EntityModal open={showCreateModal} onClose={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} title="Tambah Menu Publik">
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="space-y-4">
          <ModalField label="Label" required error={createForm.errors.label}>
            <input type="text" value={createForm.data.label} onChange={(e) => createForm.setData('label', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Label menu" autoFocus />
          </ModalField>
          <ModalField label="URL" required error={createForm.errors.href}>
            <input type="text" value={createForm.data.href} onChange={(e) => createForm.setData('href', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="/contoh/halaman" />
          </ModalField>
          <ModalField label="Icon" error={createForm.errors.icon}>
            <input type="text" value={createForm.data.icon} onChange={(e) => createForm.setData('icon', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Nama icon (opsional)" />
          </ModalField>
          <ModalField label="Parent Menu" error={createForm.errors.parent_id}>
            <select value={createForm.data.parent_id} onChange={(e) => createForm.setData('parent_id', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Tidak ada (root)</option>
              {parentMenus.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </ModalField>
          <ModalFooter onCancel={() => { setShowCreateModal(false); createForm.reset(); createForm.clearErrors(); }} processing={createForm.processing} />
        </form>
      </EntityModal>

      {/* Modal: Tambah Item Sidebar */}
      <EntityModal open={showCreateSidebarModal} onClose={() => { setShowCreateSidebarModal(false); createSidebarForm.reset(); createSidebarForm.clearErrors(); }} title="Tambah Item Sidebar">
        <form onSubmit={(e) => { e.preventDefault(); handleCreateSidebar(); }} className="space-y-4">
          <ModalField label="Label" required error={createSidebarForm.errors.label}>
            <input type="text" value={createSidebarForm.data.label} onChange={(e) => createSidebarForm.setData('label', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Label sidebar" autoFocus />
          </ModalField>
          <ModalField label="URL" required error={createSidebarForm.errors.href}>
            <input type="text" value={createSidebarForm.data.href} onChange={(e) => createSidebarForm.setData('href', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="/admin/halaman" />
          </ModalField>
          <ModalField label="Icon" error={createSidebarForm.errors.icon}>
            <select value={createSidebarForm.data.icon} onChange={(e) => createSidebarForm.setData('icon', e.target.value)} className="min-h-11 w-full rounded-lg border-border border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary">
              {Object.keys(iconMap).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </ModalField>
          <ModalField label="Akses" error={createSidebarForm.errors.role}>
            <div className="flex flex-wrap gap-3">
              {ALL_ROLES.map(r => {
                const currentRoles = createSidebarForm.data.role ? createSidebarForm.data.role.split(',').filter(Boolean) : []
                const checked = currentRoles.includes(r)
                return (
                  <label key={r} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const updated = checked
                          ? currentRoles.filter(x => x !== r)
                          : [...currentRoles, r]
                        createSidebarForm.setData('role', updated.length > 0 ? updated.join(',') : '')
                      }}
                      className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                    />
                    <span className="text-sm text-foreground">{ROLE_LABELS[r]}</span>
                  </label>
                )
              })}
            </div>
          </ModalField>
          <ModalFooter onCancel={() => { setShowCreateSidebarModal(false); createSidebarForm.reset(); createSidebarForm.clearErrors(); }} processing={createSidebarForm.processing} />
        </form>
      </EntityModal>

      <ConfirmDeleteModal
        open={!!deleteItem}
        onClose={() => { setDeleteItem(null); setDeleteType('public') }}
        onConfirm={handleDelete}
        processing={deleteForm.processing}
        title={deleteType === 'sidebar' ? 'Hapus Item Sidebar' : 'Hapus Menu'}
        message={`${deleteType === 'sidebar' ? 'Item sidebar' : 'Menu'} "${deleteItem?.label}" akan dihapus permanen.`}
      />
    </AdminLayout>
  )
}
