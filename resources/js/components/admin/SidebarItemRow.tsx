import { iconMap, iconNames } from '@/lib/iconMap'
import { TrashIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SidebarItem {
  id: number
  label: string
  href: string
  icon: string | null
  role: string | null
  sort_order: number
  is_active: boolean
}

const ALL_ROLES = ['super_admin', 'admin', 'user'] as const
const ROLE_LABELS: Record<string, string> = { super_admin: 'Super Admin', admin: 'Admin', user: 'User' }

export default function SidebarItemRow({
  menu,
  onToggle,
  onDelete,
  onIconChange,
  onRoleChange,
}: {
  menu: SidebarItem
  onToggle: (id: number, active: boolean) => void
  onDelete: (id: number) => void
  onIconChange: (id: number, icon: string) => void
  onRoleChange: (id: number, role: string | null) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: menu.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  const IconComponent = iconMap[menu.icon ?? ''] ?? iconMap.ChartBarIcon
  const currentRoles = menu.role ? menu.role.split(',').filter(Boolean) : []

  const toggleRole = (role: string) => {
    const updated = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role]
    onRoleChange(menu.id, updated.length > 0 ? updated.join(',') : null)
  }

  return (
    <tr ref={setNodeRef} style={style} className="border-b last:border-0 hover:bg-background/50 transition-colors">
      <td className="px-3 py-1">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Seret untuk mengubah urutan ${menu.label}`}
          className="inline-flex h-11 w-11 cursor-grab items-center justify-center rounded-lg text-muted hover:bg-background hover:text-foreground active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Bars3BottomLeftIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </td>
      <td className="px-3 py-1">
        <div className="flex items-center gap-2">
          <IconComponent className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <select
            aria-label={`Icon ${menu.label}`}
            value={menu.icon ?? ''}
            onChange={(e) => onIconChange(menu.id, e.target.value)}
            className="min-h-11 rounded-lg border border-border px-2 py-1 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {iconNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </td>
      <td className="px-3 py-1 text-sm font-medium">{menu.label}</td>
      <td className="px-3 py-1 text-sm text-foreground">{menu.href}</td>
      <td className="px-3 py-1">
        <button
          type="button"
          onClick={() => onToggle(menu.id, !menu.is_active)}
          aria-pressed={menu.is_active}
          aria-label={`${menu.is_active ? 'Nonaktifkan' : 'Aktifkan'} ${menu.label}`}
          className={`inline-flex min-h-11 items-center rounded-full px-3 text-xs ${menu.is_active ? 'bg-success-bg text-primary' : 'bg-background text-foreground'}`}
        >
          {menu.is_active ? 'Aktif' : 'Nonaktif'}
        </button>
      </td>
      <td className="px-3 py-1">
        <div className="flex flex-wrap gap-1.5">
          {ALL_ROLES.map(r => (
            <label key={r} className="flex min-h-11 cursor-pointer items-center gap-1.5 px-1">
              <input
                type="checkbox"
                checked={currentRoles.includes(r)}
                onChange={() => toggleRole(r)}
                aria-label={`${ROLE_LABELS[r]} untuk ${menu.label}`}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-xs text-muted">{ROLE_LABELS[r]}</span>
            </label>
          ))}
        </div>
      </td>
      <td className="px-3 py-1">
        <button
          type="button"
          onClick={() => onDelete(menu.id)}
          aria-label={`Hapus ${menu.label}`}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive-bg"
        >
          <TrashIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </td>
    </tr>
  )
}
